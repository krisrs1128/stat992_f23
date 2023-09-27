function update_curve(curves, line) {
  // generate random integer 1 to 100

  // bind the current curve of interest and update path
  d3.select("#curves path")
  //.data(...

  // update the all the scatterplot colors
  d3.select("#scatter")
  //.selectAll("...
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
  // every transition_length seconds, call update_curve()
}

let transition_length = 500
Promise.all([
  d3.csv("heart.csv", d3.autoType),
  d3.json("curves.json", d3.autoType),
  d3.csv("conf.csv", d3.autoType)
]).then(visualize)
