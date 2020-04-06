
const mongoose = require("mongoose");

const UserSchema = mongoose.model("userSchema");

class User {

    /**
     * Function to save user.
     * @param {*} user 
     */
    async saveUser(user) {
        return new Promise(async (resolve, reject) => {
            try {
                // Update if already exist otherwise insert new user
                UserSchema.findOneAndUpdate({ id: user.id }, user, {
                    new: true,
                    upsert: true // Make this update into an upsert
                }, ((error, data) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(data);
                }));
            } catch (error) {
                return reject(error);
            }
        });
    }
}

module.exports = User;