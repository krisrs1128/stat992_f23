
function make_scales(data) {
  return {
    data_x: d3.scaleLinear()
      .domain(d3.extent(data.map(d => d.UMAP1)))
      .range([0, 400]),
    data_y: d3.scaleLinear()
      .domain(d3.extent(data.map(d => d.UMAP2)))
      .range([400, 0]),
    bar_order: d3.scaleBand()
      .domain(d3.range(max_bars))
      .range([0, 300]),
    bar_height: d3.scaleLinear()
      .domain([-5, 5])
      .range([200, -200]),
    circle_fill: d3.scaleQuantile()
      .domain([0, 6])
      .range(["#46858C", "#F2A950"])
  }
}

function current_cells(brush_window, data, scales) {
  let result = []
  for (let i = 0; i < data.length; i++) {
    if (scales.data_x(data[i].UMAP1) > brush_window[0][0] &
        scales.data_x(data[i].UMAP1) < brush_window[1][0] &
        scales.data_y(data[i].UMAP2) > brush_window[0][1] &
        scales.data_y(data[i].UMAP2) < brush_window[1][1]) {
          result.push(data[i].cell_tag)
        }
  }
  return result;
}

function relevant_genes(cells, data) {
  // initialize data structure
  data = data.slice(0, 150)

  let stats = {};
  for (const gene in data[0]) {
    if (gene == "cell_tag" || gene.includes("UMAP")) continue;
    stats[gene] = {inside: [], outside: []};
  }

  // compute stats within and outside the brush
  for (let i = 0; i < data.length; i++) {
    for (const gene in data[i]) {
      if (gene == "cell_tag" || gene.includes("UMAP")) continue;

      if (cells.indexOf(data[i].cell_tag) == -1) {
        stats[gene]["outside"].push(data[i][gene])
      } else {
        stats[gene]["inside"].push(data[i][gene])
      }
    }
  }

  // compute test statistics
  let result = []
  for (gene in stats) {
    if (gene == "cell_tag") continue;
    let t_stat = 0
    if (stats[gene].outside.length != 0 && stats[gene].inside.length != 0) {
      t_stat = (d3.mean(stats[gene]["inside"]) - d3.mean(stats[gene]["outside"])) /
      d3.deviation(stats[gene]["inside"].concat(stats[gene]["outside"]))
    }

    result.push({ gene: gene, stat: t_stat })
  }

  // rank genes by test statistics
  result = result.slice().sort((a, b) => d3.descending(Math.abs(a.stat), Math.abs(b.stat)))
  result = result.slice(0, max_bars)

  result = result.slice().sort((a, b) => d3.descending(a.stat, b.stat))
  for (let i = 0; i < result.length; i++){
    result[i].rank = i
  }
  return result
}
