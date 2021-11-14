library(tidyverse)

file_names = c(
  "nyc_parks_event_listing_events.csv",
  "nyc_parks_event_listing_categories.csv",
  "nyc_parks_event_listing_locations.csv",
  "nyc_parks_event_listing_organizers.csv"
)

urls = c(
  "https://data.cityofnewyork.us/api/views/fudw-fgrp/rows.csv?accessType=DOWNLOAD",
  "https://data.cityofnewyork.us/api/views/xtsw-fqvh/rows.csv?accessType=DOWNLOAD",
  "https://data.cityofnewyork.us/api/views/cpcm-i88g/rows.csv?accessType=DOWNLOAD",
  "https://data.cityofnewyork.us/api/views/jk6k-yab4/rows.csv?accessType=DOWNLOAD"
)


l = length(file_names)

for (i in 1 : l) {
  download.file(urls[i],
                destfile = paste("data/raw_data/", file_names[i], sep = ""))
}  
