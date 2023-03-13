let currentPage = 1
let lastPage = 1

console.log("hello console")

//-----------------------Pagination-----------------------------------------
window.addEventListener("scroll",()=>{

  const {
    scrollTop,
    scrollHeight,
    clientHeight
  } = document.documentElement

  if((clientHeight + scrollTop >=scrollHeight-5) && currentPage < lastPage){
    currentPage++
    document.getElementById("loading").style.opacity = 1
    showPosts(currentPage)

  }
})
//-------------------------------------------------------------------

let loggedIn = localStorage.getItem("tokenExist")

if(loggedIn == 1){
  showPosts()
  let userInfo = JSON.parse(localStorage.getItem("user"))
  document.getElementById("addPost").style.visibility ="visible"
  document.getElementsByTagName("nav")[0].innerHTML=`
  <img id="logo" src="rrrxmyy-high-resolution-logo-white-on-transparent-background.png" alt="" width="100px">
  <ul>
   <li><a class="sidebar" href="index.html"> <ion-icon name="home-outline"></ion-icon> Home</a></li> <br>
   <li ><a href="profile.html" onclick="fromwhere(0)" class="sidebar"><ion-icon name="person-outline"></ion-icon> Profile</a></li><br>
   <li ><a id="LogOutBtn" onclick="Logout()"> <ion-icon name="log-out-outline"></ion-icon> LogOut</a></li>
  </ul>
 
  <a href="profile.html"> 
    <div id="Profile" onclick="fromwhere(0)">
      <img src=${userInfo.profile_image} alt="profile image" width="40px" height="40px" id="imgProfile">
      <span>@${userInfo.username}</span>
    </div>
  </a>
  `
}

showPosts()



//------------Functions---------------------------------------------
function showPosts(currentPage = 1){

  axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=5&page=${currentPage}`)
  .then((response)=>{
    localStorage.setItem("current_page",currentPage)
    document.getElementById("loading").style.opacity = 0

    lastPage = response.data.meta.last_page
    let posts = response.data.data
    let visibility = 'hidden'
    for( index of posts ){
      
      author = index.author
    if(localStorage.getItem("tokenExist")==1){
      if(author.id ==JSON.parse(localStorage.getItem("user")).id){
          visibility = 'visible'
      }
    }
      document.getElementsByTagName("section")[0].innerHTML +=`
      
      <div class="Post">
         <span class="PostUser">
           <a href="profile.html">  <img src="${author.profile_image}" onclick="showProfileInfo(${author.id}),fromwhere(1)"alt=""> </a>
           <a href="profile.html"> <span onclick="showProfileInfo(${author.id}),fromwhere(1)"> ${author.username}</span> </a> <br> <br>
           <span>${index.body}</span><br>
           <button class="edit-btn"   style="transform:translateX(5rem); visibility:${visibility} " onclick="deletePost(${index.id},'${encodeURIComponent(JSON.stringify(index))}')"><ion-icon name="trash"></ion-icon></button>
           <button class="edit-btn"  style="visibility:${visibility};transform:translateX(3rem); " onclick="editPost(${index.id},'${encodeURIComponent(JSON.stringify(index))}')" ><ion-icon name="ellipsis-vertical" ></ion-icon></button>
           </span>
         <a href="PostInfo.html" onclick="GetPostId(${index.id})">
         <div style="height: 600px; overflow: hidden;">
           <img class="postImage" src="${index.image}" alt="PostPhoto" width="50%">
         </div>
         <span style="position: relative;top: 1rem; left: 1.5rem; color: rgb(78, 78, 78);">${index.created_at}</span>
         <a href="PostInfo.html" class="comments"><ion-icon name="pencil-outline" style="transform: translateY(2px);"></ion-icon> (${index.comments_count}) Comments</a>
         
         </div>
         </a> <br><br><br> <br>
         `

    }
  })
}


//-----------------------Edit----------------------------------------

function editPost(postEditId,postOBj){

  let postObj = JSON.parse(decodeURIComponent(postOBj))
  document.getElementById("titleEP").value = String(postObj.title)
  document.getElementById("descriptionE").value = String(postObj.body)

  document.getElementsByClassName("overlay")[0].style.visibility = "visible"
  document.getElementById("editPostPopUp").style.transform= "scale(1)"
  localStorage.setItem("postEditId",postEditId)

}

function edit(){
  let postId = localStorage.getItem("postEditId")
  let token = localStorage.getItem("token")
  let body = document.getElementById("descriptionE").value
  let title = document.getElementById("titleEP").value
  let image = document.getElementById("imageE").files[0]

  let formData = new FormData()
  formData.append("_method","put")
  formData.append("body",body)
  formData.append("title",title)
  formData.append("image",image)

  axios.post(`https://tarmeezacademy.com/api/v1/posts/${postId}`,formData,{
    headers:{
      "Content-Type":"multipart/form-data",
      "Authorization":`Bearer ${token}`
    }
  })
  .then((response)=>{
    document.getElementById("message").innerHTML =`
    <ion-icon style="transform: translateY(0.5rem);" name="checkmark-outline"></ion-icon> The Post has been updated
  `
    exit()
    document.getElementById("errorMessage").style.background="#2ad254"
    document.getElementById("errorMessage").style.transform="scale(1)"
    setTimeout(()=>{
      document.getElementById("errorMessage").style.transform="translateY(5rem) scale(0.1)"
    },3000)
    document.getElementById("registerPopUp").style.transform ="translateY(-80%) scale(0.1)"
    document.getElementsByTagName("section")[0].innerHTML =""
    showPosts()
  })
  .catch((error)=>{
    let message = error.response.data.message

    document.getElementById("message").innerHTML =`
      <ion-icon style="transform: translateY(0.2rem);" name="warning-outline"></ion-icon>${message}
    `
    document.getElementById("errorMessage").style.transform="scale(1)"

    setTimeout(()=>{
      document.getElementById("errorMessage").style.transform="translateY(5rem) scale(0.1)"
    },2000)
  })
}

//-----------------------------------------------------------------------



function showProfileInfo(userId){
    localStorage.setItem("user-id-Info",userId)
}

function fromwhere(fw){
  console.log(fw)
  localStorage.setItem("fromwhere",fw)
}

//---------------------------------Auth-----------------------------------------

function LoginPopup(){
  document.getElementsByClassName("overlay")[0].style.visibility = "visible"
 document.getElementsByClassName("loginPopUp")[0].style.transform ="scale(1)"
}

function registerPopup(){
 document.getElementsByClassName("overlay")[0].style.visibility = "visible"
 document.getElementById("registerPopUp").style.transform ="scale(1)"
}


function exitFromLogin(){
  document.getElementsByClassName("loginPopUp")[0].style.transform ="translateY(-80%) scale(0.1)"
   registerPopup()
}



function register(){
  let username = document.getElementById("usernameVlaue").value
  let firstname = document.getElementById("firstNameValue").value
  let password = document.getElementById("passwordValue").value
  let profilePic = document.getElementById("fileInput").files[0]

  let formData = new FormData()
  formData.append("username",username)
  formData.append("name",firstname)
  formData.append("image",profilePic)
  formData.append("password",password)
    axios.post("https://tarmeezacademy.com/api/v1/register",formData,{
      headers:{
        "Content-Type":"multipart/form-data"
      }
      })
  .then((response)=>{
      console.log(response)

      document.getElementById("message").innerHTML =`
      <ion-icon style="transform: translateY(0.5rem);" name="checkmark-outline"></ion-icon> the account has been created succefuly
    `

    document.getElementById("errorMessage").style.background="#2ad254"
    document.getElementById("errorMessage").style.transform="scale(1)"
    setTimeout(()=>{
      document.getElementById("errorMessage").style.transform="translateY(5rem) scale(0.1)"
    },2000)
    document.getElementById("registerPopUp").style.transform ="translateY(-80%) scale(0.1)"
    document.getElementById("addPost").style.visibility ="visible"
    document.getElementsByTagName("nav")[0].innerHTML=`
    <img id="logo" src="rrrxmyy-high-resolution-logo-white-on-transparent-background.png" alt="" width="100px">
    <ul>
     <li><a class="sidebar"href="index.html"> <ion-icon name="home-outline"></ion-icon> Home</a></li> <br>
     <li ><a href="profile.html" class="sidebar"><ion-icon name="person-outline"></ion-icon> Profile</a></li><br>
     <li ><a id="LogOutBtn"> <ion-icon name="log-out-outline"></ion-icon> LogOut</a></li>
    </ul>
  
    <div id="Profile">
       <img src=${response.data.user.profile_image} alt="profile image" width="40px" height="40px" id="imgProfile">
       <span>@${response.data.user.username}</span>
    </div>
    `
      document.getElementsByClassName("overlay")[0].style.visibility = "hidden"
  })
  .catch((error)=>{
    console.log("error")
    let message = error.response.data.message

    document.getElementById("message").innerHTML =`
      <ion-icon style="transform: translateY(0.2rem);" name="warning-outline"></ion-icon>${message}
    `
    document.getElementById("errorMessage").style.transform="scale(1)"

    setTimeout(()=>{
      document.getElementById("errorMessage").style.transform="translateY(5rem) scale(0.1)"
    },2000)

  })
}



function Login(){
  let token = ""
  let username = document.getElementById("username").value
  let password = document.getElementById("password").value

  axios.post("https://tarmeezacademy.com/api/v1/login",{
    username:username,
    password:password
  })
  .then((response)=>{
    token = response.data.token
    localStorage.setItem("token",token)
    localStorage.setItem("tokenExist",1)
    localStorage.setItem("user",JSON.stringify(response.data.user))
    exit()

    document.getElementById("message").innerHTML =`
    <ion-icon style="transform: translateY(0.5rem);" name="checkmark-outline"></ion-icon> Wlcome
  `

  document.getElementById("errorMessage").style.background="#2ad254"
  document.getElementById("errorMessage").style.transform="scale(1)"
  setTimeout(()=>{
    document.getElementById("errorMessage").style.transform="translateY(5rem) scale(0.1)"
  },3000)
  document.getElementById("registerPopUp").style.transform ="translateY(-80%) scale(0.1)"
  document.getElementById("addPost").style.visibility ="visible"
  document.getElementsByTagName("nav")[0].innerHTML=`
  <img id="logo" src="rrrxmyy-high-resolution-logo-white-on-transparent-background.png" alt="" width="100px">
  <ul>
   <li><a class="sidebar"href="index.html"> <ion-icon name="home-outline"></ion-icon> Home</a></li> <br>
   <li ><a href="profile.html" class="sidebar"><ion-icon name="person-outline"></ion-icon> Profile</a></li><br>
   <li ><a id="LogOutBtn" onclick="Logout()"> <ion-icon name="log-out-outline"></ion-icon> LogOut</a></li>
  </ul>

  <a href="profile.html"> 
    <div id="Profile" onclick="fromwhere(0)">
      <img src=${response.data.user.profile_image} alt="profile image" width="40px" height="40px" id="imgProfile">
      <span>@${response.data.user.username}</span>
    </div>
  </a>
  `
   
  })
  .catch((error)=>{
    console.log("error")
    let message = error.response.data.message
    document.getElementById("message").innerHTML =`
      <ion-icon style="transform: translateY(0.2rem);" name="warning-outline"></ion-icon>${message}
    `
    document.getElementById("errorMessage").style.transform="scale(1)"

    setTimeout(()=>{
      document.getElementById("errorMessage").style.transform="translateY(5rem) scale(0.1)"
    },2000)

  })
}

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
    localStorage.setItem("token","token")
    document.getElementById("sidebar").innerHTML=`
    <img id="logo" src="rrrxmyy-high-resolution-logo-white-on-transparent-background.png" alt="" width="100px">
    <ul>
     <li><a class="sidebar"href="index.html"> <ion-icon name="home-outline"></ion-icon> Home</a></li> <br>
     <li ><a href="profile.html" class="sidebar"><ion-icon name="person-outline"></ion-icon> Profile</a></li><br>
     <li onclick="LoginPopup()"><a id="login"><ion-icon name="log-out-outline"></ion-icon> Login</a></li><br>
     <li onclick="registerPopup()"><a id="login" style="padding: 0.8rem 7.7rem 0.8rem 1rem;"><ion-icon name="log-out-outline"></ion-icon> register</a></li><br>
    </ul>
    `
    document.getElementById("addPost").style.visibility ="hidden"
  })
}


//------------------------------------------------------------------------------


function exit(){

  document.getElementsByClassName("overlay")[0].style.visibility = "hidden"
  document.getElementById("registerPopUp").style.transform ="translateY(-80%) scale(0.1)"
  document.getElementsByClassName("loginPopUp")[0].style.transform ="translateY(-80%) scale(0.1)"
    document.getElementById("addPostPopUp").style.transform ="translateY(-80%) scale(0.1)"
    document.getElementById("editPostPopUp").style.transform ="translateY(-80%) scale(0.1)"
  }


  //-------------------------------POSTS FUNCTIONS-----------------------------


function addPost(){
  document.getElementsByClassName("overlay")[0].style.visibility = "visible"
  document.getElementById("addPostPopUp").style.transform= "scale(1)"
}

function creatPost(){
let body = document.getElementById("description").value
let title = document.getElementById("titleNP").value
let token = localStorage.getItem("token")
let image = document.getElementById("image").files[0]
let formData = new FormData()

formData.append("body",body)
formData.append("image",image)
formData.append("title",title)

axios.post(`https://tarmeezacademy.com/api/v1/posts`,formData,{
  headers:{
    "Content-Type":"multipart/form-data",
    "Authorization":`Bearer ${token}`
  }
})
.then((response)=>{
  exit()
  document.getElementsByTagName("section")[0].innerHTML =""
  showPosts()
})
}

function GetPostId(postId){
    localStorage.setItem("postId",postId)
    document.getElementsByTagName("section")[0].innerHTML =""
    showPosts()
}


function deletePost(PostId) {
  let token = localStorage.getItem("token")

  axios.delete(`https://tarmeezacademy.com/api/v1/posts/${PostId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then((response) => {
      document.getElementById("message").innerHTML = `
  <ion-icon style="transform: translateY(0.5rem);" name="checkmark-outline"></ion-icon> The Post has been deleted
`

      document.getElementById("errorMessage").style.background = "#2ad254"
      document.getElementById("errorMessage").style.transform = "scale(1)"

      setTimeout(() => {
        document.getElementById("errorMessage").style.transform = "translateY(5rem) scale(0.1)"
      }, 3000)
    })

  document.getElementsByTagName("section")[0].innerHTML = ""
  showPosts()

}

//-----------------------------------------------------------------------------------------