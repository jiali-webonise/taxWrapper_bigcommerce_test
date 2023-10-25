const { SalesTaxSummary } = require('../app/models/SalesTaxSummary');
const { TaxProviderResponseObject } = require('../app/models/TaxProviderResponseObject');
const { AVALARA_DOCUMENT_TYPE, COUNTRY_CODE } = require('../config/constants');
const { getCompanyCode, checkCountryOrCurrencyIsConsistent, getChildProduct, isSame } = require('../util/util');
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
  const items = data?.documents.flatMap((doc) => doc.items);

  const { normalItems, bundleItems, serviceTaxAppliedItems } = getDifferentItems(items, countryCode);
  const productItems = getLineItems(normalItems);
  // Track number of line item
  const indexNum = productItems?.length > 0 ? productItems?.length : 0;

  // Handle bundle items
  const { bundleLineItems, indexOfLine } = getChildrenFromBundle(bundleItems, countryCode, currencyCode, indexNum);

  const companyCode = getCompanyCode(storeHash);
  // TODO: For serviceTaxAppliedItems, need to change address
  const shipFromAddress = getAddressForAvalara(data.documents['0'].origin_address);
  const shipToAddress = getAddressForAvalara(data.documents['0'].destination_address);
  const pointOfOriginAddress = getAddressForAvalara(data.documents['0'].origin_address);
  const docType = commit ? AVALARA_DOCUMENT_TYPE.SALES_INVOICE : AVALARA_DOCUMENT_TYPE.SALES_ORDER;
  const shippingLineItem = getShippingCostLineItem(data.documents['0'].shipping, indexOfLine);
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
  const isEU = isSame(countryCode, COUNTRY_CODE.EU);
  const isUS = isSame(countryCode, COUNTRY_CODE.US);
  const isCA = isSame(countryCode, COUNTRY_CODE.CA);
  if (isEU) {
    price = taxProperties?.find(
      (property) => String(property.code)?.startsWith('price') && String(property.code)?.includes(countryCode),
    )?.value;
  }

  if (isUS || isCA) {
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

const getDifferentItems = (items, countryCode) => {
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
      const isEU = isSame(countryCode, COUNTRY_CODE.EU);
      if (isEU && serviceTaxApplied) {
        serviceTaxAppliedItems.push(item);
      }
    } else {
      normalItems.push(item);
    }
  });

  return { normalItems, bundleItems, serviceTaxAppliedItems };
};

const getChildrenFromBundle = (bundleItems, countryCode, currencyCode, indexNum) => {
  let bundleLineItems = [];
  let indexCount = indexNum;

  if (bundleItems?.length > 0) {
    bundleItems.forEach((item) => {
      const taxProperties = item.tax_properties;
      // check country and currency code are consistent
      // TODO: handle unmatched errors
      const matched = checkCountryOrCurrencyIsConsistent(taxProperties, countryCode, currencyCode);

      const { childrenLineItems, index } = getBundleChildrenLineItems({
        taxProperties: item.tax_properties,
        countryCode,
        indexNum: indexCount,
      });
      indexCount = index;
      bundleLineItems = [...bundleLineItems, ...childrenLineItems];
    });
  }

  return { bundleLineItems, indexOfLine: indexCount };
};

module.exports = {
  getLineItems,
  getAddressForAvalara,
  getAvalaraCreateTransactionRequestBody,
  getShippingCostLineItem,
  getBundleChildrenLineItems,
  getDifferentItems,
  getChildrenFromBundle,
};
