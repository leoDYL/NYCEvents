
d3.csv("https://raw.githubusercontent.com/leoDYL/NYCEvents/main/data/derived_data/monthly_category_counts.csv").then( function(data) {

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

    var formatDate = d3.timeParse("%b %Y");

    function sortByDateAscending(a, b) {
        return formatDate(a.date) - formatDate(b.date);
    }

    var bisect = d3.bisector(function(d) { 
      return formatDate(d.date); 
    }).left;

    var currentData = data.filter(function(d){return d.category == "Accessible"});
    currentData = currentData.sort(sortByDateAscending);

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
        .datum(currentData)
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

    // Create the circle that travels along the curve of chart
    var focus = svg
      .append('g')
      .append('circle')
        .style("fill", "none")
        .attr("stroke", "black")
        .attr('r', 8.5)
        .style("opacity", 0)

    // Create the text that travels along the curve of chart
    var focusText = svg
      .append('g')
      .append('text')
        .style("opacity", 0)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")

    // Create a rect on top of the svg area: this rectangle recovers mouse position
    svg
      .append('rect')
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr('width', width)
      .attr('height', height)
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseout', mouseout);

    // What happens when the mouse move -> show the annotations at the right positions.
    function mouseover(event) {
      focus.style("opacity", 1)
      focusText.style("opacity",1)
    }

    function mousemove(event) {
      // recover coordinate we need
      var x0 = xScale.invert(d3.pointer(event)[0]);

      currentData = currentData.sort(sortByDateAscending);

      var i = bisect(currentData, x0);

      // To avoid uncaught errors when data is incomplete for some event categories
      if (i == currentData.length) {
        i -= 1;
      }

      selectedData = currentData[i];

      focus
        .attr("cx", xScale(formatDate(selectedData.date)))
        .attr("cy", yScale(selectedData.count));

      var formatFocusText = function () {
        var x = xScale(formatDate(selectedData.date));
        var y = yScale(selectedData.count);

        if (formatDate(selectedData.date) >= formatDate("May 2018")) {
          var dateStr = "<tspan x='"+(x-120)+"' y='"+(+y-25)+"'> Month:"+ selectedData.date + "</tspan>";
          var countStr = "<tspan x='"+(x-120)+"' dy=15> Count:"+ selectedData.count + "</tspan>";
        } else {
          var dateStr = "<tspan x='"+(x-30)+"' y='"+(+y-25)+"'> Month:"+ selectedData.date + "</tspan>";
          var countStr = "<tspan x='"+(x-30)+"' dy=15> Count:"+ selectedData.count + "</tspan>";
        }

        return dateStr + " " + countStr;
      }


      focusText
        .html(formatFocusText());
      }

    function mouseout() {
      focus.style("opacity", 0)
      focusText.style("opacity", 0)
    }

    // Function to update the chart whenever the selected event category changes
    function update(selectedCategory) {

      const filteredData = data.filter(function(d){return d.category == selectedCategory})
      currentData = filteredData.sort(sortByDateAscending);

      // Update the data used for the line
      line
          .datum(currentData)
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