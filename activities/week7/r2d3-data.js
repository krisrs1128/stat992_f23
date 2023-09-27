
let scales = {
  x: d3.scaleLinear()
    .domain(d3.extent(data, d => d.bill_length_mm))
    .range([0, 300]),
  y: d3.scaleLinear()
    .domain(d3.extent(data, d => d.bill_depth_mm))
    .range([0, 300])
}

svg.selectAll("circle")
  .data(data).enter()
  .append("circle")
  .attrs({
    cx: d => scales.x(d.bill_length_mm),
    cy: d => scales.y(d.bill_depth_mm),
    r: 5
  })
