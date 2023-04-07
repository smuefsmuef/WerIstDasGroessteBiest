// check https://d3-graph-gallery.com/graph/bubblemap_template.html
// https://gist.github.com/n1n9-jp/d12dde21cc192a86ba9a

// create svgMap canvas
const canvHeight = 600, canvWidth = 960;
const svgMap = d3.select("#europe") // body
    .append("svg")
    .attr("width", canvWidth)
    .attr("height", canvHeight)
    .style("border", "1px solid");

// calc the width and height depending on margin_maps.
const margin_map = {top: 50, right: 80, bottom: 50, left: 60};
const width_map = canvWidth - margin_map.left - margin_map.right;
const height_map = canvHeight - margin_map.top - margin_map.bottom;

// // create parent group and add left and top margin_map
const g = svgMap.append("g")
    .attr("id", "chart-area")
    .attr("transform", `translate(${margin_map.left},${margin_map.top})`);

// chart title
svgMap.append("text")
    .attr("id", "chart-title")
    .attr("y", 0)
    .attr("x", margin_map.left)
    .attr("dy", "1.5em")
    .text("Endangered species in Europe:");

svgMap.append("text")
    .attr("id", "species")
    .attr("y", 50)
    .attr("x", margin_map.left + 150)
    .attr("dy", "1.5em")
    .text("How many % of a species are endangered?");


//------EVENTS-----------------------------------------------------

// create event handlers for mouse events
function mouseover(species, countryId, countryArea) {
    var percent = species[countryId];
    contextHolder.select("path")
        .attr("d", arc({startAngle: 0, endAngle: percent / 50 * Math.PI}));
    d3.select("#context-label").text("" + percent + "%");
    console.log('countries percentage', percent)
}

function mouseout(countries) {
    // countries.style("fill", "green");
}


//------LEGEND-----------------------------------------------------

// arc generator for donought plot - generiert svgMap element
const arc = d3.arc()
    .innerRadius(25)
    .outerRadius(45);


// create legend
let legendDomain = ["<5%", "5-20%", "20-35%", "35-50%", ">50%"];


// kleines rechteck unten rechts..für donut plot
const contextHolder = createContextHolder();
const legendHolder = createLegend(legendDomain);

function createContextHolder() {
    const contextHolder = g.append("g")
        .attr("id", "context-holder")
        .attr("transform", `translate(${width_map - 180},${height_map - 80})`);
    contextHolder.append("rect")
        .attr("width", 100)
        .attr("height", 100);
    contextHolder.append("path")
        .attr("transform", "translate(50,50)"); // mitte des elements
    contextHolder.append("text")
        .attr("id", "context-label")
        .attr("transform", "translate(50,50)");
    return contextHolder;
}


function createLegend(legendDomain) {

    // 1. create a group to hold the legend
    const legend = g.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${10},${90})`);

    // 2. create the legend boxes and the text label
    //   a. use .data(legendDomain) on an empty DOM selection
    //      store enter()-loop in variable legend_entry
    const legend_entry = legend.selectAll("rect")
        .data(legendDomain)
        .enter();

    //   b. add coloured rect to legend_entry
    legend_entry.append("rect")
        .attr("x", 10)
        .attr("y", (d, i) => 30 * i + 10)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", "deeppink")
        .attr("fill-opacity", (d, i) => (i + 1) * 0.2)
        .attr("stroke", "black")
        .attr("stroke-width", "1");


    //   c. add text label to legend_entry
    legend_entry.append("text")
        .attr("x", 50)
        .attr("y", (d, i) => 30 * i + 25)
        .text(d => d);

    // 3. create the main border of the legend
    legend.append("rect")
        .attr("x", 1)
        .attr("y", 1)
        .attr("width", margin.right + 50)
        .attr("height", legendDomain.length * 30 + 10)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", "1");
}


//-----------------------------------------------------------

function fillCountry(country, species, selectedOption) {
    country.style("fill", d => {
        const selected_species_data = species.find(e => e.type === selectedOption)
        const value = selected_species_data[d.properties.geounit]
        console.log(selectedOption, 'selected Option')
        console.log(selected_species_data, 'selected_species_data')
        if (value > 0) {
            return "deeppink"
        } else {
            return "lightgray"
        }
    })
    country.style("fill-opacity", d => {
        const selected_species_data = species.find(e => e.type === selectedOption)
        const value = selected_species_data[d.properties.geounit]
        console.log(selectedOption, 'selected Option')
        console.log(selected_species_data, 'selected_species_data')
        // todo maybe use exact percentage instead of own steps?
        if (value > 50) {
            return .9
        } else if (35 < value && value < 50) {
            return .7
        } else if (20 < value && value < 35) {
            return .5
        } else if (5 < value && value < 20) {
            return .3
        } else if (0 < value && value < 5) {
            return .2
        } else {
            return 1
        }
    })

}

function doPlot() {

    var selectedOption = 'Mammals';

// europe topojson data from https://github.com/deldersveld/topojson/blob/master/continents/europe.json
    var projection = d3.geoMercator() // oder z.b. geoMercator
        .rotate([0, 0])
        .center([10, 57])
        .scale(500)
        .translate([width_map / 2, height_map / 2])
        .precision(.1);

    var pathGenerator = d3.geoPath()
        .projection(projection); // albers projection

    Promise.all(
        [
            d3.json("./data/2_europe.json"),
            d3.csv("./data/2_europe_threatend_species.csv")
        ]
    ).then(function (data) {
        var europe = data[0];
        var species = data[1];

        // List of groups (here I have one group per column)
        var species_groups = species.map(i => i.type)

        var selected_species_data = species.find(e => e.type === selectedOption)


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
            // alternativ die methode von oben aufsplitten, so dass pro kanton einzeln umrandung
            .data(countries.features)
            .enter()
            .append("path")
            .attr("id", d => d.id)
            .attr("class", "countries")
            .attr("d", pathGenerator);

        // initially color the country
        fillCountry(country, species, selectedOption)


        country.on("mouseover", (event, d) => {
            console.log(selectedOption, 'this.selectedGroup')
            console.log(d.properties.geounit, 'country') // country
            const selected_species_data = species.find(e => e.type === selectedOption)
            mouseover(selected_species_data, d.properties.geounit, d3.select(this))
        });

        country.on("mouseout", function () {
            mouseout(d3.select(this))
        });

        // boundaries of each country
        g.append("path")
            .datum(topojson.mesh(europe, europe.objects.continent_Europe_subunits))
            .attr("class", "europe-boundary")
            .attr("d", pathGenerator);

        /*  // country label
          g.selectAll("text")
              .data(countries.features)
              .enter()
              .append("text")
              .attr("class", "country-label")
              .attr("transform", function(d) { return "translate(" + pathGenerator.centroid(d) + ")"; })
              .attr("dy", ".35em")
              .text(function (d) {
                  return d.properties.geounit;
              });*/


    });


}

doPlot();
