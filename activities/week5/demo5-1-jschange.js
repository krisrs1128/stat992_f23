
let circle_ages = [],
  id = 0;

d3.select("body")
  .select("#my_button")
  .on("mousedown", update)

function update() {
  circle_ages = circle_ages.map(d => { return {id: d.id, age: d.age + 1}})
  circle_ages.push({age: 0, id: id});
  circle_ages = circle_ages.filter(d => d.age < 5)
  id += 1;

  let selection = d3.select("svg")
    .selectAll("circle")
    .data(circle_ages, d => d.id)

  selection.enter()
    .append("circle")
    .attrs({
      cx: 0,
      cy: 0
    })

  d3.select("svg")
    .selectAll("circle")
    .transition()
    .duration(1000)
    .attrs({
      cx: d => (900 / 5) * d.age,
      cy: 250
    })

  selection.exit()
    .transition()
    .duration(1000)
    .attr("cy", 500)
    .remove()
}
