const express = require('express');

const router = express.Router();
const UserController = require('../controllers/user-controller');
const { use } = require('../services/error-service');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - username
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         title:
 *           type: string
 *           description: The username of user
 *       example:
 *         id: d5fE_asz
 *         username: John
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: The get users API
 * /user:
 *   get:
 *     summary: Get users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: The users.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Failed to fetch users
 *   name: User
 *   description: The get user by ID API
 *
 * /user/{userId}:
 *   get:
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         type: integer
 *         required: true
 *         description: Numeric ID of the user to get.
 *
 *     tags: [User]
 *     responses:
 *       200:
 *         description: The users.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Failed to fetch user by ID
 *
 */

router.get('/', use(UserController.getUsers));
router.get('/:id', use(UserController.getUser));

module.exports = router;
