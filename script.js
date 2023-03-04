function LoginPopup(){
 document.getElementsByClassName("loginPopUp")[0].style.transform ="scale(1)"
}

function registerPopup(){
 document.getElementById("registerPopUp").style.transform ="scale(1)"
}

function exit(index){
  document.getElementById("registerPopUp").style.transform ="translateY(-80%) scale(0.1)"
  document.getElementsByClassName("loginPopUp")[0].style.transform ="translateY(-80%) scale(0.1)"

}