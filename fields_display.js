// Controls all animation, interactivity, etc. for the FIELDS section

// Proton particle animation
/*
Code derived from:
https://codepen.io/aecend/pen/WbONyK
*/
(function(w) {
  var DISPLAYMODE = "m";
  var canvas, ctx;

  var canvas_width = 1000; 
  var canvas_height = 300;
  
  var particles = []; //The array that will contain the protons to display
  var hiddenparticles = [];  //The array that will contain the protons that are hidden at any moment
  var psize = 5; //This determines the size of the protons.
  var pdensity = 300; //This determines how many protons will be made.
  var pvelocity = 50; //This determines the velocity of the protons.
  var pcolor = "#00FFFF"; // This varies the proton color according to temperature
  var sunradius = 10; //The radius of the sun

  var ions = []; //The array that will contain the ions to display
  var hiddenions = []; //The array that will contain the ions that are hidden at any moment
  var isize = 3; //This determines the size of the ions.
  var idensity = 300; //This determines how many ions will be made.
  var ivelocity = 20; //This determines the velocity of the ions.
  var icolor = "#00FFFF"; // This varies the ion color according to temperature

  var evals = []; // This array will contain the 32 energy values of the different electrons
  var totalflux; // This represents the total number of electrons at any point in time
  // Switches the display mode between protons, electrons, & alphas
  function change_mode(m){
    DISPLAYMODE = m;
    if (m == "m" && ions.length==0){
      FIELDS.initialize(); // intializes ions & hidden ions
    }
  }

  // Calculates the maximum radius within the canvas depending on the theta value
  function maxradius(theta){
    var maxw = canvas_width/2;
    var maxh = canvas_height/2;
    var corner = Math.atan(maxh/maxw); // angle from x-axis to corner
    if (theta < corner){
      return maxw / Math.abs(Math.cos(theta));
    } else if (theta < (Math.PI-corner)){
      return maxh / Math.abs(Math.sin(theta));
    } else if (theta < (Math.PI+corner)){
      return maxw / Math.abs(Math.cos(theta));
    } else if (theta < (2*Math.PI-corner)){
      return maxh / Math.abs(Math.sin(theta));
    } else {
      return maxw / Math.abs(Math.cos(theta));
    }
  }
  /*
  This creates the canvas & particles
  */
  function init() {
      //These lines get the canvas DOM element and canvas context, respectively.
      canvas = document.getElementById("THEFIELDSCANVAS");
      ctx = canvas.getContext("2d");
      //These lines set the width, height, & border of the canvas.
      canvas.width = canvas_width;
      canvas.height = canvas_height;
      canvas.style.border = "4px outset #19FFD5";
      if (DISPLAYMODE == "m"){
        for (i = 0; i < pdensity; i++) {
          ions.push(new ion(Math.random() * canvas_width, Math.random() * canvas_height, "xy"));
        }
        var temptheta;
        for (i = 0; i < (10000-pdensity); i++) {
          /*
          This creates the hidden particles that will appear when density increases
          */
          hiddenions.push(new ion(Math.random() * canvas_width, Math.random() * canvas_height, "xy"));
        }
      }
  }
  // Calculates a color from rgb(0,0,252) to rgb(252,0,0) based on the temperature
  function calcColor(x, low, high) {
    var r;
    var g;
    var b;
    n = ((x - low) / (high - low) * 1024).toFixed(0);
    if (n <= 255) {
      r = 0;
      g = n;
      b = 255;
    } else if (n <= 511) {
      r = 0;
      g = 255;
      b = 511 - n;
    } else if (n <= 767) {  
      r = n - 512;
      g = 255;
      b = 0;
    } else if (n < 1024) {
      r = 255;
      g = 1023 - n;
      b = 0;
    } else {
      r = 255;
      g = 0;
      b = 0;
    }
    return "rgb(" + r + "," + g + "," + b + ")";
  }
  
  var spacingh = 40; // outer spacing on the bottom & top
  var spacingw = 40; // outer spacing on the left & right side
  var barw = (canvas_width-spacingw) / 32; // width of a single bar in the electron display
  var barh; // represents the height of a single bar
  var marginw = 6; // horizontal spacing between bars
  var emin = 3; // minimum power of 10 for the electron energy (eV)
  var emax = 10; // maximum power of 10 for the electron energy (eV)
  var ediff = emax - emin;
  // var energybins = [2,2.6,3.3,4.2,5.1,6.1,7.9,9.9,12.5,15,19,24,29,36,45,56,70,88,112,133,175,212,257,333,400,490,600,780,950,1200,1500,1800];

  //This function draws the canvas for the electrons
  function draw_electrons() {
      // updates parameters
      totalflux = 0;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      //Loops through the 32 energy bins
      for (i = 1; i <= 32; i++) {
        var e = spaneList[orbit_ind4][slider_val4][i] // reads in energy flux value
        totalflux += e; // adds the energy flux to the total flux
        barh = (Math.log10(e) - emin) / (ediff) * (canvas_height - 2*spacingh); // calculates scaled bar height depending on the energy

        // Draws the bar
        ctx.fillStyle = calcColor(i, 1, 32); // calcColor(Math.log10(e), emin, emax);
        ctx.fillRect(marginw+(i-1)*barw, canvas_height-spacingh-barh, barw-marginw, barh);
      }
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(0, canvas_height-spacingh, canvas_width, spacingh);

      var textw = 300;
      var texth = 36;
      // Draws a text box
      ctx.fillStyle = "rgba(0,0,0,0.8)";
      ctx.fillRect(0, 0, textw, texth);
      ctx.strokeStyle = "#19FFD5";
      ctx.lineWidth = 1.2;
      ctx.beginPath(); 
      ctx.moveTo(0, texth); 
      ctx.lineTo(textw, texth); 
      ctx.lineTo(textw, 0); 
      ctx.stroke(); //Draw the path to the canvas
      // Draws the text
      ctx.fillStyle = "white";
      ctx.font = "12px Montserrat";
      ctx.textAlign = 'left';
      //ctx.fillText("Total Energy Flux: " + (totalflux/10e6).toFixed(0) + " million electrons/(cm² s ster)", 10, 22);
      ctx.fillText("DISPLAY UNFINISHED", 10, 22);
      // Create a linear gradient
      // The start gradient point is at x=20, y=0
      // The end gradient point is at x=220, y=0
      const gradient = ctx.createLinearGradient(marginw, canvas_height-(spacingh-marginw), canvas_width-spacingw, canvas_height-(spacingh-marginw));
      // Add color stops
      // gradient.addColorStop(0, "black");
      // gradient.addColorStop(0.7, "rgba(255,0,0,0.9)");
      for (i = 1; i <= 32; i++) {
        gradient.addColorStop((i-1)/32, calcColor(i, 1, 32));
      }

      // Draws horizontal axis
      ctx.fillStyle = gradient;
      ctx.fillRect(marginw, canvas_height-(spacingh-marginw), canvas_width-spacingw-marginw, spacingh-2*marginw);
      let region = new Path2D();
      region.moveTo(canvas_width - spacingw + (spacingw/2-marginw), canvas_height-(spacingh/2));
      region.lineTo(canvas_width - spacingw, canvas_height-(spacingh-marginw));
      region.lineTo(canvas_width - spacingw, canvas_height-(marginw));
      region.closePath();
      ctx.fill(region);

      // Draws vertical axis
      ctx.fillStyle = "rgba(255,0,0,0.9)";
      ctx.fillRect(canvas_width - (spacingw-marginw), marginw, spacingw-2*marginw, canvas_height-spacingh-marginw);
      let region2 = new Path2D();
      region2.moveTo(canvas_width - spacingw/2, canvas_height-(spacingh/2+marginw));
      region2.lineTo(canvas_width - (spacingw-marginw), canvas_height-spacingh);
      region2.lineTo(canvas_width - marginw, canvas_height-spacingh);
      region2.closePath();
      ctx.fill(region2);

      // Draws the Electron Energy label
      ctx.fillStyle = 'black';
      ctx.font = "12px Montserrat";
      ctx.textAlign = 'center';
      for (i = 0; i < 3; i++) {
        ctx.fillText("Electric Field Frequency (Hz)", canvas_width/2, canvas_height-(spacingh/2-4));
      }

      // Draws flux scale (logarithmic)
      ctx.font = "10px Montserrat";
      var superscripts = ["⁰","¹","²","³","⁴","⁵","⁶","⁷","⁸","⁹", "¹⁰"];
      for (i = 0; i < 2; i++) {
        for (j = emin; j <= emax; j++) {
          ctx.fillText("10"+superscripts[j], canvas_width - (spacingw/2), canvas_height-spacingh-5 - (j - emin) / (ediff) * (canvas_height - 2*spacingh));
        }
      }
      // Draws the flux label
      ctx.fillStyle = "rgba(0,0,0,0.75)";
      ctx.fillRect(canvas_width - (spacingw+10), 0, 15, marginw+62);
      ctx.fillStyle = 'rgba(255,0,0,1)';
      ctx.textAlign = 'right';
      ctx.translate(canvas_width - (spacingw-2), marginw);
      ctx.rotate(270 * Math.PI / 180);
      ctx.translate(-(canvas_width - (spacingw-2)), -marginw);
      for (i = 0; i < 3; i++) {
        ctx.fillText("energy flux", canvas_width - (spacingw-2), marginw); // canvas_width - (spacingw-2), marginw
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  //This function draws the canvas for the magnetic field
  function draw_magnetic() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var br = fieldsList[orbit_ind4][slider_val4][1].toFixed(1);
    var bt = fieldsList[orbit_ind4][slider_val4][2].toFixed(1);
    var bn = fieldsList[orbit_ind4][slider_val4][3].toFixed(1);
    // updates parameters
    ivelocity = 20; // Proton velocity
    idensity = 200; // Proton density
    icolor = calcColor(4500000, 1000000, 5000000); // Proton color based on temperature

    //This sets the color to draw with.
    ctx.strokeStyle = icolor;

    // document.getElementById("warning").innerHTML = ions.length;
    //Loops through all of the ions in the array
    for (i = 0; i < ions.length; i++) {

        //Sets this variable to the current particle so we can refer to the particle easier.
        var p = ions[i];

        //If the particle's X and Y coordinates are within the bounds of the canvas...
        if (p.x >= -50 && p.x < canvas_width && p.y >= 0 && p.y < canvas_height) {
            if (i % 4 == 0) {
              ctx.lineWidth = isize;
              p.vx = ivelocity * (Math.random()*0.2+1);;
            } else if (i % 4 == 2) {
              ctx.lineWidth = isize*0.6;
              p.vx = ivelocity * (Math.random()*0.3+0.7);
            } else {
              ctx.lineWidth = isize*0.4; 
              p.vx = ivelocity * (Math.random()*0.3+0.4);
            }
            //This recalculates the position coordinates of the particle.
            p.x = p.x + p.vx;
            p.y = p.y + (Math.random()*4-2);
            
            ctx.beginPath(); //Begin a new path on the canvas
            ctx.moveTo(p.x, p.y); //Move the drawing cursor to the starting point
            ctx.lineTo(p.px, p.py); //Describe a line from the particle's old coordinates to the new ones
            ctx.stroke(); //Draw the path to the canvas
            //This updates the previous X and Y coordinates of the particle to the new ones for the next loop.
            p.px = p.x;
            p.py = p.y;     
        }
        else {
            //If the particle's X and Y coordinates are outside the bounds of the canvas...

            //Place the particle back at the start
            p.px = p.x = -50 * Math.random();
            p.py = p.y = Math.random() * canvas_height;              
        }
    }
    var textw = 100;
    var texth = 70;
    if (fieldsUnit == "wacky"){
      textw = 220;
    }
    // Draws a text box
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, 0, textw, texth);
    ctx.strokeStyle = "#19FFD5";
    ctx.lineWidth = 1.2;
    ctx.beginPath(); 
    ctx.moveTo(0, texth); 
    ctx.lineTo(textw, texth); 
    ctx.lineTo(textw, 0); 
    ctx.stroke(); //Draw the path to the canvas
    // Draws the text
    ctx.textAlign = 'left';
    ctx.fillStyle = "white";
    ctx.font = "12px Montserrat";
    ctx.fillText("Br: " + br + " nT", 10, 56);
    ctx.fillText("Bt: " + bt + " nT", 10, 39);
    ctx.fillText("Bn: " + bn + " nT", 10, 22);

    ctx.textAlign = 'center';
    ctx.font = "32px Montserrat";
    ctx.fillText("DISPLAY UNFINISHED", canvas_width/2, canvas_height/2);
    //This requests the next animation frame which runs the draw() function again.
    // requestAnimationFrame(draw);
  }
  //This function calculates theta given x, y
  function calctheta(x, y) {
    if (x > 0 && y > 0) {
      return Math.atan(y/x);
    } else if (x < 0 && y > 0) {
      return Math.PI - Math.atan(y/-x);
    } else if (x < 0 && y < 0) {
      return Math.PI + Math.atan(-y/-x);
    } else if (x > 0 && y < 0) {
      return 2 * Math.PI - Math.atan(-y/x);
    } else if (x == 0 && y > 0) {
      return Math.PI/2;
    } else if (x == 0 && y < 0) {
      return 3 * Math.PI/2;
    } else if (x > 0 && y == 0) {
      return 0;
    } else if (x < 0 && y == 0) {
      return Math.PI;
    } else {
      return 0;
    }
  }
  //This function is used to create a particle (proton) object.
  function particle(p1, p2, key) {
    if (key == "xy"){ // p1 = x, p2 = y
      var truex = p1 - (canvas_width/2);
      var truey = p2 - (canvas_height/2);
      this.theta = calctheta(truex, truey);
      this.r = Math.sqrt(truex * truex + truey * truey);
      this.x = this.px = p1;
      this.y = this.py = p2;
      this.v = pvelocity;
    } else if (key == "tr"){ // p1 = theta, p2 = r
      this.theta = p1;
      this.r = p2;
      this.x = this.px = p2 * Math.cos(p1) + canvas_width/2;
      this.y = this.py = p2 * Math.sin(p1) + canvas_height/2;
      this.v = pvelocity;
    }
  }
  //This function is used to create an ion object.
  function ion(p1, p2, key) {
    if (key == "xy"){ // p1 = x, p2 = y
      this.x = this.px = p1;
      this.y = this.py = p2;
      this.vx = pvelocity;
    }
  }
  /*
  And this line attaches an object called "FIELDS" to the global scope. "window" was passed into
  the self-invoking function as "w", so setting "w.FIELDS" adds it to "window".
  */
  w.FIELDS = {
      initialize: init,
      drawMagnetic: draw_magnetic,
      drawElectric: draw_electrons,
      changeMode: change_mode
  }

}(window)); //Passes "window" into the self-invoking function.

window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
FIELDS.initialize();

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

var datetime4; // holds the string of the date and time
function update_data4(){ // updates the images, location, etc. every time the slider changes
  var scale_factor = 355000;
  var angle;
  document.getElementById("locplot4").src = "public/orbit_plot2_" + orbit4 + ".png"; // updates image for position display
  if (fieldsmode == "m"){ // ELECTRIC
    datetime4 = fieldsList[orbit_ind4][slider_val4][0]; 
    FIELDS.drawMagnetic();
  } else if (fieldsmode == "e"){ // MAGNETIC
    datetime4 = fieldsList[orbit_ind4][slider_val4][0]; 
    FIELDS.drawElectric();
  } 
  // update the date, time, position, etc. using SPC data
  var spcdateind = spcdateList[orbit_ind4].indexOf(datetime4);
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
  var yr = datetime4.substring(0, 4);
  var mth = datetime4.substring(4, 6);
  var day = datetime4.substring(6, 8);
  var hr = parseInt(datetime4.substring(9, 11));
  var min = datetime4.substring(11, 13);
  document.getElementById("datetxt4").innerHTML = mth + "/" + day + "/" + yr;
  document.getElementById("timetxt4").innerHTML = formattime(hr, min);

  document.getElementById("disttxt4").innerHTML = "Distance: " + dist;
  document.getElementById("pspspeed4").innerHTML = "Speed: " + speed;
}
function play_loop4(){
  if (!stopplay4){
    var increment = 1;
    max4 = parseInt(slider4.max);
    if (slider_val4 < max4-increment){
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
  orbit_ind4 = parseInt(orbit4)-1;
  slider4.value = '0'; // resets slider value to 0 every time orbit is changed
  slider_val4 = 0;
  slider4.max = fieldsList[orbit_ind4].length - 1; // changes slider range to match indices of the fits data points
  update_data4();
}

var instrumentselector4 = document.getElementById("fields_selector");
var fieldsmode = "m"; // Can be p (protons), e (electrons), or a (alphas) depending on the selector
instrumentselector4.oninput = function(){
  fieldsmode = instrumentselector4.value;
  FIELDS.changeMode(fieldsmode);
  if (fieldsmode == "m"){ // Magnetic field
    document.getElementById("fieldsinstrument").style.backgroundImage = "";
    document.getElementById("fieldsdescription").innerHTML = "DISPLAY UNFINISHED [M]";
  } 
  else if (fieldsmode == "e") { // Electric
    document.getElementById("fieldsinstrument").style.backgroundImage = "";
    document.getElementById("fieldsdescription").innerHTML = "DISPLAY UNFINISHED [E]";
  } 
  update_data4();
}

var slider4 = document.getElementById("sliderrr4");
var slider_val4 = 0;
var loc4 = document.getElementById("psploc4");
var stopplay4;
var curr_speed4 = 10000; // current speed in fps
var max_speed4 = 100000;
var min_speed4 = 5000;
var max4; // max value of fields slider 
var timer4;

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
    timer4 = setInterval(play_loop4, 60000 / curr_speed4);
    document.getElementById("fieldsfasterbutton1").style.left = (60 + 22) + "px";
    document.getElementById("fieldsfasterbutton2").style.left = (60 + 22 + 14) + "px";
    document.getElementById("fieldsslowerbutton1").style.right = (60 + 22) + "px";
    document.getElementById("fieldsslowerbutton2").style.right = (60 + 22 + 14) + "px";
    document.getElementById("speedsection4").style.opacity = 1;
  } else{
    // document.getElementById("clicktoplay").innerHTML = "stopped";
    slider4.style.opacity = 1;
    stopplay4 = true;
    clearInterval(timer4);
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
    clearInterval(timer4);
    stopplay4 = false;
    timer4 = setInterval(play_loop4, 60000 / curr_speed4);
    document.getElementById("speeddisplay4").innerHTML = "x" + curr_speed4;
  } else if (curr_speed4 != max_speed4) {
    curr_speed4 = max_speed4;
    stopplay4 = true;
    clearInterval(timer4);
    stopplay4 = false;
    timer4 = setInterval(play_loop4, 60000 / curr_speed4);
    document.getElementById("speeddisplay4").innerHTML = "x" + curr_speed4;
  }
}
function playslower4(n){
  if (curr_speed4 > min_speed4 - 1 + n){
    curr_speed4 -= n
    stopplay4 = true;
    clearInterval(timer4);
    stopplay4 = false;
    timer4 = setInterval(play_loop4, 60000 / curr_speed4);
    document.getElementById("speeddisplay4").innerHTML = "x" + curr_speed4;
  } else if (curr_speed4 != min_speed4) {
    curr_speed4 = min_speed4;
    stopplay4 = true;
    clearInterval(timer4);
    stopplay4 = false;
    timer4 = setInterval(play_loop4, 60000 / curr_speed4);
    document.getElementById("speeddisplay4").innerHTML = "x" + curr_speed4;
  }
}
var fieldsUnit = "metric";
var showFieldsUnitDisplay = false;
function fieldsUnitDisplay(){ // shows/hides fields unit controls
  showFieldsUnitDisplay = !showFieldsUnitDisplay;
  const unitlist = document.querySelectorAll('.fieldsunit');
  if (showFieldsUnitDisplay){
    unitlist.forEach((el) => el.style.display = "block");
    //unitlist.forEach((el) => el.classList.add('.fieldsunitshow'));
  } else {
    unitlist.forEach((el) => el.style.display = "none");
    //unitlist.forEach((el) => el.classList.remove('.fieldsunitshow'));
  }
}
function switchFIELDSunit(unitname){
  fieldsUnit = unitname;
  update_data4();
}


update_data4();