const { FLAT_RATE, SHIPPING_FLAT_RATE } = require('../config/constants');
const { InternalError } = require('../app/services/error-service');

const {
  US_BIGCOMMERCE_STORE_HASH,
  CA_BIGCOMMERCE_STORE_HASH,
  AU_BIGCOMMERCE_STORE_HASH,
  NZ_BIGCOMMERCE_STORE_HASH,
  JP_BIGCOMMERCE_STORE_HASH,
  IN_BIGCOMMERCE_STORE_HASH,
  EU_BIGCOMMERCE_STORE_HASH,
  WEBONISELAB_STORE_HASH,
  US_BIGCOMMERCE_ACCESS_TOKEN,
  CA_BIGCOMMERCE_ACCESS_TOKEN,
  AU_BIGCOMMERCE_ACCESS_TOKEN,
  NZ_BIGCOMMERCE_ACCESS_TOKEN,
  JP_BIGCOMMERCE_ACCESS_TOKEN,
  EU_BIGCOMMERCE_ACCESS_TOKEN,
  IN_BIGCOMMERCE_ACCESS_TOKEN,
  WEBONISELAB_ACCESS_TOKEN,
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

const getTokenByStoreHash = (storeHash) => {
  if (!storeHash) return null;
  switch (storeHash) {
    case US_BIGCOMMERCE_STORE_HASH:
      return US_BIGCOMMERCE_ACCESS_TOKEN;
    case CA_BIGCOMMERCE_STORE_HASH:
      return CA_BIGCOMMERCE_ACCESS_TOKEN;
    case AU_BIGCOMMERCE_STORE_HASH:
      return AU_BIGCOMMERCE_ACCESS_TOKEN;
    case NZ_BIGCOMMERCE_STORE_HASH:
      return NZ_BIGCOMMERCE_ACCESS_TOKEN;
    case JP_BIGCOMMERCE_STORE_HASH:
      return JP_BIGCOMMERCE_ACCESS_TOKEN;
    case IN_BIGCOMMERCE_STORE_HASH:
      return IN_BIGCOMMERCE_ACCESS_TOKEN;
    case EU_BIGCOMMERCE_STORE_HASH:
      return EU_BIGCOMMERCE_ACCESS_TOKEN;
    case WEBONISELAB_STORE_HASH:
      // this is for testing in Webonise sandbox
      return WEBONISELAB_ACCESS_TOKEN;
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

module.exports = {
  getCountryCode,
  roundOffValue,
  checkNumberIsNaNAndInfinity,
  checkIsFlatTaxRate,
  getFlatTaxRate,
  getCompanyCode,
  checkIsExempted,
  getTokenByStoreHash,
};
