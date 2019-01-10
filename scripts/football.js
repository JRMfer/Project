// This script contains the necessary functionality to create a dashboard
// Data source (topojson): https://bl.ocks.org/micahstubbs/raw/8e15870eb432a21f0bc4d3d527b2d14f/a45e8709648cafbbf01c78c76dfa53e31087e713/world_countries.json

// const var for data source
let data = "https://raw.githubusercontent.com/JRMfer/Project/master/data/transfers250.csv"
let worldCountries = "https://raw.githubusercontent.com/JRMfer/Project/master/data/world_countries.json"

// read in world_countries.topojson and data
let requests = [d3.json(worldCountries), d3.csv(data)]

window.onload = function() {
  Promise.all(requests).then(function(response) {
    //gather data
    let topology = response[0];
    let data = response[1];
    console.log(topology);
    console.log(data);
    drawDataMap(topology, data);
    drawBarChart("All", "All", "All", data);

  }).catch(function(e) {
    throw (e);
  });
}
