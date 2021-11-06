import {checkUsernameAndPassword} from "./newAccountPage.js";
checkUsernameAndPassword("/app/user");
window.addEventListener('load', function(){
    /**
     * Ask user's confirmation when user attempt to delete the account and send ajax request to server side depend on user's choice
     */
    let deleteButton=document.querySelector("#deleteButton");
    deleteButton.addEventListener("click",promptForConformation);
    function promptForConformation(){
        if(window.confirm("Are you sure you want to delete this account?")){
            let request =new XMLHttpRequest();
            request.open("GET","/user/delete?confirm=true",true);
            request.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
            request.send();
        }else{
            let request =new XMLHttpRequest();
            request.open("GET","/user/delete?confirm=false",true);
            request.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
            request.send();
            
        }
    
    }
})
