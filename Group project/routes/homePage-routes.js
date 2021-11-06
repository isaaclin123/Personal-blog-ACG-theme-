const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/middleware.js");
const userDao = require("../modules/userDao.js");
const articleDao = require("../modules/articleDao.js");

/**
 * Render the home page 
 */
router.get("/", async function(req, res) {
    let allArticles=await articleDao.retrieveAllArticles();
    console.log(allArticles);
    res.locals.articles=allArticles;
    let userIDs =[];
    for(let i=0;i<allArticles.length;i++){
        userIDs.push(allArticles[i].userID);
    }
    function distinct(userIDs) {
        return Array.from(new Set(userIDs))
    }
    userIDs=distinct(userIDs);
    console.log(userIDs);
    let userArticles=[];
    for(let i=0;i<userIDs.length;i++){
        let user=await userDao.retrieveUserById(userIDs[i]);
        // console.log(user);
        let articles= await articleDao.retrieveArticlesbyUserId(user.id);
        console.log(articles);
        for(let j=0;j<articles.length;j++){
            articles[j].authorName=user.username;
            let newArticle=articles[j];
            // console.log(newArticle);
            newArticle.authorIcon=user.avatar_image;
            userArticles.push(newArticle);
        }   
    }
    // console.log(userArticles);
    // console.log(userArticles.length);
    res.locals.articles=userArticles;
    // res.locals.defaultArticles=createDefaultArticle();
    if(res.locals.user){
        res.locals.userImage=res.locals.user.avatar_image;
    }
    res.locals.message=req.query.message;
    res.render("home",{
        title:"Home Page",
        jsFile:"homePage",
        cssFile: "home"
    });
});


function createDefaultArticle(){
    let defaultArticles=[
        {
            title:"Fate/Grand Order",
            articleImageUrl:"/images/default_article2.jpg",
            authorIcon:"/images/avatar_kyouka.png",
            authorName:"Kyouka",
            publishTime:"2021-10-15 16:05:33",
            content:"<h1>HOW THE GAME IS SO CRUEL</h1><p>Players don’t need to recruit the rarest characters to progress in Fate/Grand Order. But that’s hardly the point. Fans want to fight alongside and flirt with the important characters from the beloved Fate series, not the perfectly capable benchwarmers that the game gives out for free.</p><p>            </p><p>The game knows that a certain very profitable subset of users will spin that gacha hundreds of times — at about $20 for bundles of 10 spins — until they hit the jackpot, and the lady King Artoria appears before them. There is, of course, a very low chance of winning the best characters. But the most dedicated players don’t care, or they see the game as being worth the investment. Such is their love.</p>"
    },
    {
            title:"Princess connect re-dive",
            articleImageUrl:"/images/default_pcr.jpg",
            authorIcon:"/images/avatar_vasili.png",
            authorName:"Vasili",
            publishTime:"2021-10-14 16:05:33",
            content:"<h4>Our Princess Connect Re: Dive tier list will help take the guesswork out of your time with this brand new gacha RPG, which might just be one of the best looking examples of the genre we’ve seen on mobile just yet. That’s thanks to a collaboration between Cygames and Crunchyroll Games, the latter of which, suffice to say, knows its anime.</h4><p><br></p><p>Much like the best gacha games, Princess Connect Re: Dive features a bunch of characters to collect, which you can then add to your battle party. If you’ve seen the anime, you may recognise much of the cast, who return with full voice acting in this mobile spin-off.</p><p><br></p><p>When starting a new gacha RPG, your first port of call is to learn which characters are worth your time. That’s why we’ve created this Princess Connect Re: Dive tier list, to help you. We’ll also include full details on how to reroll, so you can start over if you don’t get the character you wanted. We’ve been there, don’t worry!</p>"
    },
    {
            title:"Pretty Derby",
            articleImageUrl:"/images/default_article3.jpg",
            authorIcon:"/images/avatar_ocata.png",
            authorName:"Ocata",
            publishTime:"2021-9-15 16:05:33",
            content:"<h3>Game overview</h3><p>The bulk of the game consists of training your “horse” (or rather, animated avatar girl with equine-ears and tail) to win races. Training sessions distinguish Uma Musume from other gacha games. If you’ve ever played a sim-raising game, you’ll be in familiar territory.</p><p><br></p><p>There are over 70 unique Uma Musume characters. Each of them has different characteristics, such as “ease of training” and “suitable distance.” The key to winning races is to train each of the avatars with these characteristics in mind. Training mode is the heart of gameplay. However, raising a bunch of characters with no other possibilities would almost certainly feel a little empty. That is why there are a few other modes where you can show off your characters.</p><p><br></p><p>The racing portion is where you can enjoy the powerful races of the avatars you have trained. Race results are decided by AI, so once the race starts, you have no choice but to trust the character you have trained. Sometimes, the results comes down to luck. After each race, a “Winning Live” is held where the winners perform a dance.</p><p><br></p><h4>The more races you win, the more songs you can watch, and once a song is performed, you can watch it as many times as you like. The main content of the game spans training, racing, and watching live performances, but you can also use the “support card” system to enhance your horse girl’s abilities, or the friendship training system to interact with other horse girls and go out with them. Utilizing this kind of content will not only strengthen the character, but will also make the game more enjoyable for users.</h4>"
    },
    {
        title:"Final Fantasy VII Remake",
        articleImageUrl:"/images/default_final_fantasy.jpg",
        authorIcon:"/images/avatar_silver.png",
        authorName:"silver",
        publishTime:"2021-9-19 16:05:33",
        content:"<h3>FINAL FANTASY VII REMAKE was one of 2020’s best games, but the ongoing remake series of Square Enix’s seminal 1997 classic is just getting started. The first entry is set in the smoggy metropolis of Midgar where it stinks of Mako, expanding the first several hours of the original game into an epic 40-hour adventure. What’s next for this budding sub-franchise? When will the next entry be released? How might the epic tale evolve in its next-gen reiteration? And how did FF7 Remake: Intergrade and Yuffie’s new story change things? Here are answers to all that and more.</h3><p>FF7 Remake Part 2 won’t be released until 2022 or later, but Square Enix has yet to offer any official updates on the matter beyond vague promises that development is proceeding smoothly.</p><p><br></p><p>The first game’s director Tetsuya Nomura confirmed via a blog post that development was in full swing by November 2019. Square Enix President Yosuke Matsuda confirmed in February 2020 the slight delay of the release of FF7 Remake would not impact the timeline for the next installment. The team confirmed development was ongoing again in July 2020.</p><p>Producer Yoshinori Kitase Kitase told Famitsu (via Comicbook.com) in December 2020 that 'development for [FF7 Remake Part 2] is progressing smoothly” but asked that fans “please wait a bit longer for more details.' Given the unprecedented scope of the project, it's hard to make predictions ... especially when many of Square Enix’s biggest projects take years to develop. Both Final Fantasy XV and Kingdom Hearts III were in development for about a decade.</p>"
    }
];
    return defaultArticles;
}

module.exports = router;