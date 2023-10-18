
// underlying data objects
console.log(countries)
console.log(data)

// create the scales
function make_scales() {
  return {
    bar_y: d3.scaleBand()
      .domain(d3.range(1, 19))
      .range([100, 500]),
    bar_x: d3.scaleLinear()
      .domain([0, 10500])
      .range([0, 250]),
    circle_y: d3.scaleLinear()
    .domain([0, 10500])
    .range([500, 300])
  }
}

let scales = make_scales();

// create the barchart
d3.select("#bars_2010")


// create the barchart country labels
d3.select("#bar_labels")
  .selectAll("text")
  .data(countries).enter()
  .append("text")
  .attrs({
    x: 0,
    y: d => scales.bar_y(d.rank_density)
  })
  .text(d => d.country)

// create the barchart
for (const year of [2000, 2010]) {
  d3.select(`#bars_${year}`)
    .selectAll("rect")
    .data(countries).enter()
    .append("rect")
    .attrs({
      x: 15, 
      y: d => scales.bar_y(d.rank_density) - 0.5 * scales.bar_y.bandwidth(),
      width: d => scales.bar_x(d[`density_${year}`]),
      height: scales.bar_y.bandwidth()
    })
}


// create the scatterplot
for (const year of [2000, 2010]) {
  d3.select(`#circles_${year}`)
    .selectAll("circle")
    .data(data).enter()
    .append("circle")
    .attrs({
      cx: year == 2000 ? 0 : 350,
      cy: d => scales.circle_y(d[`density_${year}`]),
      r: 2
    })
}



// draw the slope lines


// create a plot title