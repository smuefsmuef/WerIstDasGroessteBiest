// check https://d3-graph-gallery.com/graph/bubblemap_template.html
// https://gist.github.com/n1n9-jp/d12dde21cc192a86ba9a

const canvHeightHuman = 600, canvWidthHuman = 800;
// calc the width and height depending on margin_mapHumans.
const margin_mapHuman = {top: 80, right: 80, bottom: 50, left: 70};
const width_mapHuman = canvWidthHuman - margin_mapHuman.left - margin_mapHuman.right;
const height_mapHuman = canvHeightHuman - margin_mapHuman.top - margin_mapHuman.bottom;

// create humansMaps canvas
const humansMaps = d3.select("#humans") // body
    .append("svg")
    .attr("width", canvWidthHuman)
    .attr("height", canvHeightHuman);


// // create parent group and add left and top margin_mapHuman
const gh = humansMaps.append("g")
    .attr("id", "chart-area")
    .attr("transform", `translate(${margin_mapHuman.left},${margin_mapHuman.top})`)
;


//------LEGEND-----------------------------------------------------

function createLegendLifeIndex() {

    // 1. create a group to hold the legend
    const index = gh.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${-80},${-55})`);

    // gradient
    index.append("rect")
        .attr("x", 10)
        .attr("y", 20)
        .attr("width", 120)
        .attr("height", 5)
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
        .attr("x", 70)
        .attr("y", 15)
        .attr("font-size", "1.1rem")
        .attr("fill", "#efedea")
        .text("Life Quality Index (Pkt.)")
        .style("text-anchor", "middle");

    index.append("text")
        .attr("x", 10)
        .attr("y", 40)
        .attr("font-size", "1rem")
        .attr("fill", "#efedea")
        .text("50");

    index.append("text")
        .attr("x", 110)
        .attr("y", 40)
        .attr("font-size", "1rem")
        .attr("fill", "#efedea")
        .text("100");

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
        .attr("y", (d,i) => 30 * i + 50)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill",  "#333")
        .attr("stroke", "black")
        .attr("stroke-width", "1");

    index.append("text")
        .attr("x", 33)
        .attr("y", 65)
        .attr("font-size", "1rem")
        .attr("fill", "#efedea")
        .text("k.A.");
}

createLegendLifeIndex()


function fillCountriesWithLifeQualityValue(country, life_index_data) {
    country.style("fill", d => {
        const value = life_index_data[d.properties.geounit]
        if (value > 90) {
            return '#69E3C2'
        } else if (80 < value && value < 90) {
            return '#82CEAC'
        } else if (70 < value && value < 80) {
            return '#9BB996'
        } else if (60 < value && value < 70) {
            return '#B4A480'
        } else if (50 < value && value < 60) {
            return '#CD8F6A'
        } else if (0 < value && value < 50) {
            return '#FF653E'
        } else {
            return "#333"
        }
    })
}

function doPlotHumans() {

// europe topojson data from https://github.com/deldersveld/topojson/blob/master/continents/europe.json
    var projection_human = d3.geoMercator() // oder z.b. geoMercator
        .rotate([0, 0])
        .center([30, 55])
        .scale(430)
        .translate([width_mapHuman / 2, height_mapHuman / 2])
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
            .attr("d", pathGenerator)         .attr("class", "europe-boundary");

        //initially color the country
        fillCountriesWithLifeQualityValue(country_humans, life_index_data[0])

        // boundaries of each country
        gh.append("path")
            .datum(topojson.mesh(europe, europe.objects.continent_Europe_subunits.geometries))
            .attr("class", "europe-boundary")
            .attr("d", pathGenerator);

        country_humans.on("mouseover", (event, d) => {
         const percent = life_index_data[0]['France']
        console.log(life_index_data[0],
            )


            console.log("ed", d.properties.geounit)
            console.log("esd", percent)
            mouseover(d.properties.geounit, percent)
        });

        country_humans.on("mouseout", function () {
            mouseout(d3.select(this))
        });
    });

}

doPlotHumans();
