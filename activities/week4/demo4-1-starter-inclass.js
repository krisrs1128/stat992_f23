
let centers = [];
let u = d3.randomUniform();
console.log(u)

// populate the "centers" array with locations for the smiley faces
for (let i = 0; i < 50; i++) {
  centers.push({
    x: u(),
    y: u(),
  })
}

// select the first smiley face and clone it 50 times
initial = d3.select("#initial")

for (let i = 0; i < 50; i++) {
  initial.clone(true).attrs({
    id: "smiley-" + i,
    transform: "translate(" + 800 * centers[i].x + "," + 400 * centers[i].y + ")"
  })

}
