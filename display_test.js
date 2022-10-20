// import { readFileSync } from 'fs';

var e = document.getElementById("orbit_num");
var orbit = e.value;

function format_orbit(orb){ // Converts '2' to '02', '10' to '10', etc. 
  var o = parseInt(orb);
  if (o < 10){
      return '0'+o.toString();
  } else{
      return o.toString();
  }
}

var slider = document.getElementById("myRange");
var output = document.getElementById("slider_value");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  val = slider.value;
  output.innerHTML = val;
}

// Updates the current selector value for orbit number
e.oninput = function(){
  orbit = e.value;
  document.getElementById("thing").textContent = orbit;
  //const contents = readFileSync('./PNG_locations/PNGs_Orbit01_inner.txt', 'utf-8');
}

