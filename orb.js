var canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d'),
  requestAnimationFrame = window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

var WIDTH = document.documentElement.clientWidth*0.985,
  HEIGHT = document.documentElement.clientHeight*0.93;

canvas.setAttribute("width", WIDTH);
canvas.setAttribute("height", HEIGHT);

var
  body,
  lines = [],
  totalTentacles = 60;

function Line(x, y) {
  this.x = WIDTH/2;
  this.y = HEIGHT/2;

  this.endAngle = Math.floor(Math.random() * 360);
  this.endSpeed = (Math.floor(Math.random() * 10) + 1) / 50;
  this.endDir = Math.floor(Math.random() * 2) == 0 ? -1 : 1;
  this.endChangeFreq = Math.floor(Math.random() * 200) + 1;

  this.c1Angle = Math.floor(Math.random() * 360);
  this.c1Speed = (Math.floor(Math.random() * 10) + 1) / 20;
  this.c1Dir = Math.floor(Math.random() * 2) == 0 ? -1 : 1;
  this.c1ChangeFreq = Math.floor(Math.random() * 200) + 1;

  this.c2Angle = Math.floor(Math.random() * 360);
  this.c2Speed = (Math.floor(Math.random() * 10) + 1) / 20;
  this.c2Dir = Math.floor(Math.random() * 2) == 0 ? -1 : 1;
  this.c2ChangeFreq = Math.floor(Math.random() * 200) + 1;

  this.c1;
  this.end;
  this.c2;
  this.color = "rgba(43, 205, 255, .15)";
  this.width = 2;
  this.definePoints();
  this.draw();
  this.startTime = new Date().getTime(); // capture the creation time
}

function easeInOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
  if ((currentIteration /= totalIterations / 2) < 1) {
    return changeInValue / 2 * Math.pow(currentIteration, 3) + startValue;
  }
  return changeInValue / 2 * (Math.pow(currentIteration - 2, 3) + 2) + startValue;
}

Line.prototype.move = function() {

  this.endChangeFreq--;
  if (this.endChangeFreq == 0) {
    this.endDir *= -1;
    this.endChangeFreq = Math.floor(Math.random() * 200) + 1;
  }

  this.c1ChangeFreq--;
  if (this.c1ChangeFreq == 0) {
    this.c1Dir *= -1;
    this.c1ChangeFreq = Math.floor(Math.random() * 200) + 1;
  }

  this.c2ChangeFreq--;
  if (this.c2ChangeFreq == 0) {
    this.c2Dir *= -1;
    this.c2ChangeFreq = Math.floor(Math.random() * 200) + 1;
  }
  var currentTime = new Date().getTime();
  var elapsed = currentTime - this.startTime;
  var alpha = Math.sin(elapsed / 1000 * Math.PI);  // Calculate alpha between 0 and 1, 4000 ms (or 4 sec) for a full cycle

  if (alpha < 0) alpha = 0; // clip the lower bound

  this.c1Angle = this.c1Angle + this.c1Dir * this.c1Speed;
  this.c2Angle = this.c2Angle + this.c2Dir * this.c2Speed;
  this.endAngle = this.endAngle + this.endDir * this.endSpeed;
  this.definePoints();
  this.draw();
}

Line.prototype.definePoints = function() {
    this.c1 = aroundPoint(this.x, this.y, 150, this.c1Angle);  // was 150
    this.end = aroundPoint(this.x, this.y, 275, this.endAngle);  // was 225
    this.c2 = aroundPoint(this.end.x, this.end.y, 150, this.c2Angle);  // was 150
}

Line.prototype.draw = function() {
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  ctx.bezierCurveTo(this.c1.x, this.c1.y, this.c2.x, this.c2.y, this.end.x, this.end.y);
  ctx.strokeStyle = this.color;
  ctx.lineWidth = this.width;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.closePath();
}

function aroundPoint(x, y, dist, ang) {
  var point = [];
  var angle = degToRad(ang);
  point.x = x + Math.cos(angle) * dist;
  point.y = y + Math.sin(angle) * dist;
  return point;
}

function degToRad(deg) {
  return deg * (Math.PI / 180);
}

function init() {
  ctx.shadowColor = "rgba(43, 205, 255, 1)";
  ctx.shadowBlur = 10;
  for (var i = 0; i <= totalTentacles - 1; i++) {
    lines[lines.length] = new Line();
  }
  animate();
}
init();

function animate() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
 

  for (var i in lines) {
    lines[i].move();
  }
  requestAnimationFrame(animate);
}

// let lastRenderTime = Date.now();
// const renderInterval = 50; // Time in milliseconds

// function animate() {
//     let currentTime = Date.now();
//     if (currentTime - lastRenderTime >= renderInterval) {
//         ctx.clearRect(0, 0, WIDTH, HEIGHT);
//         for (var i in lines) {
//             lines[i].move();
//         }
//         lastRenderTime = currentTime;
//     }
//     requestAnimationFrame(animate);
// }