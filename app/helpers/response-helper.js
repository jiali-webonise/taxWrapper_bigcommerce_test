const { TaxProviderResponseObject } = require('../models/TaxProviderResponseObject');
const { SalesTaxSummary } = require('../models/SalesTaxSummary');
const { AVALARA_PATH, COUNTRY_CODE } = require('../../config/constants');
const { getAmountExclusiveByTaxRate, getAmountInclusiveByTaxRate } = require('./tax-calculate-helper');
const { roundOffValue, getFlatTaxRate, isSame } = require('../../util/util');
const { getAvalaraCreateTransactionRequestBody, getBundleChildrenLineItems } = require('../../util/avalara');
const { postAvalaraService } = require('../services/avalara-service');
const { BUNDLE, BASIC, PRODUCT_TYPE, CALCULATE_TAX_ON_KIT_DETAIL } = require('../../util/tax-properties');

/**
 * Transform response to meet BC requirement
 *
 * @param   {Object}    documents      documents(cart data) received from BC
 * @param   {String}    quoteId        quoteId received from BC Tax Provider API
 */
const getTransformedResponseByFlatTaxRate = (documents, quoteId, countryCode, isExempted) => {
  const { flatTaxRate, shippingTaxRate } = getFlatTaxRate(countryCode);
  const transformedDocs = documents.map((document) => {
    const items = document.items;
    const transformedItems = items.map((item) => {
      const transformedItem = getCalculatedResponseByTaxRate(item, flatTaxRate, isExempted);
      return transformedItem;
    });
    const shipping = getCalculatedResponseByTaxRate(document.shipping, shippingTaxRate, isExempted);
    // Modere doesn't have Handling fee but BC ask for this attribute
    const handling = getCalculatedResponseByTaxRate(document.handling, 0);
    return { id: document.id, items: transformedItems, shipping: shipping, handling: handling };
  });
  return { documents: transformedDocs, id: quoteId };
};

const getTransformedResponseFromAvalara = async (data, storeHash, documents, quoteId, commit, countryCode) => {
  const avalaraRequestBody = getAvalaraCreateTransactionRequestBody(data, storeHash, commit, countryCode);
  const avalaraResponse = await postAvalaraService({ url: AVALARA_PATH.CREATE_TRANSICATION, body: avalaraRequestBody });
  console.log('avalaraRequestBody', avalaraRequestBody);
  console.log('avalaraResponse', avalaraResponse);
  if (!avalaraResponse) {
    return avalaraResponse;
  }
  // Create response in BC format
  if (avalaraResponse && avalaraResponse.lines) {
    const transformedDocs = documents.map((document) => {
      const items = document.items;
      const transformedItems = items
        ?.map((item) => {
          let transformedItem;
          if (item?.tax_properties?.length > 0) {
            const taxProperties = item.tax_properties;
            const productType = taxProperties?.find((property) => property.code === PRODUCT_TYPE)?.value;
            const isBundle = taxProperties?.find(
              (property) => property.code === CALCULATE_TAX_ON_KIT_DETAIL && property.value === 'true',
            )?.value;

            if (productType === BASIC && !isBundle) {
              transformedItem = getTaxFromAvalaraResponse(item, avalaraResponse?.lines);
            } else if (productType === BUNDLE && isBundle) {
              // bundle item
              const { childrenLineItems } = getBundleChildrenLineItems({
                taxProperties: taxProperties,
                countryCode,
                indexNum: 0,
                includeParentPrice: true,
                item,
              });
              // merge bundle children items into one
              transformedItem = getParentTaxFromAvalaraResponse(
                item,
                childrenLineItems,
                avalaraResponse?.lines,
                countryCode,
              );
            }
          } else {
            transformedItem = getTaxFromAvalaraResponse(item, avalaraResponse?.lines);
          }

          return transformedItem;
        })
        ?.filter((item) => item !== undefined && item !== null);
      // TODO: Update for shipping rate
      const shipping = getTaxFromAvalaraResponse(document.shipping, avalaraResponse?.lines);
      const handling = getTaxFromAvalaraResponse(document.handling, avalaraResponse?.lines);
      return {
        id: document.id,
        items: transformedItems,
        shipping: shipping,
        handling: handling,
      };
    });
    if (commit) {
      return { documents: transformedDocs, id: quoteId, external_id: avalaraResponse?.id };
    }
    return { documents: transformedDocs, id: quoteId };
  }
};

/**
 * Calculate some attributes in response
 *
 * @param   {Object}    responseObject   object received from BC Tax Provider API
 */
const getCalculatedResponseByTaxRate = (responseObject, taxRate, isExempted) => {
  const calculatedPrice = {};
  calculatedPrice.tax_rate = taxRate;
  switch (isExempted) {
    case true:
      calculatedPrice.amount_exclusive = responseObject.price.amount;
      calculatedPrice.amount_inclusive = responseObject.price.amount;
      calculatedPrice.tax_rate = taxRate;
      calculatedPrice.total_tax = 0;
      break;
    default:
      if (responseObject.price.tax_inclusive) {
        calculatedPrice.amount_inclusive = responseObject.price.amount;
        calculatedPrice.amount_exclusive = getAmountExclusiveByTaxRate(
          calculatedPrice.amount_inclusive,
          calculatedPrice.tax_rate,
        );
        calculatedPrice.total_tax = roundOffValue(calculatedPrice.amount_inclusive - calculatedPrice.amount_exclusive);
      } else {
        calculatedPrice.amount_exclusive = responseObject.price.amount;
        calculatedPrice.amount_inclusive = getAmountInclusiveByTaxRate(
          calculatedPrice.amount_exclusive,
          calculatedPrice.tax_rate,
        );
        calculatedPrice.total_tax = roundOffValue(calculatedPrice.amount_inclusive - calculatedPrice.amount_exclusive);
      }
  }
  const salesSummary = new SalesTaxSummary({
    name: 'Tax',
    rate: calculatedPrice.tax_rate,
    amount: calculatedPrice.total_tax,
    taxClass: responseObject.tax_class,
    id: 'Tax',
  });
  const result = new TaxProviderResponseObject({
    id: responseObject.id,
    price: calculatedPrice,
    type: responseObject.type,
    salesTaxSummary: [salesSummary],
  });
  return result;
};

const getTaxFromAvalaraResponse = (item, avalaraResponseLines) => {
  const calculatedPrice = { tax_rate: 0 };
  const avalaraItem = avalaraResponseLines.find((el) => el.itemCode === item['item_code']);
  let taxClassCode = '';
  let taxAmount = avalaraItem.tax;

  // Currently, hardcode the handling amount to 0 because without it cannot have show correct tax in BC
  if (item.id.includes('handling')) {
    calculatedPrice.amount_exclusive = 0;
    calculatedPrice.total_tax = 0;
    calculatedPrice.amount_inclusive = 0;
    taxAmount = 0;
  } else if (avalaraItem && !item.price.tax_inclusive) {
    calculatedPrice.amount_exclusive = item.price.amount;
    calculatedPrice.total_tax = avalaraItem.tax;
    calculatedPrice.amount_inclusive = calculatedPrice.amount_exclusive + calculatedPrice.total_tax;
  } else if (avalaraItem && item.price.tax_inclusive) {
    calculatedPrice.amount_exclusive = calculatedPrice.amount_inclusive - calculatedPrice.total_tax;
    calculatedPrice.total_tax = avalaraItem.tax;
    calculatedPrice.amount_inclusive = item.price.amount;
  }
  // TODO: Handle condition when item.price.tax_inclusive is true if there is
  // TODO: Handle when avalaraItem is undefined

  if (avalaraItem) {
    avalaraItem?.details?.forEach((detail) => {
      calculatedPrice.tax_rate += detail.rate;
      taxClassCode = detail.country;
    });
  }
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

const getParentTaxFromAvalaraResponse = (item, childrenLineItems, avalaraResponseLines, countryCode) => {
  const calculatedPrice = { tax_rate: 0, amount_exclusive: 0, total_tax: 0, amount_inclusive: 0 };
  let taxClassCode = '';
  let taxAmount = 0;
  let details;
  let parentPrice;
  const isUS = isSame(countryCode, COUNTRY_CODE.US);
  const isCA = isSame(countryCode, COUNTRY_CODE.CA);
  const isEU = isSame(countryCode, COUNTRY_CODE.EU);
  childrenLineItems?.forEach((child) => {
    const avalaraItem = avalaraResponseLines.find((el) => el.itemCode === child.itemCode);
    if (avalaraItem) {
      details = avalaraItem?.details;
    }
    parentPrice = Number(child?.parentPrice) * avalaraItem.quantity;
    taxAmount += avalaraItem.tax * avalaraItem.quantity;
  });
  calculatedPrice.total_tax = taxAmount;
  if (isUS || isCA) {
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
  getTransformedResponseByFlatTaxRate,
  getTransformedResponseFromAvalara,
  getCalculatedResponseByTaxRate,
  getTaxFromAvalaraResponse,
  getParentTaxFromAvalaraResponse,
};
