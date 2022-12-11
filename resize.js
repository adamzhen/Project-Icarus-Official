function resizeDisplay(){
  if (window.innerWidth <= 1536){
    document.getElementById("positiondisplay").style.transform = "scale(" + window.innerWidth / 1536 +")";
  }
  var suntexts = document.querySelectorAll('.suntext')
  suntexts.forEach((el) => el.style.transform = "scale(" + window.innerWidth / 1536 +")");
  document.getElementById("fasterbutton1").style.left = (window.innerWidth/2 + 30) + "px";
  document.getElementById("fasterbutton2").style.left = (window.innerWidth/2 + 40) + "px";
  document.getElementById("slowerbutton1").style.right = (window.innerWidth/2 + 30) + "px";
  document.getElementById("slowerbutton2").style.right = (window.innerWidth/2 + 40) + "px";
}

window.addEventListener("resize", resizeDisplay);
resizeDisplay();
