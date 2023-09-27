
let width = 900,
  height = 500;
let circles = [];
let generator = d3.randomUniform(-1, 1);

for (let i = 0; i < 100; i++) {
  circles.push({
    x: width * generator(), // initial x coordinate
    y: height * generator(), // initial y coordinate
    vx: 0, // initial velocity in x direction
    vy: 0 // initial velocy in y direction
  })
}

// updating functions
function wrap_around(circle) {
  if (circle.x <= 0) {
    circle.x += width;
  }
  if (circle.y <= 0) {
    circle.y += height;
  }
  circle.x = circle.x % width
  circle.y = circle.y % height
  return circle
}

function update() {
  for (let i = 0; i < circles.length; i++) {
    circles[i].x += circles[i].vx
    circles[i].y += circles[i].vy
    circles[i].vx += generator() - 0.01 * circles[i].vx
    circles[i].vy += generator() - 0.01 * circles[i].vy
    circles[i] = wrap_around(circles[i])
  }
}
