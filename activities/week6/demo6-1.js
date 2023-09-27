
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

let scales = make_scales()

// create the barchart
d3.select("#bars_2000")
  .selectAll("rect")
  .data(countries).enter()
  .append("rect")
  .attrs({
    y: d => scales.bar_y(d.rank_density),
    width: d => scales.bar_x(d.density_2000),
    height: 0.9 * scales.bar_y.bandwidth(),
    fill: "#858483"
  })

d3.select("#bars_2010")
  .selectAll("rect")
  .data(countries).enter()
  .append("rect")
  .attrs({
    y: d => scales.bar_y(d.rank_density),
    width: d => scales.bar_x(d.density_2010),
    height: 0.9 * scales.bar_y.bandwidth(),
    fill: "#da6761"
  })

// create the barchart country labels
d3.select("#bar_labels")
  .selectAll("text")
  .data(countries).enter()
  .append("text")
  .attrs({
    x: -10,
    y: d => scales.bar_y(d.rank_density) + 0.5 * scales.bar_y.bandwidth()
  })
  .text(d => d.country)

// create the scatterplot
d3.select("#circles_2000")
  .selectAll("circle")
  .data(data).enter()
  .append("circle")
  .attrs({
    cx: 0,
    cy: d => scales.slope_y(d.density_2000),
    r: 3,
    fill: "#858483"
  })

d3.select("#circles_2010")
  .selectAll("circle")
  .data(data).enter()
  .append("circle")
  .attrs({
    cx: 200,
    cy: d => scales.slope_y(d.density_2010),
    r: 3,
    fill: "#da6761"
  })

d3.select("#connections")
  .selectAll("line")
  .data(data).enter()
  .append("line")
  .attrs({
    x1: 0,
    x2: 200,
    y1: d => scales.slope_y(d.density_2000),
    y2: d => scales.slope_y(d.density_2010)
  })

let label_data = data.filter(d => d.density_2010 > 19600)

d3.select("#slope_labels_2000")
  .selectAll("text")
  .data(label_data).enter()
  .append("text")
  .attrs({
    x: -10,
    y: d => scales.slope_y(d.density_2000)
  })
  .text(d => `${Math.round(d.density_2000 / 10) / 100} | ${d.city}, ${d.country}`)

d3.select("#slope_labels_2010")
  .selectAll("text")
  .data(label_data).enter()
  .append("text")
  .attrs({
    x: 210,
    y: d => scales.slope_y(d.density_2010)
  })
  .text(d => `${Math.round(d.density_2010 / 10) / 100} | ${d.city}, ${d.country}`)

// create annotation
d3.select("#title")
  .append("text")
  .attrs({ x: 170, y: 40 })
  .text("Urban population density [in 1000 persons/sq. km]")
