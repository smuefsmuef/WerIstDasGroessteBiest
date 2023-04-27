/**** Chart 3: Treemap of Area of Biotopes and number of animals living there ****/

/** Possible Source: https://d3-graph-gallery.com/graph/treemap_custom.html**/

    // set the dimensions and margins of the graph
// const margin = {top: 10, right: 10, bottom: 10, left: 10},
//     width = 445 - margin.left - margin.right,
//     height = 445 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg3b = d3.select("#my_treemap_mammals")
        .append("svg")
        .attr("width", width*2 + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            `translate(${margin.left}, ${margin.top})`);

// read json data
d3.json("./data/3_treemap_mammals.json").then(function (data) {
    //console.log(data)

    // Give the data to this cluster layout:
    const root = d3.hierarchy(data)
        .sum(function (d) {
            return d.value
        }) // Here the size of each leave is given in the 'value' field in input data
        .sort((a, b) => a.height - b.height || a.value - b.value);

    // Then d3.treemap computes the position of each element of the hierarchy
    d3.treemap()
        .size([width*2, height])
        .paddingTop(28)
        .paddingRight(7)
        .paddingInner(3)      // Padding between each rectangle
        //.paddingOuter(6)
        //.padding(20)
        (root)


    // prepare a color scale

    const color = d3.scaleOrdinal()
        .domain(["Landtiere", "Meerestiere",  "Menschen", "Rinder", "Schweine","Büffel", "Ziegen", "Schafe", "Pferde", "Kamele", "Esel" ])
        .range(["#00bd4b", "#21caf1", "#eaff70", "#ff6352", "#ff6352", "#ff6352", "#ff6352", "#ff6352", "#ff6352", "#ff6352", "#ff6352"])

    // And a opacity scale
    // const opacity = d3.scaleLinear()
    //     .domain([100, 0])
    //     .range([0, 1])

    // use this information to add rectangles:
    svg3b
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
        //.style("stroke", "red")
        .style("fill", function (d) {
            return color(d.data.name)
        })
    //    .style("fill", function(d) { return d.data.colorsamp; })
    //  .style("fill", function (d) {
    //      return color(d.parent.data.colorsamp)
    //  })
    // .style("opacity", function (d) {
    //     return opacity(d.data.value)
    // })

    //and to add the text labels
    svg3b
        .selectAll("text")
        .data(root.leaves())
        .enter()
    .append("text")
    .attr("x", function (d) {
        return d.x0 + 5
    })    // +10 to adjust position (more right)
    .attr("y", function (d) {
        return d.y0 + 20
    })    // +20 to adjust position (lower)
    .text(function (d) {
        return d.data.name.replace('mister_', '')
    })
    .attr("font-size", "1rem")
    .attr("fill", "#efedea")

    // and to add the text labels
    // svg3b
    //     .selectAll("vals")
    //     .data(root.leaves())
    //     .enter()
    //     .append("text")
    //     .attr("x", function (d) {
    //         return d.x0 + 1
    //     })    // +10 to adjust position (more right)
    //     .attr("y", function (d) {
    //         return d.y0 + 12
    //     })    // +20 to adjust position (lower)
    //     .text(function (d) {
    //         return d.data.value
    //     })
    //     .attr("font-size", "14px")
    //     .attr("fill", "black")

    // Add title for the 3 groups
    svg3b
        .selectAll("titles")
        .data(root.descendants().filter(function (d) {
            return d.depth === 1
        }))
        .enter()
        .append("text")
        .attr("x", function (d) {
            return d.x0
        })
        .attr("y", function (d) {
            return d.y0 + 20
        })
        .text(function (d) {
            return d.data.name
        })
        .attr("font-size", "1rem")
        .attr("font-weight", "bold")
        // .attr("fill", function (d) {
        //     return color(d.data.color)
        // })
        .attr("fill", "#efedea")

    // Add title for the 3 groups
    // svg3
    //     .append("text")
    //     .attr("x", 0)
    //     .attr("y", 14)    // +20 to adjust position (lower)
    //     .text("Alle bedrohten Tierarten der Schweiz")
    //     .attr("text-align", "start")
    //     .attr("font-size", "30px")
    //     .attr("fill", "white")

})
