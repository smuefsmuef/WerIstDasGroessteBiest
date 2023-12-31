// create svgMap canvas
const canvHeight = 600, canvWidth = 800;
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
function mouseover(species, countryId, country) {
    const percent = species[countryId];
    if (percent !== undefined && percent !== '0') {
        d3.select("#context-label").text(translateCountryName(countryId) + ": ");
        d3.select("#context-label-2").text(percent + "%");
        d3.select("#context-label-3").text("der " + species.type + " bedroht.");
        d3.select("#context-label-8").text("(Klicken fixiert/löst den Wert.)");
    }
}

function mouseout() {
    d3.select("#context-label").text(" ");
    d3.select("#context-label-2").text(" ");
    d3.select("#context-label-3").text(" ");
    d3.select("#context-label-8").text(" ");
}


//------LEGEND-----------------------------------------------------


createContextHolder();

function createContextHolder() {
    const contextHolder = g.append("g")
        .attr("id", "context-holder")
        .attr("transform", `translate(${-135},${120})`);

    const createTextElement = (x, y, id, fill, text, anchor) => {
        return contextHolder.append("text")
            .attr("x", x)
            .attr("y", y)
            .attr("id", id)
            .attr("fill", fill)
            .text(text)
            .style("text-anchor", anchor);
    };

    createTextElement(65, 15, "context-label", "#FF6959", "Schweiz:", "left");
    createTextElement(65, 40, "context-label-2", "#FF6959", "78.9%", "right");
    createTextElement(65, 55, "context-label-3", "#FF6959", "der Reptilien bedroht.", "left");
    createTextElement(65, 69, "context-label-8", "#929EA3", "(Klicken fixiert/löst den Wert.)", "left")
        .attr("font-size", "0.9rem");

    return contextHolder;
}

// create legend slider
function createSliderEndangeredSpecies() {
// 1. create a group to hold the legend
    const index = g.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${340},${400})`);

    index.append("rect")
        .attr("x", 10)
        .attr("y", 20)
        .attr("width", 110)
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
        .text("Bedrohte Tierart (%)")
        .attr("fill", "#efedea")
        .attr("font-size", "1.1rem")
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
        .attr("x", 100)
        .attr("y", 40)
        .text("100");

// 3. create the main border of the legend
    index.append("rect")
        .attr("x", 1)
        .attr("y", 1)
        .attr("width", 120)
        .attr("height", 70)
        .attr("fill", "none")
        .attr("stroke", "none");

}
createSliderEndangeredSpecies()


//------SELECTS-----------------------------------------------------

const selectLabel = g.append("g")
    .attr("id", "legend")
    .attr("transform", `translate(${290},${-40})`);

selectLabel.append("text")
    .attr("fill", "#efedea")
    .attr("x", 110)
    .attr("y", 0)
    .text("Untersuche die")

selectLabel.append("text")
    .attr("fill", "#efedea")
    .attr("x", 110)
    .attr("y", 15)
    .text("Bedrohungslage:")

// svg pattern
var defs = selectLabel.append("defs");

function createPatterns(id) {
    defs.append("pattern")
        .attr("id", id)
        .attr("patternUnits", "objectBoundingBox")
        .attr("patternTransform", "translate(0,4)")
        .attr("width", 1)
        .attr("height", 1)
        .append("image")
        .attr("xlink:href", "./img/labels/" + id + ".jpg")
        .attr("width", 110)
        .attr("z-index", "199")
        .attr("height", 110);
    return "url(#" + id + ")";
}

selectLabel.append("circle")
    .attr("cx", 155)
    .attr("cy", 60)
    .attr("r", 25)
    .attr("id", "reptilien")
        .style("fill", "purple")
     .style("fill", createPatterns("reptilien"))
    .attr("stroke", "black")
    .attr("class", "animal-select-button")
    .classed("selected", true)
    .attr("stroke-width", "1")
    .attr("wert", function (d) {
        return "Reptilien"
    })


selectLabel.append("circle")
    .attr("cx", 155)
    .attr("cy", 120)
    .attr("r", 25)
    .attr("fill", "green")
    .style("fill", createPatterns("amphibien"))
    .attr("stroke", "black")
    .attr("class", "animal-select-button")
    .attr("stroke-width", "1")
    .attr("wert", function (d) {
        return "Amphibien"
    })
    .attr("type", "submit")
    .attr("id", "amphibien")

selectLabel.append("circle")
    .attr("cx", 155)
    .attr("cy", 180)
    .attr("r", 25)
    .attr("fill", "lightblue")
    .style("fill", createPatterns("saeugetiere"))
    .attr("stroke", "black")
    .attr("class", "animal-select-button")
    .attr("stroke-width", "1")
    .attr("wert", function (d) {
        return "Säugetiere"
    })
    .attr("type", "submit")
    .attr("id", "saeugetiere")

selectLabel.append("circle")
    .attr("cx", 155)
    .attr("cy", 240)
    .attr("r", 25)
    .style("fill", createPatterns("voegel"))
    .attr("fill", "lightyellow")
    .attr("stroke", "black")
    .attr("class", "animal-select-button ")
    .attr("stroke-width", "1")
    .attr("wert", function (d) {
        return "Vögel"
    })
    .attr("type", "submit")
    .attr("id", "voegel")

selectLabel.append("circle")
    .attr("cx", 155)
    .attr("cy", 300)
    .attr("r", 25)
    .style("fill", "grey")
    .style("fill", createPatterns("fisch"))
    .attr("stroke", "black")
    .attr("class", "animal-select-button ")
    .attr("stroke-width", "1")
    .attr("wert", function (d) {
        return "Fische"
    })
    .attr("type", "submit")
    .attr("id", "fisch")


selectLabel.append("circle")
    .attr("cx", 155)
    .attr("cy", 360)
    .attr("r", 25)
    .style("fill", createPatterns("wirbellosen"))
    .attr("fill", "blue")
    .attr("stroke", "black")
    .attr("class", "animal-select-button ")
    .attr("stroke-width", "1")
    .attr("wert", function (d) {
        return "Wirbellosen"
    })
    .attr("type", "submit")
    .attr("id", "wirbellosen")

// tierart in titel
const animaltype = d3.select("#animal-type")
    .append("europe")
    .append("text")
    .attr("x", 65)
    .attr("class", "animal-type")
    .attr("y", 15)
    .text("Reptilien")
    .attr("text", function (d) {
        return d
    })

    .attr("font-size", "1rem")
    .style("text-anchor", "middle");


//-----------------------------------------------------------

function fillCountry(country, species, selectedOption) {
    // https://online-free-tools.com/en/css_color_hex_gradient
    country.style("fill", d => {
        const selected_species_data = species.find(e => e.type === selectedOption)
        const value = selected_species_data[d.properties.geounit]
        if (value > 90) {
            return '#E8F2E8';
        } else if (value > 80) {
            return '#D2DDD6';
        } else if (value > 70) {
            return '#BDC8C5';
        } else if (value > 60) {
            return '#A7B3B4';
        } else if (value > 50) {
            return '#929EA3';
        } else if (value > 40) {
            return '#7C8A91';
        } else if (value > 30) {
            return '#677580';
        } else if (value > 20) {
            return '#51606F';
        } else if (value > 10) {
            return '#3C4B5E';
        } else if (value > 0) {
            return '#27374D';
        } else {
            return "#333"
        }
    })
}

function doPlot(selectedOption) {
    var selectedOption = selectedOption

// europe topojson data from https://github.com/deldersveld/topojson/blob/master/continents/europe.json
    var projection = d3.geoMercator()
        .rotate([0, 0])
        .center([30, 55])
        .scale(430)
        .translate([width_map / 2, height_map / 2])
        .precision(.1);

    var pathGenerator = d3.geoPath()
        .projection(projection); // albers projection


    // get data
    Promise.all(
        [
            d3.json("./data/2_europe.json"),
            d3.csv("./data/2_europe_threatend_species.csv"),
        ]
    ).then(function (data) {
        var europe = data[0];
        var species = data[1];

        var countries = topojson.feature(europe, europe.objects.continent_Europe_subunits); // kriegen die gazen grenzen/kantone

        const country = g.selectAll("path.countries")
            .data(countries.features)
            .enter()
            .append("path")
            .attr("id", d => d.id)
            .attr("class", "countries")
            .attr("d", pathGenerator)
            .attr("class", "europe-boundary");

        // boundaries of each country
        g.append("path")
            .datum(topojson.mesh(europe, europe.objects.continent_Europe_subunits.geometries))
            .attr("d", pathGenerator);

        // initially color the country
        fillCountry(country, species, selectedOption)


        // events
        var isClicked = false;
        country.on("mouseover", (event, d) => {
            if (!isClicked) {
                const selected_species_data = species.find(e => e.type === selectedOption)
                mouseover(selected_species_data, d.properties.geounit, d3.select(this))
            }
        });

        country.on("click", (event, d) => {
            const selected_species_data = species.find(e => e.type === selectedOption)
            mouseover(selected_species_data, d.properties.geounit, d3.select(this))
            isClicked = !isClicked;
        });

        country.on("mouseout", function () {
            if (!isClicked) {
                mouseout(d3.select(this))
            }
        });

        // animal type buttons (could need a refactoring)
        d3.selectAll("#reptilien").on("mouseover", function (d) {
            selectedOption = d3.select(this).attr("wert")
            fillCountry(country, species, selectedOption)
            animaltype.text(selectedOption)
            mouseout()
            isClicked = false;
            d3.selectAll("#reptilien").classed("selected", true)
            d3.selectAll("#saeugetiere").classed("selected", false)
            d3.selectAll("#voegel").classed("selected", false)
            d3.selectAll("#amphibien").classed("selected", false)
            d3.selectAll("#fisch").classed("selected", false)
            d3.selectAll("#wirbellose").classed("selected", false)
        })

        d3.selectAll("#saeugetiere").on("mouseover", function (d) {
            selectedOption = d3.select(this).attr("wert")
            fillCountry(country, species, selectedOption)
            animaltype.text(selectedOption)
            mouseout()
            isClicked = false;

            d3.selectAll("#saeugetiere").classed("selected", true)
            d3.selectAll("#reptilien").classed("selected", false)
            d3.selectAll("#voegel").classed("selected", false)
            d3.selectAll("#amphibien").classed("selected", false)
            d3.selectAll("#fisch").classed("selected", false)
            d3.selectAll("#wirbellosen").classed("selected", false)

        })

        d3.selectAll("#voegel").on("mouseover", function (d) {
            selectedOption = d3.select(this).attr("wert")
            fillCountry(country, species, selectedOption)
            animaltype.text(selectedOption)
            mouseout()
            isClicked = false;

            d3.selectAll("#voegel").classed("selected", true)
            d3.selectAll("#reptilien").classed("selected", false)
            d3.selectAll("#saeugetiere").classed("selected", false)
            d3.selectAll("#amphibien").classed("selected", false)
            d3.selectAll("#fisch").classed("selected", false)
            d3.selectAll("#wirbellosen").classed("selected", false)

        })
        d3.selectAll("#amphibien").on("mouseover", function (d) {
            selectedOption = d3.select(this).attr("wert")
            fillCountry(country, species, selectedOption)
            animaltype.text(selectedOption)
            mouseout()
            isClicked = false;

            d3.selectAll("#amphibien").classed("selected", true)
            d3.selectAll("#reptilien").classed("selected", false)
            d3.selectAll("#saeugetiere").classed("selected", false)
            d3.selectAll("#voegel").classed("selected", false)
            d3.selectAll("#fisch").classed("selected", false)
            d3.selectAll("#wirbellosen").classed("selected", false)
        })
        d3.selectAll("#fisch").on("mouseover", function (d) {
            selectedOption = d3.select(this).attr("wert")
            fillCountry(country, species, selectedOption)
            animaltype.text(selectedOption)
            mouseout()
            isClicked = false;
            d3.selectAll("#fisch").classed("selected", true)
            d3.selectAll("#reptilien").classed("selected", false)
            d3.selectAll("#saeugetiere").classed("selected", false)
            d3.selectAll("#voegel").classed("selected", false)
            d3.selectAll("#amphibien").classed("selected", false)
            d3.selectAll("#wirbellosen").classed("selected", false)

        })
        d3.selectAll("#wirbellosen").on("mouseover", function (d) {
            selectedOption = d3.select(this).attr("wert")
            fillCountry(country, species, selectedOption)
            animaltype.text(selectedOption)
            mouseout()
            isClicked = false;
            d3.selectAll("#wirbellosen").classed("selected", true)
            d3.selectAll("#reptilien").classed("selected", false)
            d3.selectAll("#saeugetiere").classed("selected", false)
            d3.selectAll("#voegel").classed("selected", false)
            d3.selectAll("#amphibien").classed("selected", false)
            d3.selectAll("#fisch").classed("selected", false)
        })

    });
}

doPlot('Reptilien');


function translateCountryName(countryId) {
    var translations = {
        "austria": "Österreich",
        "belgium": "Belgien",
        "czechrepublic": "Tschechische Republik",
        "denmark": "Dänemark",
        "estonia": "Estland",
        "finland": "Finnland",
        "france": "Frankreich",
        "germany": "Deutschland",
        "greece": "Griechenland",
        "hungary": "Ungarn",
        "iceland": "Island",
        "ireland": "Irland",
        "italy": "Italien",
        "latvia": "Lettland",
        "lithuania": "Litauen",
        "luxembourg": "Luxemburg",
        "netherlands": "Niederlande",
        "norway": "Norwegen",
        "poland": "Polen",
        "portugal": "Portugal",
        "slovakia": "Slowakei",
        "slovenia": "Slowenien",
        "spain": "Spanien",
        "sweden": "Schweden",
        "switzerland": "Schweiz",
        "england": "England"
    };

    var translatedName = translations[countryId.toLowerCase()];
    return translatedName || 'Translation not available';
}

