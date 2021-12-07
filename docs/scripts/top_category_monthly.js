
// Set dimensions and margins
const margin = {top: 10, right: 30, bottom: 150, left: 60},
    width = 720 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

const svg = d3.select("#top_category_monthly_svg")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("https://raw.githubusercontent.com/leoDYL/NYCEvents/main/data/derived_data/monthly_category_counts.csv").then( function(data) {
    const year = new Set([2013,2014,2015,2017,2017,2018])
    const month = new Set(["Jan", "Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"])
    const topCategory = [
       "Best for Kids","Nature","Fitness","Education","Art",
       "Seniors","History","Tours","Accessible","Sports",
       "Arts & Crafts","Volunteer","Outdoor Fitness","Waterfront",
       "Historic House Trust Sites","Games","Festivals",
       "Poe Park Visitor Center","It's My Park",
       "Northern Manhattan Parks","Concerts","Film","Urban Park Rangers",
       "Talks","Dance","Birding","Free Summer Movies","City Parks Foundation",
       "Theater","Free Summer Concerts"
    ].sort()
    const topData = data.filter(function(d) { return topCategory.includes(d.category) })
      .sort(function(a, b) { return d3.ascending(a.category, b.category)} )

    function getDataToPopulate(dataInDate){
      var dataToPopulate = []
      topCategory.forEach(cat => {
          dataToPopulate.push({
            category: cat,
            count:0
          })
      })
      dataInDate.forEach(data => {
        dataToPopulate[topCategory.indexOf(data.category)].count = data.count
      })
      return dataToPopulate
    }

    d3.select("#yearButton")
      .selectAll('myOptions')
      .data(year)
      .enter()
      .append('option')
      .text(function (d) { return d; })
      .attr("value", function (d) { return d; }) 
      
    d3.select("#monthButton")
      .selectAll('myOptions')
      .data(month)
      .enter()
      .append('option')
      .text(function (d) { return d; })
      .attr("value", function (d) { return d; }) 


    var dateStr = d3.select("#monthButton").property("value") + ' ' + d3.select("#yearButton").property("value")
    var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range ([height, 0])


    dataInDate = topData.filter(function(d){return d.date == dateStr})

    xScale.domain(topCategory)
    yScale.domain([0, d3.max(topData, function(d) { return +d.count; })]);
    svg.append("g")
       .attr("transform", `translate(0, ${height})`)
       .call(d3.axisBottom(xScale))
       .selectAll("text")
       .style("text-anchor", "end")
       .attr("dx", "-1em")
       .attr("dy", "-.15em")
       .attr("transform", "rotate(-65)")

    svg.append("g")
     .call(d3.axisLeft(yScale))

    const bars = svg.selectAll("rect")
      .data(getDataToPopulate(dataInDate))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return xScale(d.category) })
      .attr("y", function(d) { return yScale(d.count) })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) { return height - yScale(d.count)})

    function upateBarchart(month, year) {
      var dateStr = month+' '+year
      console.log(dateStr)
      dataInDate = topData.filter(function(d){return d.date == dateStr})

      svg.selectAll("rect")
        .data(getDataToPopulate(dataInDate))
        .transition()
        .duration(500)
        .attr("y", function(d) { return yScale(d.count) })
        .attr("height", function(d) { return height - yScale(d.count)})
    }

    d3.select("#monthButton").on("change", function(event,d) {
        console.log("month button changed")
        const month = d3.select(this).property("value")
        const year = d3.select("#yearButton").property("value")
        upateBarchart(month,year)
    })
    d3.select("#yearButton").on("change", function(event,d) {
        console.log("year button changed")
        const month = d3.select("#monthButton").property("value")
        const year = d3.select(this).property("value")
        upateBarchart(month,year)
    })

})
