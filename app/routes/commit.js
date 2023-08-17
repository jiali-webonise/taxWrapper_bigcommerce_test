const express = require('express');

const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();
/**
 * @swagger
 * components:
 *   schemas:
 *     Commit:
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
 *   name: Commit
 *   description: The tax Commit API
 * /doc/commit:
 *   post:
 *     summary: Submit the quote request. A commit operation is intended to be submitted once only, when the Order has been confirmed and paid.
 *     tags: [Commit]
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
 *             $ref: '#/components/schemas/Commit'
 *     responses:
 *       200:
 *         description: The converted commit object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commit'
 *       500:
 *         description: Failed to post commit.
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