const { TaxProviderResponseObject } = require('../app/models/TaxProviderResponseObject');
const { SalesTaxSummary } = require('../app/models/SalesTaxSummary');
const { FLAT_RATE } = require('../config/constants');

const {
  US_BIGCOMMERCE_STORE_HASH,
  CA_BIGCOMMERCE_STORE_HASH,
  AU_BIGCOMMERCE_STORE_HASH,
  NZ_BIGCOMMERCE_STORE_HASH,
  JP_BIGCOMMERCE_STORE_HASH,
  IN_BIGCOMMERCE_STORE_HASH,
  EU_BIGCOMMERCE_STORE_HASH,
  WEBONISELAB_STORE_HASH,
} = process.env;

/**
 * Identify country code by storeHash
 *
 * @param   {String}   storeHash        BC storeHash
 */
const getCountryCode = (storeHash) => {
  if (!storeHash) return null;
  switch (storeHash) {
    case US_BIGCOMMERCE_STORE_HASH:
      return 'US';
    case CA_BIGCOMMERCE_STORE_HASH:
      return 'CA';
    case AU_BIGCOMMERCE_STORE_HASH:
      return 'AU';
    case NZ_BIGCOMMERCE_STORE_HASH:
      return 'NZ';
    case JP_BIGCOMMERCE_STORE_HASH:
      return 'JP';
    case IN_BIGCOMMERCE_STORE_HASH:
      return 'IN';
    case EU_BIGCOMMERCE_STORE_HASH:
      return 'EU';
    case WEBONISELAB_STORE_HASH:
      // this is for testing in Webonise sandbox
      return 'JP';
    // no defualt
    default:
      return null;
  }
};

const checkIsFlatTaxRate = (countryCode) => {
  if (!countryCode) return false;
  const isFlatRate = Object.keys(FLAT_RATE).includes(countryCode);
  if (isFlatRate) {
    return true;
  }
  return false;
};

const getFlatTaxRate = (countryCode) => {
  if (!countryCode) return false;
  return FLAT_RATE[countryCode];
};

const checkNumberIsNaNAndInfinity = (value = 0) => {
  if (typeof value !== 'number') {
    const transformedValue = Number(value);
    return isNaN(transformedValue) ? 0 : isFinite(transformedValue) ? transformedValue : 0;
  }
  return isNaN(value) ? 0 : isFinite(value) ? value : 0;
};

/**
 * round off value to keep certain digits
 *
 * @param   {Object}    value        value going to be rounded
 * @param   {Object}    digits       specific digits to keep
 * @param   {boolean}   setInteger   boolean value to define the value is integer
 *
 */
const roundOffValue = (value, digits, setInteger = false) => {
  if (setInteger && Number.isInteger(value)) {
    return value;
  }
  if (digits !== null && digits !== undefined && !isNaN(digits)) {
    return Number(checkNumberIsNaNAndInfinity(value).toFixed(checkNumberIsNaNAndInfinity(digits)));
  }
  return Number(checkNumberIsNaNAndInfinity(value).toFixed(2));
};

const getAmountExclusiveByTaxRate = (amountInclusive, taxRate) => {
  const result = amountInclusive / (1 + taxRate);
  return roundOffValue(result);
};

const getAmountInclusiveByTaxRate = (amountExclusive, taxRate) => {
  const result = amountExclusive * (1 + taxRate);
  return roundOffValue(result);
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

module.exports = {
  getCountryCode,
  getTransformedResponseByFlatTaxRate,
  getTransformedResponseFromAvalara,
  getAmountExclusiveByTaxRate,
  getAmountInclusiveByTaxRate,
  roundOffValue,
  checkNumberIsNaNAndInfinity,
  checkIsFlatTaxRate,
  getFlatTaxRate,
};
