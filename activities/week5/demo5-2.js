
let width = 900,
  height = 500;
let circles = [];
let generator = d3.randomUniform(-1, 1);
let connections = [];

for (let i = 0; i < 100; i++) {
  circles.push({
    x: width * generator(),
    y: height * generator(),
    vx: 0,
    vy: 0
  })
}

d3.select("svg")
  .selectAll("circle")
  .data(circles).enter()
  .append("circle")

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

  connections = []
  for (let i = 0; i < circles.length; i++) {
    for (let j = 0; j <= i; j++) {
      let dist = (circles[i].x - circles[j].x) ** 2 + (circles[i].y - circles[j].y) ** 2
      if (dist < 50 ** 2) {
        connections.push({id: `{i}-{j}`, i: i, j: j})
      }
    }
  }

  d3.select("svg")
    .selectAll("circle")
    .data(circles)
    .attrs({
      cx: d => d.x,
      cy: d => d.y
    })

  connections_selection = d3.select("svg")
    .selectAll("line")
    .data(connections, d => d.id)

  connections_selection.enter()
    .append("line")
    .attrs({
      x1: d => circles[d.i].x,
      x2: d => circles[d.j].x,
      y1: d => circles[d.i].y,
      y2: d => circles[d.j].y
    })
  connections_selection.exit().remove()
}

d3.interval(update, 50);
