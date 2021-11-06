window.addEventListener('load', function(){
localStorage.removeItem("delta");
localStorage.removeItem("articleTitle");
/**
 * When user click the delete link, ask user's confirmation about whether to delete the article
 */
let deleteLinks = document.querySelectorAll('.delete');
for(let i=0;i<deleteLinks.length;i++){
    deleteLinks[i].addEventListener('click', promptForConformation);
}

function promptForConformation(event){
    let articleIds=document.querySelectorAll(".idSpan");
    let articleID=event.target.getAttribute("data-articleID")
    if(window.confirm("Are you sure you want to delete this article?")){
        let request =new XMLHttpRequest();
        request.open("GET",`/delete/article?confirm=true&articleID=${articleID}`,true);
        request.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
        request.send();
    }else{
        let request =new XMLHttpRequest();
        request.open("GET",`/delete/article?confirm=false&articleID=${articleID}`,true);
        request.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
        request.send();
        
    }
};

});
