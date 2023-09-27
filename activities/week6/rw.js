
let walk = [{x: 250, y: 250}],
  generator = d3.randomUniform(-10, 10);

function update() {
  walk[0].x += generator()
  walk[0].y += generator()

  d3.selectAll("rect")
    .attrs({
      x: d => d.x,
      y: d => d.y
    })
}

d3.select("svg")
  .append("rect")
  .selectAll("rect")
  .data(walk).enter()
  .append("rect")
  .attrs({
    x: 250,
    y: 250,
    width: 10,
    height: 10
  })

d3.interval(update, 100)
