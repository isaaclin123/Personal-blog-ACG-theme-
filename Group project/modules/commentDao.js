/**
 * Different functions to retrieve comment data from database
 */
const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

function getCurrentTime(){
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;
    return dateTime;
};

// Add new comment into database
async function createComment(comment) {
    let commentTime =getCurrentTime();
    const db = await dbPromise;

    const result = await db.run(SQL`insert into Comments 
        (texts,likes,dislikes,commentTime,articleID,commentPosterID,commenterName,parentCommentID) 
        values(${comment.texts},0,0,
                ${commentTime},${comment.articleID},${comment.commentPosterID},${comment.commenterName},${comment.parentCommentID})`);

    comment.id = result.lastID;
}

// Get comment with the allocated id from database
async function retrieveCommentByID(id) {
    const db = await dbPromise;

    const comment = await db.get(SQL`select * from Comments
        where id = ${id}`);

    return comment;
}

// Get comment with the allocated username from database
async function retrieveCommentByUserID(userID){
    const db = await dbPromise;

    const comment = await db.get(SQL`select * from Comments
        where userID = ${userID}`);
    
    return comment;
}

// Get comment with the allocated time from database
async function retrieveCommentByTime(commentTime){
    const db = await dbPromise;

    const comment = await db.get(SQL`select * from Comments
        where commentTime = ${commentTime}`);
    
    return comment;
}

// Gets an array of all comments from database
async function retrieveAllComments() {
    const db = await dbPromise;

    const comments = await db.all(SQL`select * from Comments`);

    return comments;
}

// Updates comment in database
async function updateCommentByID(id,comment) {
    const db = await dbPromise;

    await db.run(SQL`
        update Comments
        set texts = ${comment.texts}, likes = ${comment.likes}, dislikes = ${dislikes}, commentTime = ${comment.commentTime},articleID = ${comment.articleID}, commentPosterID = ${comment.commentPosterID}
        where id = ${comment.id}`);

}

// Delete comment with the allocated id from database
async function deleteCommentByID(id) {
    const db = await dbPromise;

    await db.run(SQL`
        delete  from Comments 
        where id = ${id}`);
}
async function deleteCommentsByArticleID(articleID){
    const db = await dbPromise;
    await db.run(SQL`delete from Comments where articleID=${articleID}`);
}
async function deleteCommentByUserID(userID){
    const db = await dbPromise;
    await db.run(SQL`delete from Comments where commentPosterID=${userID}`)
}

// Upvote the comment
async function upvoteComment(id, userId) {
    const db = await dbPromise;
    if(userId) {
        let votes = await db.get(SQL`SELECT * FROM comment_votes WHERE comment_id=${id} AND user_id=${userId}`);
        if(!votes) {
            await db.run(SQL`INSERT INTO comment_votes (comment_id, user_id, is_up) VALUES (${id}, ${userId}, 1)`);
            await db.run(SQL`UPDATE Comments SET likes=likes+1 WHERE id=${id}`);
        } else if(votes.is_up != 1){
            await db.run(SQL`UPDATE comment_votes SET is_up='1' WHERE comment_id=${id} AND user_id=${userId}`);
            await db.run(SQL`UPDATE Comments SET likes=likes+1, dislikes=dislikes-1 WHERE id=${id}`);
        }
    }
    let comment = await db.get(SQL`SELECT * FROM Comments WHERE id=${id}`);
    return comment.articleID;
}

// Downvote the comment
async function downvoteComment(id, userId) {
    const db = await dbPromise;
    if(userId) {
        let votes = await db.get(SQL`SELECT * FROM comment_votes WHERE comment_id=${id} AND user_id=${userId}`);
        if(!votes) {
            await db.run(SQL`INSERT INTO comment_votes (comment_id, user_id, is_up) VALUES (${id}, ${userId}, 0)`);
            await db.run(SQL`UPDATE Comments SET dislikes=dislikes+1 WHERE id=${id}`);
        } else if(votes.is_up != 0){
            await db.run(SQL`UPDATE comment_votes SET is_up='0' WHERE comment_id=${id} AND user_id=${userId}`);
            await db.run(SQL`UPDATE Comments SET likes=likes-1, dislikes=dislikes+1 WHERE id=${id}`);
        }
    }
    let comment = await db.get(SQL`SELECT * FROM Comments WHERE id=${id}`);
    return comment.articleID;
}


async function getCommentsByArticleID(articleID){
    const db = await dbPromise;
    let articles=await db.all(SQL`select * from Comments where articleID=${articleID}`);

    return articles;
};

async function getComments(articleID, commentID, userId, lvl) {
    const db = await dbPromise;
    let result = [];
    let comments = await db.all(SQL`SELECT * FROM Comments WHERE articleID=${articleID} AND parentCommentID=${commentID}`) 
    result = await Promise.all(comments.map(async function (e) {
        let data = e;
        let users = await db.all(SQL`SELECT * FROM Users WHERE id=${e.commentPosterID}`);
        data.level=lvl;
        data.user = users[0];
        data.owner = data.commentPosterID == userId;
        let childs = await getComments(articleID, data.id, userId, lvl+1);
        return [data, ...childs];
    }))
    let fresult = [];
    result.forEach(function (e) {
        fresult = [...fresult, ...e];
    });
    return fresult;
}

// Export functions.
module.exports = {
    createComment,
    retrieveCommentByID,
    retrieveAllComments,
    updateCommentByID,
    retrieveCommentByUserID,
    retrieveCommentByTime,
    deleteCommentByID,
    getCommentsByArticleID,
    getComments,
    deleteCommentsByArticleID,
    deleteCommentByUserID,
    downvoteComment,
    upvoteComment
};