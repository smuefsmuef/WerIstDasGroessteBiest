/**** Chart 3: Treemap of Area of Biotopes and number of animals living there ****/
/** Possible Source: https://d3-graph-gallery.com/graph/treemap_custom.html**/

    // set the dimensions and margins of the graph
// const margin = {top: 10, right: 10, bottom: 10, left: 10},
//     width = 445 - margin.left - margin.right,
//     height = 445 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg3 = d3.select("#my_treemap")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        `translate(${margin.left}, ${margin.top})`);

// read json data
d3.json("./data/3_test_data.json").then(function (data) {
    console.log(data)
    // Give the data to this cluster layout:
    const root = d3.hierarchy(data).sum(function (d) {
        return d.value
    }) // Here the size of each leave is given in the 'value' field in input data

    // Then d3.treemap computes the position of each element of the hierarchy
    d3.treemap()
        .size([width, height])
        .paddingTop(28)
        .paddingRight(7)
        .paddingInner(3)      // Padding between each rectangle
        //.paddingOuter(6)
        //.padding(20)
        (root)

    // prepare a color scale

    const color = d3.scaleOrdinal()
        .domain(["Insekten","Reptilien", "Fische",  "Säugetiere", "Vögel", "Amphibien"])
        .range(["#ffa8f2", "#dec2ff", "#70fffa", "#eaff70", "#ffc170", "#b5a8ff"])

    // And a opacity scale
    const opacity = d3.scaleLinear()
        .domain([500, 0])
        .range([0, 1])

    // use this information to add rectangles:
    svg3
        .selectAll("rect")
        .data(root.leaves())
        .join("rect")
        .attr('x', function (d) {
            return d.x0;
        })
        .attr('y', function (d) {
            return d.y0;
        })
        .attr('width', function (d) {
            return d.x1 - d.x0;
        })
        .attr('height', function (d) {
            return d.y1 - d.y0;
        })
        .style("stroke", "black")
        //.style("fill", function (d) {
        // return color(d.data.color)
        // })
        .style("fill", function (d) {
            return color(d.parent.data.name)
        })
        .style("opacity", function (d) {
            return opacity(d.data.value)
        })

    // and to add the text labels
    // svg3
    //     .selectAll("text")
    //     .data(root.leaves())
    //     .enter()
    //     .append("text")
    //     .attr("x", function (d) {
    //         return d.x0 + 5
    //     })    // +10 to adjust position (more right)
    //     .attr("y", function (d) {
    //         return d.y0 + 20
    //     })    // +20 to adjust position (lower)
    //     .text(function (d) {
    //         return d.data.name.replace('mister_', '')
    //     })
    //     .attr("font-size", "12px")
    //     .attr("fill", "white")

    // and to add the text labels
    svg3
        .selectAll("vals")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", function (d) {
            return d.x0 +7
        })    // +10 to adjust position (more right)
        .attr("y", function (d) {
            return d.y0 + 10
        })    // +20 to adjust position (lower)
        .text(function (d) {
            return d.data.value
        })
        .attr("font-size", "30px")
        .attr("fill", "black")

    // Add title for the 3 groups
    svg3
        .selectAll("titles")
        .data(root.descendants().filter(function (d) {
            return d.depth == 1
        }))
        .enter()
        .append("text")
        .attr("x", function (d) {
            return d.x0 +30
        })
        .attr("y", function (d) {
            return d.y0+20
        })
        .text(function (d) {
            return d.data.name
        })
        .attr("font-size", "60px")
        .attr("font-weight", "bold")
        .attr("fill", function (d) {
            return color(d.data.name)
        })

    // Add title for the 3 groups
    svg3
        .append("text")
        .attr("x", 0)
        .attr("y", 14)    // +20 to adjust position (lower)
        .text("Alle bedrohten Tierarten der Schweiz")
        .attr("font-size", "60px")
        .attr("fill", "white")

})
