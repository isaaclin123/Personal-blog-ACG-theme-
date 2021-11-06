const express = require("express");
const router = express.Router();
const userDao = require("../modules/userDao.js");
const bcrypt = require ('bcrypt');
const { v4: uuid } = require("uuid");
const { verifyAuthenticated } = require("../middleware/middleware.js");

/**
 * Render the log in page
 */
router.get("/login",function(req, res){
    if(res.locals.user){
        res.redirect("/myHomePage")
    }else{
        res.locals.message=req.query.message;
        res.render("login",{
            title:"Login page",
            jsFile:"loginPage",
            cssFile: "login"
        });
    } 
});

router.get("/app/login",function(req, res){
    
    res.redirect("/");
});
/**
 * Receive username and password and compare password with hashpassword that stored in the database
 */
router.post("/app/login",async function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    console.log(username,password);
    let hash =await userDao.retrieveHashByUsername(username);
    console.log(hash);
    if(hash==undefined){
        hash={hashPassword:0};
    }
    // console.log(hash.hashPassword);
    bcrypt.compare(password, hash.hashPassword, async function(err, result) {
        console.log(result);
        haveAccess(result);
      });
      async function haveAccess(result){
        if (result) {
            // Auth success - give that user an authToken, save the token in a cookie, and redirect to the homepage.
            const user = await userDao.retrieveUserWithHashPassword(hash.hashPassword);
            const authToken = uuid();
            user.authToken = authToken;
            await userDao.updateUser(user);
            res.cookie("authToken", authToken);
            res.locals.user = user;
            console.log(user);
            // res.status(204);
            // response.statusCode=204;
            // request.statusCode=204;
            // res.status(204).send("/myHomePage");
            res.redirect("/myHomePage");
            // res.redirect("204,/myHomePage");
        }else {
            // Auth fail
            res.locals.user = null;
            // res.status(401);
            // response.statusCode=401;
            // request.statusCode=401;
            res.redirect("/login?message=Authentication failed!");
            // res.redirect(401,"/login?message=Authentication failed!");
        }
    }

    
});

/**
 * Log out and clear the authToken and all other cookies
 */
router.get("/logout",verifyAuthenticated, function (req, res) {
    console.log("after next 7");
    res.clearCookie("articleImage");
    res.clearCookie("authToken");
    res.clearCookie("userID");
    res.clearCookie("articleID");
    res.clearCookie("authorID");
    res.locals.user = null;
    // res.status(204);
    // response.statusCode=204;
    // request.statusCode=204;
    res.redirect("./?message=Logout successful!");
    // res.redirect(204,"./?message=Successfully logged out!");
});

module.exports = router;