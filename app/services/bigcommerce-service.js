const axios = require('axios');
const { getAccessToken } = require('../../util/util');

const instance = axios.create({
  baseURL: 'https://api.bigcommerce.com/stores/',
  timeout: 10000,
});

const createCardMetaData = async ({ url, body, storeHash }) => {
  const token = getAccessToken(storeHash);
  console.log('access token', token, storeHash);
  try {
    const res = await instance.post(url, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Auth-Token': token,
      },
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

const updateCardMetaData = async ({ url, body, storeHash }) => {
  const token = getAccessToken(storeHash);
  try {
    const res = await instance.put(url, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Auth-Token': token,
      },
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

const getCartMetaData = async ({ url, storeHash }) => {
  const token = getAccessToken(storeHash);
  try {
    const res = await instance.get(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Auth-Token': token,
      },
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};
module.exports = { createCardMetaData, updateCardMetaData, getCartMetaData };
