/**
 * This file is share between create article page and edit article page
 */
window.addEventListener("load", function () {
/**
 * Set up the editor
 */
  var quill = new Quill('#editor-container', {
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6,  false] }],
        ['bold', 'italic', 'underline','strike'],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['clean']
      ]
    },
    placeholder: 'Compose an epic...',
    theme: 'snow'  // or 'bubble'
  });
  
  //Get article id form the URL
  let articleID;
  let path= this.window.location.href;
  let firstIndex =path.lastIndexOf("id=");
  let lastIndex =path.indexOf("&");
  if (lastIndex>-1){
    articleID=path.substring(firstIndex+3,lastIndex);
  }else{
    articleID=path.substring(firstIndex+3);
  }

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
        
  
  quill.on('text-change', function(delta, source) {
    updateHtmlOutput();
  });
  /**
   * Set and get local storage of the article content and title, so that  when user refresh the page without post or upload the image after writing the article, the user won't lose the content 
   */
  let titleInput=(document.querySelector("#title"));
  if(localStorage.getItem("delta")!=null){
    quill.setContents(JSON.parse(localStorage.getItem("delta")));
    
    
  }
  /**
   * Disable or enable the post button depend on whether the title is empty
   */
  let submitButton=document.querySelector("#submitButton");
  let tipForTitle=document.querySelector("#tipForTitle");
  if(titleInput.value==""||titleInput.value==null){
      submitButton.disabled=true;
      tipForTitle.innerHTML=`<b>Title can not be empty</b>`;
    if(localStorage.getItem("articleTitle")!=''&&localStorage.getItem("articleTitle")!=null&&localStorage.getItem("articleTitle")!=undefined){
      submitButton.disabled=false;
      tipForTitle.innerHTML=``;
    }else{
      submitButton.disabled=true;
      tipForTitle.innerHTML=`<b>Title can not be empty</b>`;
    }
  }else{
    submitButton.disabled=false;
    tipForTitle.innerHTML=``;
  }
  titleInput.addEventListener("keyup",function(){
    localStorage.setItem("articleTitle",titleInput.value);
    console.log(titleInput.value);
    if(titleInput.value==""||titleInput.value==null){
      submitButton.disabled=true;
      tipForTitle.innerHTML=`<b>Title can not be empty</b>`
    }else{
      submitButton.disabled=false;
      tipForTitle.innerHTML=``;
    }
  })
  
  if(localStorage.getItem("articleTitle")!=null){
    titleInput.value=this.localStorage.getItem("articleTitle");
  }
  
  // Return the HTML content of the editor
  function getQuillHtml() { return quill.root.innerHTML; }

  /**
   * Send data to the server side's different route handlers by the window's url when the post button is click 
   */
  
  
  submitButton.addEventListener("click",function(){
  let title =titleInput.value;
    let html =getQuillHtml();
    let delta =JSON.stringify(quill.getContents());

  
    if(path.includes("http://localhost:3000/newArticle")){
      let request;
      request =new XMLHttpRequest();
      // request.open("GET",`/newArticle?html=`+html,true);
      request.open("POST",`/app/newArticle`);
      request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
      request.send(`html=${html}&title=${title}`);
    }else{
      let request;
      request =new XMLHttpRequest();
      // request.open("GET",`/newArticle?html=`+html,true);
      request.open("POST",`/app/edit`);
      request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
      request.send(`html=${html}&title=${title}&id=${articleID}`);
    }

    localStorage.removeItem("delta");
    localStorage.removeItem("articleTitle");
});
/**
 * When the text change, set local storage for article content
 */
  function updateHtmlOutput()
  {
      let  html = getQuillHtml();
      let text =quill.getText();
      console.log ( html );
      let delta =quill.getContents();
      console.log(delta);
      document.getElementById('output-html').innerText = html;
      // localStorage.setItem("articleContent",text);
      localStorage.setItem("delta",JSON.stringify(delta));
      
      
      
  }
  updateHtmlOutput();

  /**
   * Remove image and restore image when user are editing the article
   */
  let imgURL=getCookie("articleImage");
  let imageRestoreButton=document.querySelector("#restoreImage");
  if(imageRestoreButton){
    imageRestoreButton.style.display="none";
  }
  let removeImageButton =document.querySelector("#removeImage");
  let imageDisplayDiv =document.querySelector("#imageDisplayDiv");
  let currentImage=document.querySelector("#currentImage");
  let imageEditTool=document.querySelector("#imageEditTool");
  if(removeImageButton){
    removeImageButton.addEventListener("click",removeImage);
    if(getCookie("articleImage")==``||getCookie("articleImage")=='null'){
      removeImageButton.style.display="none";
    };
    
    
  };
  function removeImage(){
    imageEditTool.style.display="none";
    setCookie("articleImage",'');
    currentImage.setAttribute("src","");
    removeImageButton.style.display="none";
    imageRestoreButton.style.display="inline";
  
  };
  if(imageRestoreButton){
    imageRestoreButton.addEventListener("click",restoreImage);
  }
  
  function restoreImage(){
    setCookie("articleImage",imgURL);
    currentImage.setAttribute("src",imgURL);
    imageEditTool.style.display="inline";
    removeImageButton.style.display="inline";
    imageRestoreButton.style.display="none";
  }




})