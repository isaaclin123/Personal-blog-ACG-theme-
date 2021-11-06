/**
 * API route handlers for java swing project
 */
const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/middleware.js");
const userDao = require("../modules/userDao.js");
const bcrypt = require ('bcrypt');
const { v4: uuid } = require("uuid");
const articleDao = require("../modules/articleDao.js");
const commentDao = require("../modules/commentDao.js");


router.post("/api/login", async function(req, res){
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
            console.log(authToken);
            res.locals.user = user;
            res.status(204).json({authToken:authToken});
        }else {
            // Auth fail
            res.locals.user = null;
            res.status(401).json("Authentication fail");
        }
    }
});

router.get("/api/logout", async function (req, res) {
    console.log("Log out");
    res.clearCookie("authToken");
    const user = await userDao.retrieveUserWithAuthToken(req.query.authToken);
    user.authToken="";
    await userDao.updateUser(user);
    console.log(user);
    res.locals.user = null;

    console.log("Log out");
    res.status(204).json("Log out successfully");
       
});

router.get("/api/users", async function(req,res){
    console.log("From java");
    const user = await userDao.retrieveUserWithAuthToken(req.query.authToken);
    console.log(user);
    if(user&&user.isAdmin=="true"){
        let allUsers =await userDao.retrieveAllUsers();
        let allUsersAndArticleCounts=[];
        for(let i=0;i<allUsers.length;i++){
            let user =allUsers[i];
            user.dob=user.DOB;
            delete user.DOB;
            let userArticles=await articleDao.retrieveArticlesbyUserId(user.id);
            user.userArticlesCount =userArticles.length;
            allUsersAndArticleCounts.push(user);
        }
        res.json(allUsersAndArticleCounts);
    }else{
        res.status(401).json("You are not an Admin");
    }
});

router.delete("/api/users/:id",async function(req,res){
    const user = await userDao.retrieveUserWithAuthToken(req.query.authToken);
    console.log("delete request");
    if(user&&user.isAdmin=="true"){
        let deleteUserID=req.params.id;
        let userToDelete =await userDao.retrieveUserById(deleteUserID);
        if(userToDelete){
            await commentDao.deleteCommentByUserID(userToDelete.id);
            await articleDao.deleteArticleByUserId(userToDelete.id);
            await userDao.deleteUser(userToDelete.id);
            res.status(204).json("User deleted");
        }else{
            res.status(401).json("No user found with the request id");
        }

    }else{
        res.status(401).json("You are not an Admin");
    }
})

module.exports=router;