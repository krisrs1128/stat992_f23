
function make_tree(edges) {
  edges.push({to: 1, from: null});
  stratifier = d3.stratify()
    .id(d => d.to)
    .parentId(d => d.from)
  
  let root = stratifier(edges)
  // apply d3.tree()-based function to root
}

function visualize(data) {
  [nodes, edges] = data

  // helper to look up country and date for each node ID.
  nodes_lookup = {}
  for (let i = 0; i < nodes.length; i++) {
    nodes_lookup[i + 1] = nodes[i]
  }
}

Promise.all([
  d3.csv("covid-nodes.csv", d3.autoType),
  d3.csv("covid-edges.csv", d3.autoType)
]).then(visualize)
