function resizeDisplay(){
  if (window.innerWidth <= 1536){
    document.getElementById("positiondisplay").style.transform = "scale(" + window.innerWidth / 1536 +")";
  }
  var suntexts = document.querySelectorAll('.suntext')
  suntexts.forEach((el) => el.style.transform = "scale(" + window.innerWidth / 1536 +")");
}

window.addEventListener("resize", resizeDisplay);
resizeDisplay();
