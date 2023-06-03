//https://d3-graph-gallery.com/graph/interactivity_transition.html

data = d3.csv("./data/4_animation_neu.csv").then(function(data) {
    // Code zur weiteren Verarbeitung der Daten hier
    console.log(data); // Beispielhafter Code zum Überprüfen der Daten
}).catch(function(error) {
    // Fehlerbehandlung hier
    console.log(error);
});

// Position der Kreise auf der X-Achse
var position = [50, 100, 150, 200, 250, 300, 350];

// Erstellen Sie eine SVG-Komponente für die Animation
const svg4b = d3.select("#my_barchart_horizontal")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

/// Fügen Sie die Kreise für die Animation hinzu
svg4b.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .style("fill", "red")
    .attr("cx", function(d, i) { return position[i]; })
    .attr("cy", 40)
    .attr("r", 10)
    .transition()
    .duration(2000)
    .attr("cy", function(d) { return d.Landwirtschaftliche_Produktion; }) // Ändern Sie "Variable1" entsprechend der gewünschten Variablen
    .delay(function(d, i) { return (i * 200); });

// Fügen Sie die Zeitachse hinzu
svg4b.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", function(d, i) { return position[i]; })
    .attr("y", 80)
    .text(function(d) { return d.Jahr; })
    .attr("text-anchor", "middle");

// Animation: put them down or up one by one
function triggerTransitionDelay() {
    d3.selectAll("circle")
        .transition()
        .duration(2000)
        .attr("cy", function(d) { return d.Landwirtschaftliche_Produktion; }) // Ändern Sie "Variable1" entsprechend der gewünschten Variablen
        .delay(function(d, i) { return (i * 10); });
}
