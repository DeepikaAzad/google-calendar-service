const express = require("express");
const router = express.Router();

const Helpers = require("../util");
const googleUtil = require('../util/google-util');
const UserBiz = require('../biz/user.biz')
// Middleware to check and save session cookie
const setCookie = async (request, response, next) => {
    googleUtil.getGoogleAccountFromCode(request.query.code, (err, response) => {
        if (err) {
            response.redirect('/auth/login');
        } else {
            request.session.user = response;
        }
        next();
    });
};

// Google callback redirect uri.
router.get('/success', setCookie, async (request, response) => {
    const userBiz = new UserBiz();
    await userBiz.saveUser(request.session.user);
    return response.redirect('/#/home')
});

// To check if user is logged-in.
router.get('/loggedin', (request, response) => {
    if (!Helpers.isObjectEmpty(request.session.user)) {
        return response.status(200).json({ data: request.session.user });
    } else {
        return response.status(401).json({ status: "unauthenticated" });
    }
});

// To initiate google authorization grant flow.
router.get("/login", (request, response) => {
    return response.redirect(googleUtil.urlGoogle());
});

module.exports = router;