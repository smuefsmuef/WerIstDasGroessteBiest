// check https://d3-graph-gallery.com/graph/bubblemap_template.html
// https://gist.github.com/n1n9-jp/d12dde21cc192a86ba9a

// create svgMap canvas
const canvHeight = 500, canvWidth = 800;
const svgMap = d3.select("#europe") // body
    .append("svg")
    .attr("width", canvWidth)
    .attr("height", canvHeight);


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
function mouseover(species, countryId) {
    const percent = species[countryId];
    console.log("species", species)
    console.log("countryId", countryId)
// todo fix display of percent - somehow it doesnt recognize all paths anymrore..
    if (percent !== undefined) {
        d3.select("#context-label").text("" + countryId + ": " + percent + "%");
    }
    console.log("mouseover: " + countryId + " " + percent + "%");
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
        .attr("transform", `translate(${-30},${190})`);

    contextHolder.append("rect")
        .attr("width", 100)
        .attr("height", 100)
        .attr("stroke", "white")

    contextHolder.append("path")
        .attr("transform", "translate(50,50)"); // mitte des elements

    contextHolder.append("text")
        .attr("id", "context-label")
        .attr("color", "white")
        .text("problem todo")
        .attr("transform", "translate(10,50)")
    return contextHolder;
}

// create legend slider
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
        .attr("x", 65)
        .attr("y", 15)
        .text("Bedroht (%)")
        .attr("fill", "#efedea")
        .attr("font-size", "1rem")
        .style("text-anchor", "middle");

    index.append("text")
        .attr("fill", "#efedea")
        .attr("font-size", "1rem")
        .attr("x", 10)
        .attr("y", 40)
        .text("0");

    index.append("text")
        .attr("fill", "#efedea")
        .attr("font-size", "1rem")
        .attr("x", 110)
        .attr("y", 40)
        .text(" >50");

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

//------BUTTONS-----------------------------------------------------
d3.select("#reptilien")
    .append("europe")

d3.select("#saeugetiere")
    .append("europe")

d3.select("#voegel")
    .append("europe")

d3.select("#amphibien")
    .append("europe")

d3.select("#fisch")
    .append("europe")

d3.select("#wirbellose")
    .append("europe")

d3.select("#all")
    .append("europe")


const animaltype = d3.select("#animal-type")
    .append("europe")
    .append("text")
    .attr("x", 65)
    .attr("y", 15)
    .text("Reptilien")
    .attr("text", function (d) {
        return d
    })
    .attr("fill", "#efedea")
    .attr("font-size", "1rem")
    .style("text-anchor", "middle");


//-----------------------------------------------------------

function fillCountry(country, species, selectedOption) {
    // https://online-free-tools.com/en/css_color_hex_gradient
    country.style("fill", d => {
        const selected_species_data = species.find(e => e.type === selectedOption)
        const value = selected_species_data[d.properties.geounit]
        if (value > 50) {
            return '#a2163e'
        } else if (40 < value && value < 50) {
            return '#B1405A'
        } else if (30 < value && value < 40) {
            return '#C16A76'
        } else if (20 < value && value < 30) {
            return '#D19492'
        } else if (10 < value && value < 20) {
            return '#E1BEAE'
        } else if (0 < value && value < 10) {
            return '#f1e8cb'
        } else {
            return "#333"
        }
    })
}


function doPlot(selectedOption) {
    var selectedOption = selectedOption

// europe topojson data from https://github.com/deldersveld/topojson/blob/master/continents/europe.json
    var projection = d3.geoMercator() // oder z.b. geoMercator
        .rotate([0, 0])
        .center([20, 55])
        .scale(400)
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

        var countries = topojson.feature(europe, europe.objects.continent_Europe_subunits); // kriegen die gazen grenzen/kantone


        // todo refactoring aller buttons
        d3.select("#reptilien").on("click", function (d) {
            selectedOption = d3.select(this).property("value")
            fillCountry(country, species, selectedOption)
            animaltype.text(selectedOption)
        })

        d3.select("#saeugetiere").on("click", function (d) {
            selectedOption = d3.select(this).property("value")
            fillCountry(country, species, selectedOption)
            animaltype.text(selectedOption)
        })
        d3.select("#voegel").on("click", function (d) {
            selectedOption = d3.select(this).property("value")
            fillCountry(country, species, selectedOption)
            animaltype.text(selectedOption)
        })
        d3.select("#amphibien").on("click", function (d) {
            selectedOption = d3.select(this).property("value")
            fillCountry(country, species, selectedOption)
            animaltype.text(selectedOption)
        })
        d3.select("#fisch").on("click", function (d) {
            selectedOption = d3.select(this).property("value")
            fillCountry(country, species, selectedOption)
            animaltype.text(selectedOption)
        })
        d3.select("#wirbellose").on("click", function (d) {
            selectedOption = d3.select(this).property("value")
            fillCountry(country, species, selectedOption)
            animaltype.text(selectedOption)
        })
        d3.select("#all").on("click", function (d) {
            selectedOption = d3.select(this).property("value")
            fillCountry(country, species, selectedOption)
            animaltype.text(selectedOption)
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

doPlot('Reptilien');
