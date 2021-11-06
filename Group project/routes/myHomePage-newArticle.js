const express = require("express");
const router = express.Router();
const userDao = require("../modules/userDao.js");
const articleDao = require("../modules/articleDao.js");
const { verifyAuthenticated } = require("../middleware/middleware.js");
const upload= require("../middleware/multer-uploader.js");
// Setup jimp
const jimp = require("jimp");
//Set up fs 
const fs=require("fs");
const path = require("path");

/**
 * Render my home page
 */
router.get("/myHomePage",verifyAuthenticated,async  function (req,res) {
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    res.locals.user=user;
    let userArticles= await articleDao.retrieveArticlesbyUserId(res.locals.user.id);
    res.clearCookie("articleImage");
    res.clearCookie("articleContent");
    res.clearCookie("articleTitle");
    res.locals.userImage=res.locals.user.avatar_image;
    let userArticlesWithImages =[];
    for(let i=0;i<userArticles.length;i++){
        let articlesWithIcon=userArticles[i];
        articlesWithIcon.authorIcon=res.locals.user.avatar_image;
        userArticlesWithImages.push(articlesWithIcon);
    }
    res.locals.articles=userArticlesWithImages;
    res.locals.message=req.query.message;
    res.locals.User=`${res.locals.user.fname} ${res.locals.user.lname}`;
    
    res.render("myHomePage",{
        title:"My home page",
        jsFile:"myHomePage",
        cssFile: "home"
    });
})

/**
 * Render create article page
 */
router.get("/newArticle", verifyAuthenticated, async function(req, res){

    res.locals.thisArticleImage=req.cookies.articleImage;
    
    res.locals.message=req.query.message;
    res.render("newArticle",{
        title: "Create new Article",
        cssFile: "createArticle",
        isArticlePage:true
    });
});
router.post("/newArticle", async function(req,res){
    
    res.redirect(`/myHomePage?message=New Article Posted!`);   

});
/**
 * Create new article
 */
router.post("/app/newArticle", async function(req, res){
    let content=req.body.html;
    let title =req.body.title;
    console.log(content);

    // let index1=content.indexOf("<h1>");
    // let index2 =content.indexOf("</h1>");
    // console.log("index1 is -------------"+index1);
    // console.log("index2 is -------------"+index2);
    // let title =content.substring(index1+4,index2);
    
    console.log("title is ------------"+title);
    console.log(req.cookies.articleImage);


    let article = {
        title:title,
        content: content,
        articleImageUrl:req.cookies.articleImage,
        userID: res.locals.user.id,
        authorName:res.locals.user.username
    };
    try {
        console.log(article);
        createArticle(article);
        res.clearCookie("articleImage");
        res.clearCookie("articleContent");
        res.clearCookie("articleTitle");
        res.redirect(`/myHomePage?message=New Article Posted!`);
    } catch (error) {
        console.log(error.message);
        res.redirect(`/myHomePage?message=Error Cannot create new article, please try again.`);
    }

});
async function createArticle(article){
    await articleDao.createArticle(article);
}

/**
 * Upload image when create article
 */
router.post("/uploadImage", verifyAuthenticated,upload.single("imageFile"), async function(req, res) {
    res.clearCookie("articleImage");
    try {
        const fileInfo = req.file;
        console.log("this is the file.........."+fileInfo);

        // Move the image into the images folder
        const oldFileName = fileInfo.path;
        const newFileName = `./public/images/${fileInfo.originalname}`;

        fs.renameSync(oldFileName, newFileName);

        const image = await jimp.read(newFileName);
        image.scaleToFit(800, 600);
        await image.write(`./public/images/thumbnails/${fileInfo.originalname}`);
        let displayFilePath=`/images/thumbnails/${fileInfo.originalname}`;
        console.log(displayFilePath);
        res.cookie("articleImage",displayFilePath);

        res.redirect("/newArticle?message=upload successful!");
    } catch (error) {
        res.redirect("/newArticle?message=upload fail!");
    }
    

});
/**
 * Render the edit article page
 */
router.get("/edit",verifyAuthenticated,async function(req,res){
    res.locals.message=req.query.message;
    res.locals.userImage=res.locals.user.avatar_image;
    let id =req.query.id;
    res.cookie("articleID",id);
    let article =await articleDao.retrieveArticlesbyId(id);
    console.log("edit page article is "+article);
    console.log(article);
    res.locals.content=article.content;
    res.locals.titleValue=article.title;
    if(article.articleImageUrl!=null&&article.articleImageUrl!=""){
        res.locals.thisArticleImage=article.articleImageUrl;
        res.cookie("articleImage",article.articleImageUrl);
    }
    res.render("editPage", {
        title:"edit Page",
        cssFile: "editArticle",
        isArticlePage:true
    });
});
/**
 * Edit and update the posted article
 */
router.post("/app/edit",verifyAuthenticated,async function(req,res){
    let content=req.body.html;
    console.log(content);
    let articleID=req.body.id||req.cookies.articleID;
    let title =req.body.title;
    console.log("ID is ------------"+articleID);
    console.log("title is ------------"+title);
    let article = {
        title: title,
        id:parseInt(articleID),
        content: content,
        userID: res.locals.user.id,
        authorName:res.locals.user.username,
        articleImageUrl:req.cookies.articleImage,
    };
    try {
        console.log("edit page after post, article is "+article);
        console.log(article);
        await articleDao.editArticle(article);
        res.redirect(`/myHomePage?message=Edit article successfully!`);
    } catch (error) {
        console.log(error.message);
        res.redirect(`/myHomePage?message=Error Cannot edit article, please try again.`);
    };

})
/**
 * Upload image when editing an article
 */
router.post("/uploadImageAgain", verifyAuthenticated,upload.single("imageFile"), async function(req, res) {
    
    try {
        const fileInfo = req.file;
        console.log("this is the file.........."+fileInfo);

        // Move the image into the images folder
        const oldFileName = fileInfo.path;
        const newFileName = `./public/images/${fileInfo.originalname}`;

        fs.renameSync(oldFileName, newFileName);

        const image = await jimp.read(newFileName);
        image.scaleToFit(800, 600);
        await image.write(`./public/images/thumbnails/${fileInfo.originalname}`);
        let displayFilePath=`/images/thumbnails/${fileInfo.originalname}`;
        console.log(displayFilePath);
        res.cookie("articleImage",displayFilePath);
        console.log(req.cookies.articleID);
        let article=await articleDao.retrieveArticlesbyId(req.cookies.articleID);
        article.articleImageUrl=displayFilePath;
        await articleDao.editArticle(article);

        res.redirect(`/edit?id=${parseInt(req.cookies.articleID)}&message=upload successfully!`);
    } catch (error) {
        console.log(error.message);
        res.redirect(`/edit?id=${parseInt(req.cookies.articleID)}&message=upload fail!`);
    }
    

});
/**
 * Delete article
 */
router.get("/delete/article",verifyAuthenticated,async function(req, res){
    let articleID=req.query.articleID;
    console.log(articleID);
    const result=req.query.confirm
    console.log("The result is------"+result);
    if(result=="true"){
        await articleDao.deleteArticle(articleID);
        res.redirect("/myHomePage?message=Delete article successfully!");
    }else{
        res.redirect("/myHomePage");
    };
});


module.exports = router;