require("./index.test");
const assert = require('assert');

const UserAvailabilityBiz = require('../biz/userAvailability.biz');

const UserBiz = require("../biz/user.biz");

before(async () => {
    const dbMock = require("./db.mock");
    await dbMock.createDatabase();
    require("./index.test");
});

describe('Check Function isTimeSlotAvailable ', async () => {
    it('Time slot should be available', async () => {

        const userEmailId = "azaddeepika05@gmail.com";
        const userBiz = new UserBiz();
        const doesUserExist = await userBiz.isUserExist(userEmailId);
        assert.equal(doesUserExist, true);

        const startTime = "13:00";
        const endTime = "14:00";
        const weekday = "monday";
        const userAvailabilityBiz = new UserAvailabilityBiz();
        const result = await userAvailabilityBiz.isTimeSlotAvailable(userEmailId, startTime, endTime, weekday);
        assert(result != null);
        assert.equal(result, true);
    });

    it('Book Available slot', async () => {
        const availabilityObj = {
            emailId: "azaddeepika05@gmail.com",
            timeSlot: {
                slotType: "week_day",
                weekDay: "MONDAY",
                interval: [{
                    from: "13:01:00",
                    to: "14:00:00"
                }]
            }
        };
        const userAvailabilityBiz = new UserAvailabilityBiz();
        const result = await userAvailabilityBiz.createUserAvailability(Object.assign(new Object(), availabilityObj));
        assert(result != null);
        assert.equal(result.success, true);
        assert.equal(result.message, "Successfully Updated");
    });
});
