const express = require("express");
const router = express.Router();
const commentDao = require("../modules/commentDao.js");
const articleDao = require("../modules/articleDao.js");
const { verifyAuthenticated } = require("../middleware/middleware.js");

/**
 * Render the full article page
 */
router.get("/fullArticleAndComment",verifyAuthenticated,async function(req, res){
    
    res.cookie("userID",res.locals.user.id);
    let articleID =req.query.id||req.cookies.articleID;
    res.cookie("articleID",articleID);
    console.log(articleID);
    let authorID =req.query.authorID||req.cookies.authorID;
    res.cookie("authorID",authorID);
    console.log("----------------------------");
    console.log(authorID);
    console.log(res.locals.user.id);
    console.log("----------------------------");
    if(authorID==res.locals.user.id){
        console.log(authorID==res.locals.user.id);
        res.locals.isAuthor=true
    }else{
        res.locals.isAuthor=false;
    }
    let article = await articleDao.retrieveArticlesbyId(articleID);
    res.locals.article=article;
    // console.log(res.locals.user);
    res.locals.userImage=res.locals.user.avatar_image;
    // console.log(article);
    let comments= await commentDao.getCommentsByArticleID(articleID);
    let nestedComments= await commentDao.getComments(articleID, 0, res.locals.user.id, 0);
    // console.log(JSON.stringify(nestedComments));
    res.locals.comments=comments;
    res.locals.nestedComments=nestedComments;
    // console.log(comments)
    res.locals.message=req.query.message;

    res.render("fullArticleAndComment",{
        title:"Full article",
        jsFile:"fullArticlePage",
        cssFile:"fullArticlePage"
    })
})


/**
 * Receive comment data and create comment
 */
router.get("/app/comment",verifyAuthenticated,async function(req,res){
    let comment={
        texts:req.query.comment,
        articleID:req.query.articleID,
        commentPosterID:req.query.commentPosterID,
        commenterName:req.query.commenterName,
        parentCommentID:req.query.parentCommentID
    };
    await commentDao.createComment(comment);
    res.redirect("/fullArticleAndComment?message=Post comment successfully");
})

/**
 * Delete comment
 */
router.get("/delete/comment",verifyAuthenticated, async function(req, res){
    console.log(`the comment id will be deleted is ${req.query.commentID}`);
    console.log("-----delete route-----");
    if(req.query.commentID){ 
       let id=req.query.commentID;
       console.log("-----in here-------"+id);
      
       await commentDao.deleteCommentByID(id);
        console.log("id here is -----"+id)
        res.redirect("/fullArticleAndComment?message=Comment deleted successfully")
    }else{
        if(req.query.articleID){
            let id=req.query.articleID;
            console.log("articleID is ---------"+id);
            await commentDao.deleteCommentsByArticleID(id);
            res.redirect("/fullArticleAndComment?message=Comments deleted successfully");
        }
     
        
    }   
})
/**
 * Get upvote 
 */
router.get('/upvote/comment/:id', verifyAuthenticated, async function(req, res) {
    await commentDao.upvoteComment(req.params.id, res.locals.user.id).then(function (id) {
        res.redirect(`/fullArticleAndComment?id=${id}`);
    });
})
/**
 * Get downvote
 */
router.get('/downvote/comment/:id', verifyAuthenticated, async function(req, res) {
    await commentDao.downvoteComment(req.params.id, res.locals.user.id).then(function (id) {
        res.redirect(`/fullArticleAndComment?id=${id}`);
    });
})

module.exports = router;
