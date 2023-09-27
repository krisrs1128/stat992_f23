
let circle_ages = [],
  id = 0;

function update() {
  circle_ages = circle_ages.map(d => { return {id: d.id, age: d.age + 1}})
  circle_ages.push({age: 0, id: id});
  circle_ages = circle_ages.filter(d => d.age < 5)
  id += 1;
}
