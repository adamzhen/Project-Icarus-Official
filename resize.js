// responsiveness upon resize

function resizeDisplay(){
  var w = window.innerWidth;
  var h = window.innerHeight;
  // Header
  if (w <= 500 || w/h < 1){
    document.getElementById("logo").src = "public/ProjectIcarusHeaderVertical.png";
    document.getElementById("logo").style.setProperty("--h", 80);
    document.getElementById("logo").style.right = "0";
  } else {
    document.getElementById("logo").src = "public/ProjectIcarusHeader.png";
    document.getElementById("logo").style.setProperty("--h", 40);
    document.getElementById("logo").style.right = "1.2vw";
  }
  if (w <= 1536){
    document.getElementById("scrollbuttonsection").style.transform = "scale(" + w / 1536 +")";
  } else {
    document.getElementById("scrollbuttonsection").style.transform = "scale(1)";
  }
  // The Sun
  var suntexts = document.querySelectorAll('.suntext')
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
  if (w <= 800){
    document.getElementById("elfvansection").style.transform = "scale(" + w / 800 +")";
  } else {
    document.getElementById("elfvansection").style.transform = "scale(1)";
  }
  // WISPR
  document.getElementById("fasterbutton1").style.left = (w/2 + 30) + "px";
  document.getElementById("fasterbutton2").style.left = (w/2 + 40) + "px";
  document.getElementById("slowerbutton1").style.right = (w/2 + 30) + "px";
  document.getElementById("slowerbutton2").style.right = (w/2 + 40) + "px";
  if (w <= 1536){
    document.getElementById("positiondisplay").style.transform = "scale(" + w / 1536 +")";
  } else {
    document.getElementById("positiondisplay").style.transform = "scale(1)";
  }
}

resizeDisplay();
window.addEventListener("resize", resizeDisplay);
