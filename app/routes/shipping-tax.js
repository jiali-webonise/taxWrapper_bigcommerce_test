const express = require('express');
const router = express.Router();
const fs = require('fs');
const data = require('../../config/shipping-rates');
const path = require('path');
const { REGION_NAME, ROOT_DIRECTORY } = require('../../config/constants');

const filePath = path.join(ROOT_DIRECTORY, 'config/shipping-rates.js');

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
 *     shippingTaxRate:
 *       type: object
 *       required:
 *         - rate
 *       properties:
 *         rate:
 *           type: number
 *           description: The new shipping tax rate
 *       example:
 *         rate: 0.15
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ReturnedShippingTaxRate:
 *       type: object
 *       required:
 *         - updatedValue
 *       properties:
 *         updatedValue:
 *           type: number
 *           description: The Updated Shipping tax rate
 *       example:
 *         updatedValue: 0.15
 */

/**
 * @swagger
 * tags:
 *   name: Shipping
 *   description: The shipping rates API
 * /shipping-tax/{key}:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: post shipping tax rate object
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Country code
 *         example: JP, NZ, IN, AU
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/shippingTaxRate'
 *     tags: [Shipping]
 *     responses:
 *       200:
 *         description: Updated Shipping tax rate successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReturnedShippingTaxRate'
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

router.post('/:key', (req, res, next) => {
  try {
    const key = req.params?.key;
    const updatedTaxRate = req.body?.rate;

    if (data.SHIPPING_FLAT_RATE.hasOwnProperty(key)) {
      data.SHIPPING_FLAT_RATE[key] = updatedTaxRate;

      //write data to shipping rate configuration file
      fs.writeFile(filePath, `module.exports=${JSON.stringify(data, null, 2)};`, 'utf-8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Unable to write to configuration file' });
        }
        res.json({
          message: `Updated Shipping tax rate for ${REGION_NAME[key]} successfully`,
          updatedValue: data.SHIPPING_FLAT_RATE[key],
        });
      });
    } else {
      res.status(404).json({ error: `Shipping tax rate for key ${key} not found in configuration file` });
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     ReturnedShippingTaxRateConfiguration:
 *       type: object
 *       example:
 *         {"JP": 0.2, "NZ": 0, "AU": 0, "IN":0}
 */

/**
 * @swagger
 * tags:
 *   name: Shipping
 *   description: The shipping rates configuration API
 * /shipping-tax/rate:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: get shipping tax rate object
 *     consumes:
 *       - application/json
 *     tags: [Shipping]
 *     responses:
 *       200:
 *         description: Shipping tax rate congurations.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReturnedShippingTaxRateConfiguration'
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

router.get('/rate', (req, res, next) => {
  res.json(data.SHIPPING_FLAT_RATE);
});

module.exports = router;
