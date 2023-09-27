
///////////////////////////////////////////////////////////////////////////////
// Functions to initialize the view
///////////////////////////////////////////////////////////////////////////////

function draw_scatter(data, scales) {
  d3.select("#scatter")
    .selectAll("circle")
    .data(data, d => d.cell_tag).enter()
    .append("circle")
    .attrs({
      cx: d => scales.data_x(d.UMAP1),
      cy: d => scales.data_y(d.UMAP2),
      r: 1,
      fill: "#d3d3d3"
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
  d3.select("#scatter")
    .selectAll("circle")
    .attrs({
      r: d => cells.indexOf(d.cell_tag) == -1? 0.5 : 1.5
    })
}

function update_barchart(stats, scales) {
  update_rects(stats, scales)
  update_labels(stats, scales)
}

function update_rects(stats, scales) {
  selection = d3.select("#bars")
    .selectAll("rect")
    .data(stats, d => d.gene)

  selection.enter().append("rect")
    .attrs({
      x: d => scales.bar_order(d.rank) - 0.5 * scales.bar_order.bandwidth(),
      width: 0.9 * scales.bar_order.bandwidth(),
      y: 0
    })
    .on("mouseover", (ev, d) => update_scatter_color(ev, d, scales))

  let cols = scales.circle_fill.range()
  d3.select("#bars")
    .selectAll("rect")
    .transition().duration(transition_length)
    .attrs({
      x: d => scales.bar_order(d.rank) - 0.5 * scales.bar_order.bandwidth(),
      y: d => d.stat > 0 ? scales.bar_height(d.stat) : 0,
      height: d => Math.abs(scales.bar_height(d.stat)),
      fill: d => d.stat > 0? cols[1] : cols[0]
    })

  selection.exit().remove()
}

function update_labels(stats, scales) {
  let selection = d3.select("#labels")
    .selectAll("text")
    .data(stats, d => d.gene)

  selection.enter().append("text")
    .attrs({
      "font-size": 8,
      transform: d => `translate(${scales.bar_order(d.rank)}, ${d.stat > 0 ? 5 : -5})rotate(270)`,
      "text-anchor": d => d.stat > 0? "end" : "start"
    })

  d3.select("#labels")
    .selectAll("text")
    .transition().duration(transition_length)
    .attrs({
      transform: d => `translate(${scales.bar_order(d.rank)}, ${d.stat > 0 ? 5 : -5})rotate(270)`,
      "text-anchor": d => d.stat > 0? "end" : "start"
    })
    .text(d => d.gene)

  selection.exit().remove()
}

///////////////////////////////////////////////////////////////////////////////
// Updates for whenever a gene's bar is mouseovered
///////////////////////////////////////////////////////////////////////////////

function update_scatter_color(ev, d, scales) {
  d3.select("#scatter")
    .selectAll("circle")
    .transition().duration(transition_length)
    .attrs({
      fill: e => scales.circle_fill(e[d.gene])
    })

  d3.select("#labels")
    .selectAll("text")
    .attrs({
      "font-size": e => e.gene == d.gene ? 14 : 8
    })
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
