const express = require('express');

const router = express.Router();
const dotenv = require('dotenv');
const { getCountryCode } = require('../../util/util');
const { exampleEstimateTaxResponse } = require('../../util/example');

dotenv.config();
/**
 * @swagger
 * components:
 *   schemas:
 *     Adjust:
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
 *   name: Adjust
 *   description: The tax Adjust API
 * /doc/adjust:
 *   post:
 *     summary: Replace the persisted tax quote (identified by the given unique ID) with the provided quote request (represented by the AdjustRequest).
 *     tags: [Adjust]
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
 *             $ref: '#/components/schemas/Adjust'
 *     responses:
 *       200:
 *         description: The Adjust object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estimate'
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
 *         description: Failed to post Adjust.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Internal Error
 *
 */

router.post('/', (req, res, next) => {
  try {
    console.log('req', req.body);
    const storeHashValue = req.headers['x-bc-store-hash'];
    const countryCode = getCountryCode(storeHashValue);
    console.log('storeHashValue', storeHashValue);
    console.log('countryCode', countryCode);
    return res.status(200).send(JSON.stringify(exampleEstimateTaxResponse));
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * tags:
 *   name: Adjust
 *   description: The tax Adjust API
 * /doc/adjust/:app_domain:
 *   post:
 *     summary: Replace the persisted tax quote (identified by the given unique ID) with the provided quote request (represented by the AdjustRequest).
 *     tags: [Adjust]
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
 *             $ref: '#/components/schemas/Adjust'
 *     responses:
 *       200:
 *         description: The Adjust object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Adjust'
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
 *         description: Failed to post Adjust.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Internal Error
 *
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
