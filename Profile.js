let fr = localStorage.getItem("fromwhere")
let loggedIn = localStorage.getItem("tokenExist")

if (loggedIn == 1) {
  let userInfo = JSON.parse(localStorage.getItem("user"))
  document.getElementsByTagName("nav")[0].innerHTML = `
  <img id="logo" src="rrrxmyy-high-resolution-logo-white-on-transparent-background.png" alt="" width="100px">
  <ul>
   <li><a class="sidebar"href="index.html"> <ion-icon name="home-outline"></ion-icon> Home</a></li> <br>

   <li ><a id="LogOutBtn" onclick="Logout()"> <ion-icon name="log-out-outline"></ion-icon> LogOut</a></li>
  </ul>
 
  <div id="Profile">
     <img src=${userInfo.profile_image} alt="profile image" width="40px" height="40px" id="imgProfile">
     <span>@${userInfo.username}</span>
  </div>
  `
} else {
  alert("You need to Login to see this page")
  let promise = new Promise((resolve, reject) => {

    if (fr == 0) {
      GetuserPosts()
      showUserInfo()
    } else {
      showPostUserInfo()
    }
    resolve()
  }).then(() => {
    if (fr == 0) {
      GetuserPosts()
    } else {
      getPostUserInfo()
    }
  })
}

if (fr == 0) {
  showUserInfo()
  GetuserPosts()
} else {
  showPostUserInfo()
  getPostUserInfo()
}

//-------------------------------Posts functions ---------------------------------------------
function showUserInfo() {
  let user = JSON.parse(localStorage.getItem("user"))
  let userId = user.id
  axios.get(`https://tarmeezacademy.com/api/v1/users/${user.id}`)
    .then((response) => {

      document.getElementById("info").innerHTML += ` 
     <span>${response.data.data.name}</span><br><br>
     <span>${response.data.data.username}</span><br><br>
  `

      document.getElementById("accountInfo").innerHTML = `
  <span style="font-size: 40px;">${response.data.data.posts_count}</span> <span style="color:gray; font-size:15px;">Post</span><br>
  <span style="font-size: 40px;">${response.data.data.comments_count}</span> <span style="color:gray; font-size:15px" >Comment</span><br>
  `
      document.getElementById("ProfileImage").src = response.data.data.profile_image

      document.getElementById("userPost").innerHTML = `${response.data.data.username}'s Posts`
    })
}
function showPostUserInfo() {
  let userId = localStorage.getItem("user-id-Info")
  axios.get(`https://tarmeezacademy.com/api/v1/users/${userId}`)
    .then((response) => {

      document.getElementById("info").innerHTML += ` 
     <span>${response.data.data.name}</span><br><br>
     <span>${response.data.data.username}</span><br><br>
  `

      document.getElementById("accountInfo").innerHTML = `
  <span style="font-size: 40px;">${response.data.data.posts_count}</span> <span style="color:gray; font-size:15px;">Post</span><br>
  <span style="font-size: 40px;">${response.data.data.comments_count}</span> <span style="color:gray; font-size:15px" >Comment</span><br>
  `
      document.getElementById("ProfileImage").src = response.data.data.profile_image

      document.getElementById("userPost").innerHTML = `${response.data.data.username}'s Posts`
    })
}


function GetuserPosts() {
  let user = JSON.parse(localStorage.getItem("user"))
  let userId = user.id

  axios.get(`https://tarmeezacademy.com/api/v1/users/${user.id}/posts`)
    .then((response) => {
      let posts = response.data.data
      for (index of response.data.data) {
        author = index.author
        document.getElementById("PostsContainer").innerHTML += `
     
   <div class="Post">
   <span class="PostUser">
     <img src="${author.profile_image}" alt="">
     <span>${author.username}</span><br> <br>
     <span>${index.body}</span>
     <button class="edit-btn" style="transform:translateX(2rem)" onclick="deletePost(${index.id},'${encodeURIComponent(JSON.stringify(index))}')"><ion-icon name="trash"></ion-icon></button>
     <button class="edit-btn" onclick="editPost(${index.id},'${encodeURIComponent(JSON.stringify(index))}')" ><ion-icon name="ellipsis-vertical" ></ion-icon></button>
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
function getPostUserInfo() {
  let userId = localStorage.getItem("user-id-Info")

  axios.get(`https://tarmeezacademy.com/api/v1/users/${userId}/posts`)
    .then((response) => {
   
      let posts = response.data.data
      for (index of response.data.data) {
        author = index.author
        document.getElementById("PostsContainer").innerHTML += `
     
        <div class="Post">
        <span class="PostUser">
          <a href="profile.html">  <img src="${author.profile_image}" onclick="showProfileInfo(${author.id}),fromwhere(1)"alt=""> </a>
          <a href="profile.html"> <span onclick="showProfileInfo(${author.id}),fromwhere(1)"> ${author.username}</span> </a> <br> <br>
          <span>${index.body}</span><br>
         </span>
        <a href="PostInfo.html" onclick="GetPostId(${index.id})">
        <div style="max-height: 600px; overflow: hidden;">
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




//-----------------------------------Auth----------------------------

function Logout() {

  let token = localStorage.getItem("token")
  let user = localStorage.getItem("user")
  user = JSON.parse(user)
  let username = user.username
  token = "Bearer" + " " + token
  let config = {
    headers: {
      "Authorization": token,
    }
  }
  axios.post("https://tarmeezacademy.com/api/v1/logout",
    {
      username: username
    }, config)
    .then((response) => {
      localStorage.setItem("tokenExist", 0)
      localStorage.setItem("token", "token")
      document.getElementById("sidebar").innerHTML = `
   <img id="logo" src="rrrxmyy-high-resolution-logo-white-on-transparent-background.png" alt="" width="100px">
   <ul>
    <li><a class="sidebar"href="index.html"> <ion-icon name="home-outline"></ion-icon> Home</a></li> <br>
    <li ><a href="profile.html" class="sidebar"><ion-icon name="person-outline"></ion-icon> Profile</a></li><br>
    <li onclick="LoginPopup()"><a id="login"><ion-icon name="log-out-outline"></ion-icon> Login</a></li><br>
    <li onclick="registerPopup()"><a id="login" style="padding: 0.8rem 7.7rem 0.8rem 1rem;"><ion-icon name="log-out-outline"></ion-icon> register</a></li><br>
   </ul>
   `
      document.getElementById("addPost").style.visibility = "hidden"
    })
}

function LoginPopup() {
  document.getElementsByClassName("overlay")[0].style.visibility = "visible"
  document.getElementsByClassName("loginPopUp")[0].style.transform = "scale(1)"
}

function registerPopup() {
  document.getElementsByClassName("overlay")[0].style.visibility = "visible"
  document.getElementById("registerPopUp").style.transform = "scale(1)"
}

function exit() {
  document.getElementsByClassName("overlay")[0].style.visibility = "hidden"
  document.getElementById("registerPopUp").style.transform = "translateY(-80%) scale(0.1)"
  document.getElementsByClassName("loginPopUp")[0].style.transform = "translateY(-80%) scale(0.1)"
  //  document.getElementById("addPostPopUp").style.transform ="translateY(-80%) scale(0.1)"
  document.getElementById("editPostPopUp").style.transform = "translateY(-80%) scale(0.1)"
}

function exitFromLogin() {
  document.getElementsByClassName("loginPopUp")[0].style.transform = "translateY(-80%) scale(0.1)"
  registerPopup()
}

function register() {


  let username = document.getElementById("usernameVlaue").value
  let firstname = document.getElementById("firstNameValue").value
  let password = document.getElementById("passwordValue").value
  let profilePic = document.getElementById("fileInput").files[0]

  let formData = new FormData()
  formData.append("username", username)
  formData.append("name", firstname)
  formData.append("image", profilePic)
  formData.append("password", password)
  axios.post("https://tarmeezacademy.com/api/v1/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
    .then((response) => {

      document.getElementById("message").innerHTML = `
     <ion-icon style="transform: translateY(0.5rem);" name="checkmark-outline"></ion-icon> the account has been created succefuly
   `

      document.getElementById("errorMessage").style.background = "#2ad254"
      document.getElementById("errorMessage").style.transform = "scale(1)"
      setTimeout(() => {
        document.getElementById("errorMessage").style.transform = "translateY(5rem) scale(0.1)"
      }, 2000)
      document.getElementById("registerPopUp").style.transform = "translateY(-80%) scale(0.1)"
      document.getElementById("addPost").style.visibility = "visible"
      document.getElementsByTagName("nav")[0].innerHTML = `
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
    .catch((error) => {
      let message = error.response.data.message

      document.getElementById("message").innerHTML = `
     <ion-icon style="transform: translateY(0.2rem);" name="warning-outline"></ion-icon>${message}
   `
      document.getElementById("errorMessage").style.transform = "scale(1)"

      setTimeout(() => {
        document.getElementById("errorMessage").style.transform = "translateY(5rem) scale(0.1)"
      }, 2000)

    })
}

function Login() {


  let token = ""
  let username = document.getElementById("username").value
  let password = document.getElementById("password").value

  axios.post("https://tarmeezacademy.com/api/v1/login", {
    username: username,
    password: password
  })
    .then((response) => {
      token = response.data.token
      localStorage.setItem("token", token)
      localStorage.setItem("tokenExist", 1)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      exit()

      document.getElementById("message").innerHTML = `
   <ion-icon style="transform: translateY(0.5rem);" name="checkmark-outline"></ion-icon> Wlcome
 `

      document.getElementById("errorMessage").style.background = "#2ad254"
      document.getElementById("errorMessage").style.transform = "scale(1)"
      setTimeout(() => {
        document.getElementById("errorMessage").style.transform = "translateY(5rem) scale(0.1)"
      }, 3000)
      document.getElementById("registerPopUp").style.transform = "translateY(-80%) scale(0.1)"
      document.getElementById("addPost").style.visibility = "visible"
      document.getElementsByTagName("nav")[0].innerHTML = `
 <img id="logo" src="rrrxmyy-high-resolution-logo-white-on-transparent-background.png" alt="" width="100px">
 <ul>
  <li><a class="sidebar"href="index.html"> <ion-icon name="home-outline"></ion-icon> Home</a></li> <br>
  <li ><a href="profile.html" class="sidebar"><ion-icon name="person-outline"></ion-icon> Profile</a></li><br>
  <li ><a id="LogOutBtn" onclick="Logout()"> <ion-icon name="log-out-outline"></ion-icon> LogOut</a></li>
 </ul>

 <div id="Profile">
    <img src=${response.data.user.profile_image} alt="profile image" width="40px" height="40px" id="imgProfile">
    <span>@${response.data.user.username}</span>
 </div>
 `

    })
    .catch((error) => {
      let message = error.response.data.message
      document.getElementById("message").innerHTML = `
     <ion-icon style="transform: translateY(0.2rem);" name="warning-outline"></ion-icon>${message}
     `
      document.getElementById("errorMessage").style.transform = "scale(1)"

      setTimeout(() => {
        document.getElementById("errorMessage").style.transform = "translateY(5rem) scale(0.1)"
      }, 2000)

    })
}

//-------------------------------Edit Post---------------------------------

function GetPostId(postId) {
  localStorage.setItem("postId", postId)
  // document.getElementsByTagName("section")[0].innerHTML = ""
  // showPosts()
}

function editPost(postEditId, postOBj) {
  let postObj = JSON.parse(decodeURIComponent(postOBj))
  document.getElementById("titleEP").value = postObj.title
  document.getElementById("descriptionE").value = postObj.body

  document.getElementsByClassName("overlay")[0].style.visibility = "visible"
  document.getElementById("editPostPopUp").style.transform = "scale(1)"
  localStorage.setItem("postEditId", postEditId)


}

function edit() {
  let postId = localStorage.getItem("postEditId")
  let token = localStorage.getItem("token")
  let body = document.getElementById("descriptionE").value
  let title = document.getElementById("titleEP").value
  let image = document.getElementById("imageE").files[0]

  let formData = new FormData()
  formData.append("_method", "put")
  formData.append("body", body)
  formData.append("title", title)
  formData.append("image", image)

  axios.post(`https://tarmeezacademy.com/api/v1/posts/${postId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${token}`
    }
  })
    .then((response) => {
      document.getElementById("message").innerHTML = `
 <ion-icon style="transform: translateY(0.5rem);" name="checkmark-outline"></ion-icon> The Post has been updated
`
      exit()
      document.getElementById("errorMessage").style.background = "#2ad254"
      document.getElementById("errorMessage").style.transform = "scale(1)"
      setTimeout(() => {
        document.getElementById("errorMessage").style.transform = "translateY(5rem) scale(0.1)"
      }, 3000)
      document.getElementById("registerPopUp").style.transform = "translateY(-80%) scale(0.1)"
      document.getElementById("PostsContainer").innerHTML = ""
      GetuserPosts()
    })
    .catch((error) => {
      let message = error.response.data.message

      document.getElementById("message").innerHTML = `
    <ion-icon style="transform: translateY(0.2rem);" name="warning-outline"></ion-icon>${message}
  `
      document.getElementById("errorMessage").style.transform = "scale(1)"

      setTimeout(() => {
        document.getElementById("errorMessage").style.transform = "translateY(5rem) scale(0.1)"
      }, 2000)
    })
}

//---------------------------Delete Post----------------------------------------

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

    if(fr == 0){
  document.getElementById("info").innerHTML = ""
  showUserInfo()
  document.getElementById("PostsContainer").innerHTML = ""
  GetuserPosts()
  }else{
    document.getElementById("info").innerHTML = ""
    showPostUserInfo()
    document.getElementById("PostsContainer").innerHTML = ""
    getPostUserInfo()
  }

}
