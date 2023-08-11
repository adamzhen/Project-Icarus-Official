// responsiveness upon resize

function resizeDisplay(){
  var w = window.innerWidth;
  var h = window.innerHeight;
  // Header
  if (w <= 500 || w < h){
    document.getElementById("logo").src = "public/ProjectIcarusHeaderVertical.png";
    document.getElementById("logo").style.setProperty("--h", "80vw");
  } else {
    document.getElementById("logo").src = "public/ProjectIcarusHeader.png";
    document.getElementById("logo").style.setProperty("--h", "27vw");
  }
  // The Sun
  var suntexts = document.querySelectorAll('.suntext')
  suntexts.forEach((el) => el.style.transform = "scale(" + w / 1536 +")");
  if (w <= 750 || w < h){
    document.getElementById("rotatingcircles").style.display = "none";
  } else {
    document.getElementById("rotatingcircles").style.display = "block";
  }
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
  document.getElementById("wisprfasterbutton1").style.left = (w*0.9/2 + 28) + "px";
  document.getElementById("wisprfasterbutton2").style.left = (w*0.9/2 + 28 + 14) + "px";.1
  document.getElementById("wisprslowerbutton1").style.right = (w*0.9/2 + 28) + "px";
  document.getElementById("wisprslowerbutton2").style.right = (w*0.9/2 + 28 + 14) + "px";
  if (w <= 1450){
    document.getElementById("innersection").style.transform = "scale(" + w / 1450 + ") translateX(" + (-(1450 - w) / 1450 * (270 + w*0.3)) + "px)";
    document.getElementById("outersection").style.transform = "scale(" + w / 1450 + ") translateX(" + ((1450 - w) / 1450 * (270 + w*0.3)) + "px)";
  } else {
    document.getElementById("innersection").style.transform = "scale(1)";
    document.getElementById("outersection").style.transform = "scale(1)";
  }
  if (w <= 900){
    document.getElementById("positiondisplay").style.transform = "scale(" + w / 900 +")";
  } else {
    document.getElementById("positiondisplay").style.transform = "scale(1)";
  }
  // SWEAP
  document.getElementById("sweapfasterbutton1").style.left = (60 + 22) + "px";
  document.getElementById("sweapfasterbutton2").style.left = (60 + 22 + 14) + "px";
  document.getElementById("sweapslowerbutton1").style.right = (60 + 22) + "px";
  document.getElementById("sweapslowerbutton2").style.right = (60 + 22 + 14) + "px";
  if (w <= 1100){
    document.getElementById("positiondisplay2").style.transform = "scale(" + w / 1100 +")";
    document.getElementById("instrumentdisplay").style.transform = "scale(" + w / 1100 +")";
  } else {
    document.getElementById("positiondisplay2").style.transform = "scale(1)";
    document.getElementById("instrumentdisplay").style.transform = "scale(1)";
  }
}

resizeDisplay();
window.addEventListener("resize", resizeDisplay);
