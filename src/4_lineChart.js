/**** Chart 4: Interactive line chart with historical development of farming, species, number of people ****/
/** Source: https://d3-graph-gallery.com/graph/connectedscatter_legend.html **/

// append the svg object to the body of the page
    const svg4 = d3.select("#my_line_chart")
        .append("svg")
        .attr("width", width*2 + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
    d3.csv("./data/4_history.csv").then(function (data) {
        //console.log(data);

        // List of groups (here I have one group per column)
        const allGroup = ["Bevölkerung", "FlächeLandw", "ProduktionLandw"]

        // Reformat the data: we need an array of arrays of {x, y} tuples
        const dataReady = allGroup.map(function (grpName) { // .map allows to do something for each element of the list
            return {
                name: grpName,
                values: data.map(function (d) {
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
            .domain([1900, 2030])
            .range([0, width*2 - 100]);
        svg4.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, 300])
            .range([height, 0]);
        svg4.append("g")
            .call(d3.axisLeft(y));

        // Add the lines
        const line = d3.line()
            .x(d => x(+d.time))
            .y(d => y(+d.value))
        svg4.selectAll("myLines")
            .data(dataReady)
            .join("path")
            .attr("class", d => d.name)
            .attr("d", d => line(d.values))
            .attr("stroke", d => myColor(d.name))
            .style("stroke-width", 4)
            .style("fill", "none")

        // Add the points
        svg4
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
        svg4
            .selectAll("myLabels")
            .data(dataReady)
            .join('g')
            .append("text")
            .attr("class", d => d.name)
            .datum(d => {
                return {name: d.name, value: d.values[d.values.length - 1]};
            }) // keep only the last value of each time series
            .attr("transform", d => `translate(${x(d.value.time)},${y(d.value.value)})`) // Put the text at the position of the last point
            .attr("x", 12) // shift the text a bit more right
            .text(d => d.name)
            .style("fill", d => myColor(d.name))
            .style("font-size", 15)

        // Add a legend (interactive)
        svg4
            .selectAll("myLegend")
            .data(dataReady)
            .join('g')
            .append("text")
            .attr('x', (d, i) => 30 + i * 100)
            .attr('y', 30)
            .text(d => d.name)
            .style("fill", d => myColor(d.name))
            .style("font-size", 15)
            .on("click", function (event, d) {
                // is the element currently visible ?
                currentOpacity = d3.selectAll("." + d.name).style("opacity")
                // Change the opacity: from 0 to 1 or from 1 to 0
                d3.selectAll("." + d.name).transition().style("opacity", currentOpacity === 1 ? 0 : 1)

            })
    })

