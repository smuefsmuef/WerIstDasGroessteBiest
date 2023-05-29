// check https://d3-graph-gallery.com/graph/bubblemap_template.html
// https://gist.github.com/n1n9-jp/d12dde21cc192a86ba9a

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
function mouseover(species, countryId) {
    const percent = species[countryId];
    if (percent !== undefined && percent !== '0') {
        d3.select("#context-label").text(translateCountryName(countryId) + ": " + percent + "% der " + species.type + " bedroht.");
    }
}

function mouseout() {
    d3.select("#context-label").text(" ");
}


//------LEGEND-----------------------------------------------------


createContextHolder();

function createContextHolder() {
    const contextHolder = g.append("g")
        .attr("id", "context-holder")
        .attr("transform", `translate(${-135},${20})`)

    contextHolder.append("text")
        .attr("x", 65)
        .attr("y", 15)
        .attr("id", "context-label")
        .attr("fill", "#FF0000FF")
        .style("text-anchor", "left");
    return contextHolder;
}

// create legend slider
function createLegendEndangeredSpecies() {
// 1. create a group to hold the legend
    const index = g.append("g")
        .attr("id", "legend")
      //  .attr("transform", `translate(${-80},${-80})`);
     //   .attr("transform", `translate(${330},${400})`);
.attr("transform", `translate(${-80},${-55})`);

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
        .attr("x", 110)
        .attr("y", 40)
        .text(" >70");

// 3. create the main border of the legend
    index.append("rect")
        .attr("x", 1)
        .attr("y", 1)
        .attr("width", 120)
        .attr("height", 70)
        .attr("fill", "none")
        .attr("stroke", "none");

    // grey box
    index.append("rect")
        .attr("x", 10)
        .attr("y", (d, i) => 30 * i + 50)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", "#333")
        .attr("stroke", "black")
        .attr("stroke-width", "1");

    index.append("text")
        .attr("x", 33)
        .attr("y", 65)
        .attr("font-size", "1rem")
        .attr("fill", "#efedea")
        .text("k.A.");
}

createLegendEndangeredSpecies()

//------SELECTS-----------------------------------------------------

const selectLabel = g.append("g")
    .attr("id", "legend")
    .attr("transform", `translate(${270},${-40})`); //oben rechts
   // .attr("transform", `translate(${-70},${45})`); // //oben links
   // .attr("transform", `translate(${-70},${485})`); // //unten links

//  b. add coloured rect to legend_entry
selectLabel.append("text")
    .attr("fill", "#efedea")
    .attr("x", 100)
    .attr("y", 0)
    .text("Untersuche die")

//  b. add coloured rect to legend_entry
selectLabel.append("text")
    .attr("fill", "#efedea")
    .attr("x", 100)
    .attr("y", 15)
    .text("Bedrohungslage:")

// Define the SVG pattern
var defs = selectLabel.append("defs");

function createPatterns(id) {
    defs.append("pattern")
       .attr("id", id)
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", 30)
        .attr("height", 30)
        .append("image")
        .attr("xlink:href", "/img/labels/"+ id +".jpg")
        .attr("width", 30)
        .attr("z-index", "199")
        .attr("height", 30);
    return "url(#" + id + ")";
}

selectLabel.append("circle")
    .attr("cx", 135 )
    .attr("cy", 60)
    .attr("r", 30)
   .attr("id", "reptilien")
    .style("fill", "purple")  // Apply the pattern as the fill
    .style("fill", createPatterns("reptilien"))  // Apply the pattern as the fill
    .attr("stroke", "black")
    .attr("class", "animal-select-button selected")
    .attr("stroke-width", "1")
    .attr("wert", function (d) {
        return "Reptilien"
    })
    .attr("type", "submit")



selectLabel.append("circle")
    .attr("cx", 135 )
    .attr("cy", 130)
    .attr("r", 30)
    .attr("fill", "green")
    .style("fill", createPatterns("amphibien"))  // Apply the pattern as the fill
    .attr("stroke", "black")
    .attr("class", "animal-select-button")
    .attr("stroke-width", "1")
    .attr("wert", function (d) {
        return "Amphibien"
    })
    .attr("type", "submit")
    .attr("id", "amphibien")

selectLabel.append("circle")
    .attr("cx", 135 )
    .attr("cy", 200)
    .attr("r", 30)
    .attr("fill", "lightblue")
   .style("fill", createPatterns("saeugetiere"))  // Apply the pattern as the fill

    .attr("stroke", "black")
    .attr("class", "animal-select-button")
    .attr("stroke-width", "1")
    .attr("wert", function (d) {
        return "Säugetiere"
    })
    .attr("type", "submit")
    .attr("id", "saeugetiere")

selectLabel.append("circle")
    .attr("cx", 135 )
    .attr("cy", 270)
    .attr("r", 30)
    .style("fill", createPatterns("voegel"))  // Apply the pattern as the fill
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
    .attr("cx", 135 )
    .attr("cy", 340)
    .attr("r", 30)
    .style("fill", createPatterns("fisch"))  // Apply the pattern as the fill
    .style("fill", "grey")  // Apply the pattern as the fill
    .attr("stroke", "black")
    .attr("class", "animal-select-button ")
    .attr("stroke-width", "1")
    .attr("wert", function (d) {
        return "Fische"
    })
    .attr("type", "submit")
    .attr("id", "fisch")


selectLabel.append("circle")
    .attr("cx", 135 )
    .attr("cy", 410)
    .attr("r", 30)
    .style("fill", createPatterns("wirbellose"))  // Apply the pattern as the fill
    .attr("fill", "blue")
    .attr("stroke", "black")
    .attr("class", "animal-select-button ")
    .attr("stroke-width", "1")
    .attr("wert", function (d) {
        return "Wirbellose"
    })
    .attr("type", "submit")
    .attr("id", "wirbellose")


/*selectLabel.append("circle")
    .attr("cx", 207 )
    .attr("cy", 20)
    .attr("r", 15)
    .attr("fill", "blue")
    .attr("stroke", "black")
    .attr("class", "animal-select-button ")
    .attr("stroke-width", "1")
    .attr("wert", function (d) {
        return "Pflanzen und Tiere"
    })
    .attr("type", "submit")
    .attr("id", "all")*/

// tierart in titel
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
        if (value > 70) {
            return '#A2163E';
        } else if (value > 60) {
            return '#AD3452';
        } else if (value > 50) {
            return '#B85266';
        } else if (value > 40) {
            return '#C3707A';
        } else if (value > 30) {
            return '#CF8E8E';
        } else if (value > 20) {
            return '#DAACA2';
        } else if (value > 10) {
            return '#E5CAB6';
        } else if (value > 0) {
            return '#F1E8CB';
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

        /* todo hover effect map
        let mouseOver = function(d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", .5)
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("stroke", "black")
        }
        let mouseLeave = function(d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", 1)
            d3.select(this)
                .transition()
                .duration(200)
                .style("stroke", "transparent")
        }
        */


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
        country.on("mouseover", (event, d) => {
            const selected_species_data = species.find(e => e.type === selectedOption)
            mouseover(selected_species_data, d.properties.geounit, d3.select(this))
        });

        country.on("mouseout", function () {
            mouseout(d3.select(this))
        });

        // todo refactoring aller buttons
        d3.selectAll("#reptilien").on("mouseover", function (d) {
            console.log("reptilien", this)
            selectedOption = d3.select(this).attr("wert")
            fillCountry(country, species, selectedOption)
            animaltype.text(selectedOption)
        })

        d3.selectAll("#saeugetiere").on("mouseover", function (d) {
            console.log("on hover saeugetiere", this)
            selectedOption = d3.select(this).attr("wert")
            fillCountry(country, species, selectedOption)
            animaltype.text(selectedOption)
        })

        d3.selectAll("#voegel").on("mouseover", function (d) {
            console.log("on hover oegel", this)

            selectedOption = d3.select(this).attr("wert")
            fillCountry(country, species, selectedOption)
            animaltype.text(selectedOption)
        })
        d3.selectAll("#amphibien").on("mouseover", function (d) {
            selectedOption = d3.select(this).attr("wert")
            fillCountry(country, species, selectedOption)
            animaltype.text(selectedOption)
        })
        d3.selectAll("#fisch").on("mouseover", function (d) {
            selectedOption = d3.select(this).attr("wert")
            fillCountry(country, species, selectedOption)
            animaltype.text(selectedOption)
        })
        d3.selectAll("#wirbellose").on("mouseover", function (d) {
            selectedOption = d3.select(this).attr("wert")
            fillCountry(country, species, selectedOption)
            animaltype.text(selectedOption)
        })
      /*  d3.select("#all").on("mouseover", function (d) {
            selectedOption = d3.select(this).attr("wert")
            fillCountry(country, species, selectedOption)
            animaltype.text(selectedOption)
        })
*/

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
