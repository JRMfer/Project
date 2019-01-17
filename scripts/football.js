// This script contains the necessary functionality to create a dashboard
// Data source (topojson): https://bl.ocks.org/micahstubbs/raw/8e15870eb432a21f0bc4d3d527b2d14f/a45e8709648cafbbf01c78c76dfa53e31087e713/world_countries.json

// const var for data source
let data = "https://raw.githubusercontent.com/JRMfer/Project/master/data/transfers250.csv"
let worldCountries = "https://raw.githubusercontent.com/JRMfer/Project/master/data/world_countries.json"
let info = {"Seasons": ["All"], "data": [], "Countries": ["All"], "Positions": ["All"]}

// read in world_countries.topojson and data
let requests = [d3.json(worldCountries), d3.csv(data)]

function dropdownChange() {

  // console.log("test2");
  // console.log(info["Seasons"]);
  //
  // let season = d3.select(".seasonclick")
  //                .property("value");

  // info["Seasons"].forEach(function(season) {
  //   console.log(d3.select("#" + season).property("selected"));
  // })
  // console.log(d3.select('.seasonsdropdown option:checked').property("value"));
  // console.log(d3.select(this));
  // console.log("country");
  // console.log(d3.select("#countriesdropdown").property("value"));
  // console.log("season");
  // console.log(d3.select("#seasonsdropdown").property("value"));
  // console.log("position")
  // console.log(d3.select("#positionsdropdown").property("value"));
  let season = d3.select("#seasonsdropdown").property("value");
  let country = d3.select("#countriesdropdown").property("value")
  let position = d3.select("#positionsdropdown").property("value")

  updateBarChart(country, season, position, info["data"]);
  drawDataMap(features, info["data"],season, position);
}

function optionsDropdown(topology, data) {

  // let seasons = [];
  // console.log(topology);

  data.forEach(function(transfer) {
    let index = info.Seasons.indexOf(transfer.Season);
    let index2 = info.Countries.indexOf(transfer.League_to);
    let index3 = info.Positions.indexOf(transfer.Position);
    if (index < 0) {
      // seasons.push(transfer.Season);
      info.Seasons.push(transfer.Season);
    }
    if (index2 < 0) {
      info.Countries.push(transfer.League_to);
    }
    if (index3 < 0) {
      info.Positions.push(transfer.Position);
    }
  })

  topology.forEach(function(country) {
    let index = info.Countries.indexOf(country.properties.name);
    if (index < 0) {
      info.Countries.push(country.properties.name);
    }
  })
  info.Countries.sort();
  info.Positions.sort();
  let index = info.Countries.indexOf("All");
  let temp = info.Countries[0];
  info.Countries[0] = info.Countries[index];
  info.Countries[index] = temp;
  // console.log(info.Seasons);
  // console.log(info.Countries);
  // console.log(info.Positions);

  let dropdown = d3.select('#countriesdropdown');
  // .on('change', dropdownChange(data));

  let dropdown2 = d3.select("#seasonsdropdown");

  let dropdown3 = d3.select("#positionsdropdown");


  dropdown.selectAll("option")
          .data(info.Countries)
          .enter()
          .append("option")
          .attr("value", function(d) {
            return d;
          })
          .text(function(d) {
            return d;
          })

  dropdown2.selectAll("option")
           .data(info.Seasons)
           .enter()
           .append("option")
           .attr("value", function(d) {
             return d;
           })
           .text(function(d) {
             return d;
           })

  dropdown3.selectAll("option")
           .data(info.Positions)
           .enter()
           .append("option")
           .attr("value", function(d) {
             return d;
           })
           .text(function(d) {
             return d;
           })
}


window.onload = function() {
  Promise.all(requests).then(function(response) {
    //gather data
    let topology = response[0];
    info["data"] = response[1];
    // console.log(topology);
    // console.log(info["data"]);
    optionsDropdown(topology.features, info["data"]);
    drawDataMap(topology, info["data"], "All", "All");
    drawSunburst("All", "All", "All", info.data);
    updateBarChart("All", "All", "All", info["data"]);

  }).catch(function(e) {
    throw (e);
  });
}
