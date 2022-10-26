// if using ES6 Imports uncomment line below
// import {readFileSync, promises as fsPromises} from 'fs';
import { readFileSync, promises as fsPromises } from 'fs';

function format_orbit(orb){
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

var orbit = '10';
// FITS data
var data = syncReadFITS('./wispr_txt_data/orbit'+format_orbit(orbit)+'.txt');
// PNG file locations
var inner_PNGs = syncReadPNGs('./PNG_locations/PNGs_Orbit'+format_orbit(orbit)+'_inner.txt');
var outer_PNGs = syncReadPNGs('./PNG_locations/PNGs_Orbit'+format_orbit(orbit)+'_outer.txt');
var innerURL= 'https://wispr.nrl.navy.mil/data/rel/pngs/PNGs_Orbit'+format_orbit(orbit)+'_inner/';
var outerURL = 'https://wispr.nrl.navy.mil/data/rel/pngs/PNGs_Orbit'+format_orbit(orbit)+'_outer/';
console.log(data.length); // up to 2366 for orbit 10
