const mongoose = require("mongoose");
const UserSchema = mongoose.model("userSchema");

class User {

    /**
     * This method check if for given user time slot us already booked.
     * @param {*} userEmailId 
     * @param {*} startTime 
     * @param {*} endTime 
     * @param {*} weekDay
     * @return {boolean} 
     */
    async isUserExist(userEmailId) {
        const user = await UserSchema.findOne({ email: userEmailId }).exec();
        return user == null;
    }
}

module.exports = User;