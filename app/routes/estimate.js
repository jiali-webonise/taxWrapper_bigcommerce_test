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
 *         - converted
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
 *         converted:
 *           type: boolean
 *           description: This estimate is converted
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
 *         converted: true
 */

/**
 * @swagger
 * tags:
 *   name: Estimate
 *   description: The tax estimate API
 * /tax/estimate:
 *   post:
 *     summary: post tax estimate object
 *     consumes:
 *      - application/json
 *     parameters:
 *      - in: header
 *        name: X-BC-Store-Hash
 *        schema:
 *          type: string
 *        required: true
 *        description: Store Hash.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Estimate'
 *     tags: [Estimate]
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
    const result = { ...req.body, converted: true };
    return res.status(200).send(JSON.stringify(result));
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * tags:
 *   name: Estimate
 *   description: The tax estimate API
 * /tax/estimate/:app_domain:
 *   post:
 *     summary: post tax estimate object
 *     consumes:
 *      - application/json
 *     parameters:
 *      - in: path
 *        name: app_domain
 *        schema:
 *          type: string
 *        required: false
 *        description: App domain.
 *      - in: header
 *        name: X-BC-Store-Hash
 *        schema:
 *          type: string
 *        required: true
 *        description: Store Hash.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Estimate'
 *     tags: [Estimate]
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
router.post('/:app_domain', (req, res, next) => {
  try {
    const { app_domain } = req.params;
    console.log('app_domain', app_domain);
    console.log('req', req.body);
    const result = { ...req.body, converted: true };
    return res.status(200).send(JSON.stringify(result));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
