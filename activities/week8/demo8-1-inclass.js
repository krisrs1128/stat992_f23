

function nest(data) {
  let result = {}
  let dates = data.map(d => d.date)
  for (let i = 0; i < dates.length; i++) {
    result[dates[i]] = [];
  }

  for (let i = 0; i < data.length; i++) {
    result[data[i].date].push(data[i])
  }

  // fill this in
  return Object.values(result)
}

function draw_lines(nested, scales) {
  let line_generator = d3.line()
    .x(d => scales.x(d.hour))
    .y(d => scales.y(d.pollution))

  d3.select("#lines")
    .selectAll("path")
    .data(nested).enter()
    .append("path")
    .attrs({
      d: line_generator
    });
}

function make_scales(data, margin) {
  return {
    x: d3.scaleLinear()
      .domain([0, 23])
      .range([margin.left, 500 - margin.right]),
    y: d3.scaleLinear()
      .domain(d3.extent(data.map(d => d.pollution)))
      .range([300 - margin.bottom, margin.top])
  }
}

function draw_axes(scales, margin) {
  let x_axis = d3.axisBottom(scales.x)
  d3.select("#x_axis")
    .attr("transform", `translate(0, ${300 - margin.bottom})`)
    .call(x_axis)

  let y_axis = d3.axisLeft(scales.y)
  d3.select("#y_axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(y_axis)
}

function visualize(data) {
  let margin = {top: 10, right: 10, bottom: 20, left: 50}
  let nested = nest(data)
  let scales = make_scales(data, margin)
  draw_lines(nested, scales)
  draw_axes(scales, margin)
}

d3.csv("pollution.csv", d3.autoType)
  .then(visualize)
