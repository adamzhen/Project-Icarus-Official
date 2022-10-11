// if using ES6 Imports uncomment line below
// import {readFileSync, promises as fsPromises} from 'fs';
const {readFileSync, promises: fsPromises} = require('fs');

function format_orbit(orbit){
    o = parseInt(orbit);
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
  for (i=0; i<arr1.length; i++){
    arr2.push(arr1[i].split(", "));
  }
  return arr2;
}

function video(){
    if(counter <= 1000){
        document.getElementById("inner").src = innerURL + innerPNGs[counter];
        counter++;
    } else {
        clearInterval(timer);
        console.log("done");
    }
}
var delay_ms = 50;
var counter = 0;
var e = document.getElementById("orbit_number");
var orbit = e.value;

document.getElementById("thing").textContent = orbit 
// FITS data
data = syncReadFITS('./wispr_txt_data/orbit'+format_orbit(orbit)+'.txt');
// PNG file locations
innerURL= 'https://wispr.nrl.navy.mil/data/rel/pngs/PNGs_Orbit'+format_orbit(orbit)+'_inner/'
outerURL = 'https://wispr.nrl.navy.mil/data/rel/pngs/PNGs_Orbit'+format_orbit(orbit)+'_outer/'
console.log(data[3][3]);
let timer = setInterval(video, delay_ms);
