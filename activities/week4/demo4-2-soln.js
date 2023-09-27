
// part (b)
d3.selectAll("circle")
  .attr("fill", "blue")

d3.select("#part_c")
  .attrs({
    cx: 100,
    cx: 100
  })

// part (c)
d3.selectAll(".part_d")
  .attr("fill", "red")

d3.select("#group_part_e")
  .selectAll(".part_e")
  .attr("fill", "red")
