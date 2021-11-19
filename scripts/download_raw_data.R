library(tidyverse)

dir.create("data")
dir.create("data/raw_data")
dir.create("data/derived_data")

csv_file_names = c(
  "nyc_parks_event_listing_events.csv",
  "nyc_parks_event_listing_categories.csv",
  "nyc_parks_event_listing_locations.csv",
  "nyc_parks_event_listing_organizers.csv"
)

csv_urls = c(
  "https://data.cityofnewyork.us/api/views/fudw-fgrp/rows.csv?accessType=DOWNLOAD",
  "https://data.cityofnewyork.us/api/views/xtsw-fqvh/rows.csv?accessType=DOWNLOAD",
  "https://data.cityofnewyork.us/api/views/cpcm-i88g/rows.csv?accessType=DOWNLOAD",
  "https://data.cityofnewyork.us/api/views/jk6k-yab4/rows.csv?accessType=DOWNLOAD"
)


l_csv = length(csv_file_names)

for (i in 1 : l_csv) {
  download.file(csv_urls[i],
                destfile = paste("data/raw_data/", csv_file_names[i], sep = ""))
}

library(readxl)

park_crimes_file_names = c(
  "nyc_parks_crime_2021_q3.xlsx",
  "nyc_parks_crime_2021_q2.xlsx",
  "nyc_parks_crime_2021_q1.xlsx",
  "nyc_parks_crime_2020_q4.xlsx",
  "nyc_parks_crime_2020_q3.xlsx",
  "nyc_parks_crime_2020_q2.xlsx",
  "nyc_parks_crime_2020_q1.xlsx",
  "nyc_parks_crime_2019_q4.xlsx",
  "nyc_parks_crime_2019_q3.xlsx",
  "nyc_parks_crime_2019_q2.xlsx",
  "nyc_parks_crime_2019_q1.xlsx",
  "nyc_parks_crime_2018_q4.xlsx",
  "nyc_parks_crime_2018_q3.xlsx",
  "nyc_parks_crime_2018_q2.xlsx",
  "nyc_parks_crime_2018_q1.xlsx",
  "nyc_parks_crime_2017_q4.xlsx",
  "nyc_parks_crime_2017_q3.xlsx",
  "nyc_parks_crime_2017_q2.xlsx",
  "nyc_parks_crime_2017_q1.xlsx",
  "nyc_parks_crime_2016_q4.xlsx",
  "nyc_parks_crime_2016_q3.xlsx",
  "nyc_parks_crime_2016_q2.xlsx",
  "nyc_parks_crime_2016_q1.xlsx",
  "nyc_parks_crime_2015_q4.xlsx",
  "nyc_parks_crime_2015_q3.xlsx",
  "nyc_parks_crime_2015_q2.xlsx",
  "nyc_parks_crime_2015_q1.xlsx",
  "nyc_parks_crime_2014_q4.xlsx"
)

park_crimes_urls = c(
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q3-2021.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q2-2021.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q1-2021.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q4-2020.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q3-2020.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q2-2020.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q1-2020a.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q4-2019.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q3-2019.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q2-2019.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q1-2019.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q4-2018.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q3-2018.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q2-2018.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q1-2018.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q4-2017.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q3-2017.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q2-2017.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q1-2017.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q4-2016.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q3-2016.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q2-2016.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q1-2016.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q4-2015.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q3-2015.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q2-2015.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q1-2015.xlsx",
  "https://www1.nyc.gov/assets/nypd/downloads/excel/crime_statistics/park-crime/nyc-park-crime-stats-q4-2014.xlsx"
)

crime_quarters <- c(
  "2021_q3",
  "2021_q2",
  "2021_q1",
  "2020_q4",
  "2020_q3",
  "2020_q2",
  "2020_q1",
  "2019_q4",
  "2019_q3",
  "2019_q2",
  "2019_q1",
  "2018_q4",
  "2018_q3",
  "2018_q2",
  "2018_q1",
  "2017_q4",
  "2017_q3",
  "2017_q2",
  "2017_q1",
  "2016_q4",
  "2016_q3",
  "2016_q2",
  "2016_q1",
  "2015_q4",
  "2015_q3",
  "2015_q2",
  "2015_q1",
  "2014_q4"
)

l_park_crimes = length(park_crimes_file_names)

for (i in 1 : l_park_crimes) {
  destfile <- paste("data/raw_data/", park_crimes_file_names[i], sep = "")
  download.file(park_crimes_urls[i],
                destfile = destfile)
}

for (i in 1 : l_park_crimes) {
  destfile <- paste("data/raw_data/", park_crimes_file_names[i], sep = "")
  # Handling special cases
  if (i == 1) {
    df <- head(read_excel(destfile, sheet = 1, skip = 3), -2)
  } else if (i %in% c(3, 14, 25:28)) {
    df <- head(read_excel(destfile, sheet = 1, skip = 4), -1)
  } else {
    df <- head(read_excel(destfile, sheet = 1, skip = 3), -1)
  }
  df$Quarter <- crime_quarters[i]
  names(df) <- toupper(names(df))
  write.csv(df, gsub("xlsx", "csv", destfile), row.names=FALSE)
}

data_all <- list.files(path = "data/raw_data/",
                       pattern = "nyc_parks_crime_20.*.csv", full.names = TRUE) %>%
  lapply(read_csv) %>%
  bind_rows

write.csv(data_all, "data/derived_data/nyc_parks_crime_data_all.csv", row.names=FALSE)

