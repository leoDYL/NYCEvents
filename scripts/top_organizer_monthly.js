
d3.csv("https://raw.githubusercontent.com/leoDYL/NYCEvents/main/data/derived_data/monthly_organizer_counts.csv").then( function(data) {
    console.log(data)
    // Set dimensions and margins
    const margin = {top: 10, right: 30, bottom: 200, left: 60},
        width = 720 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;
    
    const svg = d3.select("#top_organizer_monthly_svg")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const year = new Set(data.map(d => d.year).sort())
    const month = new Set(data.map(d => d.month))
    const topOrganizer = Array.from(new Set(data.map(d => d.organizer)))
    const topData = data.filter(function(d) { return topOrganizer.includes(d.organizer) })
      .sort(function(a, b) { return d3.ascending(a.organizer, b.organizer)} )

    function getDataToPopulate(dataInDate){
      var dataToPopulate = []
      topOrganizer.forEach(cat => {
          dataToPopulate.push({
            organizer: cat,
            count:0
          })
      })
      dataInDate.forEach(data => {
        dataToPopulate[topOrganizer.indexOf(data.organizer)].count = data.count
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

    xScale.domain(topOrganizer)
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
    
    const tooltip = d3.select("body")
        .append("div")
        .attr("class","d3-tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("padding", "15px")
        .style("background", "rgba(0,0,0,0.6)")
        .style("border-radius", "5px")
        .style("color", "#fff")
        .text("a simple tooltip")
    
    const bars = svg.selectAll("rect")
      .data(getDataToPopulate(dataInDate))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return xScale(d.organizer) })
      .attr("y", function(d) { return yScale(d.count) })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) { return height - yScale(d.count)})
      .on("mouseover", function(event, d){ 
        d3.select(this).attr("fill", "orange")
        tooltip.html(`Count: ${d.count}`).style("visibility", "visible")
      })
      .on("mousemove", function(){
          tooltip
            .style("top", (event.pageY-10)+"px")
            .style("left",(event.pageX+10)+"px");
        })
      .on("mouseout", function(){ 
        d3.select(this).attr("fill", "black")
        tooltip.html(``).style("visibility", "hidden")
      });

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
