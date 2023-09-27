
library(shiny)
library(tidyverse)

birds <- read_csv("https://raw.githubusercontent.com/krisrs1128/stat479_s22/main/exercises/data/birds.csv") %>%
  separate(Species, c("genus", "species2"))
    
ui <- fluidPage(
  fluidRow(
    column(6, plotOutput("plot", brush = "plot_brush")),
    column(4, dataTableOutput("table"))
  )
)

scatter <- function(x, selected_) {
  x %>%
    mutate(selected_ = factor(selected_, levels = c("FALSE", "TRUE"))) %>%
    ggplot() +
    geom_point(aes(Ellipticity, Asymmetry, col = selected_)) +
    scale_color_manual(values = c("black", "red")) +
    theme(legend.position = "none")
}

filtered_table <- function(birds, selected) {
  birds %>% 
    select(Order, Family, MVZDatabase) %>% 
    filter(selected)
}

server <- function(input, output) {
  selected <- reactiveVal(rep(TRUE, nrow(birds)))
  observeEvent(
    input$plot_brush,
    selected(brushedPoints(birds, input$plot_brush, allRows = TRUE)$selected_)
  )

  output$plot <- renderPlot(scatter(birds, selected()))
  output$table <- renderDataTable(
    filtered_table(birds, selected()),
    options = list(pageLength = 5)
  )
}

shinyApp(ui, server)