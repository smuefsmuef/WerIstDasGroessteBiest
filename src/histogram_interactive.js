// set the dimensions and margins of the graph
const margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_histogram_interactive")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Initialize the X axis
const x = d3.scaleBand()
    .range([ 0, width ])
    .padding(0.2);
const xAxis = svg.append("g")
    .attr("transform", `translate(0,${height})`);

// Initialize the Y axis
const y = d3.scaleLinear()
    .range([height, 0]);
const yAxis = svg.append("g")
    .attr("class", "myYaxis");


// A function that create / update the plot for a given variable:
function update(selectedVar) {

    // Parse the Data
    d3.csv("./data/data_test.csv").then( function(data) {
console.log(data);
        // X axis
        x.domain(data.map(d => d.group))
        xAxis.transition().duration(1000).call(d3.axisBottom(x));

        // Add Y axis
        y.domain([0, d3.max(data, d => +d[selectedVar]) ]);
        yAxis.transition().duration(1000).call(d3.axisLeft(y));

        // variable u: map data to existing bars
        const u = svg.selectAll("rect")
            .data(data)

        // update bars
        u.join("rect")
            .transition()
            .duration(1000)
            .attr("x", d => x(d.group))
            .attr("y", d => y(d[selectedVar]))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d[selectedVar]))
            .attr("fill", "green")
    })
}

// Initialize plot
update('living_quality')