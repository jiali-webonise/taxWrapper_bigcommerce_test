const express = require('express');

const router = express.Router();
const dotenv = require('dotenv');
const { getCountryCode } = require('../../util/util');
const { UnauthorizedError } = require('../services/error-service');
const { exampleEstimateTaxResponse } = require('../../util/example');

dotenv.config();
const { ACCESS_TOKEN } = process.env;

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: x-auth-token
 */

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
 *         documents:
 *           type: object
 *           description: The documents object
 *       example:
 *         id: 3f0c857e
 *         documents: [{}]
 */

/**
 * @swagger
 * tags:
 *   name: Estimate
 *   description: The tax estimate API
 * /tax/estimate:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
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
 *       400:
 *         description: Not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Not Found
 *       401:
 *         description: Not authenticated. Response to indicate that the merchant’s authentication credentials are invalid. The merchant will receive an update in their Store Logs.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Unauthorized request
 *       500:
 *         description: Failed to post estimate.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Internal Error
 */

router.post('/', (req, res, next) => {
  try {
    console.log('req', req.body);
    const authToken = req.headers['x-auth-token'];
    if (!authToken || authToken !== ACCESS_TOKEN) {
      throw new UnauthorizedError();
    }
    const storeHashValue = req.headers['x-bc-store-hash'];
    const countryCode = getCountryCode(storeHashValue);
    console.log('storeHashValue', storeHashValue);
    console.log('countryCode', countryCode);
    return res.status(200).send(JSON.stringify(req.body));
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
 *       400:
 *         description: Not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Not Found
 *       401:
 *         description: Not authenticated. Response to indicate that the merchant’s authentication credentials are invalid. The merchant will receive an update in their Store Logs.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Unauthorized request
 *       500:
 *         description: Failed to post estimate.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Internal Error
 */
router.post('/:app_domain', (req, res, next) => {
  try {
    const { app_domain } = req.params;
    const authToken = req.headers['x-auth-token'];
    if (!authToken || authToken !== ACCESS_TOKEN) {
      throw new UnauthorizedError();
    }
    const storeHashValue = req.headers['x-bc-store-hash'];
    const countryCode = getCountryCode(storeHashValue);
    console.log('storeHashValue', storeHashValue);
    console.log('countryCode', countryCode);
    console.log('app_domain', app_domain);
    console.log('req', req.body);
    return res.status(200).send(JSON.stringify(exampleEstimateTaxResponse));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
