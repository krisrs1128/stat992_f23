
let circle_ages = [],
  id = 0;

function update() {
  circle_ages = circle_ages.map(d => { return {id: d.id, age: d.age + 1}})
  circle_ages.push({age: 0, id: id});
  circle_ages = circle_ages.filter(d => d.age < 5)
  id += 1;

  d3.select("svg")
    .selectAll("circle")
    .data(circle_ages, d => d.id)
    .join(
        enter => enter.append("circle").attrs({cx: 0, cy: 0}),
        update => update.call(
          u => u.transition().attrs({
            cx: d => (900 / 5) * (d.age - 1),
            cy: 250
          })
        ),
        exit => exit.call(u => u.transition().attr("cy", 500).remove())
    )
}
