
// underlying data objects
console.log(countries)
console.log(data)

// create the scales
function make_scales() {
    return {
      bar_x: d3.scaleLinear()
        .domain([0, 10000])
        .range([0, 200]),
      bar_y: d3.scaleBand()
        .domain(d3.range(1, 19))
        .range([0, 400]),
      slope_y: d3.scaleLinear()
        .domain([0, 35000])
        .range([400, 0])
    }
}

// create the barchart
function initialize_bars(countries, scales, tag, variable, fill_color) {
  d3.select(tag)
    .selectAll("rect")
    .data(countries).enter()
    .append("rect")
    .attrs({
      x: 0,
      y: d => scales.bar_y(d.rank_density),
      width: d => scales.bar_x(d[variable]),
      height: 20,
      fill: fill_color
    })
}

function bar_annotation(countries, scales) {
  d3.select("#bar_labels")
    .selectAll("text")
    .data(countries).enter()
    .append("text")
    .attrs({
      x: -10,
      y: d => scales.bar_y(d.rank_density) + 0.5 * scales.bar_y.bandwidth()
    })
    .text(d => d.country)

  let x_axis = d3.axisBottom(scales.bar_x).ticks(4)
  d3.select("#bar_axes")
    .attr("transform", "translate(0, 400)")
    .call(x_axis);
}

function initialize_circles(data, scales, tag, variable, fill_color, x_coord) {
  d3.select(tag)
    .selectAll("circle")
    .data(data).enter()
    .append("circle")
    .attrs({
      cx: x_coord,
      cy: d => scales.slope_y(d[variable]),
      r: 3,
      fill: fill_color
    })
}

function initialize_links(data, scales, x_min, x_max) {
  d3.select("#connections")
    .selectAll("line")
    .data(data).enter()
    .append("line")
    .attrs({
      x1: x_min,
      x2: x_max,
      y1: d => scales.slope_y(d.density_2000),
      y2: d => scales.slope_y(d.density_2010)
    })
}

function initialize_slope_labels(data, scales, tag, variable, x_coord) {
  d3.select(tag)
    .selectAll("text")
    .data(label_data).enter()
    .append("text")
    .attrs({
      x: x_coord,
      y: d => scales.slope_y(d[variable])
    })
    .text(d => `${Math.round(d[variable] / 10) / 100} | ${d.city}, ${d.country}`)
}

let scales = make_scales()
initialize_bars(countries, scales, "#bars_2010", "density_2010", "#da6761")
initialize_bars(countries, scales, "#bars_2000", "density_2000", "#858483")
bar_annotation(countries, scales)
initialize_circles(data, scales, "#circles_2010", "density_2010", "#da6761", 200)
initialize_circles(data, scales, "#circles_2000", "density_2000", "#858483", 0)
initialize_links(data, scales, 0, 200)

let label_data = data.filter(d => d.density_2010 > 19600)
initialize_slope_labels(label_data, scales, "#slope_labels_2010", "density_2010", 210)
initialize_slope_labels(label_data, scales, "#slope_labels_2000", "density_2000", -10)

// create annotation
d3.select("#title")
  .append("text")
  .attrs({ x: 170, y: 40 })
  .text("Urban population density [in 1000 persons/sq. km]")
