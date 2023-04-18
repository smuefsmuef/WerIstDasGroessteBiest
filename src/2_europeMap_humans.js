// check https://d3-graph-gallery.com/graph/bubblemap_template.html
// https://gist.github.com/n1n9-jp/d12dde21cc192a86ba9a

// create humansMaps canvas
const humansMaps = d3.select("#humans") // body
    .append("svg")
    .attr("width", canvWidth/2)
    .attr("height", canvHeight/2)
    .style("border", "1px solid");


// // create parent group and add left and top margin_map
const gh = humansMaps.append("g")
        .attr("id", "chart-area")
         .attr("transform", `translate(${margin_map.left},${margin_map.top})`)
;

// chart title
humansMaps.append("text")
    .attr("id", "chart-title")
    .attr("y", 0)
    .attr("x", margin_map.left)
    .attr("dy", "1.5em")
    .text("A nice life for Humans");


humansMaps.append("text")
    .attr("id", "species")
    .attr("y", 50)
    .attr("x", margin_map.left + 80)
    .attr("dy", "1.5em")
    .text("Living Quality Index in Europe");

function createLegendLifeIndex() {

    // 1. create a group to hold the legend
    const index = gh.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${-40},${120})`);

    //  b. add coloured rect to legend_entry
    index.append("rect")
        .attr("x", 10)
        .attr("y",  20)
        .attr("width", 100)
        .attr("height", 20)
        .classed('filled-human', true);

    // add gradient
    // https://gist.github.com/pnavarrc/20950640812489f13246;
    var mainGradient = index.append('linearGradient')
        .attr('id', 'mainGradient');

    mainGradient.append('stop')
        .attr('class', 'stop-left-human')
        .attr('offset', '0');

    mainGradient.append('stop')
        .attr('class', 'stop-right-human')
        .attr('offset', '1');

    index.append("text")
        .attr("x", 60)
        .attr("y", 15)
        .text("Life Quality Index Points");

    index.append("text")
        .attr("x", 20)
        .attr("y", 60)
        .text("0");

    index.append("text")
        .attr("x", 100)
        .attr("y", 60)
        .text("100");

    // 3. create the main border of the legend
    index.append("rect")
        .attr("x", 1)
        .attr("y", 1)
        .attr("width", 120)
        .attr("height", 70)
        .attr("fill", "none")
        .attr("stroke", "none")
        ;
}
createLegendLifeIndex()


function fillCountriesWithLifeQualityValue(country, life_index_data) {
    country.style("fill", d => {
        const value = life_index_data[d.properties.geounit]
        if (value > 0) {
            return "#00655e"
        } else {
            return "lightgray"
        }
    })
    country.style("fill-opacity", d => {
        const value = life_index_data[d.properties.geounit]
        if (value > 90) {
            return .9
        } else if (80 < value && value < 90) {
            return .7
        } else if (70 < value && value < 80) {
            return .5
        } else if (60 < value && value < 70) {
            return .3
        } else if (50 < value && value < 60) {
            return .2
        } else if (1 < value && value < 50) {
            return .1
        } else {
            return 1
        }
    })

}

function doPlot() {

// europe topojson data from https://github.com/deldersveld/topojson/blob/master/continents/europe.json
    var projection_human = d3.geoMercator() // oder z.b. geoMercator
        .rotate([0, 0])
        .center([40, 30])
        .scale(200)
        .translate([width_map / 2, height_map / 2])
        .precision(.1);

    var pathGenerator = d3.geoPath()
        .projection(projection_human); // albers projection

    // get data
    Promise.all(
        [
            d3.json("./data/2_europe.json"),
            d3.csv("./data/2_europe_humans.csv")
        ]
    ).then(function (data) {
        var europe = data[0];
        var life_index_data = data[1];

        var countries = topojson.feature(europe, europe.objects.continent_Europe_subunits);

        const country_humans = gh.selectAll("path.countries")
            .data(countries.features)
            .enter()
            .append("path")
            .attr("id", d => d.id)
            .attr("class", "countries")
            .attr("d", pathGenerator);

        //initially color the country
        fillCountriesWithLifeQualityValue(country_humans, life_index_data[0])

        // boundaries of each country
        gh.append("path")
            .datum(topojson.mesh(europe, europe.objects.continent_Europe_subunits))
            .attr("class", "europe-boundary")
            .attr("d", pathGenerator);

    });

}

doPlot();
