
let width = 900,
  height = 500;
let circles = [];
let generator = d3.randomUniform(-1, 1);

for (let i = 0; i < 100; i++) {
  circles.push({
    x: width * Math.abs(generator()), // initial x coordinate
    y: height * Math.abs(generator()), // initial y coordinate
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

function distance(u, v) {
  return ((u.x - v.x) ** 2 + (u.y - v.y) ** 2)
}

function update() {
  for (let i = 0; i < circles.length; i++) {
    circles[i].x += circles[i].vx
    circles[i].y += circles[i].vy
    circles[i].vx += generator() - 0.01 * circles[i].vx
    circles[i].vy += generator() - 0.01 * circles[i].vy
    circles[i] = wrap_around(circles[i])
  }

  d3.selectAll("circle")
    .attrs({
      cx: d => d.x,
      cy: d => d.y
    })

  let edges = []
  for (i = 0; i < circles.length; i++) {
    for (j = 0; j < i; j++) {
      if (distance(circles[i], circles[j]) < 50 ** 2) {
        edges.push({
          i: i,
          j: j,
          id: `{i}-{j}`
        })
      }
    }
  }

  selection = d3.select("svg")
    .selectAll("line")
    .data(edges, d => d.id)
    
   selection.enter().append("line")

  d3.selectAll("line")
    .attrs({
      x1: (d) => circles[d.i].x,
      y1: (d) => circles[d.i].y,
      x2: (d) => circles[d.j].x,
      y2: (d) => circles[d.j].y,
      stroke: "black",
      "stroke-width": 2.
    })

    //selection.exit().remove()
}

d3.select("svg")
  .selectAll("circle")
  .data(circles).enter()
  .append("circle")
  .attrs({
    cx: d => d.x,
    cy: d => d.y,
    r: 20
  })

  d3.interval(update, 500)