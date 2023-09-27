let penguins = [{"species":"Adelie","island":"Torgersen","bill_length_mm":39.1,"bill_depth_mm":18.7,"flipper_length_mm":181,"body_mass_g":3750,"sex":"male","year":2007},{"species":"Adelie","island":"Torgersen","bill_length_mm":39.5,"bill_depth_mm":17.4,"flipper_length_mm":186,"body_mass_g":3800,"sex":"female","year":2007},{"species":"Adelie","island":"Torgersen","bill_length_mm":40.3,"bill_depth_mm":18,"flipper_length_mm":195,"body_mass_g":3250,"sex":"female","year":2007},{"species":"Adelie","island":"Torgersen","bill_length_mm":36.7,"bill_depth_mm":19.3,"flipper_length_mm":193,"body_mass_g":3450,"sex":"female","year":2007},{"species":"Adelie","island":"Torgersen","bill_length_mm":39.3,"bill_depth_mm":20.6,"flipper_length_mm":190,"body_mass_g":3650,"sex":"male","year":2007},{"species":"Adelie","island":"Torgersen","bill_length_mm":38.9,"bill_depth_mm":17.8,"flipper_length_mm":181,"body_mass_g":3625,"sex":"female","year":2007},{"species":"Adelie","island":"Torgersen","bill_length_mm":39.2,"bill_depth_mm":19.6,"flipper_length_mm":195,"body_mass_g":4675,"sex":"male","year":2007}]

let penguins2 = {"species":["Adelie","Adelie","Adelie","Adelie","Adelie","Adelie","Adelie"],"island":["Torgersen","Torgersen","Torgersen","Torgersen","Torgersen","Torgersen","Torgersen"],"bill_length_mm":[39.1,39.5,40.3,36.7,39.3,38.9,39.2],"bill_depth_mm":[18.7,17.4,18,19.3,20.6,17.8,19.6],"flipper_length_mm":[181,186,195,193,190,181,195],"body_mass_g":[3750,3800,3250,3450,3650,3625,4675],"sex":["male","female","female","female","male","female","male"],"year":[2007,2007,2007,2007,2007,2007,2007]}

// part (b)
let mean = d3.mean(penguins2["flipper_length_mm"])
console.log(mean)

// part (c), approach 1
let result = [];
for (let i = 0; i < penguins.length; i++) {
  result.push(penguins[i].flipper_length_mm > 187)
}
console.log(result)

// part (c), approach 2
result = penguins.map(d => d.flipper_length_mm > 187)
console.log(result)
