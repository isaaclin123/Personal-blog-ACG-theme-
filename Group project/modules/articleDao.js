/**
 * Different functions to retrieve article data from database
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

async function createArticle(article){
    let dateTime =getCurrentTime();
    const db = await dbPromise;

    const result = await db.run(SQL`
        insert into Articles (title, content, articleImageUrl, publishTime, userID,authorName) values(
            ${article.title},
            ${article.content},
            ${article.articleImageUrl},
            ${dateTime},
            ${article.userID},
            ${article.authorName})`);

    article.id = result.lastID;
}

async function retrieveAllArticles() {
    const db = await dbPromise;

    const articles = await db.all(SQL`select * from Articles`);

    return articles;
}

async function retrieveArticlesbyId(id) {
    const db = await dbPromise;

    const articles = await db.get(SQL`select * from Articles where id=${id}`);

    return articles;
}

async function retrieveUsernameByUserId(id) {
    const db = await dbPromise;

    const articles = await db.all(SQL`select username from Articles as a, Users as u 
                                    where a.userID=u.id
                                    having a.useID=${id}`);

    return articles;
}


async function retrieveArticlesbyDate(date) {
    const db = await dbPromise;

    const articles = await db.all(SQL`select publishTime from Articles where publishTime=${date}`);

    return articles;
}

async function retrieveArticlesbyUserId(id) {
    const db = await dbPromise;

    const articles = await db.all(SQL`select * from Articles where userID=${id}`);

    return articles;
}


async function editArticle(article) {
    let dateTime =getCurrentTime();
    const db = await dbPromise;

    await db.run(SQL`
        update Articles
        set title=${article.title}, content = ${article.content}, articleImageUrl = ${article.articleImageUrl}, publishTime = ${dateTime},authorName=${article.authorName}
        where id = ${article.id} and userID = ${article.userID}`);
}


async function deleteArticle(id) {
    const db = await dbPromise;

    await db.run(SQL`
        delete from Articles
        where id = ${id}`);
}
async function deleteArticleByUserId(userID) {
    const db = await dbPromise;

    await db.run(SQL`
        delete from Articles
        where userID = ${userID}`);
}


module.exports = {
    createArticle,
    retrieveAllArticles,
    retrieveUsernameByUserId,
    retrieveArticlesbyDate,
    editArticle,
    deleteArticle,
    retrieveArticlesbyId,
    retrieveArticlesbyUserId,
    deleteArticleByUserId
    
};