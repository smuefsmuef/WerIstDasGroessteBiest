// set the dimensions and margins of the graph: https://d3-graph-gallery.com/barplot.html
const margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_histogram")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("./data/data_test.csv").then( function(data) {
    console.log(data);
// X axis
    const x = d3.scaleBand()
        .range([ 0, width ])
        .domain(data.map(d => d.country))
        .padding(0.2);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

// Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 200])
        .range([ height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

// Bars
    svg.selectAll("mybar")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.country))
        .attr("y", d => y(d.life_quality))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.life_quality))
        .attr("fill", "#69b3a2")

})