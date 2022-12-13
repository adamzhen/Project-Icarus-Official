// responsiveness upon resize

function resizeDisplay(){
  // The Sun
  var suntexts = document.querySelectorAll('.suntext')
  suntexts.forEach((el) => el.style.transform = "scale(" + window.innerWidth / 1536 +")");
  // PSP
  // Corona
  document.getElementById("auroracontainer").style.setProperty("--w", (window.innerWidth / 1536 * 400) + "px");
  document.getElementById("auroracontainer").style.width = "scale(" + window.innerWidth / 1536 +")";
  // WISPR
  document.getElementById("fasterbutton1").style.left = (window.innerWidth/2 + 30) + "px";
  document.getElementById("fasterbutton2").style.left = (window.innerWidth/2 + 40) + "px";
  document.getElementById("slowerbutton1").style.right = (window.innerWidth/2 + 30) + "px";
  document.getElementById("slowerbutton2").style.right = (window.innerWidth/2 + 40) + "px";
  if (window.innerWidth <= 1536){
    document.getElementById("positiondisplay").style.transform = "scale(" + window.innerWidth / 1536 +")";
  }
}

resizeDisplay();
window.addEventListener("resize", resizeDisplay);
