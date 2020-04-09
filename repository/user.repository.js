const mongoose = require("mongoose");
const UserSchema = mongoose.model("userSchema");

class User {

    /**
     * This method check if for given user time slot us already booked.
     *
     * @param {*} userEmailId 
     */
    async findUserByEmailId(userEmailId) {
        return UserSchema.findOne({ email: userEmailId }).exec();
    }

    /**
     * Function to update if already exist otherwise insert new user
     *
     * @param {*} userObj 
     */
    async saveUser(userObj) {
        try {
            return UserSchema.findOneAndUpdate({ email: userObj.email }, userObj, {
                new: true,
                upsert: true // Make this update into an upsert
            }).exec();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;