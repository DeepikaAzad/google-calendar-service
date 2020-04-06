const express = require("express");
const router = express.Router();

const CalendarController = require("../controller/calendar.controller");

const calendarController = new CalendarController();
calendarController.register(router);

module.exports = router;