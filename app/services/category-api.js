const axios = require('axios');
const { getTokenByStoreHash } = require('../../util/util');

const getCategoryAPIConfig = (access_token) => {
  const config = {
    baseURL: 'https://api.bigcommerce.com/stores/',
    timeout: 10000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Auth-Token': access_token,
    },
  };
  return config;
};

const getProductsBySKUs = async ({ store_hash, queryParams }) => {
  const access_token = getTokenByStoreHash(store_hash);

  let url = `${store_hash}/v3/catalog/products`;
  if (queryParams && queryParams !== '') {
    const skus = queryParams.toString();
    const includeFields = ['id', 'name', 'price', 'sale_price'].toString();
    url = url + `?sku:in=${skus}&include_fields=${includeFields}`;
  }

  return await axios
    .get(url, getCategoryAPIConfig(access_token))
    .then(function (response) {
      console.log(response);
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
};

module.exports = {
  getProductsBySKUs,
};
