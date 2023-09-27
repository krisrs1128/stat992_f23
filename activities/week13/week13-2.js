function update_curve(curves, line) {
  let generator = d3.randomInt(1, 100)
  let ix = generator().toString()

  d3.select("#curves path")
    .data([curves[ix].curve])
    .transition().duration(transition_length)
    .attrs({d : line})

  d3.select("#scatter")
    .selectAll("circle")
    .transition().duration(transition_length)
    .attrs({
      opacity: 1,
      fill: (d, i) => curves[ix].ids.indexOf(i) == -1 ? "#A7EBF2" : "#F26A4B"
    })
}

function visualize(data) {
  let [heart, curves, conf] = data
  let scales = make_scales();

  draw_axes(scales)
  draw_scatter(heart, scales)
  draw_ribbon(conf, scales)

  let line = d3.line()
    .x(d => scales.x(d.ldl))
    .y(d => scales.y(d.y_hat))

  d3.select("#curves").append("path")
  update_curve(curves, line)
  d3.interval(() => update_curve(curves, line), transition_length)
}

let transition_length = 500
Promise.all([
  d3.csv("heart.csv", d3.autoType),
  d3.json("curves.json", d3.autoType),
  d3.csv("conf.csv", d3.autoType)
]).then(visualize)
