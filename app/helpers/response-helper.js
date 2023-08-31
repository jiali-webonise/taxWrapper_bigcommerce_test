const { TaxProviderResponseObject } = require('../models/TaxProviderResponseObject');
const { SalesTaxSummary } = require('../models/SalesTaxSummary');
const { FLAT_RATE } = require('../../config/constants');
const { getAmountExclusiveByTaxRate, getAmountInclusiveByTaxRate } = require('./tax-calculate-helper');
const { roundOffValue } = require('../../util/util');

/**
 * Transform response to meet BC requirement
 *
 * @param   {Object}    documents      documents(cart data) received from BC
 * @param   {String}    quoteId        quoteId received from BC Tax Provider API
 */
const getTransformedResponseByFlatTaxRate = (documents, quoteId, flatTaxRate) => {
  const transformedDocs = documents.map((document) => {
    const items = document.items;
    const transformedItems = items.map((item) => {
      const transformedItem = getCalculatedResponseByTaxRate(item, flatTaxRate);
      return transformedItem;
    });
    const shipping = getCalculatedResponseByTaxRate(document.shipping, flatTaxRate);
    const handling = getCalculatedResponseByTaxRate(document.handling, flatTaxRate);
    return { id: document.id, items: transformedItems, shipping: shipping, handling: handling };
  });
  return { documents: transformedDocs, id: quoteId };
};

// TODO: Refactor this method with real Avalara data
const getTransformedResponseFromAvalara = (documents, quoteId, avalaraResponseTaxRate = 0.1) => {
  const transformedDocs = documents.map((document) => {
    const items = document.items;
    const transformedItems = items.map((item) => {
      const transformedItem = getCalculatedResponseByTaxRate(item, avalaraResponseTaxRate);
      return transformedItem;
    });
    const shipping = getCalculatedResponseByTaxRate(document.shipping, avalaraResponseTaxRate);
    const handling = getCalculatedResponseByTaxRate(document.handling, avalaraResponseTaxRate);
    return { id: document.id, items: transformedItems, shipping: shipping, handling: handling };
  });
  return { documents: transformedDocs, id: quoteId };
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

module.exports = {
  getTransformedResponseByFlatTaxRate,
  getTransformedResponseFromAvalara,
  getCalculatedResponseByTaxRate,
};
