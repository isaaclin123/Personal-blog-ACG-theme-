const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/middleware.js");
const userDao = require("../modules/userDao.js");
const saltRounds =10;
const bcrypt = require ('bcrypt');
const { v4: uuid } = require("uuid");
const articleDao = require("../modules/articleDao.js");
const commentDao = require("../modules/commentDao.js");

/**
 * Render edit user information page
 */
router.get("/user",verifyAuthenticated, function(req, res) {

    console.log(res.locals.user);
    let user=res.locals.user;
    res.locals.defaultUsername=user.username;
    res.locals.defaultFirstName=user.fname;
    res.locals.defaultLastName=user.lname;
    res.locals.defaultDescription=user.description;
    
    // DD/MM/YYYY to YYYY-MM-DD  格式转换 
    // const YYYYMMDD = time.replace(/\//g, '').replace(/^(\d{2})(\d{2})(\d{4})$/,"$3-$2-$1")
    //YYYY-MM-DD to DD/MM/YYYY
    const time=user.DOB.replace(/^(\d{2})(\d{2})(\d{4})$/,"$3-$2-$1").replace(/\//g, '');
    res.locals.defaultDOB=time;
    res.locals.message=req.query.message;
    res.render("userEdit",{
        title:"Edit your information",
        jsFile:"userEditPage",
        cssFile: "useredit"
    });
});

/**
 * Check username availability(excluding the username which is logging in ) while editing user information 
 */
router.get("/app/user",verifyAuthenticated, function(req,res){
    const username = req.query.username;
    let currentUsername = res.locals.user.username;
    console.log(currentUsername);
    console.log(username);
    getUsernames();
    async function getUsernames(){
        let usernames =[];
        const usernamesOBJ= await userDao.retrieveAllUsernames();
        for (let i=0;i<usernamesOBJ.length;i++){
            usernames.push(usernamesOBJ[i].username);
        }
        console.log(usernames);
        console.log("this is "+usernames);
        if(usernames.includes(username)&&username!=currentUsername){
            console.log("in here");
            // res.status(300).send("true");
            // res.status(400).send(400);
            res.send("true"); 
        }else{
            res.send("false");
        }
    }
});
/**
 * Update user information and logout
 */
router.post("/app/user",verifyAuthenticated, async function(req, res){
    let password=req.body.password2;
    // const authToken = uuid();
    let user={
        id:res.locals.user.id,
        username:req.body.username,
        fname:req.body.first_name,
        lname:req.body.last_name,
        DOB:req.body.dob,
        description:req.body.description,
        avatar_image:req.body.avatar,
        isAdmin:"false",
        saltRounds:saltRounds,
        authToken:res.locals.user.authToken
    }
    let articles=await articleDao.retrieveArticlesbyUserId(user.id);
    console.log(articles);
    for(let i=0;i<articles.length;i++){
        articles[i].authorName=user.username;
        await articleDao.editArticle(articles[i]);
    }
    
    bcrypt.hash(password, saltRounds, async function(err, hash) {
        user.hashPassword=hash;
        console.log(user);
        await userDao.updateUser(user);
      });
      res.locals.user=user;

      
    res.redirect("/logout?message=Account updated successfully!");
});
/**
 * Delete user account along with user comments and articles
 */
router.get("/user/delete",verifyAuthenticated, async function(req,res){

    const result=req.query.confirm
    console.log("The result is------"+result);
    if(result=="true"){
        await commentDao.deleteCommentByUserID(res.locals.user.id);
        await articleDao.deleteArticleByUserId(res.locals.user.id);
        await userDao.deleteUser(res.locals.user.id);
        
        res.redirect("/");
    }else{
        res.redirect("/user");
    };

});

module.exports = router;