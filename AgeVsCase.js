<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Histogram of Age vs Total Breast Cancer Cases</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <style>
        .bar {
            fill: steelblue;
        }

        .bar:hover {
            fill: orange;
        }

        .axis-label {
            font-size: 12px;
        }

        .tooltip {
            position: absolute;
            text-align: center;
            padding: 8px;
            background: lightgray;
            border: 1px solid gray;
            border-radius: 4px;
            pointer-events: none;
        }
    </style>
</head>
<body>
    <h2>Histogram of Age vs Total Breast Cancer Cases</h2>
    <div id="chart"></div>
    <script>
        const data = await d3.csv("Breast_Cancer.csv", d3.autoType);

        const margin = { top: 20, right: 30, bottom: 50, left: 50 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .domain([d3.min(data, d => d.Age), d3.max(data, d => d.Age)])
            .range([0, width]);

        const histogram = d3.histogram()
            .value(d => d.Age)
            .domain(x.domain()) 
            .thresholds(x.ticks(20)); 

        const bins = histogram(data);

        const y = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .nice()
            .range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .append("text")
            .attr("y", 40)
            .attr("x", width / 2)
            .attr("text-anchor", "middle")
            .attr("class", "axis-label")
            .text("Age (Binned)");

        // Create y-axis
        svg.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("y", -30)
            .attr("x", -height / 2)
            .attr("text-anchor", "middle")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .text("Total Breast Cancer Cases");

        svg.selectAll(".bar")
            .data(bins)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.x0) + 1)
            .attr("y", d => y(d.length))
            .attr("width", d => x(d.x1) - x(d.x0) - 1)
            .attr("height", d => height - y(d.length));

        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.selectAll(".bar")
            .on("mouseover", (event, d) => {
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html(`Age Range: ${d.x0}-${d.x1}<br>Total Cases: ${d.length}`)
                    .style("left", `${event.pageX + 5}px`)
                    .style("top", `${event.pageY - 28}px`);
            })
            .on("mouseout", () => {
                tooltip.transition().duration(200).style("opacity", 0);
            });
    </script>
</body>
</html>
