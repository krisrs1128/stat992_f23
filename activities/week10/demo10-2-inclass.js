
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
  d3.selectAll("circle")
    .attrs({
      cx: d => d.x,
      cy: d => d.y
    })

  d3.selectAll("line")
    .attrs({
      x1: d => d.source.x,
      x2: d => d.target.x,
      y1: d => d.source.y,
      y2: d => d.target.y
    })

  d3.select("#labels")
    .selectAll("text")
    .attrs({
      transform: d => `translate(${d.x}, ${d.y})`
    })

  voronoi = d3.Delaunay.from(nodes.map(d => [d.x, d.y]))
  d3.select("svg").on("mousemove", ev => update_neighbors(ev, voronoi, neighbor_arrays, nodes))
}

function update_neighbors(ev, voronoi, neighbor_arrays, nodes) {
  let pos = d3.pointer(ev)
  let ix = voronoi.find(pos[0], pos[1])
  let neighbor_ix = neighbor_arrays[ix]
  let cur_nodes = neighbor_ix.map(i => nodes[i])

  d3.selectAll("circle")
    .attrs({
      r: d => neighbor_ix.indexOf(d.id) == -1 ? 3 : 6
    })

  let label_selection = d3.select("#labels")
    .selectAll("text")
    .data(cur_nodes, d => d.id)

  label_selection.enter()
    .append("text")
    .attrs({
      transform: d => `translate(${d.x}, ${d.y})`,
      "font-size": d => (ix == d.id) ? 16 : 11
    })
    .text(d => d.label)

  label_selection.transition()
    .attrs({
    "font-size": d => (ix == d.id) ? 16 : 11
  })

  label_selection.exit().remove()
}

function visualize(data) {
  let [simulation, nodes, links] = setup_simulation(data)
  neighbor_arrays = neighborhoods(nodes, links)
  console.log(neighbor_arrays)

  initialize_graph(nodes, links)
  simulation.on("tick", _ => ticked(nodes, neighbor_arrays))
}

let transition_length = 500
Promise.all([
  d3.csv("political-books-nodes.csv", d3.autoType),
  d3.csv("political-books-edges.csv", d3.autoType)
]).then(visualize)
