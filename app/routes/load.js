const express = require('express');

const router = express.Router();
const BigCommerce = require('node-bigcommerce');

const bigCommerce = new BigCommerce({
  secret: process.env.CLIENT_SECRET,
  responseType: 'json',
});

router.get('/', (req, res, next) => {
  try {
    const data = bigCommerce.verify(req.query.signed_payload);
    console.log(data);
    return res.status(200).send({ message: 'Welcome' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
