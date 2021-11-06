const userDao = require("../modules/userDao.js");

/**
 * 
 * A global middleware to add user to locals after logging in 
 */
async function addUserToLocals(req, res, next) {
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    console.log("1 middleware---user is "+user);
    res.locals.user = user;
    next();
}

/**
 * A local middleware to verify user's login status and redirect user to different page base on user's login status
 */
function verifyAuthenticated(req, res, next) {
    if (res.locals.user) {
        next();
    }
    else {
        res.redirect("/");
    }
}

module.exports = {
    addUserToLocals,
    verifyAuthenticated
};