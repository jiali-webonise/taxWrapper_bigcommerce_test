const dotenv = require('dotenv');

dotenv.config();
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

module.exports = { getCountryCode };
