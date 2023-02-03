var startdate = new Date('10/3/2022');
var currdate = new Date();
const diffTime = Math.abs(currdate - startdate);
const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 
console.log(diffDays + " days");