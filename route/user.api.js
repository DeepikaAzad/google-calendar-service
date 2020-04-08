const express = require("express");
const router = express.Router();

const UserController = require("../controller/user.controller");

const userController = new UserController();
userController.register(router);

module.exports = router;