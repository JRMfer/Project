// This script contains the necessary functionality to create a dashboard
// Data source (topojson): https://bl.ocks.org/micahstubbs/raw/8e15870eb432a21f0bc4d3d527b2d14f/a45e8709648cafbbf01c78c76dfa53e31087e713/world_countries.json

// const var for data source
let data = "https://raw.githubusercontent.com/JRMfer/Project/master/data/transfers250.csv"
let worldCountries = "https://raw.githubusercontent.com/JRMfer/Project/master/data/world_countries.json"
let info = {"Seasons": ["All"], "data": []}

// read in world_countries.topojson and data
let requests = [d3.json(worldCountries), d3.csv(data)]

function dropdownChange() {

  console.log("test2");
  console.log(info["Seasons"]);
  //
  // let season = d3.select(".seasonclick")
  //                .property("value");

  console.log("season");
  // info["Seasons"].forEach(function(season) {
  //   console.log(d3.select("#" + season).property("selected"));
  // })
  // console.log(d3.select('.seasonsdropdown option:checked').property("value"));
  // console.log(d3.select(this));
  console.log(d3.select("#seasonsdropdown").property("value"));
  let season = d3.select("#seasonsdropdown").property("value");

  return updateBarChart("All", season, "All", info["data"])
}

function optionsDropdown(data) {

  let seasons = [];

  data.forEach(function(transfer) {
    let index = seasons.indexOf(transfer.Season);
    if (index < 0) {
      seasons.push(transfer.Season);
      info["Seasons"].push(transfer.Season)
    }
  })
  console.log(seasons);

  let dropdown = d3.select('#seasonsdropdown');
  // .on('change', dropdownChange(data));
console.log(d3.select('#seasonsdropdown'));


  let options = dropdown.selectAll("option")
                        .data(info["Seasons"])
                        .enter()
                        .append("option")
                        .attr("value", function(d) {
                          return d;
                        })
                        // .attr("href", "/")
                        // .attr("class", "seasonclick")
                        // .attr("value", function(d) {
                        //   return d;
                        // })
                        .text(function(d) {
                          return d;
                        })
                        // .attr("href", "/")
                        // .attr("onChange", "dropdownChange()");

                        // d3.select('#seasonsdropdown')
                        // dropdown.on('click', dropdownChange);

}


window.onload = function() {
  Promise.all(requests).then(function(response) {
    //gather data
    let topology = response[0];
    info["data"] = response[1];
    console.log(topology);
    console.log(data);
    optionsDropdown(info["data"]);
    drawDataMap(topology, info["data"]);
    updateBarChart("All", "All", "All", info["data"]);

  }).catch(function(e) {
    throw (e);
  });
}
