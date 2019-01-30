/*
Name: Julien Fer
University: University of Amsterdam
Studentnumber: 10649441

This script contains the functionality to load the data set and topojson
needed to set the options for the dropdown, draw the datamap, line and
bar chart and sunburst. It also contains the update function for the dropdown
changes. The window.onload contains the necassary functions to start the
visualizations.

Data source (topojson):
https://bl.ocks.org/micahstubbs/raw/8e15870eb432a21f0bc4d3d527b2d14f/a45e8709648cafbbf01c78c76dfa53e31087e713/world_countries.json
*/
// const var for data source
let data = "https://raw.githubusercontent.com/JRMfer/Project/master/data/transfers250.csv"
let worldCountries = "https://raw.githubusercontent.com/JRMfer/Project/master/data/world_countries.json"

// variable to keep track for options dropdown, the dataset and the root for the
// sunburst
let info = {
  "Seasons": ["All"],
  "data": [],
  "Countries": ["All"],
  "Positions": ["All"],
  "rootSun": 0
};

// read in world_countries.topojson and data
let requests = [d3.json(worldCountries), d3.csv(data)]

// var to keep track of features map
let featuresMap;

// set format for data values (millions) for tooltip
const format = d3.format(",");

// window onload
window.onload = function() {
  // promise
  Promise.all(requests).then(function(response) {
    let topology = response[0];
    featuresMap = response[0];
    info["data"] = response[1];
    let season = d3.select("#seasonsdropdown").property("value");
    let country = d3.select("#countriesdropdown").property("value");
    let position = d3.select("#positionsdropdown").property("value");
    optionsDropdown(featuresMap.features, info["data"]);
    drawDataMap(featuresMap, info["data"], "All", "All");
    info["rootSun"] = preproccesSunburst("All", "All", "All", info.data);
    drawSunburst(info.rootSun);
    updateBarChart("All", "All", "All", info["data"]);
    animateLine();
  }).catch(function(e) {
    throw (e);
  });
}

function optionsDropdown(topology, data) {
  /*
    Function that collects all the countries in the topojson, all the seasons and
    all the posiition that are possible and fill 3 differen dropdown menus with
    thes options
  */

  // loop every transfer
  data.forEach(function(transfer) {

    // check for index season, country, position, if not push found value
    let index = info.Seasons.indexOf(transfer.Season);
    let index2 = info.Countries.indexOf(transfer.League_to);
    let index3 = info.Positions.indexOf(transfer.Position);
    if (index < 0) {
      info.Seasons.push(transfer.Season);
    }
    if (index2 < 0) {
      info.Countries.push(transfer.League_to);
    }
    if (index3 < 0) {
      info.Positions.push(transfer.Position);
    }
  });

  // checks for the remaining countries in the topojson data
  topology.forEach(function(country) {
    let index = info.Countries.indexOf(country.properties.name);
    if (index < 0) {
      info.Countries.push(country.properties.name);
    }
  });

  // sort countries and positions, set All at first option
  info.Countries.sort();
  info.Positions.sort();
  let index = info.Countries.indexOf("All");
  let temp = info.Countries[0];
  info.Countries[0] = info.Countries[index];
  info.Countries[index] = temp;

  // select the dropdowns
  let dropdown = d3.select('#countriesdropdown');
  let dropdown2 = d3.select("#seasonsdropdown");
  let dropdown3 = d3.select("#positionsdropdown");

  // set options dropdowns
  dropdown.selectAll("option")
    .data(info.Countries)
    .enter()
    .append("option")
    .attr("value", function(d) {
      return d;
    })
    .text(function(d) {
      return d;
    });

  dropdown2.selectAll("option")
    .data(info.Seasons)
    .enter()
    .append("option")
    .attr("value", function(d) {
      return d;
    })
    .text(function(d) {
      return d;
    });

  dropdown3.selectAll("option")
    .data(info.Positions)
    .enter()
    .append("option")
    .attr("value", function(d) {
      return d;
    })
    .text(function(d) {
      return d;
    });
}

function countriesDropdownChange() {
  /*
    Update function dropdown countries
  */

  let season = d3.select("#seasonsdropdown").property("value");
  let country = d3.select("#countriesdropdown").property("value");
  let position = d3.select("#positionsdropdown").property("value");

  zoomSunburst(country);
  updateBarChart(country, season, position, info["data"]);
}

function seasonsDropdownChange() {
  /*
    Update function dropdown seasons
  */

  let season = d3.select("#seasonsdropdown").property("value");
  let country = d3.select("#countriesdropdown").property("value");
  let position = d3.select("#positionsdropdown").property("value");
  
  let newData = preproccesSunburst(country, season, position, info.data);
  if (newData.children[0].children.length > 0) {
    drawSunburst(newData);
    zoomSunburst(country);
    updateBarChart(country, season, position, info["data"]);
    drawDataMap(featuresMap, info["data"], season, position);
  } else {
    alert("No data found");
  }
}

function positionsDropdownChange() {
  /*
    Update function dropdown positions
  */

  let season = d3.select("#seasonsdropdown").property("value");
  let country = d3.select("#countriesdropdown").property("value");
  let position = d3.select("#positionsdropdown").property("value");
  let newData = preproccesSunburst(country, season, position, info.data);

  if (newData.children[0].children.length > 0) {
    drawSunburst(newData);
    zoomSunburst(country);
    updateBarChart(country, season, position, info["data"]);
    drawDataMap(featuresMap, info["data"], season, position);
  } else {
    alert("No data found");
  }
}
