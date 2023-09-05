const axios = require('axios');

const { AVALARA_AUTH } = process.env;
/**
 * URL is https://api.bigcommerce.com/stores/${store_hash}/v3/tax/providers/${provider_id}/connection
 * bcConnectionClient instance is used for Tax Provider Connection
 */
const avalaraInstance = axios.create({
  baseURL: 'https://rest.avatax.com/api/v2/',
  timeout: 1000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Basic ${AVALARA_AUTH}`,
    'X-Avalara-Client': 'taxWrapper;2023.0;test integration;WRL370PrajaktaT',
  },
});

const getAvalaraService = async ({ url }) => {
  try {
    const res = await avalaraInstance.get(url);
    return res.data;
  } catch (error) {
    console.error('error', error);
  }
};

const postAvalaraService = async ({ url, body }) => {
  try {
    const res = await avalaraInstance.post(url, body);
    return res.data;
  } catch (error) {
    console.error('error', error);
  }
};

module.exports = { avalaraInstance, getAvalaraService, postAvalaraService };
