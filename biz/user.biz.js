const UserRepo = require("../repository/user.repository");

class User {

    /**
     * Function to save user.
     * @param {*} user 
     */
    async saveUser(user, code) {
        try {
            const userRepo = new UserRepo();
            const userResponse = await userRepo.saveUser(user);
            return userResponse;
        } catch (error) {
            return reject(error);
        }
    }

    /**
     * Check if user available.
     * @param {*} userEmailId 
     */
    async isUserExist(userEmailId) {
        try {
            const userRepo = new UserRepo();
            const userResponse = await userRepo.findUserByEmailId(userEmailId);
            return userResponse !== null;
        } catch(error) {
            throw error;
        }
    }
}

module.exports = User;