
function setup_simulation(data) {
  let [nodes, links] = data
  let simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id)) // attracts nodes
    .force("charge", d3.forceManyBody().strength(-10)) // repels nodes
    .force("center", d3.forceCenter(300, 300)) // center of the canvas

  return [simulation, nodes, links]
}

function initialize_graph(nodes, links, scales) {
  scales = make_scales()
  d3.select("#nodes")
    .selectAll("circle")
    .data(nodes).enter()
    .append("circle")
    .attrs({
      cx: d => d.x,
      cy: d => d.y,
      r: 3,
      fill: d => scales.fill(d.political_ideology)
    })

  d3.select("#links")
    .selectAll("line")
    .data(links).enter()
    .append("line")
    .attrs({
      x1: d => d.source.x,
      x2: d => d.target.x,
      y1: d => d.source.y,
      y2: d => d.target.y
    })
}

function ticked(nodes, neighbor_arrays) {
}

function update_neighbors() {
}

function visualize(data) {
  let [simulation, nodes, links] = setup_simulation(data)
  neighbor_arrays = neighborhoods(nodes, links)

  initialize_graph(nodes, links)
  simulation.on("tick", _ => ticked(nodes, neighbor_arrays))
}

let transition_length = 500
Promise.all([
  d3.csv("political-books-nodes.csv", d3.autoType),
  d3.csv("political-books-edges.csv", d3.autoType)
]).then(visualize)
