const express = require('express');

const router = express.Router();
const { getCountryCode, checkIsFlatTaxRate, getFlatTaxRate } = require('../../util/util');
const {
  getTransformedResponseByFlatTaxRate,
  getTransformedResponseFromAvalara,
} = require('../helpers/response-helper');
const { exampleEstimateTaxResponse } = require('../../util/example');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: authorization
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
 *         - documents
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the estimate
 *         documents:
 *           type: object
 *           description: The documents object
 *       example:
 *         id: 3f0c857e
 *         documents: [{
 *           id: 'document-id',
 *           items: [{
 *             id: '088c7465-e5b8-4624-a220-0d9faa82e7cb',
 *             price: {
 *               amount_inclusive: 675,
 *               amount_exclusive: 450,
 *               total_tax: 225,
 *               tax_rate: 0.5,
 *               sales_tax_summary: [
 *               {
 *                  name: 'Brutal Tax',
 *                  rate: 0.5,
 *                  amount: 225,
 *                  tax_class: {
 *                    class_id: '0',
 *                    name: 'Brutal Tax',
 *                    code: 'US',
 *                  },
 *                  id: 'Brutal Tax',
 *               }],
 *             },
 *             type: 'item',
 *           }],
 *           shipping: {
 *             id: '5d522b889d3d9',
 *             price: {
 *               amount_inclusive: 15,
 *               amount_exclusive: 10,
 *               total_tax: 5,
 *               tax_rate: 0.5,
 *               sales_tax_summary: [{
 *                 name: 'Brutal Tax',
 *                 rate: 0.5,
 *                 amount: 5,
 *                 tax_class: {
 *                   class_id: '0',
 *                   name: 'Brutal Tax',
 *                   code: 'US',
 *                 },
 *                 id: 'Brutal Tax',
 *              }]
 *            },
 *            type: 'shipping',
 *           },
 *           handling: {
 *             id: '5d522b889d3d9',
 *             price: {
 *               amount_inclusive: 0,
 *               amount_exclusive: 0,
 *               total_tax: 0,
 *               tax_rate: 0.5,
 *               sales_tax_summary: [{
 *                 name: 'Brutal Tax',
 *                 rate: 0.5,
 *                 amount: 0,
 *                 tax_class: {
 *                   class_id: '0',
 *                   name: 'Brutal Tax',
 *                   code: 'US',
 *                 },
 *                 id: 'Brutal Tax',
 *              }]
 *            },
 *           type: 'handling',
 *          }
 *       }]
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
 *         description: Bad Request Error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Bad Request Error
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

router.post('/', async (req, res, next) => {
  try {
    const quoteId = req.body.id;
    const storeHashValue = req.headers['x-bc-store-hash'];
    const countryCode = getCountryCode(storeHashValue);
    console.log('storeHashValue', storeHashValue);
    console.log('countryCode', countryCode);

    const isFlatTaxRate = checkIsFlatTaxRate(countryCode);
    let expectedResponse;
    if (isFlatTaxRate) {
      const flatTaxRate = getFlatTaxRate(countryCode);
      expectedResponse = getTransformedResponseByFlatTaxRate(req.body.documents, quoteId, flatTaxRate);
    } else {
      // TODO: transform avalara response to BC response
      expectedResponse = getTransformedResponseFromAvalara(req.body, storeHashValue, req.body.documents, quoteId);
    }
    console.log('expectedResponse', JSON.stringify(expectedResponse));

    return res.status(200).send(expectedResponse);
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
 *         description: Bad Request Error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Bad Request Error
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
