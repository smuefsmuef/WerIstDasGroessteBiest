/**** Chart 1: Bar Chart Life Quality vs. Threatened Species ****/
/** Source: https://d3-graph-gallery.com/graph/barplot_button_data_csv.html **/

// set the dimensions and margins of the graph
const margin = {top: 30, right: 30, bottom: 70, left: 120},
    width = 800 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg1 = d3.select("#my_barchart_horizontal")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


// Initialize the X axis
const x = d3.scaleLinear()
    .range([0, width])
const xAxis = svg1.append("g")
    .attr("transform", `translate(0,${height})`);

// Initialize the Y axis
const y = d3.scaleBand()
    .range([0, height])
    .padding(0.2)
const yAxis = svg1.append("g")
    .attr("class", "myYaxis");


// A function that create / update the plot for a given variable:
function update(selectedVar) {

    // Parse the Data
    d3.csv("./data/1_living_quality_threatened_animals_stacked.csv").then(function (data) {
        console.log(data)
        console.log(selectedVar)

        if (selectedVar === "Total_Index") {
            data.sort((a, b) => b[selectedVar] - a[selectedVar]);
            // Add Y axis
            y.domain(data.map(d => d.country));
            yAxis.transition().duration(2000)
                .call(d3.axisLeft(y))
                .style("text-anchor", "end")
                .style("font-size", "16px")

            // X axis
            x.domain([0, d3.max(data, d => d[selectedVar])])
            console.log(d3.max(data, d => d[selectedVar]))

            xAxis.transition().duration(1000)
                .call(d3.axisBottom(x))
                .selectAll("yAxisLabel")
                .attr("transform", "translate(5,0)")


            // text label for x axis
            svg1.append("svg:text")
                .attr("id", "textLabel")
                .attr("y", height + margin.bottom / 2)
                .attr("x", width / 2)
                .attr("dy", "1em")
                .attr("font-family", "sans-serif")
                .style("text-anchor", "middle")
                .style("fill", "white")
                .style("text-size", "18px")
                .text("Lebensqualität der Menschen [OECD Index]")

            // variable u: map data to existing bars
            const u = svg1.selectAll("rect")
                .data(data)

            // update bars
            u.join("rect")
                .transition()
                .duration(1000)
                .attr("x", x(0))
                .attr("y", d => y(d.country))
                .attr("width", d => x(d[selectedVar]))
                .attr("height", y.bandwidth())
                .attr("fill", d => colorPickerHuman(d.country))

        } else if (selectedVar === "Threatened_species_total") {
            data.sort((a, b) => a[selectedVar] - b[selectedVar]);
            // Add Y axis
            y.domain(data.map(d => d.country));
            yAxis.transition().duration(1000)
                .call(d3.axisLeft(y))
                .style("text-anchor", "left");

            // X axis
            x.domain([0, 40])

            xAxis.transition().duration(1000)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(5,0)")
                .style("text-anchor", "end");

            // text label for x axis
            svg1.select("#textLabel")
                .text(selectedVar)
                .attr("y", height + margin.bottom / 2)
                .attr("x", width / 2)
                .attr("dy", "1em")
                .attr("font-family", "sans-serif")
                .style("text-anchor", "middle")
                .style("fill", "white")
                .style("text-size", "18px")
                .text(null)
                .text("Bedrohte Tierarten [Anzahl]")

            // variable u: map data to existing bars
            const u = svg1.selectAll("rect")
                .data(data)

            // update bars
            u.join("rect")
                .transition()
                .duration(1000)
                .attr("x",  x(0))
                .attr("y", d => y(d.country))
                .attr("width", d => x(d[selectedVar]))
                .attr("height", y.bandwidth())
                .attr("fill", d => colorPickerAnimal(d.country))
        } else if (selectedVar === "Purchasing Power Index" || selectedVar === "Safety Index" || selectedVar === "Health Care Index" || selectedVar ==="Climate Index") {

            data.sort((a, b) => b[selectedVar] - a[selectedVar]);
            // Add Y axis
            y.domain(data.map(d => d.country));
            yAxis.transition().duration(2000)
                .call(d3.axisLeft(y))
                .style("text-anchor", "end")
                .style("font-size", "16px")

            // X axis
            x.domain([0, 50])

            xAxis.transition().duration(1000)
                .call(d3.axisBottom(x))
                .selectAll("yAxisLabel")
                .attr("transform", "translate(5,0)")


            // text label for x axis
            svg1.select("#textLabel")
                .text(selectedVar)
                .attr("y", height + margin.bottom / 2)
                .attr("x", width / 2)
                .attr("dy", "1em")
                .attr("font-family", "sans-serif")
                .style("text-anchor", "middle")
                .style("fill", "white")
                .style("text-size", "18px")

            // variable u: map data to existing bars
            const u = svg1.selectAll("rect")
                .data(data)

            // update bars
            u.join("rect")
                .transition()
                .duration(1000)
                .attr("x", x(0))
                .attr("y", d => y(d.country))
                .attr("width", d => x(d[selectedVar]))
                .attr("height", y.bandwidth())
                .attr("fill", d => colorPickerIndex(d.country))
        } else {

        data.sort((a, b) => b[selectedVar] - a[selectedVar]);
        // Add Y axis
        y.domain(data.map(d => d.country));
        yAxis.transition().duration(2000)
            .call(d3.axisLeft(y))
            .style("text-anchor", "end")
            .style("font-size", "16px")

        // X axis
        x.domain([0, 50])

        xAxis.transition().duration(1000)
            .call(d3.axisBottom(x))
            .selectAll("yAxisLabel")
            .attr("transform", "translate(5,0)")


        // text label for x axis
        svg1.append("text").remove()
            .attr("y", height + margin.bottom / 2)
            .attr("x", width / 2)
            .attr("dy", "1em")
            .attr("font-family", "sans-serif")
            .style("text-anchor", "middle")
            .style("fill", "white")
            .style("text-size", "18px")
            .text(selectedVar)

        // variable u: map data to existing bars
        const u = svg1.selectAll("rect")
            .data(data)

        // update bars
        u.join("rect")
            .transition()
            .duration(1000)
            .attr("x", x(0))
            .attr("y", d => y(d.country))
            .attr("width", d => -x(d[selectedVar]))
            .attr("height", y.bandwidth())
            .attr("fill", d => colorPickerAnimal(d.country))
    }
    })
}




function colorPickerHuman(c) {
    if (c === "Switzerland") {
        return "#eaff70";
    } else {
        return "#03a65c";
    }
}

function colorPickerAnimal(c) {
    if (c === "Switzerland") {
        return "#eaff70";
    } else {
        return "#fd7272";
    }
}

function changeLegend(selectedVar) {
    currentLegend = "";
    if (selectedVar === "Total_Index") {
        currentLegend = "Lebensqualität der Menschen [OECD Index]";
    } else {
        currentLegend = "Anteil bedrohter Tier- und Pflanzenarten [%]";
    }
    return currentLegend;
}

function colorPickerIndex(c) {
    if (c === "Switzerland") {
        return "#eaff70";
    } else {
        return "#8dd8e7";
    }
}

// Initialize plot
        update('Total_Index')



