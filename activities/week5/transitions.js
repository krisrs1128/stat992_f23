
// correctly chains transitions
d3.select("svg")
  .select("#my_circle")
  .transition()
  .duration(1000)
  .attrs({ cx: 10, cy: 10, r: 10 })
  .transition()
  .duration(1000)
  .attrs({ cx: 250, cy: 50, r: 50, fill: "red"})
