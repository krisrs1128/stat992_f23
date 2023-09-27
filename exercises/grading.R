
library(tidyverse)

grades <- read_csv("~/Downloads/grades.csv") %>%
  select(Student, `Final Score`) %>%
  mutate(
    grade_Q = cut(
      `Final Score`, 
      breaks = quantile(`Final Score`, probs = c(0, 0.05, 0.1, 0.3, 0.45, 0.65, 0.75, 1)),
      right = TRUE,
      include.lowest = TRUE,
      labels = c("F", "D", "C", "BC", "B", "AB", "A")
    ),
    grade_S = cut(
      `Final Score`,
      breaks = c(0, 60, 70, 78, 82, 88, 91, 100),
      labels = c("F", "D", "C", "BC", "B", "AB", "A")
    )
  ) %>%
  arrange(-`Final Score`)
write_csv(grades, "~/Downloads/grades_sorted.csv")

round(table(grades$grade_S) / nrow(grades), 2)