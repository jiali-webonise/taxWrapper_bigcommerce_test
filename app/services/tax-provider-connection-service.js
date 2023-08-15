
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const {API_URL, CLIENT_ID, CLIENT_SECRET, LOGIN_URL, ACCESS_TOKEN, PROVIDER_ID, TAX_PROVIDER_ACCOUNT, TAX_PROVIDER_ACCOUNT_PW} = process.env;
/**
 * URL is https://api.bigcommerce.com/stores/${store_hash}/v3/tax/providers/${provider_id}/connection
 * bcConnectionClient instance is used for Tax Provider Connection
 */
const bcConnectionClient = axios.create({
  baseURL: 'https://api.bigcommerce.com/stores/',
  timeout: 1000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Auth-Token': ACCESS_TOKEN
  }
});

const getTaxProviderConnectionStatus = async (store_hash) => {
  let url = `${store_hash}/v3/tax/providers/${PROVIDER_ID}/connection`;

  return await bcConnectionClient.get(url)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    })
}

const deleteTaxProviderConnection = async (store_hash) => {
  let url = `${store_hash}/v3/tax/providers/${PROVIDER_ID}/connection`;

  return await bcConnectionClient.delete(url)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    })
}

const updateTaxProviderConnection = async (store_hash) => {
  let url = `${store_hash}/v3/tax/providers/${PROVIDER_ID}/connection`;
  const body = {"username": TAX_PROVIDER_ACCOUNT, "password": TAX_PROVIDER_ACCOUNT_PW, }//"profile": "test-profile"
  return await bcConnectionClient.put(url, body)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    })
}

module.exports = {
  getTaxProviderConnectionStatus,
  deleteTaxProviderConnection,
  updateTaxProviderConnection
};
