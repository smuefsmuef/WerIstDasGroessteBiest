// check https://d3-graph-gallery.com/graph/bubblemap_template.html
// https://gist.github.com/n1n9-jp/d12dde21cc192a86ba9a

// create svgMap canvas
const canvHeight = 600, canvWidth = 800;
const svgMap = d3.select("#europe") // body
    .append("svg")
    .attr("width", canvWidth/2)
    .attr("height", canvHeight/2)
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
    .text("And not so for {selectedOption}");

svgMap.append("text")
    .attr("id", "species")
    .attr("y", 50)
    .attr("x", margin_map.left + 150)
    .attr("dy", "1.5em")
    .text("How many % of a species are endangered?");


//------EVENTS-----------------------------------------------------

// create event handlers for mouse events
function mouseover(species, countryId, countryArea, landcover) {
    const percent = species[countryId];

    contextHolder.select("path")
        .attr("d", arc({startAngle: 0, endAngle: percent / 50 * Math.PI}));
    d3.select("#context-label").text("" + percent + "%");

    plotPieChart(landcover, countryId)
}

function mouseout(countries) {
    // countries.style("fill", "green");
}

function plotPieChart(landcover, countryId) {
    //https://gist.github.com/chilijung/7e548ce769135e15281c
    // todo next add plot for every country
    pieChartHolder.select("path")

    var width = 100,
        height = 100,
        // find the min of width and height and devided by 2
        radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var arcnew = d3.arc()
        // the outer radius of the pie chart.
        .outerRadius(radius - 20)
        // the inner radius of the pie chart, set 0 for now
        .innerRadius(0);

    // Constructs a new pie function
    var pie = d3.pie()
        // not sorting
        .sort(null)
        // set the pie chart value to population.
        .value(function (d) {
            return d.value;
        });

    // append a group
    var gp = pieChartHolder.selectAll(".arc")
        .data(pie(landcover))
        .enter().append("g")
        .attr("transform", "translate(50,50)") // mitte des elements
        .attr("class", "arc");

    // append path, the pie
    gp.append("path")
        .attr("d", arcnew)
        .style("fill", function (d) {
            return color(d.data.name);
        });

    // add text
    gp.append("text")
        .attr("transform", function (d) {
            return "translate(" + arc.centroid(d) + ")";
        })

        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function (d) {
            return d.data.name;
        });
}

//------LEGEND-----------------------------------------------------

// arc generator for donought plot - generiert svgMap element
const arc = d3.arc()
    .innerRadius(25)
    .outerRadius(45);


// kleines rechteck unten rechts..für donut plot
const contextHolder = createContextHolder();
const pieChartHolder = createPieChartHolder();

function createContextHolder() {
    const contextHolder = g.append("g")
        .attr("id", "context-holder")
        .attr("transform", `translate(${-40},${120})`);

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

function createPieChartHolder() {
    const holder = g.append("g")
        .attr("id", "context-holder-pie")
        .attr("transform", `translate(${40},${ 120})`);

    holder.append("rect")
        .attr("fill", "transparent")
        .attr("width", 100)
        .attr("height", 100);

    holder.append("path")
        .attr("transform", "translate(50,50)"); // mitte des elements

    holder.append("text")
        .attr("id", "context-label-pie")
        .attr("transform", "translate(50,50)");

    return holder;
}


// create legend
function createLegendEndangeredSpecies() {
// 1. create a group to hold the legend
    const index = g.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${-40},${40})`);

//  b. add coloured rect to legend_entry
    index.append("rect")
        .attr("x", 10)
        .attr("y", 20)
        .attr("width", 100)
        .attr("height", 20)
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
        .text("Endangered in %");

    index.append("text")
        .attr("x", 20)
        .attr("y", 60)
        .text("0");

    index.append("text")
        .attr("x", 100)
        .attr("y", 60)
        .text(">50%");

// 3. create the main border of the legend
    index.append("rect")
        .attr("x", 1)
        .attr("y", 1)
        .attr("width", 120)
        .attr("height", 70)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", "1");
}

createLegendEndangeredSpecies()

//-----------------------------------------------------------

function fillCountry(country, species, selectedOption) {
    country.style("fill", d => {
        const selected_species_data = species.find(e => e.type === selectedOption)
        const value = selected_species_data[d.properties.geounit]
        if (value > 0) {
            return "deeppink"
        } else {
            return "lightgray"
        }
    })
    country.style("fill-opacity", d => {
        const selected_species_data = species.find(e => e.type === selectedOption)
        const value = selected_species_data[d.properties.geounit]
        if (value > 50) {
            return 1
        } else {
            return value / 100
        }
        // alternatively set fix scale
        // if (value > 50) {
        //      return 1
        //  } else if (35 < value && value < 50) {
        //      return .7
        //  } else if (20 < value && value < 35) {
        //      return .5
        //  } else if (5 < value && value < 20) {
        //      return .3
        //  } else if (0 < value && value < 5) {
        //      return .2
        //  } else {
        //      return 1
        //  }
    })

}

function doPlot() {

    var selectedOption = 'Mammals';

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
            // alternativ die methode von oben aufsplitten, so dass pro kanton einzeln umrandung
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

      /*  // country label
        g.selectAll("text")
            .data(countries.features)
            .enter()
            .append("text")
            .attr("class", "country-label")
            .attr("transform", function (d) {
                return "translate(" + pathGenerator.centroid(d) + ")";
            })
            .attr("dy", ".35em")
            .text(function (d) {
                return d.properties.geounit;
            });
*/
        //  todo reactivate?  country bubble
        // g.selectAll("myCircles")
        //     .data(countries.features)
        //     .enter()
        //     .append("circle")
        //     .attr("transform", function(d) { return "translate(" + pathGenerator.centroid(d) + ")"; })
        //     .attr("r", 14)
        //     .style("fill", "69b3a2")
        //     .attr("stroke", "#69b3a2")
        //     .attr("stroke-width", 1)
        //     .attr("fill-opacity", .2)

        // events
        country.on("mouseover", (event, d) => {
            const selected_species_data = species.find(e => e.type === selectedOption)
            mouseover(selected_species_data, d.properties.geounit, d3.select(this), landcover)
        });

        country.on("mouseout", function () {
            mouseout(d3.select(this))
        });
    });
}

doPlot();
