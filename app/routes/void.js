const express = require('express');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Void
 *   description: The tax Void API
 * /doc/void:
 *   post:
 *     summary: Invalidate the persisted tax quote as identified by the given unique ID. Relevant to order cancellations or when moving an order from
 *              a paid status to an unpaid status.
 *     consumes:
 *      - application/json
 *     parameters:
 *      - in: query
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Unique ID identifying the existing, persisted Tax Quote that will be voided.
 *      - in: header
 *        name: X-BC-Store-Hash
 *        schema:
 *          type: string
 *        required: true
 *        description: Store Hash.
 *     tags: [Void]
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: OK
 *       401:
 *         description: Not authenticated. Response to indicate that the merchant’s authentication credentials are invalid. The merchant will receive an update in their Store Logs.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Unauthorized request
 *       400:
 *         description: Not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Not Found
 *       500:
 *         description: Failed to invalidate the persisted tax quote.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Internal Error
 *
 */

router.post('/', (req, res, next) => {
  try {
    const storeHashValue = req.headers['x-bc-store-hash'];
    const taxQuoteId = req.query?.id;
    console.log('storeHashValue', storeHashValue);
    console.log('taxQuoteId', taxQuoteId);
    return res.status(200).send('OK');
  } catch (err) {
    next(err);
  }
});
module.exports = router;
