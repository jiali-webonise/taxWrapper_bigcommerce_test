const express = require('express');
const router = express.Router();
const BigCommerce = require('node-bigcommerce');

const bigCommerce = new BigCommerce({
  clientId: process.env.CLIENT_ID,
  secret: process.env.CLIENT_SECRET,
  callback: process.env.AUTH_CALLBACK,
  responseType: 'json'
});

router.get('/', (req, res, next) => {
  // return res.status(200).send({message: 'Authorized'});
  bigCommerce.authorize(req.query)
    .then(data => console.log('data: ', data))
    .then(data => {
      console.log('data2: ', data);
      return res.status(200).send({message: 'Authorized'})
    }).catch((err) => {
      console.error(err)
    })
});
module.exports = router;