
let walk = [{x: 250, y: 250, timepoint: 0}],
  generator = d3.randomUniform(-10, 10),
  timepoint = 0;

function update() {
  walk.push({
    x: walk[walk.length - 1].x + generator(),
    y: walk[walk.length - 1].y + generator(),
    timepoint: timepoint
  })
  walk = walk.filter(d => d.timepoint > timepoint - 20)
  timepoint += 1;

  let rw = d3.select("svg")
    .selectAll("rect")
    .data(walk, d => d.timepoint)

  // part (a). Using this selection, append the
  // newly "pushed" walk element to the SVG canvas
  // at the correct location.
  // rw.enter().append("rect")

  // part (b). Using this selection, remove the walk elements that have been
  // filtered away.

  // part (c), bonus. At each timestep, modify the appearance of the rectangels
}

d3.interval(update, 100)
