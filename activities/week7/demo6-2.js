
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
  svg.select(tag)
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
    .on("mouseover", (ev, d) => update_slopes(ev, d))
}

function bar_annotation(countries, scales) {
  svg.select("#bar_labels")
    .selectAll("text")
    .data(countries).enter()
    .append("text")
    .attrs({
      x: -10,
      y: d => scales.bar_y(d.rank_density) + 0.5 * scales.bar_y.bandwidth()
    })
    .text(d => d.country)

  let x_axis = d3.axisBottom(scales.bar_x).ticks(4)
  svg.select("#bar_axes")
    .attr("transform", "translate(0, 400)")
    .call(x_axis);
}

function initialize_circles(data, scales, tag, variable, fill_color, x_coord) {
  svg.select(tag)
    .selectAll("circle")
    .data(data).enter()
    .append("circle")
    .attrs({
      cx: x_coord,
      cy: d => scales.slope_y(d[variable]),
      r: 3,
      fill: fill_color
    })
    .on("mouseover", highlight_city)
}

function initialize_links(data, scales, x_min, x_max) {
  svg.select("#connections")
    .selectAll("line")
    .data(data).enter()
    .append("line")
    .attrs({
      x1: x_min,
      x2: x_max,
      y1: d => scales.slope_y(d.density_2000),
      y2: d => scales.slope_y(d.density_2010)
    })
    .on("mouseover", highlight_city)
}

function initialize_slope_labels(data, scales, tag, variable, x_coord) {
  svg.select(tag)
    .selectAll("text")
    .data(label_data).enter()
    .append("text")
    .attrs({
      x: x_coord,
      y: d => scales.slope_y(d["density_2000"])
    })
    .text(d => `${Math.round(d["density_2000"] / 10) / 100} | ${d.city}, ${d.country}`)
}

function slope_highlights(d) {
  svg.select("#connections")
    .selectAll("line")
    .attrs({
      opacity: e => e.country == d.country ? 0.4 : 0.05,
      "stroke-width": e => e.country == d.country ? 1 : 0.2
    })
  for (const tag of ["#circles_2000", "#circles_2010"]) {
    svg.select(tag)
      .selectAll("circle")
      .attrs({
        opacity: e => e.country == d.country ? 1 : 0.2,
        r: e => e.country == d.country ? 3 : 1
      })
  }
}

function update_slopes(ev, d) {
  label_data = data.filter(e => e.country == d.country)
  label_redraw("#slope_labels_2000", label_data, -10, "density_2000")
  label_redraw("#slope_labels_2010", label_data, 210, "density_2010")
  slope_highlights(d)
}

function label_redraw(tag, label_data, x, field) {
  let selection = svg.select(tag)
    .selectAll("text")
    .data(label_data, d => d.city)

  selection.exit().remove();
  selection.enter()
    .append("text")
    .attrs({
      x: x,
      y: d => scales.slope_y(d[field])
    })
    .text(d => `${Math.round(d[field]/ 10) / 100} | ${d.city}, ${d.country}`)
}

function highlight_city(ev, d) {
  label_data = data.filter(e => e.city == d.city)
  label_redraw("#slope_labels_2000", label_data, -10, "density_2000")
  label_redraw("#slope_labels_2010", label_data, 210, "density_2010")

  svg.select("#connections")
    .selectAll("line")
    .attrs({
      opacity: e => e.city == d.city ? 0.4 : 0.05,
      "stroke-width": e => e.city == d.city ? 1 : 0.2
    })
}

// Create tags that had been in the HTML page before... could probably have put
// each "append" step into a function
svg.append("g").attr("id", "title")
svg.append("g").attrs({
    id: "slope",
    transform: "translate(200, 50)"
  })
  .append("g")
  .attr("id", "slope_labels_2000")

svg.append("g").attrs({
    id: "barchart",
    transform: "translate(700, 0)"
  })

svg.select("#slope")
  .append("g")
  .attr("id", "slope_labels_2010")

svg.select("#slope")
  .append("g")
  .attr("id", "connections")

svg.select("#slope")
  .append("g")
  .attr("id", "circles_2000")

svg.select("#slope")
  .append("g")
  .attr("id", "circles_2010")

svg.select("#barchart")
  .append("g")
  .attr("id", "bars_2000")

svg.select("#barchart")
  .append("g")
  .attr("id", "bars_2010")

svg.select("#barchart")
  .append("g")
  .attr("id", "bar_labels")

svg.select("#barchart")
  .append("g")
  .attr("id", "bar_axes")

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
svg.select("#title")
  .append("text")
  .attrs({ x: 170, y: 40 })
  .text("Urban population density [in 1000 persons/sq. km]")
