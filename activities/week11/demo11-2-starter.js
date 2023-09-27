
///////////////////////////////////////////////////////////////////////////////
// Functions to initialize the view
///////////////////////////////////////////////////////////////////////////////

function draw_scatter(data, scales) {
  d3.select("#scatter")
    .selectAll("circle")
    .data(data).enter()
    .append("circle")
    .attrs({
      cx: d => scales.data_x(d.UMAP1),
      cy: d => scales.data_y(d.UMAP2),
      r: 2
    })
}

///////////////////////////////////////////////////////////////////////////////
// Updates for whenever the scatterplot is brushed
///////////////////////////////////////////////////////////////////////////////

function brush_update(brush_window, data, scales) {
  let cells = current_cells(brush_window, data, scales)
  update_scatter_radius(cells)

  let stats = relevant_genes(cells, data)
  update_barchart(stats, scales)
}

function update_scatter_radius(cells) {
}

function update_barchart(stats, scales) {
  update_rects(stats, scales)
  update_labels(stats, scales)
}

function update_rects(stats, scales) {
  let selection = d3.select("#bars")
    .selectAll("rect")
    .data(stats, d => d.gene)

  selection.enter()
    .append("rect")
    .attrs({
      x: d => scales.bar_order(d.rank),
      width: 0.9 * scales.bar_order.bandwidth(),
      height: 0,
      y: 0,
      fill: d => d.stat > 0 ? "#F2A950" : "#46858C"
    })

  d3.select("#bars")
    .selectAll("rect")
    .transition().duration(transition_length)
    .attrs({
      x: d => scales.bar_order(d.rank),
      height: d => Math.abs(scales.bar_height(d.stat)),
      y: d => d.stat > 0 ? scales.bar_height(d.stat) : 0,
      fill: d => d.stat > 0 ? "#F2A950" : "#46858C"
    })

  selection.exit().remove()

  // create a selection for the current genes
  // enter, update, and exit to reflect current gene statistics
}

function update_labels(stats, scales) {
  // create a selection for the current genes
  // enter, update, and exit to reflect current gene names
}

///////////////////////////////////////////////////////////////////////////////
// Updates for whenever a gene's bar is mouseovered
///////////////////////////////////////////////////////////////////////////////

function update_scatter_color(ev, d, scales) {
}

///////////////////////////////////////////////////////////////////////////////
// Main visualization function
///////////////////////////////////////////////////////////////////////////////

function visualize(data) {
  let scales = make_scales(data)
  draw_scatter(data, scales)

  let brush = d3.brush()
    .extent([[0, 0], [400, 400]])
    .on("end", ev => brush_update(ev.selection, data, scales))
  d3.select("#brush").call(brush)
}

let transition_length = 500,
  max_bars = 20
d3.csv("scores.csv", d3.autoType)
  .then(visualize)
