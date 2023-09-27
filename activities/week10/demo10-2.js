
function setup_simulation(data) {
  let [nodes, links] = data
  let simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id)) // attracts nodes
    .force("charge", d3.forceManyBody().strength(-8)) // repels nodes
    .force("center", d3.forceCenter(300, 300)) // center of the canvas

  return [simulation, nodes, links]
}

function visualize(data) {
  let [simulation, nodes, links] = setup_simulation(data)
  n_array = neighborhoods(nodes, links)

  initialize_graph(nodes, links)
  simulation.on("tick", _ => ticked(nodes))
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

function ticked(nodes) {
  d3.select("#nodes")
    .selectAll("circle")
    .attrs({
      cx: d => d.x,
      cy: d => d.y,
    })

  d3.select("#links")
    .selectAll("line")
    .attrs({
      x1: d => d.source.x,
      x2: d => d.target.x,
      y1: d => d.source.y,
      y2: d => d.target.y
    })

  voronoi = d3.Delaunay.from(nodes.map(d => [d.x, d.y]))
  d3.select("#hover").on("mousemove", ev => update_neighbors(ev, nodes, voronoi))
}

function update_neighbors(ev, nodes, voronoi) {
  let pos = d3.pointer(ev)
  ix = voronoi.find(pos[0], pos[1])

  d3.select("#nodes")
    .selectAll("circle")
    .transition().duration(1000)
    .attrs({ r: d => d.id == nodes[ix].id ? 5 : 3 })

  selection = d3.select("#labels")
    .selectAll("text")
    .data([nodes[ix].label], d => d)

  selection.attrs({
    transform: `translate(${nodes[ix].x},${nodes[ix].y})`
  })
  selection.enter()
    .append("text")
    .text(d => d)
  selection.exit().remove()
}

let transition_length = 1000
Promise.all([
  d3.csv("political-books-nodes.csv", d3.autoType),
  d3.csv("political-books-edges.csv", d3.autoType)
]).then(visualize)
