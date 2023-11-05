// global brushes arrays
let brushes = [],
  scales;

function nest(data) {
  let result = {}

  // Create object of (empty) arrays for each date
  let dates = data.map(d => d.date)
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
  scales = make_scales(data, margin)
  draw_lines(nested, scales)
  draw_axes(scales, margin)
  new_brush()
}

function update_series() {
  d3.select("#lines")
    .selectAll("path")
    .attr("class", d => check_all(d, scales) ? "highlight" : "plain")
}

function check_any(d, scales, window) {
  // check whether any points along one series fall into a single brush
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

function check_all(d, scales) {
  for (let i = 0; i < brushes.length; i++) {
    brush = d3.select(`#brush-${i}`).node()
    current_window = d3.brushSelection(brush)
    if(current_window !== null && (!check_any(d, scales, current_window))) {
      return false;
    }
  }
  return true;
}

function new_brush() {
  let brush = d3.brush()
    .on("brush", update_series)
    .on("end", brushend)

  brushes.push(brush)

  d3.select("#brushes")
    .insert("g", "g")
    .attr("id", `brush-${brushes.length - 1}`)
    .call(brush)

  function brushend(ev) {
    brush = d3.select(`#brush-${brushes.length - 1}`).node()
    current_window = d3.brushSelection(brush)
    console.log(current_window)
    if (current_window ==! null) {
      new_brush()
    }
  }

  // remove pointer events from the overlay except for the most recent brush
  for (let i = 0; i < brushes.length; i++) {
    d3.select(`#brush-${i}`)
      .select(".overlay")
      .style("pointer-events", i < brushes.length - 1 ? "none" : "all")
  }
}

d3.csv("pollution.csv", d3.autoType)
  .then(visualize)
