
library(shiny)
library(tidyverse)
olympics <- read_csv("https://uwmadison.box.com/shared/static/rzw8h2x6dp5693gdbpgxaf2koqijo12l.csv")

#' Scatterplot with highlighted points
#' 
#' Assumes a column in df called "selected" saying whether points should be
#' larger / darker
scatterplot <- function(df) {
  ggplot(df) +
    geom_point(
      aes(Weight, `Height, cm`, 
          alpha = as.numeric(selected),
          size = as.numeric(selected))
      ) +
    scale_alpha(range = c(0.05, .8)) +
    scale_size(range = c(0.1, 1))
}

ui <- fluidPage(
  selectInput("dropdown", "Select a Sport", choices = unique(olympics$Sport), multiple = TRUE),
  plotOutput("scatterplot")
)
    
server <- function(input, output) {
  updated <- reactive({
    olympics %>%
      mutate(selected = Sport %in% input$dropdown)
  })
  
  output$scatterplot <- renderPlot(scatterplot(updated()))
}

shinyApp(ui, server)