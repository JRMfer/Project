// const var for marginsMap svg Data map
const marginsMap = {top: 0, right: 0, bottom: 0, left: 0},
            widthMap = 800 - marginsMap.left - marginsMap.right,
            heightMap = 400 - marginsMap.top - marginsMap.bottom;

// // const var topojson worldmap and data
// let worldCountries = "https://bl.ocks.org/micahstubbs/raw/8e15870eb432a21f0bc4d3d527b2d14f/a45e8709648cafbbf01c78c76dfa53e31087e713/world_countries.json"
// let data = "https://raw.githubusercontent.com/JRMfer/Project/master/data/top250-00-19.csv"

// Create SVG for datamap
let svgMap = d3.select("#map")
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 800 400")
      // .attr("height", heightMap + marginsMap.top + marginsMap.bottom)
      // .attr("width", widthMap + marginsMap.left + marginsMap.right)
      .append("g")
      .attr("class", "svgMap")
      .attr("id", "dataMap")
      // .attr("transform", "translate(" + marginsMap.left + "," + marginsMap.top + ")");


let projection = d3.geoMercator()
                   .scale(130)
                   .translate( [widthMap / 2, heightMap / 1.5]);

let path = d3.geoPath().projection(projection);

function drawDataMap(topology, data) {
  console.log(topology);
  ready(0, topology, data);
}

function ready(error, topology, data) {

  // Define the div for the tooltip
  let div = d3.select("#map").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  svgMap.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topology.features)
        .enter().append("path")
        .attr("d", path)
        .style("fill", "red")
        .style("stroke", "black")
        .style("stroke-width", 1.5)
        .on("mouseover", function(d) {
          div.transition()
          .style("opacity", 0.9)
          div.html(d.properties.name)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - heightMap / 2.5) + "px")
          d3.select(this).style('opacity', 0.5)
        })
        .on("mouseout", function(d) {
            div.transition()
                .style("opacity", 0)
            d3.select(this).style('opacity', 1);
        });

  // svgMap.append("path")
  //     .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
  //      // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
  //     .attr("class", "names")
  //     .attr("d", path);
}
