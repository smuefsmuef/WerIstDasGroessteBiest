//with the help of ChatGPT

(() => {
    d3.csv("./data/4_animation_neu.csv").then(function (data) {
        var width = 800;
        var height = 180;

        var svg = d3.select("#animation_neu")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

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

        var maxDataValue = d3.max(parsedData, function (d) {
            return d3.max([d.Variable1, d.Variable2, d.Variable3, d.Variable4, d.Variable5]);
        });

        var minDataValue = d3.min(parsedData, function (d) {
            return d3.min([d.Variable1, d.Variable2, d.Variable3, d.Variable4, d.Variable5]);
        });
        console.log("Max DataValue" + maxDataValue)

        var xScale = d3.scaleLinear()
            .domain([minDataValue, maxDataValue])
            .range([0, width]);


        var yScale = d3.scaleBand()
            .domain(["Variable5", "Variable4", "Variable3", "Variable2", "Variable1"])
            .range([height, 0])
            .padding(0.1);


        svg.selectAll(".bar-variable1")
            .data(parsedData)
            .join("rect")
            .attr("class", "bar")
            .attr("x", xScale(100))
            .attr("y", function () {
                return yScale("Variable1");
            })
            .attr("width", 0)
            .attr("height", yScale.bandwidth())
            .style("fill", "#3C4B5E")
            .transition()
            .duration(10000)
            .attr("width", function (d) {
                return xScale(d.Variable1) - xScale(100);
            })
            .delay(function (d, i) {
                return i * 100;
            });

        svg.selectAll(".bar-variable2")
            .data(parsedData)
            .join("rect")
            .attr("class", "bar")
            .attr("x", xScale(100))
            .attr("y", function () {
                return yScale("Variable2");
            })
            .attr("width", 0)
            .attr("height", yScale.bandwidth())
            .style("fill", "#3C4B5E")
            .transition()
            .duration(10000)
            .attr("width", function (d) {
                return xScale(d.Variable2) - xScale(100);
            })
            .delay(function (d, i) {
                return i * 100;
            });


        svg.selectAll(".bar-variable3")
            .data(parsedData)
            .join("rect")
            .attr("class", "bar-variable3")
            .attr("x", function () {
                return xScale(100);
            })
            .attr("y", function () {
                return yScale("Variable3");
            })
            .attr("width", 0)
            .attr("height", yScale.bandwidth())
            .style("fill", "#FF6959")
            .transition()
            .duration(10000)
            .attr("x", function (d) {
                return xScale(d.Variable3);
            })
            .attr("width", function (d) {
                return Math.abs(xScale(d.Variable3) - xScale(100));
            })
            .delay(function (d, i) {
                return i * 100;
            });

        svg.selectAll(".bar-variable4")
            .data(parsedData)
            .join("rect")
            .attr("class", "bar-variable4")
            .attr("x", function () {
                return xScale(100);
            })
            .attr("y", function () {
                return yScale("Variable4");
            })
            .attr("width", 0)
            .attr("height", yScale.bandwidth())
            .style("fill", "#FF6959")
            .transition()
            .duration(10000)
            .attr("x", function (d) {
                return xScale(d.Variable4);
            })
            .attr("width", function (d) {
                return Math.abs(xScale(d.Variable4) - xScale(100));
            })
            .delay(function (d, i) {
                return i * 100;
            });

        svg.selectAll(".bar-variable5")
            .data(parsedData)
            .join("rect")
            .attr("class", "bar-variable5")
            .attr("x", function () {
                return xScale(100);
            })
            .attr("y", function () {
                return yScale("Variable5");
            })
            .attr("width", 0)
            .attr("height", yScale.bandwidth())
            .style("fill", "#FF6959")
            .transition()
            .duration(10000)
            .attr("x", function (d) {
                return xScale(d.Variable5);
            })
            .attr("width", function (d) {
                return Math.abs(xScale(d.Variable5) - xScale(100));
            })
            .delay(function (d, i) {
                return i * 100;
            });

        var yearLabel = svg.append("text")
            .attr("class", "year-label")
            .attr("x", xScale(70))
            .attr("y", height - 140)
            .attr("text-anchor", "middle")
            .attr("font-size", "30px")
            .attr("fill", "#ffffff");

        function showYear(year) {
            yearLabel.text(year);
        }

        var years = [1900, 1915, 1930, 1945, 1960, 1975, 1990, 2005, 2014, 2022];
        var duration = 10000;
        var delay = duration / years.length;

        years.forEach(function (year, index) {
            setTimeout(function () {
                showYear(year);
            }, index * delay);
        });

        // Beschriftung der Balken
        svg.append("text")
            .attr("class", "bar-label")
            .attr("x", xScale(102))
            .attr("y", yScale("Variable1") + yScale.bandwidth() / 2 + 5)
            .attr("text-anchor", "start")
            .attr("font-size", "15px")
            .attr("fill", "#fff")
            .text("seit 1900: Zunahme der Bevölkerung um 160%");

        svg.append("text")
            .attr("class", "bar-label")
            .attr("x", xScale(102))
            .attr("y", yScale("Variable2") + yScale.bandwidth() / 2 + 5)
            .attr("text-anchor", "start")
            .attr("font-size", "15px")
            .attr("fill", "#fff")
            .text("seit 1900: Zunahme der landwirtschaftliche Produktion um 160%");

        svg.append("text")
            .attr("class", "bar-label")
            .attr("x", xScale(102))
            .attr("y", yScale("Variable3") + yScale.bandwidth() / 2 + 5)
            .attr("text-anchor", "start")
            .attr("font-size", "15px")
            .attr("fill", "#fff")
            .text("seit 1900: Abnahme der Auenflächen um 60%");

        svg.append("text")
            .attr("class", "bar-label")
            .attr("x", xScale(102))
            .attr("y", yScale("Variable4") + yScale.bandwidth() / 2 + 5)
            .attr("text-anchor", "start")
            .attr("font-size", "15px")
            .attr("fill", "#fff")
            .text("seit 1900: Abnahme der Hoch- und Flachmoorflächen um 85%");

        svg.append("text")
            .attr("class", "bar-label")
            .attr("x", xScale(102))
            .attr("y", yScale("Variable5") + yScale.bandwidth() / 2 + 5)
            .attr("text-anchor", "start")
            .attr("font-size", "15px")
            .attr("fill", "#fff")
            .text("seit 1900: Abnahme der Trockenwiesen und -weiden um 95%");

    });
})();
