// const var for margins svg Data map
const margins = {"top": 50, "left": 50, "right": 50, "bottom": 50},
  height = 400 - margins.top - margins.bottom,
  width = 800 - margins.left - margins.right;

// const var topojson worldmap and data
let worldCountries = "https://bl.ocks.org/micahstubbs/raw/8e15870eb432a21f0bc4d3d527b2d14f/a45e8709648cafbbf01c78c76dfa53e31087e713/world_countries.json"
let data = "https://raw.githubusercontent.com/JRMfer/Project/master/data/top250-00-19.csv"

// Create SVG for datamap
let svg = d3.select("#map")
      .append("svg")
      .attr("height", height + margins.top + margins.bottom)
      .attr("width", width + margins.left + margins.right)
      .append("g")
      .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

// read in world_countries.topojson and data
let requests = [d3.json(worldCountries), d3.csv(data)]

function drawDataMap(requests) {
  Promise.all(requests).then(function(response) {
    //gather data
    let topology = response[0];
    let data = response[1];
    console.log(topology);
  });
}

function ready(error, data) {

}
