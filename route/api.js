const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.api"));
router.use("/calendar", require("./calendar.api"));
router.use("/user", require("./user.api"));

module.exports = router;