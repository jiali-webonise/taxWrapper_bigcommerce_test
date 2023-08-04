const express = require('express'),
  router = express.Router(),
  BigCommerce = require('node-bigcommerce');
const bigCommerce = new BigCommerce({
  secret: process.env.CLIENT_SECRET,
  responseType: 'json'
});

router.get('/', (req, res, next) => {
  // return res.status(200).send({message: 'loading'});
  try {
    const data = bigCommerce.verify(req.query['signed_payload']);
    console.log(data);
    // res.render('welcome', {title: 'Welcome!'});
    return res.status(200).send({message: 'welcome'});
  } catch (err) {
    next(err);
  }
});

module.exports = router;