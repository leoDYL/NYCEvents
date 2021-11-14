library(tidyverse)
library(patchwork)
library(gginnards)

custom.sort <- function(x){x[order(as.numeric(x))]}

missing_value_plot <- function(dataset, percent) {
  
  missing_patterns <- data.frame(is.na(dataset)) %>%
    group_by_all() %>%
    count(name = "count", sort = TRUE) %>%
    ungroup()
  
  num_vars <- ncol(missing_patterns)
  
  tidy_missing_patterns <- missing_patterns %>% 
    rownames_to_column("row_num") %>% 
    gather(key, value, -row_num, -count)

  variable_levels <- levels(
    fct_reorder(tidy_missing_patterns$key, 
                -(tidy_missing_patterns$value * tidy_missing_patterns$count),
                sum))
  case_levels <- rev(custom.sort(unique(tidy_missing_patterns$row_num)))
  
  missing_patterns_w_num_vars_missing <- missing_patterns %>%
    mutate(num_missing_variables = rowSums(.) - count) %>%
    rownames_to_column("row_num")
  
  complete_rows <- (
    missing_patterns_w_num_vars_missing %>% 
      filter(num_missing_variables == 0)
  )$row_num
  
  tile_missing_colors <- c("grey", "mediumpurple1")
  
  g_main <- tidy_missing_patterns %>%
    group_by(row_num) %>%
    mutate(num_missing_variables = aggregate(value, by=list(row_num), sum)) %>%
    ggplot(aes(x = factor(key, levels = variable_levels),
               y = factor(row_num, levels = case_levels), 
               fill = value,
               alpha = c(num_missing_variables$x == 0))
           ) + 
    geom_tile(color = "white") +
    annotate("text", x = round(num_vars / 2), y = complete_rows, label = "complete cases") +
    scale_fill_manual(values = tile_missing_colors) +
    scale_alpha_manual(values = c(0.5, 1.0), breaks = c(FALSE, TRUE)) +
    labs(x = "variable", y = "missing pattern") + 
    theme(legend.position="none") +
    theme(panel.background = element_blank())

  row_missing_data <- tidy_missing_patterns %>%
    mutate(rows_missing = count * value) %>%
    group_by(key) %>%
    summarize(rows_missing = sum(rows_missing) / ifelse(percent==TRUE, sum(count)/ 100, 1))
  
  g_num_row_missing <- row_missing_data %>%
    ggplot() + 
    geom_col(aes(x = factor(key, levels = variable_levels), y = rows_missing, alpha = 0.5), fill = "cornflowerblue") +
    ylim(0, ifelse(percent, 100, max(row_missing_data$rows_missing))) + 
    labs(x = "", y = "num rows \n missing") + 
    ggtitle("Missing value patterns") + 
    theme_bw() +
    theme(legend.position="none")

  g_row_count <- missing_patterns_w_num_vars_missing %>% 
    ggplot() +
    geom_col(aes(x = factor(row_num, levels = case_levels), y = count / ifelse(percent == TRUE, sum(count)/100, 1), alpha = c(num_missing_variables==0)), fill = "cornflowerblue") +
    scale_alpha_manual(values = c(0.5, 1.0), breaks = c(FALSE, TRUE)) +
    labs(x = "", y = "row count") + 
    coord_flip() +
    ylim(0, ifelse(percent, 100, max(missing_patterns$count))) +
    theme_bw() + 
    theme(legend.position = "none")
  
  layout <- "
  BBBBB#
  AAAAAC
  AAAAAC
  AAAAAC
  AAAAAC
  AAAAAC
  "
  g_main + g_num_row_missing + g_row_count +
    plot_layout(design = layout)
}