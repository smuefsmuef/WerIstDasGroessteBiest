/**** Chart 1: Bar Chart Life Quality vs. Threatened Species ****/

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
    d3.csv("./data/graph1_barchart.csv").then( function(data) {
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


/**** Chart 2: Map of europe with living quality (human) and threatened aninmals ****/




/**** Chart 3: Line Chart with historical development of farming, species, number of people ****/


// append the svg object to the body of the page
const svg3 = d3.select("#my_line_chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("./data/graph3_line_chart.csv").then( function(data) {
    console.log(data);
    // List of groups (here I have one group per column)
    const allGroup = ["Produktion", "Bevölkerung", "Fläche"]

    // Reformat the data: we need an array of arrays of {x, y} tuples
    const dataReady = allGroup.map( function(grpName) { // .map allows to do something for each element of the list
        return {
            name: grpName,
            values: data.map(function(d) {
                return {time: d.time, value: +d[grpName]};
            })
        };
    });
    // I strongly advise to have a look to dataReady with
    // console.log(dataReady)

    // A color scale: one color for each group
    const myColor = d3.scaleOrdinal()
        .domain(allGroup)
        .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    const x = d3.scaleLinear()
        .domain([1900,2020])
        .range([ 0, width ]);
    svg3.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain( [0,300])
        .range([ height, 0 ]);
    svg3.append("g")
        .call(d3.axisLeft(y));

    // Add the lines
    const line = d3.line()
        .x(d => x(+d.time))
        .y(d => y(+d.value))
    svg3.selectAll("myLines")
        .data(dataReady)
        .join("path")
        .attr("class", d => d.name)
        .attr("d", d => line(d.values))
        .attr("stroke", d => myColor(d.name))
        .style("stroke-width", 4)
        .style("fill", "none")

    // Add the points
    svg3
        // First we need to enter in a group
        .selectAll("myDots")
        .data(dataReady)
        .join('g')
        .style("fill", d => myColor(d.name))
        .attr("class", d => d.name)
        // Second we need to enter in the 'values' part of this group
        .selectAll("myPoints")
        .data(d => d.values)
        .join("circle")
        .attr("cx", d => x(d.time))
        .attr("cy", d => y(d.value))
        .attr("r", 5)
        .attr("stroke", "white")

    // Add a label at the end of each line
    svg3
        .selectAll("myLabels")
        .data(dataReady)
        .join('g')
        .append("text")
        .attr("class", d => d.name)
        .datum(d => { return {name: d.name, value: d.values[d.values.length - 1]}; }) // keep only the last value of each time series
        .attr("transform", d => `translate(${x(d.value.time)},${y(d.value.value)})`) // Put the text at the position of the last point
        .attr("x", 12) // shift the text a bit more right
        .text(d => d.name)
        .style("fill", d => myColor(d.name))
        .style("font-size", 15)

    // Add a legend (interactive)
    svg3
        .selectAll("myLegend")
        .data(dataReady)
        .join('g')
        .append("text")
        .attr('x', (d,i) => 30 + i*60)
        .attr('y', 30)
        .text(d => d.name)
        .style("fill", d => myColor(d.name))
        .style("font-size", 15)
        .on("click", function(event,d){
            // is the element currently visible ?
            currentOpacity = d3.selectAll("." + d.name).style("opacity")
            // Change the opacity: from 0 to 1 or from 1 to 0
            d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1)

        })
})