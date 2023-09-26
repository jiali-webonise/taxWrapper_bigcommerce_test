const axios = require('axios');

const { AVALARA_AUTH } = process.env;

const avalaraInstance = axios.create({
  baseURL: 'https://rest.avatax.com/api/v2/',
  timeout: 10000,
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
