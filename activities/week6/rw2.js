
let walk = [{x: 250, y: 250, timepoint: 0}],
  generator = d3.randomUniform(-10, 10),
  timepoint = 0;

function update_walk_data(walk, timepoint) {
  walk.push({
    x: walk[walk.length - 1].x + generator(),
    y: walk[walk.length - 1].y + generator(),
    timepoint: timepoint
  })
  return walk.filter(d => d.timepoint > timepoint - 20)
}

function update() {
  timepoint += 1;
  walk = update_walk_data(walk, timepoint)

  let rw = d3.select("svg")
    .selectAll("rect")
    .data(walk, d => d.timepoint)

  rw.exit().remove();
  rw.enter().append("rect")
    .attrs({
      x: d => d.x,
      y: d => d.y,
      width: 10,
      height: 10
    })

  d3.select("svg")
    .selectAll("rect").attrs({
      opacity: d => 1 + 0.05 * (d.timepoint - timepoint)
    })
}

d3.interval(update, 100)
