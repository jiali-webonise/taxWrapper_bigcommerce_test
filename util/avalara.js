const { SalesTaxSummary } = require('../app/models/SalesTaxSummary');
const { TaxProviderResponseObject } = require('../app/models/TaxProviderResponseObject');
const { AVALARA_DOCUMENT_TYPE, COUNTRY_CODE } = require('../config/constants');
const {
  getCompanyCode,
  getCurrencyAndCountryByTaxProperty,
  checkCountryOrCurrency,
  checkCountryOrCurrencyIsConsistent,
  getChildProduct,
} = require('../util/util');
const { PRODUCT_TYPE, BASIC, BUNDLE, SERVICE_TAX_APPLIED, CALCULATE_TAX_ON_KIT_DETAIL } = require('./tax-properties');

const getLineItems = (items) => {
  if (items?.length <= 0) return [];
  return items?.map((item, index) => {
    return {
      number: index,
      quantity: item?.quantity,
      amount: item?.price.amount,
      itemCode: item?.item_code,
      taxCode: item?.item_code,
    };
  });
};

const getAddressForAvalara = (address) => {
  return {
    line1: address?.line1,
    city: address?.city,
    region: address?.region_code,
    country: address?.country_code,
    postalCode: address?.postal_code,
  };
};
const getShippingCostLineItem = (shippingData, itemNumber) => {
  const finalData = {
    number: itemNumber,
    quantity: shippingData.quantity,
    amount: shippingData.price.amount,
    itemCode: shippingData.item_code,
    taxCode: shippingData.item_code,
  };
  return finalData;
  //TODO: Need to confirm taxCode for shipping
};

const getAvalaraCreateTransactionRequestBody = (data, storeHash, commit, countryCode) => {
  const currencyCode = data.currency_code;
  // Get normal and bundle items
  const items = data?.documents.flatMap((doc) => doc.items);

  const normalItems = [];
  const bundleItems = [];
  const serviceTaxAppliedItems = [];

  // Get normal items and bundle items
  items?.forEach((item) => {
    if (item?.tax_properties?.length > 0) {
      const taxProperties = item.tax_properties;
      const productType = taxProperties?.find((property) => property.code === PRODUCT_TYPE)?.value;
      const isBundle = taxProperties?.find(
        (property) => property.code === CALCULATE_TAX_ON_KIT_DETAIL && property.value === 'true',
      )?.value;
      const serviceTaxApplied = taxProperties?.find(
        (property) => property.code?.includes(SERVICE_TAX_APPLIED) && property.value === 'true',
      );
      if (productType === BASIC && !isBundle) {
        normalItems.push(item);
      }
      if (productType === BUNDLE && isBundle) {
        bundleItems.push(item);
      }
      // TODO: handle serviceTaxApplied items
      if (countryCode === COUNTRY_CODE.EU && serviceTaxApplied) {
        serviceTaxAppliedItems.push(item);
      }
    } else {
      normalItems.push(item);
    }
  });

  const productItems = getLineItems(normalItems);
  // Track number of line item
  let indexNum = productItems?.length > 0 ? productItems?.length : 0;

  // Handle bundle items
  let bundleLineItems = [];
  if (bundleItems?.length > 0) {
    bundleItems.forEach((item) => {
      const taxProperties = item.tax_properties;
      // check country and currency code are consistent
      // TODO: handle unmatched errors
      const matched = checkCountryOrCurrencyIsConsistent(taxProperties, countryCode, currencyCode);

      const { childrenLineItems, index } = getBundleChildrenLineItems({
        taxProperties: item.tax_properties,
        countryCode,
        indexNum,
      });
      indexNum = index;
      bundleLineItems = [...bundleLineItems, ...childrenLineItems];
    });
  }

  const companyCode = getCompanyCode(storeHash);
  // TODO: For serviceTaxAppliedItems, need to change address
  const shipFromAddress = getAddressForAvalara(data.documents['0'].origin_address);
  const shipToAddress = getAddressForAvalara(data.documents['0'].destination_address);
  const pointOfOriginAddress = getAddressForAvalara(data.documents['0'].origin_address);
  const docType = commit ? AVALARA_DOCUMENT_TYPE.SALES_INVOICE : AVALARA_DOCUMENT_TYPE.SALES_ORDER;
  const shippingLineItem = getShippingCostLineItem(data.documents['0'].shipping, indexNum);
  const lineItems = [...productItems, ...bundleLineItems, shippingLineItem];

  const customerCode = data.customer.customer_id;
  const exemptionNo = data.customer.taxability_code ? data.customer.taxability_code : null;
  const finalRequestBody = {
    type: docType,
    companyCode: companyCode,
    date: new Date().toISOString()?.slice(0, 10),
    code: data.id,
    customerCode: customerCode,
    commit: commit,
    taxOverride: null,
    currencyCode: data.currency_code,
    description: null,
    exemptionNo: exemptionNo,
    taxDate: data.transaction_date,
    lines: lineItems,
    addresses: {
      singleLocation: null,
      shipFrom: shipFromAddress,
      shipTo: shipToAddress,
      pointOfOrderOrigin: null,
      pointOfOrderAcceptance: null,
    },
  };
  return finalRequestBody;
};

const getBundleChildrenLineItems = ({ taxProperties, countryCode, indexNum, includeParentPrice }) => {
  if (taxProperties?.length === 0) return;
  let price = 0;

  if (countryCode?.localeCompare(COUNTRY_CODE.EU) === 0) {
    price = taxProperties?.find(
      (property) => String(property.code)?.startsWith('price') && String(property.code)?.includes(countryCode),
    )?.value;
  }

  if (
    countryCode?.localeCompare(COUNTRY_CODE.US, 'en', { sensitivity: 'base' }) === 0 ||
    countryCode?.localeCompare(COUNTRY_CODE.CA, 'en', { sensitivity: 'base' }) === 0
  ) {
    price = taxProperties?.find(
      (property) =>
        String(property.code)?.startsWith('taxableprice') && String(property.code)?.includes(countryCode.toLowerCase()),
    )?.value;
  }

  const children = taxProperties?.filter(
    (property) => property.code.startsWith('product') && property.code.includes('|'),
  );
  let indexCurrent = indexNum;
  const lineItems = children
    .map((child) => {
      const { childLine, index } = getChildProduct({
        childPropertyCode: child.code,
        index: indexCurrent,
        percentage: child.value,
        price: price,
        quantity: 1, // Need further confirmation
        includeParentPrice: includeParentPrice,
      });
      indexCurrent = index;
      return childLine;
    })
    ?.filter((child) => child !== null && child !== undefined);
  return { childrenLineItems: lineItems, index: indexCurrent };
};

const getParentTaxFromAvalaraResponse = (item, childrenLineItems, avalaraResponseLines, countryCode) => {
  // console.log('childrenLineItems', childrenLineItems);
  // console.log('avalaraResponseLines', avalaraResponseLines);

  const calculatedPrice = { tax_rate: 0, amount_exclusive: 0, total_tax: 0, amount_inclusive: 0 };
  let taxClassCode = '';
  let taxAmount = 0;
  let details;
  let parentPrice;
  const isUSOrCA =
    countryCode?.localeCompare(COUNTRY_CODE.US, 'en', { sensitivity: 'base' }) === 0 ||
    countryCode?.localeCompare(COUNTRY_CODE.CA, 'en', { sensitivity: 'base' }) === 0;
  const isEU = countryCode?.localeCompare(COUNTRY_CODE.EU) === 0;
  childrenLineItems?.forEach((child) => {
    const avalaraItem = avalaraResponseLines.find((el) => el.itemCode === child.itemCode);
    if (avalaraItem) {
      details = avalaraItem?.details;
    }
    parentPrice = Number(child?.parentPrice);
    taxAmount += avalaraItem.tax;
  });
  calculatedPrice.total_tax = taxAmount;
  if (isUSOrCA) {
    calculatedPrice.amount_exclusive = parentPrice;
    calculatedPrice.amount_inclusive = parentPrice + taxAmount;
  } else if (isEU) {
    calculatedPrice.amount_inclusive = parentPrice;
    calculatedPrice.amount_exclusive = parentPrice - taxAmount;
  }

  details?.forEach((detail) => {
    calculatedPrice.tax_rate += detail.rate;
    taxClassCode = detail.country;
  });

  // Can only have one salesTaxSummary and the tax rate is the total tax rate
  const salesTaxSummary = new SalesTaxSummary({
    name: 'Tax',
    rate: calculatedPrice.tax_rate,
    amount: taxAmount,
    taxClass: { ...item.tax_class, code: taxClassCode },
    id: 'Tax',
  });

  const result = new TaxProviderResponseObject({
    id: item.id,
    price: calculatedPrice,
    type: item.type,
    salesTaxSummary: [salesTaxSummary],
  });

  return result;
};

module.exports = {
  getLineItems,
  getAddressForAvalara,
  getAvalaraCreateTransactionRequestBody,
  getShippingCostLineItem,
  getBundleChildrenLineItems,
  getParentTaxFromAvalaraResponse,
};
