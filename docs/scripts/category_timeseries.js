
// Set dimensions and margins
const margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 720 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

const svg = d3.select("#category_timeseries_svg")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("https://raw.githubusercontent.com/leoDYL/NYCEvents/main/data/derived_data/monthly_category_counts.csv").then( function(data) {

    var formatDate = d3.timeParse("%b %Y");

    function sortByDateAscending(a, b) {
        return formatDate(a.date) - formatDate(b.date);
    }

    data = data.sort(sortByDateAscending);

    // List of categories
    const categories = new Set(data.map(d => d.category))

    // Add the options to the dropdown select button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(categories)
      .enter()
    	.append('option')
      .text(function (d) { return d; })
      .attr("value", function (d) { return d; }) // Value returned by the dropdown select button

    // Have a different color for the lines of different event categories
    const categoryColorScheme = d3.scaleOrdinal()
      .domain(categories)
      .range(d3.schemeSet2);

    // Add xScale, with "%b %Y" format
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return formatDate(d.date); }))
      .range([0, width]);

    // Add the x-axis
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    // Add yScale, for count of events for the category for the timeseries
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.count; })])
      .range([ height, 0 ]);

    // Add the y-axis
    svg.append("g")
      .call(d3.axisLeft(yScale));

    // Initialize line with first event category of the list
    const line = svg
      .append('g')
      .append("path")
        .datum(data.filter(function(d){return d.category == "Accessible"}))
        .attr("d", d3.line()
          .x(function(d) { 
            return xScale(formatDate(d.date)) 
          })
          .y(function(d) { 
            return yScale(+d.count) 
          })
        )
        .attr("stroke", categoryColorScheme("Accessible"))
        .style("stroke-width", 4)
        .style("fill", "none")

    // Function to update the chart whenever the selected event category changes
    function update(selectedCategory) {

      const dataFilter = data.filter(function(d){return d.category == selectedCategory})

      // Update the data used for the line
      line
          .datum(dataFilter)
          .transition()
          .duration(500)
          .attr("d", d3.line()
            .x(function(d) { return xScale(formatDate(d.date)) })
            .y(function(d) { return yScale(+d.count) })
          )
          .attr("stroke", function(d){ 
            return categoryColorScheme(selectedCategory) 
          })
    }

    // When the button is changed, run the update function to reflect the category change
    d3.select("#selectButton").on("change", function(event,d) {
        const selectedCategory = d3.select(this).property("value")
        update(selectedCategory)
    })

})
