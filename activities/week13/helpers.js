
function make_scales() {
  return {
    x: d3.scaleLinear()
      .domain([.95, 15.5])
      .range([0, 400]),
    y: d3.scaleLinear()
      .domain([0, 1])
      .range([250, 20])
  }
}

function draw_axes(scales) {
  let axes = {
    x: d3.axisBottom(scales.x),
    y: d3.axisLeft(scales.y),
  }
  d3.select("#x_axis").call(axes.x)
  d3.select("#y_axis").call(axes.y)
}

function draw_scatter(heart, scales) {
  d3.select("#scatter")
    .selectAll("circle")
    .data(heart).enter()
    .append("circle")
    .attrs({
      cx: d => scales.x(d.ldl),
      cy: d => scales.y(d.chd + .1 * (Math.random() - 0.5)),
      opacity: 0
    })
}

function draw_ribbon(conf, scales) {
  let ribbon = d3.area()
    .x(d => scales.x(d.ldl))
    .y0(d => scales.y(d.lo))
    .y1(d => scales.y(d.hi))

  d3.select("#ribbon")
    .selectAll("path")
    .data([conf]).enter()
    .append("path")
    .attrs({
      d: ribbon
    })
}
