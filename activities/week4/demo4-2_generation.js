
let generator = d3.randomNormal();
let circles = d3.range(20).map(d => { return {x: 80 + 50 * generator(), y: 200 + 50 * generator()} })

d3.select("#group_part_e")
  .selectAll("circle")
  .data(circles).enter()
  .append("circle")
  .attrs({
    cx: d => d.x,
    cy: d => d.y,
    r: 10
  })

circles = d3.range(80).map(d => { return {x: 80 + 50 * generator(), y: 200 + 50 * generator()} })
d3.select("#other_circles")
  .selectAll("circle")
  .data(circles).enter()
  .append("circle")
  .attrs({
    cx: d => d.x,
    cy: d => d.y,
    r: 3
  })


let squares = d3.range(80).map(d => { return {x: 400 + 90 * generator(), y: 300 + 20 * generator()} })
d3.select("#squares")
  .selectAll("rect")
  .data(squares).enter()
  .append("rect")
  .attrs({
    x: d => d.x,
    y: d => d.y,
    width: d => 3 + Math.abs(10 * generator()),
    height: d => 3 + Math.abs(10 * generator()),
    class: (d, i) => i < 20 ? "part_d" : "other"
  })
