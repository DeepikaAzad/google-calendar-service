require("./index.test");
const assert = require('assert');

const UserBiz = require('../biz/user.biz');

const ResourceNotFoundError = require("../exception/resourceNotFoundError.exception");

before(async () => {
    const dbMock = require("./db.mock");
    await dbMock.createDatabase();
    // require("../model/index");
});

describe('User Creation', async () => {
    it('Test create user', async () => {
        const userObj = {
            name: "Deepika",
            email: "azaddeepika05@gmail.com",
            displayPicture: "https://blog.postman.com/wp-content/themes/Postal-v1.2.0/favicon.ico"
        };
        const userBizObj = new UserBiz();
        const userCreationObj = await userBizObj.saveUser(userObj);
        assert.notEqual(userCreationObj, null);
        assert.equal(userCreationObj.name, userObj.name);
        assert.equal(userCreationObj.email, userObj.email);
        assert.equal(userCreationObj.displayPicture, userObj.displayPicture);

        const userBiz = new UserBiz();
        const doesUserExist = await userBiz.isUserExist(userObj.email);
        assert.equal(doesUserExist, true);
    });

    it ('Event should throw not found error.', async () => {
        const publisherEmail = "azaddeepika08@gmail.com";
        const userBiz = new UserBiz();
        const isUserExist = await userBiz.isUserExist(publisherEmail);
        assert.equal(isUserExist, false);
        assert.throws(() => {
            throw new ResourceNotFoundError("The page you are looking for could not be found.");
        }, "User not found");
    });
});
