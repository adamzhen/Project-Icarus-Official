// Controls all animation, interactivity, etc. for the SWEAP section

// Proton particle animation
/*
Code derived from:
https://codepen.io/aecend/pen/WbONyK
*/
(function(w) {
    var DISPLAYMODE = "p";
    var canvas, ctx;

    var canvas_width = 1000; 
    var canvas_height = 300;
    var psize = 5; //This determines the size of the particles.
    var particles = []; //The array that will contain the particles to display
    var hiddenparticles = [];  //The array that will contain the particles that are hidden at any moment

    var pdensity = 300; //This determines how many protons will be made.
    var pvelocity = 50; //This determines the velocity of the protons.
    var pcolor = "#00FFFF"; // This varies the proton color according to temperature
    var sunradius = 10; //The radius of the sun

    var evals = []; // This array will contain the 32 energy values of the different electrons
    var totalelectrons; // This represents the total number of electrons at any point in time
    // Switches the display mode between protons, electrons, & alphas
    function change_mode(m){
      DISPLAYMODE = m;
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
        canvas = document.getElementById("c");
        ctx = canvas.getContext("2d");
        //These lines set the width, height, & border of the canvas.
        canvas.width = canvas_width;
        canvas.height = canvas_height;
        canvas.style.border = "4px outset rgb(217, 54, 0)";

        for (i = 0; i < pdensity; i++) {
            temptheta = Math.random() * 2*Math.PI; 
            hiddenparticles.push(new particle(temptheta, Math.random() * (maxradius(temptheta)-sunradius) + sunradius, "tr"));
        }
        var temptheta;
        for (i = 0; i < (10000-pdensity); i++) {
          /*
          This creates the hidden particles that will appear when density increases
          */
          temptheta = Math.random() * 2*Math.PI; 
          hiddenparticles.push(new particle(temptheta, Math.random() * (maxradius(temptheta)-sunradius) + sunradius, "tr"));
        }
        //When the page is finished loading, run the draw() function.
        w.onload = draw_protons;
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

    // Draws the proton display
    function draw_protons() {
        var pv = spcList[orbit_ind2][slider_val2][1].toFixed(1);
        var pd = spcList[orbit_ind2][slider_val2][2].toFixed(0);
        var pt = spcList[orbit_ind2][slider_val2][3].toFixed(0);
        var pdist = spcList[orbit_ind2][slider_val2][6].toFixed(3);
        // updates parameters
        pvelocity = pv/10; // Proton velocity
        pdensity = pd; // Proton density
        pcolor = calcColor(pt, 200000, 700000); // Proton color based on temperature
        sunradius = 32 / (pdist/0.075); // Calculates radius of the sun based on distance from it

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draws the sun
        ctx.fillStyle = "#fcb603";
        ctx.shadowColor = "rgb(255, 122, 0)";
        ctx.shadowBlur = sunradius;
        ctx.beginPath();
        ctx.ellipse(canvas_width/2, canvas_height/2, sunradius, sunradius, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;

        //This sets the color to draw with.
        ctx.strokeStyle = pcolor;
        var maxr = Math.sqrt((canvas_width*canvas_width/4) + (canvas_height*canvas_height/4));
        var pradius;

        var diff = Math.abs(pdensity - particles.length);
        // Increase the particle amount if below density
        if (particles.length < pdensity){   
          while (diff > 0) {
              particles.push(hiddenparticles.pop());
              diff -= 1;
          }
        }
        // Decrease the particle amount if above density 
        else if (particles.length > pdensity){
          while (diff > 0) {
            // if (!(p.x >= 0 && p.x < canvas_width && p.y >= 0 && p.y < canvas_height))
            var p = particles.pop();
            p.theta = Math.random() * 2*Math.PI;
            p.r = Math.random() * (maxradius(p.theta)-sunradius) + sunradius;
            p.px = p.x = p.r * Math.cos(p.theta) + canvas_width/2;
            p.py = p.y = p.r * Math.sin(p.theta) + canvas_height/2;
            hiddenparticles.push(p);
            diff -= 1;
          }
        }
        // document.getElementById("warning").innerHTML = particles.length;
        //Loops through all of the particles in the array
        var templength = particles.length;
        for (i = 0; i < particles.length; i++) {

            //Sets this variable to the current particle so we can refer to the particle easier.
            var p = particles[i];

            //If the particle's X and Y coordinates are within the bounds of the canvas...
            if (p.x >= 0 && p.x < canvas_width && p.y >= 0 && p.y < canvas_height) {
              if (i % 9 == 0){
                p.v = pvelocity * (p.r / maxr) * (p.r / maxr) * 2 + Math.random()*pvelocity/8;
                p.r += p.v; 
                ctx.fillStyle = pcolor;
                //This recalculates the position coordinates of the particle.
                p.x = p.r * Math.cos(p.theta) + canvas_width/2;
                p.y = p.r * Math.sin(p.theta) + canvas_height/2;
                pradius = psize * (p.r / maxr) * (p.r / maxr);
                ctx.beginPath();
                ctx.ellipse(p.x, p.y, pradius, pradius, 0, 0, 2 * Math.PI);
                ctx.fill();
              }
              else {
                if (i % 4 == 0) {
                  ctx.lineWidth = psize * (p.r / maxr) * Math.sqrt(p.r / maxr);
                  p.v = pvelocity * (p.r / maxr) * Math.sqrt(p.r / maxr) + Math.random()*pvelocity/10;
                } else if (i % 4 == 2) {
                  ctx.lineWidth = psize * Math.sqrt(p.r / maxr);
                  p.v = pvelocity * (p.r / maxr) + Math.random()*pvelocity/9;
                } else {
                  ctx.lineWidth = psize * (p.r / maxr) * (p.r / maxr) * 2; 
                  p.v = pvelocity * (p.r / maxr) + Math.random()*pvelocity/8;
                }
                p.r += p.v; 
                //This recalculates the position coordinates of the particle.
                p.x = p.r * Math.cos(p.theta) + canvas_width/2;
                p.y = p.r * Math.sin(p.theta) + canvas_height/2;
                
                ctx.beginPath(); //Begin a new path on the canvas
                ctx.moveTo(p.x, p.y); //Move the drawing cursor to the starting point
                ctx.lineTo(p.px, p.py); //Describe a line from the particle's old coordinates to the new ones
                ctx.stroke(); //Draw the path to the canvas
              }
              //This updates the previous X and Y coordinates of the particle to the new ones for the next loop.
              p.px = p.x;
              p.py = p.y;     
            }
            else {
                //If the particle's X and Y coordinates are outside the bounds of the canvas...

                //Place the particle back at the start
                p.r = sunradius;
                p.theta = Math.random() * 2*Math.PI;
                p.px = p.x = p.r * Math.cos(p.theta) + canvas_width/2;
                p.py = p.y = p.r * Math.sin(p.theta) + canvas_height/2;
                // If there are more particles than the density...                  
            }
        }
        var textw = 180;
        var texth = 70;
        // Draws a text box
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(0, 0, textw, texth);
        ctx.strokeStyle = "rgb(255, 100, 0)";
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
        ctx.fillText("Velocity: " + pv + " km/s", 10, 56);
        ctx.fillText("Density: " + pd + " protons/cm²", 10, 39);
        ctx.fillText("Temperature: " + (pt-273) + " ℃", 10, 22);
        //This requests the next animation frame which runs the draw() function again.
        // requestAnimationFrame(draw);
    }
    
    var spacingh = 35; // outer spacing on the bottom & top
    var spacingw = 35; // outer spacing on the left & right side
    var barw = (canvas_width-spacingw) / 32; // width of a single bar in the electron display
    var barh; // represents the height of a single bar
    var marginw = 6; // horizontal spacing between bars
    var emin = 2; // minimum power of 10 for the electron energy (eV)
    var emax = 9; // maximum power of 10 for the electron energy (eV)
    var ediff = emax - emin;
    var energybins = [2,2.6,3.3,4.2,5.1,6.1,7.9,9.9,12.5,15,19,24,29,36,45,56,70,88,112,133,175,212,257,333,400,490,600,780,950,1200,1500,1800];

    //This function draws the canvas for the electrons
    function draw_electrons() {
        // updates parameters
        totalelectrons = (spaneList[orbit_ind2][slider_val2][33] / 1000000).toFixed(0);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //Loops through the 32 energy bins
        for (i = 1; i <= 32; i++) {
          var e = spaneList[orbit_ind2][slider_val2][i] / energybins[i-1]; // reads in energy value (eV)
          barh = (Math.log10(e) - emin) / (ediff) * (canvas_height - 2*spacingh); // calculates scaled bar height depending on the energy

          // Draws the bar
          ctx.fillStyle = calcColor(i, 1, 32); // calcColor(Math.log10(e), emin, emax);
          ctx.fillRect(marginw+(i-1)*barw, canvas_height-spacingh-barh, barw-marginw, barh);
        }
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect(0, canvas_height-spacingh, canvas_width, spacingh);

        var textw = 265;
        var texth = 36;
        // Draws a text box
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(0, 0, textw, texth);
        ctx.strokeStyle = "rgb(255, 100, 0)";
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
        ctx.fillText("Total Density: " + totalelectrons + " million electrons/cm²", 10, 22);

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

        // Draws horizontal & vertical axis
        ctx.fillStyle = gradient;
        ctx.fillRect(marginw, canvas_height-(spacingh-marginw), canvas_width-spacingw-marginw, spacingh-2*marginw);
        let region = new Path2D();
        region.moveTo(canvas_width - spacingw + (spacingw/2-marginw), canvas_height-(spacingh/2));
        region.lineTo(canvas_width - spacingw, canvas_height-(spacingh-marginw));
        region.lineTo(canvas_width - spacingw, canvas_height-(marginw));
        region.closePath();
        ctx.fill(region);

        ctx.fillStyle = "rgba(255,0,0,0.9)";
        ctx.fillRect(canvas_width - (spacingw-marginw), marginw, spacingw-2*marginw, canvas_height-spacingh-marginw);
        let region2 = new Path2D();
        region2.moveTo(canvas_width - spacingw/2, canvas_height-(spacingh/2+marginw));
        region2.lineTo(canvas_width - (spacingw-marginw), canvas_height-spacingh);
        region2.lineTo(canvas_width - marginw, canvas_height-spacingh);
        region2.closePath();
        ctx.fill(region2);

        // Draws the labels
        ctx.fillStyle = 'black';
        ctx.font = "11px Montserrat";
        ctx.textAlign = 'center';
        for (i = 0; i < 3; i++) {
          ctx.fillText("Electron Energy", canvas_width/2, canvas_height-(spacingh/2-4));
        }

        ctx.font = "10px Montserrat";
        var superscripts = ["⁰","¹","²","³","⁴","⁵","⁶","⁷","⁸","⁹"];
        for (i = 0; i < 2; i++) {
          for (j = emin; j <= emax; j++) {
            ctx.fillText("10"+superscripts[j], canvas_width - (spacingw/2), canvas_height-spacingh-4 - (j - emin) / (ediff) * (canvas_height - 2*spacingh));
          }
        }
        ctx.fillStyle = 'rgba(255,0,0,1)';
        ctx.textAlign = 'right';
        ctx.translate(canvas_width - (spacingw-2), marginw);
        ctx.rotate(270 * Math.PI / 180);
        ctx.translate(-(canvas_width - (spacingw-2)), -marginw);
        for (i = 0; i < 3; i++) {
          ctx.fillText("electrons / cm²", canvas_width - (spacingw-2), marginw);
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);

    }

    //This function draws the canvas for the alphas/ions
    function draw_alphas() {

      /*
      This line clears the canvas. It needs to be cleared every time a new frame is drawn
      so the particles move. Otherwise, the particles would just look like long curvy lines.
      */
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.font = "18px Montserrat";
      ctx.textAlign = 'center';
      ctx.fillText("Alpha display still under construction", canvas_width/2, canvas_height/2);
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
    //This function is used to create a particle object.
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
  
    /*
    And this line attaches an object called "SWEAP" to the global scope. "window" was passed into
    the self-invoking function as "w", so setting "w.SWEAP" adds it to "window".
    */
    w.SWEAP = {
        initialize: init,
        drawProtons: draw_protons,
        drawElectrons: draw_electrons,
        drawAlphas: draw_alphas,
        changeMode: change_mode
    }

}(window)); //Passes "window" into the self-invoking function.

window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
SWEAP.initialize();

var selector2 = document.getElementById("orbit_num2");
var orbit2 = '1';
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
function update_data2(){ // updates the images, location, etc. every time the slider changes
  var scale_factor = 355000;
  var angle;
  if (sweapmode == "p"){ // PROTONS
    var data = spcList[orbit_ind2][slider_val2]; 
    var dist = data[6].toFixed(3).toString();
    var speed = data[7].toFixed(1).toString();
    datetime = data[0];
    document.getElementById("locplot2").src = "public/orbit_plot2_" + orbit2 + ".png"; // updates image for position display
    document.getElementById("locplot2").style.opacity = "1";
    var x = data[4];
    var y = data[5];
    loc2.style.left = (8 + x / scale_factor).toString() + 'px'; //
    loc2.style.top = (-198 - y / scale_factor).toString() + 'px'; //
    if (x>0){
      angle = Math.atan(y/x);
    } else {
      angle = Math.PI - Math.atan(y/-x);
    }
    loc2.style.transform = "rotate(" + (2*Math.PI-angle) + "rad)";
    SWEAP.drawProtons();
  } else {
    if (sweapmode == "e"){ // ELECTRONS
      datetime = spaneList[orbit_ind2][slider_val2][0]; 
      SWEAP.drawElectrons();
    } else if (sweapmode == "a"){ // ALPHAS/IONS
      SWEAP.drawAlphas();
    } 
    var spcdateind = spcdateList[orbit_ind2].indexOf(datetime);
    if (spcdateind != -1){ // if the date is found in the spc date list
      var data = spcList[orbit_ind2][spcdateind]; 
      var dist = data[6].toFixed(3).toString();
      var speed = data[7].toFixed(1).toString();
      document.getElementById("locplot2").src = "public/orbit_plot2_" + orbit2 + ".png"; // updates image for position display
      document.getElementById("locplot2").style.opacity = "1";
      var x = data[4];
      var y = data[5];
      loc2.style.left = (8 + x / scale_factor).toString() + 'px'; //
      loc2.style.top = (-198 - y / scale_factor).toString() + 'px'; //
      if (x>0){
        angle = Math.atan(y/x);
      } else {
        angle = Math.PI - Math.atan(y/-x);
      }
      loc2.style.transform = "rotate(" + (2*Math.PI-angle) + "rad)";
    } 
    else { // if the date is NOT found in the spc date list
      document.getElementById("locplot2").style.opacity = "0.8";
      dist = speed = "____";
    }
  }
  var yr = datetime.substring(0, 4);
  var mth = datetime.substring(4, 6);
  var day = datetime.substring(6, 8);
  var hr = parseInt(datetime.substring(9, 11));
  var min = datetime.substring(11, 13);
  document.getElementById("datetxt2").innerHTML = mth + "/" + day + "/" + yr;
  document.getElementById("timetxt").innerHTML = formattime(hr, min);

  document.getElementById("disttxt2").innerHTML = "Distance: " + dist + " AU";
  document.getElementById("pspspeed").innerHTML = "Speed: " + speed + " km/s";
  // document.getElementById("warning").innerHTML = datetime;
}
function play_loop2(){
  if (!stopplay2){
    var increment = 1;
    max2 = parseInt(slider2.max);
    if (slider_val2 < max2-increment){
      slider_val2 += increment;
      slider2.value = slider_val2.toString();
    } else {
      slider_val2 = 0;
      slider2.value = slider_val2.toString();
    }
    update_data2();
  }
}

var orbit_ind2 = 0;
// Updates the current selector value for orbit number
selector2.oninput = function(){
  orbit2 = selector2.value;
  orbit_ind2 = parseInt(orbit2)-1;
  slider2.value = '0'; // resets slider value to 0 every time orbit is changed
  slider_val2 = 0;
  if (sweapmode == "p"){ // Protons
    slider2.max = spcList[orbit_ind2].length - 1; // changes slider range to match indices of the fits data points
  } 
  else if (sweapmode == "e") { // Electrons
    slider2.max = spaneList[orbit_ind2].length - 1; // changes slider range to match indices of the fits data points
  } 
  else if (sweapmode == "a") { // Alphas/Ions
    slider2.max = spaniList[orbit_ind2].length - 1; // changes slider range to match indices of the fits data points
  } 
  update_data2();
}

var instrumentselector = document.getElementById("sweap_selector");
var sweapmode = "p"; // Can be p (protons), e (electrons), or a (alphas) depending on the selector
instrumentselector.oninput = function(){
  sweapmode = instrumentselector.value;
  SWEAP.changeMode(sweapmode);
  if (sweapmode == "p"){ // Protons
    document.getElementById("sweapinstrument").style.backgroundImage = "url(public/SPC_instrument.jpg)";
    document.getElementById("sweapdescription").innerHTML = "The Solar Probe Cup (SPC) courageously stares straight into the sun, enduring temperatures that could melt away even steel and iron (over 3000°F / 1650°C) - all in order to measure the temperature, density, and velocity of protons and alpha particles in the solar wind (only data for protons is shown here).";
    slider2.max = spcList[orbit_ind2].length - 1; // changes slider range to match indices of the fits data points
    var dateind = spcdateList[orbit_ind2].indexOf(datetime);
  } 
  else if (sweapmode == "e") { // Electrons
    document.getElementById("sweapinstrument").style.backgroundImage = "url(public/SPANe_instrument.jpg)";
    document.getElementById("sweapdescription").innerHTML = "Both of the two Solar Probe ANalyzers (SPAN) measure electrons by sorting them into 32 different energy bins. SPAN-A points in the direction that the PSP is traveling, while SPAN-B points the opposite way. Together, their field of view covers almost the entire sky (except for what the heat shield blocks).";
    slider2.max = spaneList[orbit_ind2].length - 1; // changes slider range to match indices of the fits data points
    var dateind = spanedateList[orbit_ind2].indexOf(datetime);
  } 
  else if (sweapmode == "a") { // Alphas/Ions
    document.getElementById("sweapinstrument").style.backgroundImage = "url(public/SPANi_instrument.jpg)";
    document.getElementById("sweapdescription").innerHTML = "Unlike SPAN-B, SPAN-A measures both electrons & alpha particles (hence why it has 2 cylinder-shaped sensors, while SPAN-B only has one). It is important to note that when we say alphas, we're actually measuring all ions. But most ions in the solar wind are alphas, so here we just call them alphas.";
    slider2.max = spaniList[orbit_ind2].length - 1; // changes slider range to match indices of the fits data points
    var dateind = spanidateList[orbit_ind2].indexOf(datetime);
  } 
  // Updates slider index to match date/time, or resets slider to 0 if date/time is not found
  if (dateind != -1){
    slider2.value = dateind.toString();
    slider_val2 = dateind;
  } else {
    slider2.value = '0'; // resets slider value to 0 if matching datetime is not found
    slider_val2 = 0;
  }
  update_data2();
}

var slider2 = document.getElementById("sliderrr2");
var slider_val2 = 0;
var loc2 = document.getElementById("psploc2");
var stopplay2;
var curr_speed2 = 10000; // current speed in fps
var max_speed2 = 100000;
var min_speed2 = 5000;
var max2; // max value of sweap slider 
var timer2;

// Update the current slider value (each time you drag the slider handle)
slider2.oninput = function() {
  slider_val2 = parseInt(this.value);
  update_data2();
}

function playclick2(){
  var play = document.getElementById("playbutton2")
  play.classList.toggle("paused");
  if (play.className=="button paused"){
    slider2.style.opacity = 0;
    stopplay2 = false;
    timer2 = setInterval(play_loop2, 60000 / curr_speed2);
    document.getElementById("sweapfasterbutton1").style.left = (60 + 22) + "px";
    document.getElementById("sweapfasterbutton2").style.left = (60 + 22 + 14) + "px";
    document.getElementById("sweapslowerbutton1").style.right = (60 + 22) + "px";
    document.getElementById("sweapslowerbutton2").style.right = (60 + 22 + 14) + "px";
    document.getElementById("speedsection2").style.opacity = 1;
  } else{
    // document.getElementById("clicktoplay").innerHTML = "stopped";
    slider2.style.opacity = 1;
    stopplay2 = true;
    clearInterval(timer2);
    document.getElementById("sweapfasterbutton1").style.left = "50%";
    document.getElementById("sweapfasterbutton2").style.left = "50%";
    document.getElementById("sweapslowerbutton1").style.right = "50%";
    document.getElementById("sweapslowerbutton2").style.right = "50%";
    document.getElementById("speedsection2").style.opacity = 0;
    slider2.value = slider_val2.toString();
  }
}
function playfaster2(n){
  if (curr_speed2 < max_speed2 + 1 - n){
    curr_speed2 += n
    stopplay2 = true;
    clearInterval(timer2);
    stopplay2 = false;
    timer2 = setInterval(play_loop2, 60000 / curr_speed2);
    document.getElementById("speeddisplay2").innerHTML = "x" + curr_speed2;
  } else if (curr_speed2 != max_speed2) {
    curr_speed2 = max_speed2;
    stopplay2 = true;
    clearInterval(timer2);
    stopplay2 = false;
    timer2 = setInterval(play_loop2, 60000 / curr_speed2);
    document.getElementById("speeddisplay2").innerHTML = "x" + curr_speed2;
  }
}
function playslower2(n){
  if (curr_speed2 > min_speed2 - 1 + n){
    curr_speed2 -= n
    stopplay2 = true;
    clearInterval(timer2);
    stopplay2 = false;
    timer2 = setInterval(play_loop2, 60000 / curr_speed2);
    document.getElementById("speeddisplay2").innerHTML = "x" + curr_speed2;
  } else if (curr_speed2 != min_speed2) {
    curr_speed2 = min_speed2;
    stopplay2 = true;
    clearInterval(timer2);
    stopplay2 = false;
    timer2 = setInterval(play_loop2, 60000 / curr_speed2);
    document.getElementById("speeddisplay2").innerHTML = "x" + curr_speed2;
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
update_data2();