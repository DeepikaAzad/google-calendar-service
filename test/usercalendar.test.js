require("./index.test");
const assert = require('assert');

const CalendarBiz = require('../biz/calendar.biz');
const UserBiz = require('../biz/user.biz');

before(async () => {
    const dbMock = require("./db.mock");
    await dbMock.createDatabase();
});

describe('Check Function createEvent', async () => {

    it('Event should  create successfully', async () => {
        const publisher = "azaddeepika05";
        const event = {
            summary: "Test",
            description: "user can book event.",
            start: {
                dateTime: "2020-04-08T04:00:00.000Z",
                timeZone: "Asia/Kolkata"
            },
            end: {
                dateTime: "2020-04-08T05:00:00.000Z",
                timeZone: "Asia/Kolkata"
            },
            attendees: {
                email: "taniya05sen@gmail.com"
            }
        };
        const calendarBiz = new CalendarBiz();
        const result = await calendarBiz.createEvent(event, publisher);
        assert(result != null);
        assert.equal(result.success, true);
        assert.equal(result.message, "Event Booked Successfully");
    });
});