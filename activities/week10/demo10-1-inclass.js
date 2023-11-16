
function radius(depth) {
  return 10 * Math.exp(-.5 * depth)
}

function make_tree(data) {
  data["edges"].push({to: "flare", from: null});
  let stratifier = d3.stratify()
    .id(d => d.to)
    .parentId(d => d.from),
  tree_gen = d3.tree()
    .size([600, 350]);

  return tree_gen(stratifier(data["edges"]));
}

function visualize(data) {
  tree = make_tree(data);
  let link_gen = d3.linkVertical()
    .x(d => d.x)
    .y(d => d.y);

  d3.select("#tree")
    .selectAll("path")
    .data(tree.links()).enter()
    .append("path")
    .attrs({
      d: link_gen,
      transform: "translate(0, 10)", // so doesn't go off page
      "stroke-width": 0.05
    })

  d3.select("#tree")
    .selectAll("circle")
    .data(tree.descendants()).enter()
    .append("circle")
    .attrs({
      cx: d => d.x,
      cy: d => d.y,
      r: d => radius(d.depth), // decreasing sizes
      transform: "translate(0, 10)",
      fill: "#A0C3D9",
    })

    let neighborhoods = d3.Delaunay.from(tree.descendants().map(d => [d.x, d.y]))
    d3.select("svg")
      .on("mousemove", (ev) => update(ev, neighborhoods, tree))
  // Use d3.Delaunay to delineate the nearest neighborhoods of each node
  // Create a mouseover event listener to run each time the mouse is moved
}

function focus_ids(cur_node) {
  let ancestors = cur_node.ancestors().map(d => d.id)
  let descendants = cur_node.descendants().map(d => d.id)
  return ancestors.concat(descendants)
}

function update(ev, neighborhoods, tree) {
  let pos = d3.pointer(ev)
  let ix = neighborhoods.find(pos[0], pos[1])
  let cur_node = tree.descendants()[ix]
  let relatives = focus_ids(cur_node)

  d3.select("#tree")
    .selectAll("circle")
    .transition().duration(100)
    .attrs({
      fill: d => relatives.indexOf(d.id) == -1 ? "#A0C3D9" : "black",
      r: d => relatives.indexOf(d.id) == -1 ? radius(d.depth) : 2 * radius(d.depth)
    })

  d3.select("#tree")
    .selectAll("path")
    .transition().duration(100)
    .attrs({
      "stroke-width": d => relatives.indexOf(d.target.id) == -1 ? 0.05 : 5
    })

  d3.select("#labels")
    .selectAll("text")
    .text(cur_node.id)
    .attr("transform", `translate(${10 + cur_node.x}, ${cur_node.y})`)
}


d3.json("https://raw.githubusercontent.com/krisrs1128/stat679_code/main/examples/week9/week9-1/flare.json")
  .then(visualize)
