const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const { PROVIDER_ID, TAX_PROVIDER_ACCOUNT, TAX_PROVIDER_ACCOUNT_PW } = process.env;

const getTaxProviderConnectionConfig = (access_token) => {
  const config = {
    baseURL: 'https://api.bigcommerce.com/stores/',
    timeout: 1000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Auth-Token': access_token,
    },
  };
  return config;
};
/**
 * URL is https://api.bigcommerce.com/stores/${store_hash}/v3/tax/providers/${provider_id}/connection
 * bcConnectionClient instance is used for Tax Provider Connection
 */
const getTaxProviderConnectionStatus = async ({ store_hash, access_token }) => {
  let url = `${store_hash}/v3/tax/providers/${PROVIDER_ID}/connection`;

  return await axios
    .get(url, getTaxProviderConnectionConfig(access_token))
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

const deleteTaxProviderConnection = async ({ store_hash, access_token }) => {
  let url = `${store_hash}/v3/tax/providers/${PROVIDER_ID}/connection`;

  return await axios
    .delete(url, getTaxProviderConnectionConfig(access_token))
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

const updateTaxProviderConnection = async ({ store_hash, access_token }) => {
  let url = `${store_hash}/v3/tax/providers/${PROVIDER_ID}/connection`;
  const body = { username: TAX_PROVIDER_ACCOUNT, password: TAX_PROVIDER_ACCOUNT_PW }; //"profile": "test-profile"
  return await axios
    .put(url, body, getTaxProviderConnectionConfig(access_token))
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

module.exports = {
  getTaxProviderConnectionStatus,
  deleteTaxProviderConnection,
  updateTaxProviderConnection,
  getTaxProviderConnectionConfig,
};
