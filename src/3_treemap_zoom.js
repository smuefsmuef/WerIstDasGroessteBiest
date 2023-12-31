//code https://observablehq.com/@d3/zoomable-treemap
(() => {

    var count = 0;

    function uid(name) {
        return new Id("O-" + (name == null ? "" : name + "-") + ++count);
    }

    function Id(id) {
        this.id = id;
        this.href = new URL(`#${id}`, location) + "";
    }

    Id.prototype.toString = function () {
        return "url(" + this.href + ")";
    };

    const margin = {top: 30, right: 30, bottom: 70, left: 120},
        widthTreemap = 600 - margin.left - margin.right,
        heightTreemap = 320 - margin.top - margin.bottom;

    const x = d3.scaleLinear().rangeRound([0, widthTreemap]);
    const y = d3.scaleLinear().rangeRound([0, heightTreemap]);

    const svg3d = d3.create("svg")
        .attr("viewBox", [0.5, -30.5, widthTreemap, heightTreemap + 30])
        .style("font", "8px sans-serif")
        .style("line-height", "11px");

    function tile(node, x0, y0, x1, y1) {
        d3.treemapBinary(node, 0, 0, widthTreemap, heightTreemap);
        for (const child of node.children) {
            child.x0 = x0 + child.x0 / widthTreemap * (x1 - x0);
            child.x1 = x0 + child.x1 / widthTreemap * (x1 - x0);
            child.y0 = y0 + child.y0 / heightTreemap * (y1 - y0);
            child.y1 = y0 + child.y1 / heightTreemap * (y1 - y0);
        }
    }

    let name = d => d.ancestors().reverse().map(d => d.data.name).join("/");
    let format = d3.format(",d")
    let treemap = data => d3.treemap()
        .tile(tile)
        (d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => a.value - b.value));


    function render(group, root) {
        const node = group
            .selectAll("g")
            .data(root.children.concat(root))
            .join("g");

        node.filter(d => d === root ? d.parent : d.children)
            .attr("cursor", "pointer")
            .on("click", (event, d) => d === root ? zoomout(root) : zoomin(d));

        node.append("title")
            .text(d => `${name(d)}\n${format(d.value)}`);

        node.append("rect")
            .attr("id", d => (d.leafUid = uid("leaf")).id)
            .attr("stroke", "black")
            .style("fill", function (d) {
                return d.data.color;
            })

        node.append("image")
            .attr("xlink:href", d => d.data.image);

        node.append("clipPath")
            .attr("id", d => (d.clipUid = uid("clip")).id)
            .append("use")
            .attr("xlink:href", d => d.leafUid.href);

        node.append("text")
            .attr("clip-path", d => d.clipUid)
            .attr("font-weight", d => d === root ? "bold" : null)
            .selectAll("tspan")
            .data(d => {
                const textArray = (d === root ? name(d) : d.data.name).split(/(?=\n)/g).concat(format(d.value));
                return textArray.map(text => text.replace(/\n/g, ""));
            })
            .join("tspan")
            .attr("x", 3)
            .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
            .text(d => d);

        group.call(position, root);
    }

    function position(group, root) {
        group.selectAll("g")
            .attr("transform", d => d === root ? `translate(0,-30)` : `translate(${x(d.x0)},${y(d.y0)})`)
            .select("rect")
            .attr("width", d => d === root ? widthTreemap : x(d.x1) - x(d.x0))
            .attr("height", d => d === root ? 30 : y(d.y1) - y(d.y0));
        group.selectAll("g")
            .select("image")
            .attr("x", d => d === root ? 0 : (x(d.x1) - x(d.x0)) * 0.2)
            .attr("y", d => d === root ? 0 : (x(d.y1) - x(d.y0)) * 0.05)
            .attr("width", d => d === root ? widthTreemap : (x(d.x1) - x(d.x0)) * 0.6)
            .attr("height", d => d === root ? 30 : (y(d.y1) - y(d.y0)) * 0.6)
    }

    let group = svg3d.append("g")

    function zoomin(d) {
        const group0 = group.attr("pointer-events", "none");
        const group1 = group = svg3d.append("g").call(render, d);

        x.domain([d.x0, d.x1]);
        y.domain([d.y0, d.y1]);

        svg3d.transition()
            .duration(750)
            .call(t => group0.transition(t).remove()
                .call(position, d.parent))
            .call(t => group1.transition(t)
                .attrTween("opacity", () => d3.interpolate(0, 1))
                .call(position, d));
    }

    function zoomout(d) {
        const group0 = group.attr("pointer-events", "none");
        const group1 = group = svg3d.insert("g", "*").call(render, d.parent);

        x.domain([d.parent.x0, d.parent.x1]);
        y.domain([d.parent.y0, d.parent.y1]);

        svg3d.transition()
            .duration(750)
            .call(t => group0.transition(t).remove()
                .attrTween("opacity", () => d3.interpolate(1, 0))
                .call(position, d))
            .call(t => group1.transition(t)
                .call(position, d.parent));
    }

    function zoomToNode(jsonPath, nodeId) {
        d3.json(jsonPath).then(function (data) {
            const root = treemap(data);
            const node = root.descendants().find(d => d.data.id === nodeId);

            if (node) {
                zoomin(node);
            } else {
                console.log("Node not found.");
            }
        });
    }

    d3.json("./data/3_treemap_zoom.json").then(function (data) {
        group.call(render, treemap(data));
        let sel = d3.select("#zoom_treemap");
        sel.node().appendChild(svg3d.node());
    });
    window.zoomToNode = zoomToNode;
})();
