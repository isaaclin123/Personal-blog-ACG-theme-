const express = require("express");
const router = express.Router();
const bcrypt = require ('bcrypt');
const userDao = require("../modules/userDao.js");
const saltRounds =10;

/**
 * Create new account
 */
router.post("/app/newAccount", async function(req, res){
    let password=req.body.password2;
    console.log(password);
    
    let user={
        username:req.body.username,
        fname:req.body.first_name,
        lname:req.body.last_name,
        DOB:req.body.dob,
        description:req.body.description,
        avatar_image:req.body.avatar,
        isAdmin:"false",
        saltRounds:saltRounds
    }
    try {
        bcrypt.hash(password, saltRounds, async function(err, hash) {
            user.hashPassword=hash;
            console.log(user);
            await userDao.createUser(user);
          });
        res.redirect(`/login?message=Welcome ${user.username}! Account created successfully!`);
    } catch (error) {
        console.log(error.message);
        res.redirect(`/newAccount?errorMessage=Error! Cannot create an account, please try again.`)
    }
    
});     
/**Render new account page */
router.get("/newAccount",function(req, res){

    res.locals.errorMessage=req.query.errorMessage;
    res.render("newAccount",{
        title:"New account",
        jsFile:"newAccountPage",
        cssFile:"newAccountPage"
    });
});

router.post("/newAccount", async function(req, res){

    res.redirect("/login");
});
/**
 * Check username availability
 */
router.get("/app/newAccount", function(req,res){
    const username = req.query.username;
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
        if(usernames.includes(username)){
            console.log("in here");
            // res.status(300).send("true");
            // res.status(400).send(400);
            res.send("true"); 
        }else{
            res.send("false");
        }
    }
});





module.exports = router;