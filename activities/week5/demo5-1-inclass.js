``
let circle_ages = [],
  id = 0;

function update() {
  circle_ages = circle_ages.map(d => { return {id: d.id, age: d.age + 1}})
  circle_ages.push({id: id, age: 0});
  circle_ages = circle_ages.filter(d => d.age < 5)
  id += 1;

  // enter new array elements as circles
  selection = d3.select("svg")
    .selectAll("circle")
    .data(circle_ages, d => d.id)

  selection.enter()
    .append("circle")

  // update locations of changed array elements (new ages)
  d3.selectAll("circle")
    .transition()
    .attrs({
      cx: (d) => 150 * d.age,
      cy: 200
    })

  selection.exit().remove()


  // remove circles that have been filtered away
}
