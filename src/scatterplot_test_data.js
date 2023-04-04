// create svg canvas
const canvHeight = 600, canvWidth = 800;
const svg = d3.select("#my_scatterplot")
    .append("svg")
    .attr("width", canvWidth)
    .attr("height", canvHeight)
    .style("border", "1px solid");

// calc the width and height depending on margins.
const margin = {top: 50, right: 80, bottom: 50, left: 60};
const width = canvWidth - margin.left - margin.right;
const height = canvHeight - margin.top - margin.bottom;

// chart title
svg.append("text")
    .attr("y", 0)
    .attr("x", margin.left)
    .attr("dy", "1.5em")
    .attr("font-family", "sans-serif")
    .attr("font-size", "24px")
    .style("text-anchor", "left")
    .text("Quality of Life in different Countries");

// create parent group and add left and top margin
const g = svg.append("g")
    .attr("id", "chart-area")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// text label for the x axis
g.append("text")
    .attr("y", height + margin.bottom / 2)
    .attr("x", width / 2)
    .attr("dy", "1em")
    .attr("font-family", "sans-serif")
    .style("text-anchor", "middle")
    .text("Länder");

// text label for the y axis
g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("font-family", "sans-serif")
    .style("text-anchor", "middle")
    .text("Lebensqualität Index");

// function createLegend(legendDomain, colorScale) {
//     // 1. create a group to hold the legend
//     const legend = svg.append("g")
//         .attr("id", "legend")
//         .attr("transform", "translate(" + (canvWidth - margin.right + 10) + "," + margin.top + ")")

//     // 2. create the legend boxes and the text label
//     //    use .data(legendDomain) on an empty DOM selection
//     const legend_entry = legend.selectAll("rect")
//         .data(legendDomain)
//         .enter();
//
//     legend_entry.append("rect")
//         .attr("x", 10)
//         .attr("y", (d,i) => 30 * i + 10)
//         .attr("width", 20)
//         .attr("height", 20)
//         .attr("fill", d => colorScale(d))
//         .attr("stroke", "black")
//         .attr("stroke-width", "1");
//
//     legend_entry.append("text")
//         .attr("x", 40)
//         .attr("y", (d,i) => 30 * i + 25)
//         .text(d => d);
//
//     // 3. create the main border of the legend
//     legend.append("rect")
//        .attr("x", 1)
//         .attr("y", 1)
//         .attr("width", margin.right - 15)
//         .attr("height", legendDomain.length * 30 + 10)
//         .attr("fill", "none")
//         .attr("stroke", "black")
//         .attr("stroke-width", "1");
// }

// load the data from the cleaned csv file. 
// note: the call is done asynchronous. 
// That is why you have to load the data inside of a
// callback function.
d3.csv("./data/1_livingQuality_threatenedSpecies.csv").then(function (data) {
    const X = d3.extent(data, d => Number(d.Id));
    const Y = d3.extent(data, d => Number(d.Life_Quality));

    // 1. create scales for x and y direction and for the color coding
    const xScale = d3.scaleLinear()
        .rangeRound([0, width])
        .domain(X)
        .nice(5);

    const yScale = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain(Y)
        .nice(5);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // 2. create and append
    //    a. x-axis legend
    const xAxis = d3.axisBottom(xScale);
    g.append("g")  // create a group and add axis
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    //    b. y-axis legend
    const yAxis = d3.axisLeft(yScale);
    g.append("g")  // create a group and add axis
        .attr("id", "y-axis")
        .call(yAxis);

    // 3. add data-points (circle)
    var data_points = g.selectAll("circle")  // this is just an empty placeholder
        .data(data)   // join empty selection with data
        .enter()      // enter join-loop

        //Add circles
        .append("circle")
        .attr("class", "living_quality")
        .attr("cx", d => xScale(d.Id))
        .attr("cy", height)
        .attr("r", 20)
        .style("fill", "red")
        .transition()
        .duration(3000)
        // .duration(d =>
        //         500 * Math.log10(1000 * Math.sqrt(
        //             Math.pow(0 - xScale(d.Id), 2) +
        //             Math.pow(height - yScale(d.Life_Quality), 2)
        //         ))
        // )
        .ease(d3.easeElasticOut)
        .attr("cx", d => xScale(d.Id))
        .attr("cy", d => yScale(d.Life_Quality))
        .style("fill", "green")



    // 4. create legend
   // var legendDomain = ["S", "M", "L"];
   // createLegend(legendDomain, colorScale);
    
    var pointLabel = d3.select("body").append("div").classed("pointLabel", true);
    pointLabel.append("text")
        .attr("y", d => yScale(d.Life_Quality))
        .attr("x", d => xScale(d.Id))
        .attr("dy", "1em")
        .attr("font-family", "sans-serif")
        .style("text-anchor", "middle")
        .text("Länder")
    //.text("text", d => xScale(d.Country));


    // 5. Create tooltip
    //    a. create tooltip div and append to body.
    var tooltip = d3.select("body").append("div").classed("tooltip", true);

    //    b. add mouseover event and use tooltip.html() to change its content.
    //       Set style property 'visible', 'top' and 'left'
    g.selectAll("circle").on("mouseover", (event, d) => {
            var pos = d3.pointer(event, d);
            tooltip
                .style("left", pos[0] + "px")
                .style("top", pos[1] - 28 + "px")
                .style("visibility", "visible")
                .html(`${d["Country"]} <br/>`
                    + `Lebensqualität: ${d.Life_Quality}<br/>`
                    + `Id: ${d.Id}<br/>`
                    + `Prozent bedroht: ${d["Threatened_Species"]}`);
        })
            .on("mouseout", function(d,i) {
                tooltip.style("visibility", "hidden")
            });
});