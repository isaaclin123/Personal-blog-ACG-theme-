
/**
 * A function to sort the article by author,title or publish time with fade in and fade out effect
 */

window.addEventListener("load",function(){
    // localStorage.removeItem("delta");
    // localStorage.removeItem("articleTitle");
    let choice =document.querySelector("#orderby");
    let articleContainer =document.querySelector("#sort-articles");
    let eachArticles =articleContainer.querySelectorAll(".eachArticle");
    let original =articleContainer.innerHTML;
    function sortArticles(parent, child, key){
        let items=Array.prototype.slice.call(document.querySelectorAll(parent+" "+child)).sort(function(a,b){
            let compareA =a.querySelector(key).innerHTML;
            let compareB =b.querySelector(key).innerHTML;
            return (compareA<compareB)?-1:(compareA>compareB)?1:0;
        });
        for(let i=0;i<eachArticles.length;i++){
            articleContainer.appendChild(items[i]);
        }
    };
    let key;
    choice.onchange = function(){ 
    let fader = window.setTimeout(fadeOut,0)
    let waitForFade = window.setTimeout(replace,1000);
    let waitForReplace = window.setTimeout(fadeIn,1600);
    }
    function fadeIn(){
        let i = 1;
        Array.prototype.forEach.call(eachArticles, function(article) {
        setTimeout(function(){ article.classList.add("visible") }, 400*i)
        i++;
        })
    }
    function replace(){
            if(choice.value=="time"){
                // articleContainer.innerHTML=original;
                key="span[itemprop=publishTime]";
            }else{
                if(choice.value=="Author"){
                    key="span[itemprop=author]";
                }
                if(choice.value=="title"){
                    key="h1[itemprop=title]";
                }
                
            }
            sortArticles("#sort-articles",".eachArticle",key);
        };

    function fadeOut(){      
        let i = 1;
        Array.prototype.forEach.call(eachArticles, function(article) {
            setTimeout(function(){ article.classList.remove("visible"); }, 300*i)
        i++;
        });
    }

    fadeIn();

});


