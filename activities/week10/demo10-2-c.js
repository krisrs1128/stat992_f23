
function setup_simulation(data) {
  let [nodes, links] = data
  let simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id)) // attracts nodes
    .force("charge", d3.forceManyBody().strength(-10)) // repels nodes
    .force("center", d3.forceCenter(300, 300)) // center of the canvas

  return [simulation, nodes, links]
}

function visualize(data) {
  let [simulation, nodes, links] = setup_simulation(data)
  neighbor_arrays = neighborhoods(nodes, links)

  initialize_graph(nodes, links)
  simulation.on("tick", _ => ticked(nodes, neighbor_arrays))
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
  d3.select("#hover").on("mousemove", ev => update_neighbors(ev, nodes, voronoi, neighbor_arrays))
}

function update_neighbors(ev, nodes, voronoi, neighbor_arrays) {
  let pos = d3.pointer(ev)
  ix = voronoi.find(pos[0], pos[1])

  d3.select("#nodes")
    .selectAll("circle")
    .transition().duration(transition_length)
    .attrs({
      r: d => neighbor_arrays[nodes[ix].id].indexOf(d.id) == -1? 3 : 5
    })

  cur_labels = nodes.filter(d => neighbor_arrays[nodes[ix].id].indexOf(d.id) != -1)
  selection = d3.select("#labels")
    .selectAll("text")
    .data(cur_labels, d => d.id)

  selection.attrs({
    transform: d => `translate(${d.x},${d.y})`,
    "font-size": d => d.id == nodes[ix].id ? 12 : 8
  })
  selection.enter()
    .append("text")
    .text(d => d.label)
  selection.exit().remove()
}

let transition_length = 500
Promise.all([
  d3.csv("political-books-nodes.csv", d3.autoType),
  d3.csv("political-books-edges.csv", d3.autoType)
]).then(visualize)
