import { readFileSync, promises as fsPromises } from 'fs';

var e = document.getElementById("orbit_num");
var orbit = '1';


function format_orbit(orb){ // Converts '2' to '02', '10' to '10', etc. 
  var o = parseInt(orb);
  if (o < 10){
      return '0'+o.toString();
  } else{
      return o.toString();
  }
}

function syncReadFITS(filename) {
  const contents = readFileSync(filename, 'utf-8');
  const arr1 = contents.split(/\r?\n/);
  const arr2 = [];
  for (var i=0; i<arr1.length; i++){
    arr2.push(arr1[i].split(", "));
  }
  return arr2;
}

function syncReadPNGs(filename) {
  const contents = readFileSync(filename, 'utf-8');
  const arr = contents.split(/\r?\n/);
  return arr;
}
var innerPNGs;
var outerPNGs;
var innerURL;
var outerURL;
// Updates the current selector value for orbit number
e.oninput = function(){
  orbit = e.value;
  // PNG file locations
  innerPNGs = syncReadPNGs('./PNG_locations/PNGs_Orbit'+format_orbit(orbit)+'_inner.txt');
  outerPNGs = syncReadPNGs('./PNG_locations/PNGs_Orbit'+format_orbit(orbit)+'_outer.txt');
  innerURL= 'https://wispr.nrl.navy.mil/data/rel/pngs/PNGs_Orbit'+format_orbit(orbit)+'_inner/';
  outerURL = 'https://wispr.nrl.navy.mil/data/rel/pngs/PNGs_Orbit'+format_orbit(orbit)+'_outer/';
  document.getElementById("inner").src = innerURL + innerPNGs[0]; //CHANGE
  document.getElementById("thing").textContent = orbit;
}

var slider = document.getElementById("myRange");
var output = document.getElementById("slider_value");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  val = this.value;
  output.innerHTML = val;
}

// FITS data
// var data = syncReadFITS('./wispr_txt_data/orbit'+format_orbit(orbit)+'.txt');
