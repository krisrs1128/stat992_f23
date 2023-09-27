
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
          col = as.factor(selected),
      )) +
    scale_color_manual(values = c("black", "red"))
}

ui <- fluidPage(
  selectInput("dropdown", "Select a Sport", choices = unique(olympics$Sport), multiple = TRUE),
  plotOutput("scatterplot"),
  dataTableOutput("table")
)
    
server <- function(input, output) {
  updated <- reactive({
    olympics %>%
      mutate(selected = Sport %in% input$dropdown)
  })
  
  output$scatterplot <- renderPlot(scatterplot(updated()))
  output$table <- renderDataTable({
    updated() %>%
      filter(selected)
  })
}

shinyApp(ui, server)