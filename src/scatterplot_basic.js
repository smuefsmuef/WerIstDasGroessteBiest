chart = Scatterplot(cars, {
    x: d => d.mpg,
    y: d => d.hp,
    title: d => d.name,
    xLabel: "Miles per gallon →",
    yLabel: "↑ Horsepower",
    stroke: "steelblue",
    width,
    height: 600
})

data =  FileAttachment("mtcars.csv").csv({typed: true})

