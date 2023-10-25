const { FLAT_RATE, COUNTRY_CODE } = require('../config/constants');
const { InternalError } = require('../app/services/error-service');
const { SHIPPING_FLAT_RATE } = require('../config/shipping-rates');
const { CALCULATE_TAX_ON_KIT_DETAIL, PRODUCT_TYPE } = require('./tax-properties');

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
      return 'US';
    // no default
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
  if (!countryCode) throw new InternalError();
  const taxRate = FLAT_RATE[countryCode];
  const shippingTaxRate = SHIPPING_FLAT_RATE[countryCode] ? SHIPPING_FLAT_RATE[countryCode] : taxRate;
  return { flatTaxRate: taxRate, shippingTaxRate: shippingTaxRate };
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
const getCompanyCode = (storeHash) => {
  const market = getCountryCode(storeHash);
  if (!market) return null;
  switch (market) {
    case 'US':
      return 'NEWAYS';
    case 'EU':
      return 'MODEREEUROPEBV';
    case 'CA':
      return 'CANADA';
    default:
      return null;
  }
};

const checkIsExempted = (data) => {
  if (Boolean(data.customer?.taxability_code)) {
    return true;
  }
  return false;
};

const getCurrencyAndCountryByTaxProperty = (taxProperty) => {
  let itemCountry, itemCurrency;
  const codes = taxProperty.split('-');
  if (codes?.length === 4) {
    itemCountry = codes[1];
    itemCurrency = codes[2];
  } else if (codes?.length === 3) {
    itemCurrency = codes[1];
  } else {
    return { country: null, currency: null };
  }

  return { country: itemCountry, currency: itemCurrency };
};

/**
 *
 * @param {string} item1
 * @param {string} item2
 * @returns
 */
const isSame = (item1, item2) => {
  if (item1 && typeof item1 === 'string') {
    return item1?.localeCompare(item2, 'en', { sensitivity: 'base' }) === 0;
  }
  return false;
};

/**
 * check if country and currency are consistent
 *
 * @param {Array} taxProperties
 * @param {String} countryCode
 * @param {String} currencyCode
 * @returns {boolean}
 */
const checkCountryOrCurrencyIsConsistent = (taxProperties, countryCode, currencyCode) => {
  const filteredTaxProperties = taxProperties?.filter(
    (property) =>
      property.code !== CALCULATE_TAX_ON_KIT_DETAIL &&
      property.code !== PRODUCT_TYPE &&
      !String(property.code)?.startsWith('product'),
  );

  return filteredTaxProperties.every((property) => {
    const { country, currency } = getCurrencyAndCountryByTaxProperty(property?.code);
    const isCountryValid = isSame(country, countryCode);
    const isCurrencyValid = isSame(currency, currencyCode);

    if (isCountryValid || isCurrencyValid) {
      return true;
    }
    console.error(
      `error: country or currency not match: countryCode is ${countryCode} but get ${country},currencyCode is ${currencyCode} but get ${currency}`,
    );
    // TODO: handle error

    return false;
  });
};

/**
 * Construct child product from tax properties
 * If child need more attributes such as currency, country, pricetype, it can be added here
 *
 * @param {object} param0
 * @returns
 */
const getChildProduct = ({ childPropertyCode, index, percentage, price, quantity, includeParentPrice }) => {
  const properties = childPropertyCode.split('|');
  const child = {};
  if (properties?.length === 5) {
    child.number = index;
    child.quantity = quantity;
    child.amount = percentage * price;
    child.itemCode = properties[1];
    child.taxCode = properties[1];
  } else if (properties?.length === 4) {
    child.number = index;
    child.quantity = quantity;
    child.amount = Number(percentage) * 0.01 * Number(price);
    child.itemCode = properties[1];
    child.taxCode = properties[1];
  } else {
    return { childLine: null, index: index };
  }
  if (includeParentPrice) {
    child.parentPrice = price;
  }
  return { childLine: child, index: index + 1 };
};

module.exports = {
  getCountryCode,
  roundOffValue,
  checkNumberIsNaNAndInfinity,
  checkIsFlatTaxRate,
  getFlatTaxRate,
  getCompanyCode,
  checkIsExempted,
  getCurrencyAndCountryByTaxProperty,
  checkCountryOrCurrencyIsConsistent,
  getChildProduct,
  isSame,
};
