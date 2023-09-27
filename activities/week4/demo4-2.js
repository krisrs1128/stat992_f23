
// part (b)
d3.select("#part_c")
  .transition()
  .attrs({
    cx: 100,
    cy: 100
  })

d3.selectAll(".part_d")
  .attr("fill", "red")

d3.selectAll("#group_part_e .part_e")
  .attr("fill", "black")
  .transition()
  .duration(2000)
  .attr("fill", "red")
