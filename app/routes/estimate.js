const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

router.post('/', (req, res, next) => {
  try {
    console.log('req', req.body);
    return res.status(200).send(JSON.stringify(req.body));
  } catch (err) {
    next(err);
  }
});
module.exports = router;