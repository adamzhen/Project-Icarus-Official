var canvas_width = 1000; 
var canvas_height = 300;
var sunradius = 10; //The radius of the sun

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

var points = [];
for (var i = 0; i < 2*Math.PI; i+=Math.PI/20){
  var theta = i;
  var radius = maxradius(theta);
  var x = radius*Math.cos(theta);
  var y = radius*Math.sin(theta);
  points.push([x,y]);
  points.sort();
  console.log(theta/Math.PI*180, radius);
}
//console.log(points);