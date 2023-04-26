// check https://d3-graph-gallery.com/graph/bubblemap_template.html
// https://gist.github.com/n1n9-jp/d12dde21cc192a86ba9a

// create svgMap canvas
const canvHeight = 600, canvWidth = 800;
const svgMap = d3.select("#europe") // body
    .append("svg")
    .attr("width", canvWidth / 2)
    .attr("height", canvHeight / 2)
    .style("border", "1px solid");


// calc the width and height depending on margin_maps.
const margin_map = {top: 80, right: 80, bottom: 50, left: 70};
const width_map = canvWidth - margin_map.left - margin_map.right;
const height_map = canvHeight - margin_map.top - margin_map.bottom;

// // create parent group and add left and top margin_map
const g = svgMap.append("g")
    .attr("id", "chart-area")
    .attr("transform", `translate(${margin_map.left},${margin_map.top})`);


//------EVENTS-----------------------------------------------------

// create event handlers for mouse events
function mouseover(species, countryId, countryArea, landcover) {
    const percent = species[countryId];

    if (percent !== undefined) {
        d3.select("#context-label").text("" + countryId + ": " + percent + "%");
    }
    contextHolder.select("path")
}

function mouseout() {
    d3.select("#context-label").text("");
}


//------LEGEND-----------------------------------------------------

// arc generator for donought plot - generiert svgMap element
const arc = d3.arc()
    .innerRadius(25)
    .outerRadius(45);


// kleines rechteck unten rechts..für donut plot
const contextHolder = createContextHolder();

// const pieChartHolder = createPieChartHolder(); // todo maybe enable?

function createContextHolder() {
    const contextHolder = g.append("g")
        .attr("id", "context-holder")
        .attr("transform", `translate(${-40},${120})`);

    contextHolder.append("rect")
        .attr("width", 100)
        .attr("height", 100)
        .attr("stroke", "none");

    contextHolder.append("path")
        .attr("transform", "translate(50,50)"); // mitte des elements

    contextHolder.append("text")
        .attr("id", "context-label")
        .attr("transform", "translate(50,-40)")
    return contextHolder;
}

// create legend
function createLegendEndangeredSpecies() {
// 1. create a group to hold the legend
    const index = g.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${-40},${120})`);

//  b. add coloured rect to legend_entry
    index.append("rect")
        .attr("x", 10)
        .attr("y", 20)
        .attr("width", 120)
        .attr("height", 5)
        .classed('filled', true);

// add gradient
// https://gist.github.com/pnavarrc/20950640812489f13246;
    var mainGradientSpecies = index.append('linearGradient')
        .attr('id', 'mainGradientSpecies');

    mainGradientSpecies.append('stop')
        .attr('class', 'stop-left-species')
        .attr('offset', '0');

    mainGradientSpecies.append('stop')
        .attr('class', 'stop-right-species')
        .attr('offset', '1');

    index.append("text")
        .attr("x", 62)
        .attr("y", 15)
        .text("Vom Aussterben bedroht")
        .style("text-anchor", "middle");

    index.append("text")
        .attr("x", 20)
        .attr("y", 60)
        .text("0");

    index.append("text")
        .attr("x", 100)
        .attr("y", 60)
        .text("> 60%");

// 3. create the main border of the legend
    index.append("rect")
        .attr("x", 1)
        .attr("y", 1)
        .attr("width", 120)
        .attr("height", 70)
        .attr("fill", "none")
        .attr("stroke", "none");
}

createLegendEndangeredSpecies()

//-----------------------------------------------------------

function fillCountry(country, species, selectedOption) {
    country.style("fill", d => {
        const selected_species_data = species.find(e => e.type === selectedOption)
        const value = selected_species_data[d.properties.geounit]
        if (value >= 0) {
            return "red"
        } else {
            return "lightgray"
        }
    })
    country.style("fill-opacity", d => {
        const selected_species_data = species.find(e => e.type === selectedOption)
        const value = selected_species_data[d.properties.geounit]
        if (value > 60) {
            return 1
        } else {
            return value / 100
        }
    })

}

function doPlot() {

    var selectedOption = 'Reptilien';
// europe topojson data from https://github.com/deldersveld/topojson/blob/master/continents/europe.json
    var projection = d3.geoMercator() // oder z.b. geoMercator
        .rotate([0, 0])
        .center([40, 30])
        .scale(200)
        .translate([width_map / 2, height_map / 2])
        .precision(.1);

    var pathGenerator = d3.geoPath()
        .projection(projection); // albers projection

    // get data
    Promise.all(
        [
            d3.json("./data/2_europe.json"),
            d3.csv("./data/2_europe_threatend_species.csv"),
            d3.csv("./data/2_europe_land_cover_coordinates.csv") // reine testdaten todo fox
        ]
    ).then(function (data) {
        var europe = data[0];
        var species = data[1];
        var landcover = data[2];

        // List of groups (here I have one group per column)
        var species_groups = species.map(i => i.type)


        // add the options to the button
        // https://d3-graph-gallery.com/graph/line_select.html
        d3.select("#speciesButton")
            .selectAll('myOptions')
            .data(species_groups)
            .enter()
            .append('option')
            .text(function (d) {
                return d;
            }) // text showed in the menu
            .attr("value", function (d) {
                return d;
            }) // corresponding value returned by the button

        var countries = topojson.feature(europe, europe.objects.continent_Europe_subunits); // kriegen die gazen grenzen/kantone

        // When the button is changed, run the updateChart function
        d3.select("#speciesButton").on("change", function (d) {
            // recover the option that has been chosen
            selectedOption = d3.select(this).property("value")
            // run the updateChart function with this selected option
            // recolor countries
            fillCountry(country, species, selectedOption)
        })

        const country = g.selectAll("path.countries")
            .data(countries.features)
            .enter()
            .append("path")
            .attr("id", d => d.id)
            .attr("class", "countries")
            .attr("d", pathGenerator);

        // initially color the country
        fillCountry(country, species, selectedOption)

        // boundaries of each country
        g.append("path")
            .datum(topojson.mesh(europe, europe.objects.continent_Europe_subunits))
            .attr("class", "europe-boundary")
            .attr("d", pathGenerator);

        // events
        country.on("mouseover", (event, d) => {
            const selected_species_data = species.find(e => e.type === selectedOption)
            console.log(event, d)
            mouseover(selected_species_data, d.properties.geounit, d3.select(this))
        });

        country.on("mouseout", function () {
            mouseout(d3.select(this))
        });
    });
}

doPlot();
