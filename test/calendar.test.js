require("./index.test");
const assert = require('assert');

const CalendarBiz = require('../biz/calendar.biz');

const EventRepo = require("../repository/event.repository");

before(async () => {
    const dbMock = require("./db.mock");
    await dbMock.createDatabase();
    // require("../model/index");
});

describe('Event Creation', async () => {
    
});