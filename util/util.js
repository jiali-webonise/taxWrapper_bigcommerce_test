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
  if (!countryCode) return -1;
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

module.exports = {
  getCountryCode,
  roundOffValue,
  checkNumberIsNaNAndInfinity,
  checkIsFlatTaxRate,
  getFlatTaxRate,
};
