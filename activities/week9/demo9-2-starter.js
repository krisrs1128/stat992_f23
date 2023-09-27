
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
      r: d => 10 * Math.exp(-.5 * d.depth), // decreasing sizes
      transform: "translate(0, 10)",
      fill: "#A0C3D9",
    })

  // Use d3.Delaunay to delineate the nearest neighborhoods of each node
  // Create a mouseover event listener to run each time the mouse is moved
}

function focus_ids(cur_node) {
  // get the IDs of the ancestor nodes
  // get the IDs of the descendants
  // concatenate them together
}

function update(ev, neighborhoods, tree) {
  // Use the delaunay neighborhoods to figure out the currently selected node
  // Get the ancestor and descendant IDs around the current node using the
  // .ancestors() and .descendants() methods on the stratified JS

  d3.select("#tree")
    .selectAll("circle")
    .transition().duration(100)
    //.attrs({
    // set the fill so that the highlighted nodes are a different color
    //})

  d3.select("#tree")
    .selectAll("path")
    .transition().duration(100)
    // Change the path width depending on the selection
    //.attr(...)

  d3.select("#labels")
    .selectAll("text")
    //.text(cur_node.id)
    //.attr("transform", `translate(${cur_node.x}, ${cur_node.y})`)
}


d3.json("https://raw.githubusercontent.com/krisrs1128/stat679_code/main/examples/week9/week9-1/flare.json")
  .then(visualize)
