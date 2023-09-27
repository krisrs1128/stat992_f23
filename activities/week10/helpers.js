
function make_scales(scales) {
  return {
    fill: d3.scaleOrdinal()
      .domain(["conservative", "neutral", "liberal"])
      .range(["#A60311", "#8480F2", "#75A3BF"])
  }
}

function neighborhoods(nodes, links) {
  let result = {};
  for (let i = 0; i < nodes.length; i++) {
    result[nodes[i].index] = [nodes[i].index]
  }

  for (let i = 0; i < links.length; i++) {
    if (result[links[i].source.index]) {
      result[links[i].source.index].push(links[i].target.index)
    }
    if (result[links[i].target.index]) {
      result[links[i].target.index].push(links[i].source.index)
    }
  }

  return result
}
