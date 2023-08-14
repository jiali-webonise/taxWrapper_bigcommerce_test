const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

/**
 * @swagger
 * components:
 *   schemas:
 *     Estimate:
 *       type: object
 *       required:
 *         - id
 *         - currency_code
 *         - customer
 *         - transaction_date
 *         - documents 
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the estimate
 *         currency_code:
 *           type: string
 *           description: The currency code
 *         customer:
 *           type: object
 *           description: The customer object
 *         transaction_date:
 *           type: string
 *           description: The transaction date
 *         documents:
 *           type: object
 *           description: The documents object
 *       example:
 *         id: 3f0c857e
 *         currency_code: USD
 *         customer: {
 *            "customer_id": "0",
 *            "customer_group_id": "0",
 *            "taxability_code": ""
 *         }
 *         transaction_date: 2019-08-13T03:17:37+00:00
 *         documents: {}
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ReturnedEstimate:
 *       type: object
 *       required:
 *         - id
 *         - currency_code
 *         - customer
 *         - transaction_date
 *         - documents 
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the estimate
 *         currency_code:
 *           type: string
 *           description: The currency code
 *         customer:
 *           type: object
 *           description: The customer object
 *         transaction_date:
 *           type: string
 *           description: The transaction date
 *         documents:
 *           type: object
 *           description: The documents object
 *       example:
 *         id: 3f0c857e
 *         currency_code: USD
 *         customer: {
 *            "customer_id": "0",
 *            "customer_group_id": "0",
 *            "taxability_code": ""
 *         }
 *         transaction_date: 2019-08-13T03:17:37+00:00
 *         documents: {}
 */

/**
 * @swagger
 * tags:
 *   name: Estimate
 *   description: The tax estimate API
 * /api/tax/estimate:
 *   post:
 *     summary: post tax estimate object
 *     tags: [Estimate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Estimate'
 *     responses:
 *       200:
 *         description: The converted estimate object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReturnedEstimate'
 *       500:
 *         description: Failed to post estimate.
 *
 */

router.post('/', (req, res, next) => {
  try {
    console.log('req', req.body);
    return res.status(200).send(JSON.stringify(req.body));
  } catch (err) {
    next(err);
  }
});
module.exports = router;