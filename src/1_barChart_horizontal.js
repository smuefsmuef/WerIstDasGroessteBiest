/**** Chart 1: Bar Chart Life Quality vs. Threatened Species ****/
/** Source: https://d3-graph-gallery.com/graph/barplot_button_data_csv.html **/

// set the dimensions and margins of the graph
const margin = {top: 30, right: 30, bottom: 70, left: 120},
    width = 500 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

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

// text label for x axis
svg1.append("svg:text")
    .attr("id", "textLabel")
    .attr("y", height + margin.bottom / 2)
    .attr("x", width / 2)
    .attr("dy", "1em")
    .attr("font-family", "sans-serif")
    .style("text-anchor", "middle")
    .style("fill", "#efedea")
    .style("text-size", "8px")
    .text("Lebensqualität der Menschen [OECD Index]")


// A function that create / update the plot for a given variable:
function update(selectedVar) {

    // Parse the Data
    d3.csv("./data/1_living_quality_threatened_animals_stacked.csv").then(function (data) {

        if (selectedVar === "Total_Index") {
            data.sort((a, b) => b[selectedVar] - a[selectedVar]);
            // Add Y axis
            y.domain(data.map(d => d.country));
            yAxis.transition().duration(4000)
                .call(d3.axisLeft(y))
                .style("text-anchor", "end")
                .style("font-size", "1rem")

            // X axis
            x.domain([0, d3.max(data, d => d[selectedVar])])

            xAxis.transition().duration(4000)
                .call(d3.axisBottom(x))
                .selectAll("yAxisLabel")
                .attr("transform", "translate(5,0)")


            // text label for x axis
            svg1.select("#textLabel")
                .text(selectedVar)
                .attr("y", height + margin.bottom / 2)
                .attr("x", width / 2)
                .attr("dy", "1rem")
                .attr("font-family", "sans-serif")
                .style("text-anchor", "middle")
                .style("fill", "#efedea")
                .style("text-size", "18px")
                .text("Lebensqualität der Menschen [OECD Index]")

            // variable u: map data to existing bars
            const u = svg1.selectAll("rect")
                .data(data);

            // update bars
            u.join("rect")
                .transition()
                .duration(4000)
                .attr("id", "humans")
                .attr("x", x(0))
                .attr("y", d => y(d.country))
                .attr("width", d => x(d[selectedVar]))
                .attr("height", y.bandwidth())
                .attr("fill", d => colorPickerHuman(d.country))


        } else if (selectedVar === "Threatened_species_total") {
            data.sort((a, b) => a[selectedVar] - b[selectedVar]);
            // Add Y axis
            y.domain(data.map(d => d.country));
            yAxis.transition().duration(4000)
                .call(d3.axisLeft(y))
                .style("text-anchor", "left");

            // X axis
            x.domain([0, 40])

            xAxis.transition().duration(4000)
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
                .style("fill", "#efedea")
                .style("text-size", "8px")
                .text(null)
                .text("Anteil bedrohter Tierarten [Prozent]")

            // variable u: map data to existing bars
            const u = svg1.selectAll("rect")
                .data(data);

            // update bars
            u.join("rect")
                .transition()
                .duration(5000)
                .attr("x", x(0))
                .attr("y", d => y(d.country))
                .attr("width", d => x(d[selectedVar]))
                .attr("height", y.bandwidth())
                .attr("fill", d => colorPickerAnimal(d.country))



        } else if (selectedVar === "Purchasing Power Index" || selectedVar === "Safety Index" || selectedVar === "Health Care Index" || selectedVar === "Climate Index") {

            data.sort((a, b) => b[selectedVar] - a[selectedVar]);
            // Add Y axis
            y.domain(data.map(d => d.country));
            yAxis.transition().duration(5000)
                .call(d3.axisLeft(y))
                .style("text-anchor", "end")
                .style("font-size", "1rem")

            // X axis
            x.domain([0, 50])

            xAxis.transition().duration(5000)
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
                .duration(5000)
                .attr("x", x(0))
                .attr("y", d => y(d.country))
                .attr("width", d => x(d[selectedVar]))
                .attr("height", y.bandwidth())
                .attr("fill", d => colorPickerHuman(d.country))
        } else {

            data.sort((a, b) => b[selectedVar] - a[selectedVar]);
            // Add Y axis
            y.domain(data.map(d => d.country));
            yAxis.transition().duration(5000)
                .call(d3.axisLeft(y))
                .style("text-anchor", "end")
                .style("font-size", "1rem")

            // X axis
            x.domain([0, 50])

            xAxis.transition().duration(5000)
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
                .duration(5000)
                .attr("x", x(0))
                .attr("y", d => y(d.country))
                .attr("width", d => -x(d[selectedVar]))
                .attr("height", y.bandwidth())
                .attr("fill", d => colorPickerAnimal(d.country))



        }
        function showLabel(event, d) {

            console.log(selectedVar, 'ssssssssssss')
            d3.select(this)
                .attr("opacity", "0.7");

            svg1.append("text")
                .attr("class", "bar-label")
                .attr("fill", "white")
                .attr("font-size", "0.9rem")
                .attr("x", d => {
                    if(selectedVar == "") {
                        return x(d[selectedVar]*-1) + 5;
                    } else return 5
                })
                .attr("y", y(d.country) + y.bandwidth() / 2)
                .attr("dy", "0.35em")
                .text(Number(d[selectedVar]).toFixed(2));
        }

        function hideLabel(event, d) {
            d3.select(this)
                .attr("opacity", "1");
            svg1.select(".bar-label").remove();
        }

        svg1.selectAll("rect")
            .on("mouseover", showLabel)
            .on("mouseout", hideLabel);
    })
}


function colorPickerHuman(c) {
    if (c === "Switzerland") {
        return "#FF6959";
    } else {
        return "#A7B3B4";
    }
}

function colorPickerAnimal(c) {
    if (c === "Switzerland") {
        return "#FF6959";
    } else {
        return "#A7B3B4";
    }

}

// Initialize plot
update('Total_Index')



