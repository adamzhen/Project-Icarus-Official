// responsiveness upon resize

function resizeDisplay(){
  // The Sun
  var suntexts = document.querySelectorAll('.suntext')
  var w = window.innerWidth;
  var h = window.innerHeight;
  suntexts.forEach((el) => el.style.transform = "scale(" + w / 1536 +")");
  // PSP
  // Corona
  document.getElementById("auroracontainer").style.setProperty("--w", (w / 1536 * 500) + "px");
  if (w <= 750){
    document.getElementById("cmecontainer").style.setProperty("--w", (w / 750 * 360) + "px");
    document.getElementById("carringtoncontainer").style.setProperty("--w", (w / 750 * 330) + "px");
  } else {
    document.getElementById("cmecontainer").style.setProperty("--w", "360px");
    document.getElementById("carringtoncontainer").style.setProperty("--w", "330px");
  }
  // WISPR
  document.getElementById("fasterbutton1").style.left = (w/2 + 30) + "px";
  document.getElementById("fasterbutton2").style.left = (w/2 + 40) + "px";
  document.getElementById("slowerbutton1").style.right = (w/2 + 30) + "px";
  document.getElementById("slowerbutton2").style.right = (w/2 + 40) + "px";
  if (w <= 1536){
    document.getElementById("positiondisplay").style.transform = "scale(" + w / 1536 +")";
  }
}

resizeDisplay();
window.addEventListener("resize", resizeDisplay);
