const express = require('express');
const router = express.Router();
const BigCommerce = require('node-bigcommerce');
const dotenv = require('dotenv');
dotenv.config();

const {API_URL, AUTH_CALLBACK, CLIENT_ID, CLIENT_SECRET, LOGIN_URL} = process.env;

const apiConfig = {
  apiUrl: API_URL,
  loginUrl: LOGIN_URL
}

const bigCommerce = new BigCommerce({
  clientId: CLIENT_ID,
  secret: CLIENT_SECRET,
  callback: AUTH_CALLBACK,
  responseType: 'json',
  headers: {'Accept-Encoding': '*'},
  apiVersion: 'v3',
  ...apiConfig,
});

router.get('/', (req, res, next) => {
  bigCommerce.authorize(req.query)
    .then(data => console.log('data: ', data))
    .then(data => {
      return res.status(200).send({message: 'Authorized'})
    }).catch((err) => {
      console.error(err)
    })
});
module.exports = router;