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

//------EVENTS-----------------------------------------------------

// create event handlers for mouse events
function mouseoverHumans(index_values, countryId) {
    const percent = index_values[countryId]
    if (percent !== undefined && percent !== '0') {
        d3.select("#context-label-4").text(translateCountryName(countryId) + ": ");
        d3.select("#context-label-5").text(percent);
        d3.select("#context-label-6").text("von 100 Punkten");
        d3.select("#context-label-7").text("(Klicken fixiert/löst den Wert.)");
    }
}

function mouseoutHumans() {
    d3.select("#context-label-4").text(" ");
    d3.select("#context-label-5").text(" ");
    d3.select("#context-label-6").text(" ");
    d3.select("#context-label-7").text(" ");
}

//------LEGEND-----------------------------------------------------
function createSliderLifeIndex() {

    // 1. create a group to hold the legend
    const index = gh.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${340},${400})`);

    // gradient
    index.append("rect")
        .attr("x", 10)
        .attr("y", 20)
        .attr("width", 110)
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
        .attr("x", 61)
        .attr("y", 15)
        .attr("font-size", "1.1rem")
        .attr("fill", "#efedea")
        .text("Quality of Life (Pkt.)")
        .style("text-anchor", "middle");

    index.append("text")
        .attr("x", 10)
        .attr("y", 40)
        .attr("font-size", "1rem")
        .attr("fill", "#efedea")
        .text("0");

    index.append("text")
        .attr("x", 100)
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
}

createSliderLifeIndex()

function createLegendLifeIndex() {

    // 1. create a group to hold the legend
    const index = gh.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${-80},${-95})`);

    // keine Angaben
    index.append("rect")
        .attr("x", 10)
        .attr("y", (d, i) => 30 * i + 80)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", "#333")
        .attr("stroke", "black")
        .attr("stroke-width", "1");

    index.append("text")
        .attr("x", 33)
        .attr("y", 93)
        .attr("font-size", "1rem")
        .attr("fill", "#efedea")
        .text("k.A.");

    index.append("rect")
        .attr("x", 10)
        .attr("y", (d, i) => 30 * i + 50)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", "#27374D")
        .attr("stroke", "black")
        .attr("stroke-width", "1");

    index.append("text")
        .attr("x", 33)
        .attr("y", 63)
        .attr("font-size", "1rem")
        .attr("fill", "#efedea")
        .text("sehr nettes Leben");

    index.append("rect")
        .attr("x", 130)
        .attr("y", (d, i) => 30 * i + 50)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", "#ACB5BA")
        .attr("stroke", "black")
        .attr("stroke-width", "1");

    index.append("text")
        .attr("x", 153)
        .attr("y", 63)
        .attr("font-size", "1rem")
        .attr("fill", "#efedea")
        .text("weniger nettes Leben");

}
createLegendLifeIndex()


function createContextHolderHumans() {
    const contextHolder4 = gh.append("g")
        .attr("id", "context-holder-4")
        .attr("transform", `translate(${-135},${120})`);

    const createText = (x, y, id, fill, text, textAnchor) => {
        return contextHolder4.append("text")
            .attr("x", x)
            .attr("y", y)
            .attr("id", id)
            .attr("fill", fill)
            .text(text)
            .style("text-anchor", textAnchor);
    };

    createText(65, 15, "context-label-4", "#FF6959", "Schweiz:", "left");
    createText(65, 40, "context-label-5", "#FF6959", "95.1", "right");
    createText(65, 55, "context-label-6", "#FF6959", "von 100 Pkt.", "left");
    createText(65, 69, "context-label-7", "#3C4B5E", "(Klicken fixiert/löst den Wert.)", "left")
        .attr("font-size", "0.9rem");
    return contextHolder4;
}
createContextHolderHumans();


function fillCountriesWithLifeQualityValue(country, life_index_data) {
    country.style("fill", d => {
        const value = life_index_data[d.properties.geounit]
        if (value > 90) {
            return '#27374D';
        } else if (value > 80) {
            return '#3C4B5E';
        } else if (value > 70) {
            return '#51606F';
        } else if (value > 60) {
            return '#677580';
        } else if (value > 50) {
            return '#7C8A91';
        } else if (value > 40) {
            return '#929EA3';
        } else if (value > 30) {
            return '#A7B3B4';
        } else if (value > 20) {
            return '#BDC8C5';
        } else if (value > 10) {
            return '#D2DDD6';
        } else if (value > 0) {
            return '#E8F2E8';
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
            .attr("d", pathGenerator).attr("class", "europe-boundary");

        //initially color the country
        fillCountriesWithLifeQualityValue(country_humans, life_index_data[0])

        // events
        var isClicked = false;
        country_humans.on("mouseover", (event, d) => {
            if (!isClicked) {
                mouseoverHumans(life_index_data[0], d.properties.geounit)
            }
        });

        country_humans.on("click", (event, d) => {
            mouseoverHumans(life_index_data[0], d.properties.geounit)
            isClicked = !isClicked;
        });

        country_humans.on("mouseout", function () {
            if (!isClicked) {
                mouseoutHumans(d3.select(this))
            }
        });

        // boundaries of each country
        gh.append("path")
            .datum(topojson.mesh(europe, europe.objects.continent_Europe_subunits.geometries))
            .attr("class", "europe-boundary")
            .attr("d", pathGenerator);

    });

}

doPlotHumans();


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

