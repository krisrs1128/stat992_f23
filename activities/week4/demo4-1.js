
let centers = [];
let u = d3.randomUniform();

for (let i = 0; i < 50; i++) {
  centers.push({
    x: 900 * u(),
    y: 500 * u()
  })
}

console.log(centers)

let initial = d3.select("#initial")
for (let i = 0; i < 50; i++ ){
  initial.clone(true).attrs({
      id: "smiley" + i,
      transform: "translate(" + centers[i].x + "," + centers[i].y + ")"
    })

}

d3.mean()
