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

    var totalflux; // This represents the total number of electrons at any point in time
    // Switches the display mode between protons, electrons, & alphas
    function change_mode(m){
      DISPLAYMODE = m;
      if (m == "a" && ions.length==0){
        SWEAP.initialize(); // intializes ions & hidden ions
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
        canvas = document.getElementById("THESWEAPCANVAS");
        ctx = canvas.getContext("2d");
        //These lines set the width, height, & border of the canvas.
        canvas.width = canvas_width;
        canvas.height = canvas_height;
        canvas.style.border = "4px outset rgb(217, 54, 0)";
        if (DISPLAYMODE == "p"){
          for (i = 0; i < pdensity; i++) {
            temptheta = Math.random() * 2*Math.PI; 
            particles.push(new particle(temptheta, Math.random() * (maxradius(temptheta)-sunradius) + sunradius, "tr"));
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
        else if (DISPLAYMODE == "a"){
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

    // Draws the proton display
    function draw_protons() {
        var pv = spcList[orbit_ind2][slider_val2][1].toFixed(1); // km/s
        var pd = spcList[orbit_ind2][slider_val2][2].toFixed(0); // cm^-2
        var pt = spcList[orbit_ind2][slider_val2][3].toFixed(0); // K
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
        if (sweapUnit == "wacky"){
          textw = 210;
        }
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
        if (sweapUnit == "metric"){
          ctx.fillText("Velocity: " + (pv*3600).toFixed(0) + " kmph", 10, 56);
          ctx.fillText("Density: " + pd + " protons/cm²", 10, 39);
          ctx.fillText("Temperature: " + (pt-273) + " ℃", 10, 22);
        } 
        else if (sweapUnit == "imperial"){
          ctx.fillText("Velocity: " + (pv*3600*0.6214).toFixed(0) + " mph", 10, 56);
          ctx.fillText("Density: " + (pd/2.54/2.54).toFixed(0) + " protons/in²", 10, 39);
          ctx.fillText("Temperature: " + (((pt-273)/5*9)+32).toFixed(0) + " ℉", 10, 22);
        } 
        else if (sweapUnit == "wacky"){
          ctx.fillText("Velocity: Mach " + (pv/0.343).toFixed(0) + "", 10, 56);
          ctx.fillText("Density: " + (pd/2.85).toFixed(0) + " protons/penny", 10, 39);
          ctx.fillText("Temperature: " + (pt/329.817).toFixed(0) + " death valleys", 10, 22);
        } 
        //This requests the next animation frame which runs the draw() function again.
        // requestAnimationFrame(draw);
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
          var e = spaneList[orbit_ind2][slider_val2][i] // reads in energy flux value
          totalflux += e; // adds the energy flux to the total flux
          barh = (Math.log10(e) - emin) / (ediff) * (canvas_height - 2*spacingh); // calculates scaled bar height depending on the energy

          // Draws the bar
          ctx.fillStyle = calcColor(i, 1, 32); // calcColor(Math.log10(e), emin, emax);
          ctx.fillRect(marginw+(i-1)*barw, canvas_height-spacingh-barh, barw-marginw, barh);
        }
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect(0, canvas_height-spacingh, canvas_width, spacingh);

        var textw = 335;
        var texth = 36;
        if (sweapUnit == "wacky"){
          textw = 360;
        } 
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
        if (sweapUnit == "metric"){
          ctx.fillText("Total Energy Flux: " + (totalflux/10e6).toFixed(0) + " million electrons/(cm² s ster)", 10, 22);
        } 
        else if (sweapUnit == "imperial"){
          ctx.fillText("Total Energy Flux: " + (totalflux/10e6/2.54/2.54).toFixed(0) + " million electrons/(in² s ster)", 10, 22);
        } 
        else if (sweapUnit == "wacky"){
          ctx.fillText("Total Energy Flux: " + (totalflux/10e6/1.555).toFixed(0) + " million electrons/(eardrum s ster)", 10, 22);
        } 
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
          ctx.fillText("Electron Energy", canvas_width/2, canvas_height-(spacingh/2-4));
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

    //This function draws the canvas for the alphas/ions
    function draw_alphas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (orbit_ind2 >= 1 && orbit_ind2 <= 7) { // only works with orbits 2-8
        var iv = spaniList[orbit_ind2][slider_val2][1].toFixed(1);
        var id = spaniList[orbit_ind2][slider_val2][2].toFixed(2);
        var it = spaniList[orbit_ind2][slider_val2][3].toFixed(0);
        // updates parameters
        ivelocity = iv/15; // Proton velocity
        idensity = id*100; // Proton density
        icolor = calcColor(it, 1000000, 5000000); // Proton color based on temperature

        //This sets the color to draw with.
        ctx.strokeStyle = icolor;

        var diff = Math.abs(idensity - ions.length);
        // Increase the particle amount if below density
        if (ions.length < idensity){   
          while (diff > 0) {
              ions.push(hiddenions.pop());
              diff -= 1;
          }
        }
        // Decrease the particle amount if above density 
        else if (ions.length > idensity){
          while (diff > 0) {
            // if (!(p.x >= 0 && p.x < canvas_width && p.y >= 0 && p.y < canvas_height))
            var p = ions.pop();
            p.px = p.x = Math.random() * canvas_width;
            p.py = p.y = Math.random() * canvas_height;
            hiddenions.push(p);
            diff -= 1;
          }
        }
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
        var textw = 180;
        var texth = 70;
        if (sweapUnit == "wacky"){
          textw = 220;
        }
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
        if (sweapUnit == "metric"){
          ctx.fillText("Velocity: " + (iv*3600).toFixed(0) + " kmph", 10, 56);
          ctx.fillText("Density: " + id + " alphas/cm³", 10, 39);
          ctx.fillText("Temperature: " + (it-273) + " ℃", 10, 22);
        } 
        else if (sweapUnit == "imperial"){
          ctx.fillText("Velocity: " + (iv*3600*0.6214).toFixed(0) + " mph", 10, 56);
          ctx.fillText("Density: " + (id/2.54/2.54/2.54).toFixed(4) + " alphas/in³", 10, 39);
          ctx.fillText("Temperature: " + (((it-273)/5*9)+32).toFixed(0) + " ℉", 10, 22);
        } 
        else if (sweapUnit == "wacky"){
          ctx.fillText("Velocity: Mach " + (iv/0.343).toFixed(0) + "", 10, 56);
          ctx.fillText("Density: " + (id/2.5).toFixed(4) + " alphas/acorn", 10, 39);
          ctx.fillText("Temperature: " + (it/329.817).toFixed(0) + " death valleys", 10, 22);
        } 
        //This requests the next animation frame which runs the draw() function again.
        // requestAnimationFrame(draw);
      } else {
        ctx.fillStyle = 'rgb(217, 54, 0)';
        ctx.font = "24px Montserrat";
        ctx.textAlign = 'center';
        ctx.fillText("DATA ONLY AVAILABLE FOR ORBITS 2-8", canvas_width/2, canvas_height/2);
      }
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
    var dist = (data[6]).toFixed(3).toString() + " AU";
    if (sweapUnit=="metric"){
      var speed = (data[7]*3600).toFixed(0).toString() + " kmph";
    } else if (sweapUnit=="imperial"){
      var speed = (data[7]*3600*0.6214).toFixed(0).toString() + " mph";
    } else if (sweapUnit=="wacky"){
      var speed = "Mach " + (data[7]*2.91545).toFixed(0).toString();
    }
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
      if (orbit_ind2 >= 1 && orbit_ind2 <= 7) { // only data for orbits 2-8
        datetime = spaniList[orbit_ind2][slider_val2][0]; 
      }
      SWEAP.drawAlphas();
    } 
    var spcdateind = spcdateList[orbit_ind2].indexOf(datetime);
    if (spcdateind != -1){ // if the date is found in the spc date list
      var data = spcList[orbit_ind2][spcdateind]; 
      var dist = data[6].toFixed(3).toString() + " AU";
      if (sweapUnit=="metric"){
        var speed = (data[7]*3600).toFixed(0).toString() + " kmph";
      } else if (sweapUnit=="imperial"){
        var speed = (data[7]*3600*0.6214).toFixed(0).toString() + " mph";
      } else if (sweapUnit=="wacky"){
        var speed = "Mach " + (data[7]*2.91545).toFixed(0).toString();
      }
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
      dist = speed = "unknown";
    }
  }
  var yr = datetime.substring(0, 4);
  var mth = datetime.substring(4, 6);
  var day = datetime.substring(6, 8);
  var hr = parseInt(datetime.substring(9, 11));
  var min = datetime.substring(11, 13);
  document.getElementById("datetxt2").innerHTML = mth + "/" + day + "/" + yr;
  document.getElementById("timetxt").innerHTML = formattime(hr, min);

  document.getElementById("disttxt2").innerHTML = "Distance: " + dist;
  document.getElementById("pspspeed").innerHTML = "Speed: " + speed;
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
    if (orbit_ind2 >= 1 && orbit_ind2 <= 7) { // only data for orbits 2-8
      slider2.max = spaniList[orbit_ind2].length - 1; // changes slider range to match indices of the fits data points
    }
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
    document.getElementById("whatisflux").style.display = "none";
    slider2.max = spcList[orbit_ind2].length - 1; // changes slider range to match indices of the fits data points
    var dateind = spcdateList[orbit_ind2].indexOf(datetime);
  } 
  else if (sweapmode == "e") { // Electrons
    document.getElementById("sweapinstrument").style.backgroundImage = "url(public/SPANe_instrument.jpg)";
    document.getElementById("sweapdescription").innerHTML = "Both of the two Solar Probe ANalyzers (SPAN) measure electrons by sorting them into 32 different energy bins. SPAN-A points in the direction that the PSP is traveling, while SPAN-B points the opposite way. Together, their field of view covers almost the entire sky (except for what the heat shield blocks).";
    document.getElementById("whatisflux").style.display = "block";
    slider2.max = spaneList[orbit_ind2].length - 1; // changes slider range to match indices of the fits data points
    var dateind = spanedateList[orbit_ind2].indexOf(datetime);
  } 
  else if (sweapmode == "a") { // Alphas/Ions
    document.getElementById("sweapinstrument").style.backgroundImage = "url(public/SPANi_instrument.jpg)";
    document.getElementById("sweapdescription").innerHTML = "Unlike SPAN-B, SPAN-A measures both electrons & alpha particles (hence why it has 2 cylinder-shaped sensors, while SPAN-B only has one). It is important to note that when we say alphas, we're actually measuring all ions. But most ions in the solar wind are alphas, so here we just call them alphas.";
    document.getElementById("whatisflux").style.display = "none";
    if (orbit_ind2 >= 1 && orbit_ind2 <= 7) { // only data for orbits 2-8
      slider2.max = spaniList[orbit_ind2].length - 1; // changes slider range to match indices of the fits data points
    }
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
var sweapUnit = "metric";
var showSweapUnitDisplay = false;
function sweapUnitDisplay(){ // shows/hides sweap unit controls
  showSweapUnitDisplay = !showSweapUnitDisplay;
  const unitlist = document.querySelectorAll('.sweapunit');
  if (showSweapUnitDisplay){
    unitlist.forEach((el) => el.style.display = "block");
    //unitlist.forEach((el) => el.classList.add('.sweapunitshow'));
  } else {
    unitlist.forEach((el) => el.style.display = "none");
    //unitlist.forEach((el) => el.classList.remove('.sweapunitshow'));
  }
}
function switchSWEAPunit(unitname){
  sweapUnit = unitname;
  update_data2();
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

update_data2();