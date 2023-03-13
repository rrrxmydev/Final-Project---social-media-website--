let tokenExist = localStorage.getItem("tokenExist")



if(localStorage.getItem("tokenExist") == 1){
 let userInfo = JSON.parse(localStorage.getItem("user"))

 document.getElementsByTagName("nav")[0].innerHTML=`
 <img id="logo" src="rrrxmyy-high-resolution-logo-white-on-transparent-background.png" alt="" width="100px">
 <ul>
  <li><a class="sidebar"href="index.html"> <ion-icon name="home-outline"></ion-icon> Home</a></li> <br>
  <li ><a href="profile.html" class="sidebar"><ion-icon name="person-outline"></ion-icon> Profile</a></li><br>
  <li ><a id="LogOutBtn" onclick="Logout()"> <ion-icon name="log-out-outline"></ion-icon> LogOut</a></li>
 </ul>

 <div id="Profile">
    <img src=${userInfo.profile_image} alt="profile image" width="40px" height="40px" id="imgProfile">
    <span>@${userInfo.username}</span>
 </div>
 `
}



//------------------------------post details --------------------------------------

function showPostDetails(){
 let postId = localStorage.getItem("postId")
 axios.get(`https://tarmeezacademy.com/api/v1/posts/${postId}`)
 .then((response)=>{
  console.log(response)
  document.getElementsByClassName("PostsContainer")[0].innerHTML =`
  <h1 style=" position: relative; top: 2rem; margin-left: 1rem;">${response.data.data.author.username}'s Post</h1>
  <br>
  <div class="Post">
   <span class="PostUser">
    <img src="${response.data.data.author.profile_image}" alt="" width="40px">
    <span> <a href="profile.html">${response.data.data.author.username}</a></span><br> <br>
    <span>${response.data.data.body}</span>
   </span>
   <img class="postImage" src="${response.data.data.image}" alt="PostPhoto" width="50%">
   <span style="position: relative;top: 1rem; left: 1.5rem; color: rgb(78, 78, 78);">${response.data.data.created_at}</span>
   <a href="PostInfo.html" class="comments"><ion-icon name="pencil-outline" style="transform: translateY(2px);"></ion-icon> (${response.data.data.comments_count}) Comment</a>
   <a href=""> <span class="tag">tag1</span></a>
   <a href=""> <span class="tag">tag1</span></a>
   <a href=""> <span class="tag">tag1</span></a>
   <br>
   <hr>
   <div id="CommentsContainer">

   </div>
  </div> <br> <br>

  `
  for(let comment=0 ; comment<response.data.data.comments.length;comment++){
  document.getElementById("CommentsContainer").innerHTML +=
  `
  <img src="${response.data.data.comments[comment].author.profile_image}" alt="" class="commentUserImage">
  <span>${response.data.data.comments[comment].author.username}</span>
  <br>
  <span class="commentText">${response.data.data.comments[comment].body}</span> <br> <br>
  `
 }
 document.getElementById("CommentsContainer").innerHTML +=`
 <input type="text" placeholder="Comment here" class="Commentinput">
 <button class="send-btn" onclick="sendComment()"><ion-icon name="send-outline"></ion-icon> Send</button>
 `
 })
}

showPostDetails()

//--------------------------Commments----------------------------------

function sendComment(){
 let comment = document.getElementsByClassName("Commentinput")[0].value
 let token = localStorage.getItem("token")
 let postId = localStorage.getItem("postId")
 axios.post(`https://tarmeezacademy.com/api/v1/posts/${postId}/comments`,{
  body :comment,
 },{
  headers:{
   "Authorization" :`Bearer ${token}`
  }
 })
 .then((response)=>{
  document.getElementById("message").innerHTML =`
  <ion-icon style="transform: font-size:25px;  " name="checkmark-outline"></ion-icon> the comment has been sent
`
        document.getElementById("errorMessage").style.transform="scale(1)"

     setTimeout(()=>{
        document.getElementById("errorMessage").style.transform="translateY(5rem) scale(0.1)"
     },2000)
     showPostDetails()
 })
 .catch((error)=>{
  let message = error.response.data.message
  document.getElementById("errorMessage").style.backgroundColor ="#e33742"
  document.getElementById("message").innerHTML =`
  <ion-icon style="transform: translateY(0.1rem);" name="warning-outline"></ion-icon>${message}
`
        document.getElementById("errorMessage").style.transform="scale(1)"

     setTimeout(()=>{
        document.getElementById("errorMessage").style.transform="translateY(5rem) scale(0.1)"
     },2000)
 })
}

//---------------------Auth-----------------

function Logout(){

 let token = localStorage.getItem("token")
 let user = localStorage.getItem("user")
  user = JSON.parse(user)
 let username = user.username
 token = "Bearer" +" " +token
 let config = {
   headers: {
     "Authorization":token,
   }
 }
 axios.post("https://tarmeezacademy.com/api/v1/logout",
 {
   username:username
 },config)
 .then((response)=>{
   localStorage.setItem("tokenExist",0)
   document.getElementById("navbar").innerHTML=`
   <img id="logo" src="rrrxmyy-high-resolution-logo-white-on-transparent-background.png" alt="" width="100px">
   <ul>
    <li><a class="sidebar"href="index.html"> <ion-icon name="home-outline"></ion-icon> Home</a></li> <br>
    <li ><a href="profile.html" class="sidebar"><ion-icon name="person-outline"></ion-icon> Profile</a></li><br>
    <li onclick="LoginPopup()"><a id="login"><ion-icon name="log-out-outline"></ion-icon> Login</a></li><br>
    <li onclick="registerPopup()"><a id="login" style="padding: 0.8rem 7.7rem 0.8rem 1rem;"><ion-icon name="log-out-outline"></ion-icon> register</a></li><br>
   </ul>
   `
 })
}


