window.addEventListener("load",function(){
/**
 * Create cookies for the user's input
 */
  function setCookie(cname, cvalue, expiryInDays) {
    const d = new Date();
    d.setTime(d.getTime() + (expiryInDays* 24*60*60*1000));
    document.cookie = `${cname}=${cvalue}; expires=${d.toUTCString ()}; path=/`;
    };
  
  /**
   * Get the cookies by the cookies'names
   */
  function getCookie(cname) {
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");
    for(let i = 0; i <cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length);
        }
    }
    return undefined;
    }
    let showCommentButton=document.querySelector("#showComment");
    let hideCommentButton=document.querySelector("#hideComment");
    let commentDiv =document.querySelector("#commentDiv");
    let authorID =document.querySelector("#authorID").innerText;
    showCommentButton.addEventListener("click",showComments);
    hideCommentButton.addEventListener("click",hideComments,);

    /**
     * Show or hide comments
     */
    function showComments(){
        commentDiv.style.height="auto";
        commentDiv.style.opacity=1;
        showCommentButton.style.display="none";
        hideCommentButton.style.display="unset";
    };
    function hideComments(){
        commentDiv.style.height=0;
        commentDiv.style.opacity=0;
        showCommentButton.style.display="unset";
        hideCommentButton.style.display="none";
    };
   
    /**
     * When hove to the comment div,show delete link if the userID matches that comment's commentPosterID
     */
    let deleteLinks=document.querySelectorAll(".deleteLinks");
    for(let i=0;i<deleteLinks.length;i++){
        deleteLinks[i].style.display="none";
    }
    let deleteArticleCommentsLink =document.querySelector("#deleteArticleComments");
    deleteArticleCommentsLink.style.display="none";
    if (getCookie("authorID")==getCookie("userID")){
        deleteArticleCommentsLink.style.display="inline";
    }
   
    let commentPosterIDSpans=document.querySelectorAll(".commentPosterIDs");
    let allComments=document.querySelectorAll(".eachComment");
    console.log(allComments);
    for(let i=0;i<allComments.length;i++){
        allComments[i].addEventListener("mouseover",function(event){
        let commentPosterID = event.target.getAttribute("PosterID");
        if((getCookie("userID")==commentPosterID||null)||(getCookie("authorID")==getCookie("userID"))){
            // event.target.lastElementChild.style.transition="1s";
            event.target.lastElementChild.style.display="inline";
        }

        });
    }
})