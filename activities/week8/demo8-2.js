

function nest(data) {
  let result = {}

  // Create object of (empty) arrays for each date
  let dates = [... new Set(data.map(d => d.date))]
  for (let i = 0; i < dates.length; i++) {
    result[dates[i]] = []
  }

  // append to the array for each date
  for (let i = 0; i < data.length; i++) {
    result[data[i].date].push(data[i])
  }

  return Object.values(result)
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

function draw_lines(nested, scales) {
  let path_generator = d3.line()
    .x(d => scales.x(d.hour))
    .y(d => scales.y(d.pollution))

  d3.select("#lines")
    .selectAll("path")
    .data(nested).enter()
    .append("path")
    .attrs({
      class: "plain",
      d: path_generator
    })
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
  setup_brush(scales)
}

function setup_brush(scales) {
  let brush = d3.brush().on("brush", (ev) => update_series(ev, scales))
  d3.select("#brush").call(brush)
}

function update_series(ev, scales) {
  d3.selectAll("path")
    .attr("class", d => check_any(d, ev.selection, scales) ? "highlight" : "plain")
}

function check_any(d, window, scales) {
  if (d === null) return false;

  for (let i = 0; i < d.length; i++) {
    if (scales.x(d[i].hour) > window[0][0] &
        scales.y(d[i].pollution) > window[0][1] &
        scales.x(d[i].hour) < window[1][0] &
        scales.y(d[i].pollution) < window[1][1]) {
          return true;
    }
  }
  return false;
}

d3.csv("pollution.csv", d3.autoType)
  .then(visualize)
