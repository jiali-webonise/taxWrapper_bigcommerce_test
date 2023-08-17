const express = require('express');

const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

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
 *       500:
 *         description: Failed to post commit.
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

/**
 * @swagger
 * tags:
 *   name: Void
 *   description: The tax Void API
 * /doc/void/:app_domain:
 *   post:
 *     summary: Invalidate the persisted tax quote as identified by the given unique ID. Relevant to order cancellations or when moving an order from
 *              a paid status to an unpaid status.
 *     consumes:
 *      - application/json
 *     parameters:
 *      - in: path
 *        name: app_domain
 *        schema:
 *          type: string
 *        required: false
 *        description: App domain.
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
 *       500:
 *         description: Failed to post commit.
 *
 */
router.post('/:app_domain', (req, res, next) => {
  try {
    const { app_domain } = req.params;
    const storeHashValue = req.headers['x-bc-store-hash'];
    const taxQuoteId = req.query?.id;
    console.log('storeHashValue', storeHashValue);
    console.log('app_domain', app_domain);
    console.log('taxQuoteId', taxQuoteId);
    return res.status(200).send('OK');
  } catch (err) {
    next(err);
  }
});
module.exports = router;
