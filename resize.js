// responsiveness upon resize

var w = window.innerWidth;
var h = window.innerHeight;

function textResize(className, sizeFactor, lineHeightFactor) {
  var elements = document.querySelectorAll(className); // Select all h1 elements within elements of the specified class
  elements.forEach(function(element) {
    element.style.fontSize = sizeFactor*Math.pow(w, 0.6) + "px"; // Set the font size of each h1 element
    element.style.lineHeight = lineHeightFactor*sizeFactor*Math.pow(w, 0.6) + "px"; // Set the line height of each h1 element
  });
}

function resizeDisplay(){
  w = window.innerWidth;
  h = window.innerHeight;
  document.getElementById("sourcecode").innerHTML = "w: " + w + " h: " + h;

  // If switch to landscape view, hide loader
  if (w > 500 && w > h ){
    document.querySelector(".loader-wrapper").style.opacity = 0;
    document.getElementById("loader-text").style.opacity = 0;
  }
  // Header
  if (w <= 500 || w < h){
    document.getElementById("logo").src = "public/ProjectIcarusHeaderVertical.png";
    document.getElementById("logo").style.setProperty("--h", "67vw");
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
  textResize(".modelcontainer h1", 2, 0.75);
  textResize(".modelcontainer h2", 0.23, 0.8);
  textResize(".modelcontainer h3", 0.53, 1.1);
  textResize(".modelcontainer h4", 0.2, 1);
  textResize(".modelcontainer h5", 0.12, 0.8);
  textResize(".modelcontainer p", 0.1, 1.5);
  // if (w <= 900){
  //   document.getElementById("disclaimer").style.fontSize = "6px";
  // } else {
  //   document.getElementById("disclaimer").style.fontSize = "8px";
  // }
  // Corona
  if (w <= 750){
    document.getElementById("corona").style.width = "100%";
    document.getElementById("corona").style.borderRadius = "0px";
  } else {
    document.getElementById("corona").style.width = "620px";
    document.getElementById("corona").style.borderRadius = "75px";
  }
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
  textResize(".exhibitnum", 0.2, 1);
  // WISPR
  textResize("#wispr h1", 1.35, 0.9);
  textResize("#wispr h2", 0.18, 1.5);
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
  textResize("#sweap h1", 1.35, 0.9);
  textResize("#sweap h2", 0.18, 1.5);
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
  // IOSIS
  textResize("#isois h1", 1.35, 0.9);
  textResize("#isois h2", 0.18, 1.5);
  // FIELDS
  textResize("#fields h1", 1.35, 0.9);
  textResize("#fields h2", 0.2, 1.5);
}

resizeDisplay();
window.addEventListener("resize", resizeDisplay);
