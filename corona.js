var elfvandelay = 10;
var angle = 0;
var colored = false;
function changeColor(){ // Changes color of elf van if you click on it
  colored = !colored;
  if (colored){
    document.getElementById("elfvan").src = "public/elf-van.png";
  } else {
    document.getElementById("elfvan").src = "public/elf-van-bw.png";
  }
}
function elfVanLoop() { // Animates elf van "orbitting" around sun
  angle -= Math.PI/180;
  document.getElementById("elfvan").style.left = (195*Math.cos(angle)).toString() + "px";
  document.getElementById("elfvan").style.bottom = (190+195*Math.sin(angle)).toString() + "px";
  document.getElementById("elfvan").style.transform = "rotate(" + (Math.PI/2-angle) + "rad)"
}
let elfVanTimer = setInterval(elfVanLoop, elfvandelay);

document.getElementById("vidPlayImg").onclick = function() { // Allows user to play the corona sun video
  document.getElementById("vidPlayImg").style.display="none";
  var video = document.getElementById('coronavid');
  var sources = video.getElementsByTagName('source');
  sources[0].src = 'public/CoronaSunVIDEO.mp4';
  video.load();
  video.style.display="block";

  var delayInMilliseconds = 19666;
  const vidDelay = setTimeout(function() {
    if (document.getElementById("coronavid").style.display!="none"){
      document.getElementById("coronavid").style.display="none";
      document.getElementById("vidPlayImg").style.display="block";
    } else {
      clearTimeout(vidDelay);
    }
  }, delayInMilliseconds);
}