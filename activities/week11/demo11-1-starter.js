
///////////////////////////////////////////////////////////////////////////////
// Functions to initialize the view
///////////////////////////////////////////////////////////////////////////////

function draw_scatter(data, scales) {
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

  // define a brush that calls brush_update on brush end
}

let transition_length = 500,
  max_bars = 20
d3.csv("scores.csv", d3.autoType)
  .then(visualize)
