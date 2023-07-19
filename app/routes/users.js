const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user-controller');
const {use} = require('../services/error-service');

router.get('/', use(UserController.getUsers));
router.get('/:id', use(UserController.getUser));

module.exports = router;
