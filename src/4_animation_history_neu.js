
(() => {
    d3.csv("./data/4_animation_neu.csv").then(function (data) {
// Breite und Höhe des Diagramms
        var width = 800;
        var height = 400;

// Erstellen Sie eine SVG-Komponente für das Diagramm
        var svg = d3.select("#animation_neu")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

// Konvertieren der Daten in das gewünschte Format
        var parsedData = data.map(function (d) {
            return {
                Jahr: parseInt(d.Jahr),
                Variable1: parseInt(d.Bevoelkerung),
                Variable2: parseInt(d.Landwirtschaftliche_Produktion),
                 Variable3: parseInt(d.Flaechenanteil_Auen),
                 Variable4: parseInt(d.Flaechenanteil_Hoch_und_Flachmoore),
                Variable5: parseInt(d.Trockenwiesen_Weiden)
            };
        });

// Berechnen des maximalen Werts für die Skalierung der x-Achse
        var maxDataValue = d3.max(parsedData, function (d) {
            return d3.max([d.Variable1, d.Variable2,d.Variable3, d.Variable4, d.Variable5]);
        });

        var minDataValue = d3.min(parsedData, function (d) {
            return d3.min([d.Variable1, d.Variable2, d.Variable3, d.Variable4, d.Variable5]);
        });
        console.log("Max DataValue" +maxDataValue)

// Skalierung der x-Achse
        var xScale = d3.scaleLinear()
            .domain([minDataValue, maxDataValue])
            .range([0, width]);

// Skalierung der y-Achse (für die Kategorien)
        var yScale = d3.scaleBand()
            .domain(["Variable1", "Variable2","Variable3", "Variable4", "Variable5"])
            .range([height, 0])
            .padding(0.1);

// Erstellen der horizontalen Barcharts für jede Variable
        svg.selectAll(".bar-variable1")
            .data(parsedData)
            .join("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return xScale(d3.min([100, d.Variable1])); })
            .attr("y", function() { return yScale("Variable1"); })
            .attr("width", 0)
            .attr("height", yScale.bandwidth())
            .style("fill", "red")
            .transition()
            .duration(10000) // Animation verlangsamt auf 8 Sekunden
            .attr("x", function(d) { return xScale(d.Variable1); })
            .attr("width", function(d) { return Math.abs(xScale(d.Variable1) - xScale(100)); })
            .delay(function(d, i) { return i * 100; }) // Verzögerung zwischen den Balken


        svg.selectAll(".bar-variable2")
            .data(parsedData)
            .join("rect")
            .attr("class", "bar-variable2")
            .attr("x", function() { return xScale(100); })
            .attr("y", function() { return yScale("Variable2"); })
            .attr("width", 0)
            .attr("height", yScale.bandwidth())
            .style("fill", "red")
            .transition()
            .duration(10000)
            .attr("x", function(d) { return xScale(d.Variable2); })
            .attr("width", function(d) { return Math.abs(xScale(d.Variable2) - xScale(100)); })
            .delay(function(d, i) { return i * 100; });

        svg.selectAll(".bar-variable3")
            .data(parsedData)
            .join("rect")
            .attr("class", "bar-variable3")
            .attr("x", function() { return xScale(100); })
            .attr("y", function() { return yScale("Variable3"); })
            .attr("width", 0)
            .attr("height", yScale.bandwidth())
            .style("fill", "green")
            .transition()
            .duration(10000)
            .attr("x", function(d) { return xScale(d.Variable3); })
            .attr("width", function(d) { return Math.abs(xScale(d.Variable3) - xScale(100)); })
            .delay(function(d, i) { return i * 100; });

        svg.selectAll(".bar-variable4")
            .data(parsedData)
            .join("rect")
            .attr("class", "bar-variable4")
            .attr("x", function() { return xScale(100); })
            .attr("y", function() { return yScale("Variable4"); })
            .attr("width", 0)
            .attr("height", yScale.bandwidth())
            .style("fill", "green")
            .transition()
            .duration(10000)
            .attr("x", function(d) { return xScale(d.Variable4); })
            .attr("width", function(d) { return Math.abs(xScale(d.Variable4) - xScale(100)); })
            .delay(function(d, i) { return i * 100; });

        svg.selectAll(".bar-variable5")
            .data(parsedData)
            .join("rect")
            .attr("class", "bar-variable5")
            .attr("x", function() { return xScale(100); })
            .attr("y", function() { return yScale("Variable5"); })
            .attr("width", 0)
            .attr("height", yScale.bandwidth())
            .style("fill", "green")
            .transition()
            .duration(10000)
            .attr("x", function(d) { return xScale(d.Variable5); })
            .attr("width", function(d) { return Math.abs(xScale(d.Variable5) - xScale(100)); })
            .delay(function(d, i) { return i * 100; });

        // Erstellen der Jahreszahl-Anzeige
        var yearLabel = svg.append("text")
            .attr("class", "year-label")
            .attr("x", width / 2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .attr("font-size", "30px")
            .attr("fill", "#ffffff");

// Funktion zum Anzeigen der Jahreszahl
        function showYear(year) {
            yearLabel.text(year);
        }

// Animation der Jahreszahlen
        var years = [1900, 1915, 1930, 1945, 1960, 1975, 1990, 2005, 2014, 2022];
        var duration = 10000;
        var delay = duration / years.length;

        years.forEach(function(year, index) {
            setTimeout(function() {
                showYear(year);
            }, index * delay);
        });



        // Beschriftung der Balken
        svg.selectAll(".bar-label-variable1")
            .data(parsedData)
            .join("text")
            .attr("class", "bar-label-variable1")
            .attr("x", function(d) { return d3.min([xScale(d.Variable1), xScale(100)]); })
            .attr("y", function(d, i) { return yScale(d.Variable1) + yScale.bandwidth() / 2 + i * (yScale.bandwidth() + 5); })
            .attr("dx", -5)
            .attr("dy", 4)
            .attr("text-anchor", "end")
            .attr("font-size", "20px")
            .attr("fill", "#ffffff")
            .text(function(d) { return d.Variable1; });

        svg.selectAll(".bar-label-variable2")
            .data(parsedData)
            .join("text")
            .attr("class", "bar-label-variable2")
            .attr("x", function(d) { return d3.min([xScale(d.Variable2), xScale(100)]); })
            .attr("y", function(d, i) { return yScale(d.Variable2) + yScale.bandwidth() / 2 + i * (yScale.bandwidth() + 5); })
            .attr("dx", -5)
            .attr("dy", 4)
            .attr("text-anchor", "end")
            .attr("font-size", "20px")
            .attr("fill", "#ffffff")
            .text(function(d) { return d.Variable2; });

        svg.selectAll(".bar-label-variable3")
            .data(parsedData)
            .join("text")
            .attr("class", "bar-label-variable3")
            .attr("x", function(d) { return d3.min([xScale(d.Variable3), xScale(100)]); })
            .attr("y", function(d, i) { return yScale(d.Variable3) + yScale.bandwidth() / 2 + i * (yScale.bandwidth() + 5); })
            .attr("dx", -5)
            .attr("dy", 4)
            .attr("text-anchor", "end")
            .attr("font-size", "20px")
            .attr("fill", "#ffffff")
            .text(function(d) { return d.Variable3; });

    });
})();