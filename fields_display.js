var selector4 = document.getElementById("orbit_num4");
var orbit4 = '1';
var NUMORBITS = 12;

function formattime(hr, min){ // formats the time to 12-hour format
  if (hr==0){
    return "12:" + min + " am";
  } else if (hr<12){
    return hr.toString() + ":" + min + " am";
  } else if (hr == 12){
    return "12:" + min + " pm";
  } else {
    return (hr % 12).toString() + ":" + min + " pm";
  }
}
var datetime; // holds the string of the date and time
function update_data4(){ // updates the images, location, etc. every time the slider changes
  var scale_factor = 355000;
  var angle;
  if (fieldsmode == "p"){ // PROTONS
    var data = spcList[orbit_ind4][slider_val4]; 
    var dist = (data[6]).toFixed(3).toString() + " AU";
    if (fieldsUnit=="metric"){
      var speed = (data[7]*3600).toFixed(0).toString() + " kmph";
    } else if (fieldsUnit=="imperial"){
      var speed = (data[7]*3600*0.6214).toFixed(0).toString() + " mph";
    } else if (fieldsUnit=="wacky"){
      var speed = "Mach " + (data[7]*2.91545).toFixed(0).toString();
    }
    datetime = data[0];
    document.getElementById("locplot4").src = "public/orbit_plot2_" + orbit4 + ".png"; // updates image for position display
    document.getElementById("locplot4").style.opacity = "1";
    var x = data[4];
    var y = data[5];
    loc4.style.left = (8 + x / scale_factor).toString() + 'px'; //
    loc4.style.top = (-198 - y / scale_factor).toString() + 'px'; //
    if (x>0){
      angle = Math.atan(y/x);
    } else {
      angle = Math.PI - Math.atan(y/-x);
    }
    loc4.style.transform = "rotate(" + (2*Math.PI-angle) + "rad)";
    SWEAP.drawProtons();
  } else {
    if (fieldsmode == "e"){ // ELECTRONS
      datetime = spaneList[orbit_ind4][slider_val4][0]; 
      SWEAP.drawElectrons();
    } else if (fieldsmode == "a"){ // ALPHAS/IONS
      if (orbit_ind4 >= 1 && orbit_ind4 <= 7) { // only data for orbits 2-8
        datetime = spaniList[orbit_ind4][slider_val4][0]; 
      }
      SWEAP.drawAlphas();
    } 
    var spcdateind = spcdateList[orbit_ind4].indexOf(datetime);
    if (spcdateind != -1){ // if the date is found in the spc date list
      var data = spcList[orbit_ind4][spcdateind]; 
      var dist = data[6].toFixed(3).toString() + " AU";
      if (fieldsUnit=="metric"){
        var speed = (data[7]*3600).toFixed(0).toString() + " kmph";
      } else if (fieldsUnit=="imperial"){
        var speed = (data[7]*3600*0.6214).toFixed(0).toString() + " mph";
      } else if (fieldsUnit=="wacky"){
        var speed = "Mach " + (data[7]*4.91545).toFixed(0).toString();
      }
      document.getElementById("locplot4").src = "public/orbit_plot2_" + orbit4 + ".png"; // updates image for position display
      document.getElementById("locplot4").style.opacity = "1";
      var x = data[4];
      var y = data[5];
      loc4.style.left = (8 + x / scale_factor).toString() + 'px'; //
      loc4.style.top = (-198 - y / scale_factor).toString() + 'px'; //
      if (x>0){
        angle = Math.atan(y/x);
      } else {
        angle = Math.PI - Math.atan(y/-x);
      }
      loc4.style.transform = "rotate(" + (2*Math.PI-angle) + "rad)";
    } 
    else { // if the date is NOT found in the spc date list
      document.getElementById("locplot4").style.opacity = "0.8";
      dist = speed = "unknown";
    }
  }
  var yr = datetime.substring(0, 4);
  var mth = datetime.substring(4, 6);
  var day = datetime.substring(6, 8);
  var hr = parseInt(datetime.substring(9, 11));
  var min = datetime.substring(11, 13);
  document.getElementById("datetxt4").innerHTML = mth + "/" + day + "/" + yr;
  document.getElementById("timetxt").innerHTML = formattime(hr, min);

  document.getElementById("disttxt4").innerHTML = "Distance: " + dist;
  document.getElementById("pspspeed").innerHTML = "Speed: " + speed;
  // document.getElementById("warning").innerHTML = datetime;
}
function play_loop4(){
  if (!stopplay2){
    var increment = 1;
    max4 = parseInt(slider4.max);
    if (slider_val4 < max2-increment){
      slider_val4 += increment;
      slider4.value = slider_val4.toString();
    } else {
      slider_val4 = 0;
      slider4.value = slider_val4.toString();
    }
    update_data4();
  }
}

var orbit_ind4 = 0;
// Updates the current selector value for orbit number
selector4.oninput = function(){
  orbit4 = selector4.value;
  orbit_ind4 = parseInt(orbit2)-1;
  slider4.value = '0'; // resets slider value to 0 every time orbit is changed
  slider_val4 = 0;
  if (fieldsmode == "p"){ // Protons
    slider4.max = spcList[orbit_ind4].length - 1; // changes slider range to match indices of the fits data points
  } 
  else if (fieldsmode == "e") { // Electrons
    slider4.max = spaneList[orbit_ind4].length - 1; // changes slider range to match indices of the fits data points
  } 
  else if (fieldsmode == "a") { // Alphas/Ions
    if (orbit_ind4 >= 1 && orbit_ind4 <= 7) { // only data for orbits 2-8
      slider4.max = spaniList[orbit_ind4].length - 1; // changes slider range to match indices of the fits data points
    }
  } 
  update_data4();
}

var instrumentselector = document.getElementById("fields_selector");
var fieldsmode = "p"; // Can be p (protons), e (electrons), or a (alphas) depending on the selector
instrumentselector.oninput = function(){
  fieldsmode = instrumentselector.value;
  SWEAP.changeMode(fieldsmode);
  if (fieldsmode == "p"){ // Protons
    document.getElementById("fieldsinstrument").style.backgroundImage = "url(public/SPC_instrument.jpg)";
    document.getElementById("fieldsdescription").innerHTML = "The Solar Probe Cup (SPC) courageously stares straight into the sun, enduring temperatures that could melt away even steel and iron (over 3000°F / 1650°C) - all in order to measure the temperature, density, and velocity of protons and alpha particles in the solar wind (only data for protons is shown here).";
    document.getElementById("whatisflux").style.display = "none";
    slider4.max = spcList[orbit_ind4].length - 1; // changes slider range to match indices of the fits data points
    var dateind = spcdateList[orbit_ind4].indexOf(datetime);
  } 
  else if (fieldsmode == "e") { // Electrons
    document.getElementById("fieldsinstrument").style.backgroundImage = "url(public/SPANe_instrument.jpg)";
    document.getElementById("fieldsdescription").innerHTML = "Both of the two Solar Probe ANalyzers (SPAN) measure electrons by sorting them into 32 different energy bins. SPAN-A points in the direction that the PSP is traveling, while SPAN-B points the opposite way. Together, their field of view covers almost the entire sky (except for what the heat shield blocks).";
    document.getElementById("whatisflux").style.display = "block";
    slider4.max = spaneList[orbit_ind4].length - 1; // changes slider range to match indices of the fits data points
    var dateind = spanedateList[orbit_ind4].indexOf(datetime);
  } 
  else if (fieldsmode == "a") { // Alphas/Ions
    document.getElementById("fieldsinstrument").style.backgroundImage = "url(public/SPANi_instrument.jpg)";
    document.getElementById("fieldsdescription").innerHTML = "Unlike SPAN-B, SPAN-A measures both electrons & alpha particles (hence why it has 2 cylinder-shaped sensors, while SPAN-B only has one). It is important to note that when we say alphas, we're actually measuring all ions. But most ions in the solar wind are alphas, so here we just call them alphas.";
    document.getElementById("whatisflux").style.display = "none";
    if (orbit_ind4 >= 1 && orbit_ind4 <= 7) { // only data for orbits 2-8
      slider4.max = spaniList[orbit_ind4].length - 1; // changes slider range to match indices of the fits data points
    }
    var dateind = spanidateList[orbit_ind4].indexOf(datetime);
  } 
  // Updates slider index to match date/time, or resets slider to 0 if date/time is not found
  if (dateind != -1){
    slider4.value = dateind.toString();
    slider_val4 = dateind;
  } else {
    slider4.value = '0'; // resets slider value to 0 if matching datetime is not found
    slider_val4 = 0;
  }
  update_data4();
}

var slider4 = document.getElementById("sliderrr4");
var slider_val4 = 0;
var loc4 = document.getElementById("psploc4");
var stopplay2;
var curr_speed4 = 10000; // current speed in fps
var max_speed4 = 100000;
var min_speed4 = 5000;
var max2; // max value of fields slider 
var timer2;

// Update the current slider value (each time you drag the slider handle)
slider4.oninput = function() {
  slider_val4 = parseInt(this.value);
  update_data4();
}

function playclick4(){
  var play = document.getElementById("playbutton4")
  play.classList.toggle("paused");
  if (play.className=="button paused"){
    slider4.style.opacity = 0;
    stopplay4 = false;
    timer4 = setInterval(play_loop2, 60000 / curr_speed2);
    document.getElementById("fieldsfasterbutton1").style.left = (60 + 22) + "px";
    document.getElementById("fieldsfasterbutton2").style.left = (60 + 22 + 14) + "px";
    document.getElementById("fieldsslowerbutton1").style.right = (60 + 22) + "px";
    document.getElementById("fieldsslowerbutton2").style.right = (60 + 22 + 14) + "px";
    document.getElementById("speedsection4").style.opacity = 1;
  } else{
    // document.getElementById("clicktoplay").innerHTML = "stopped";
    slider4.style.opacity = 1;
    stopplay4 = true;
    clearInterval(timer2);
    document.getElementById("fieldsfasterbutton1").style.left = "50%";
    document.getElementById("fieldsfasterbutton2").style.left = "50%";
    document.getElementById("fieldsslowerbutton1").style.right = "50%";
    document.getElementById("fieldsslowerbutton2").style.right = "50%";
    document.getElementById("speedsection4").style.opacity = 0;
    slider4.value = slider_val4.toString();
  }
}
function playfaster4(n){
  if (curr_speed4 < max_speed4 + 1 - n){
    curr_speed4 += n
    stopplay4 = true;
    clearInterval(timer2);
    stopplay4 = false;
    timer4 = setInterval(play_loop2, 60000 / curr_speed2);
    document.getElementById("speeddisplay4").innerHTML = "x" + curr_speed2;
  } else if (curr_speed4 != max_speed2) {
    curr_speed4 = max_speed2;
    stopplay4 = true;
    clearInterval(timer2);
    stopplay4 = false;
    timer4 = setInterval(play_loop2, 60000 / curr_speed2);
    document.getElementById("speeddisplay4").innerHTML = "x" + curr_speed2;
  }
}
function playslower4(n){
  if (curr_speed4 > min_speed4 - 1 + n){
    curr_speed4 -= n
    stopplay4 = true;
    clearInterval(timer2);
    stopplay4 = false;
    timer4 = setInterval(play_loop2, 60000 / curr_speed2);
    document.getElementById("speeddisplay4").innerHTML = "x" + curr_speed2;
  } else if (curr_speed4 != min_speed2) {
    curr_speed4 = min_speed2;
    stopplay4 = true;
    clearInterval(timer2);
    stopplay4 = false;
    timer4 = setInterval(play_loop2, 60000 / curr_speed2);
    document.getElementById("speeddisplay4").innerHTML = "x" + curr_speed2;
  }
}
var fieldsUnit = "metric";
var showSweapUnitDisplay = false;
function fieldsUnitDisplay(){ // shows/hides fields unit controls
  showSweapUnitDisplay = !showSweapUnitDisplay;
  const unitlist = document.querySelectorAll('.fieldsunit');
  if (showSweapUnitDisplay){
    unitlist.forEach((el) => el.style.display = "block");
    //unitlist.forEach((el) => el.classList.add('.fieldsunitshow'));
  } else {
    unitlist.forEach((el) => el.style.display = "none");
    //unitlist.forEach((el) => el.classList.remove('.fieldsunitshow'));
  }
}
function switchSWEAPunit(unitname){
  fieldsUnit = unitname;
  update_data4();
}
var showFluxInfo = false;
function fluxInfo(){ // shows/hides flux info
  showFluxInfo = !showFluxInfo;
  if (showFluxInfo){
    document.getElementById("fluxinfo").style.display = "block";
    document.getElementById("whatisflux").style.display = "none";
  } else {
    document.getElementById("fluxinfo").style.display = "none";
    document.getElementById("whatisflux").style.display = "block";
  }
}
// var fullscreen = False;
// function togglefullscreen(){
//   fullscreen = !fullscreen;
//   // checks to see if the canvas should be fullscreen & adjusts accordingly
//   if (fullscreen){
//     document.getElementById("fullscreenbutton").src = "public/minimizescreen.png";
//     document.getElementById("c").width = window.innerWidth;
//     document.getElementById("c").height = window.innerHeight;
//   } else {
//     document.getElementById("fullscreenbutton").src = "public/fullscreen.png";
//     document.getElementById("c").width = 1000;
//     document.getElementById("c").height = 400;
//   }
// }
update_data4();