describe('Check Function isTimeSlotAvailable ', () => {
    const assert = require('assert');
    const sinon = require('sinon');
    const UserAvailability = require('../repository/user_availability.repository');
    it('time slot should be matched with give data', () => {
        const userEmailId = "azaddeepika05@gmail.com";
        const startTime = "17:00";
        const endTime = "18:00";
        const weekday = "monday";
        const resp = (new UserAvailability()).isTimeSlotAvailable(userEmailId,startTime,endTime,weekday);
        assert(resp != null);
    });
});
