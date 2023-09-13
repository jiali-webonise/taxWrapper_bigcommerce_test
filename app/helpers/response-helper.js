const { TaxProviderResponseObject } = require('../models/TaxProviderResponseObject');
const { SalesTaxSummary } = require('../models/SalesTaxSummary');
const { FLAT_RATE, AVALARA_PATH } = require('../../config/constants');
const { getAmountExclusiveByTaxRate, getAmountInclusiveByTaxRate } = require('./tax-calculate-helper');
const { roundOffValue, getFlatTaxRate } = require('../../util/util');
const { getAvalaraCreateTransactionRequestBody } = require('../../util/avalara');
const { postAvalaraService } = require('../services/avalara-service');

/**
 * Transform response to meet BC requirement
 *
 * @param   {Object}    documents      documents(cart data) received from BC
 * @param   {String}    quoteId        quoteId received from BC Tax Provider API
 */
const getTransformedResponseByFlatTaxRate = (documents, quoteId, countryCode) => {
  const { flatTaxRate, shippingTaxRate } = getFlatTaxRate(countryCode);
  const transformedDocs = documents.map((document) => {
    const items = document.items;
    const transformedItems = items.map((item) => {
      const transformedItem = getCalculatedResponseByTaxRate(item, flatTaxRate);
      return transformedItem;
    });
    const shipping = getCalculatedResponseByTaxRate(document.shipping, shippingTaxRate);
    // Modere doesn't have Handling fee but BC ask for this attribute
    const handling = getCalculatedResponseByTaxRate(document.handling, 0);
    return { id: document.id, items: transformedItems, shipping: shipping, handling: handling };
  });
  return { documents: transformedDocs, id: quoteId };
};

const getTransformedResponseFromAvalara = async (data, storeHash, documents, quoteId) => {
  const avalaraRequestBody = getAvalaraCreateTransactionRequestBody(data, storeHash);
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
      const transformedItems = items.map((item) => {
        const transformedItem = getTaxFromAvalaraResponse(item, avalaraResponse?.lines);
        return transformedItem;
      });
      // TODO: Update for shipping rate
      const shipping = getTaxFromAvalaraResponse(document.shipping, avalaraResponse?.lines);
      const handling = getTaxFromAvalaraResponse(document.handling, avalaraResponse?.lines);
      return { id: document.id, items: transformedItems, shipping: shipping, handling: handling };
    });
    return { documents: transformedDocs, id: quoteId };
  }
};

/**
 * Calculate some attributes in response
 *
 * @param   {Object}    responseObject   object received from BC Tax Provider API
 */
const getCalculatedResponseByTaxRate = (responseObject, taxRate) => {
  const calculatedPrice = {};
  calculatedPrice.tax_rate = taxRate;

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

module.exports = {
  getTransformedResponseByFlatTaxRate,
  getTransformedResponseFromAvalara,
  getCalculatedResponseByTaxRate,
  getTaxFromAvalaraResponse,
};
