// const var for marginsMap svg Data map
const marginsMap = {top: 0, right: 0, bottom: 0, left: 0},
            widthMap = 750 - marginsMap.left - marginsMap.right,
            heightMap = 500 - marginsMap.top - marginsMap.bottom;

let colorsMap = ["#65cd94", "#52c786", "#52c786", "#3ec179", "#38ad6d", "#329a61", "#2c8755","#257449", "#1f603c", "#194d30"];
;
let dataMap;

// // const var topojson worldmap and data
// let worldCountries = "https://bl.ocks.org/micahstubbs/raw/8e15870eb432a21f0bc4d3d527b2d14f/a45e8709648cafbbf01c78c76dfa53e31087e713/world_countries.json"
// let data = "https://raw.githubusercontent.com/JRMfer/Project/master/data/top250-00-19.csv"

// Create SVG for datamap
let svgMap = d3.select("#map")
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 960 700")
      // .attr("height", heightMap + marginsMap.top + marginsMap.bottom)
      // .attr("width", widthMap + marginsMap.left + marginsMap.right)
      .append("g")
      .attr("class", "svg")
      .attr("id", "svgMap")
      // .attr("transform", "translate(" + marginsMap.left + "," + marginsMap.top + ")");


let projection = d3.geoMercator()
                   .scale(140)
                   .translate( [widthMap / 1.85, heightMap / 1]);

let path = d3.geoPath().projection(projection);

// Define the div for the tooltip
let divMap = d3.select("#map").append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltipMap")
    .style("opacity", 0);

function findValuesMap(data, season, position) {
  let values = {};
  data.forEach(function(transfer) {
    let tempObj = {}
    if (transfer.League_to in values) {
      if (((transfer.Season === season) || (season === "All")) &&
          ((transfer.Position === position) || (position === "All")) &&
          (+transfer.Transfer_fee > 0)) {
            values[transfer.League_to]["transfers"] += 1;
            values[transfer.League_to]["total"] += +transfer.Transfer_fee;
        }
    }
    else {
      if (((transfer.Season === season) || (season === "All")) &&
          ((transfer.Position === position) || (position === "All")) &&
          (+transfer.Transfer_fee > 0)) {
        tempObj["transfers"] = 1;
        tempObj["total"] = +transfer.Transfer_fee;
        values[transfer.League_to] = tempObj;
      }
    }
  })
  values["valuesArray"] = [];
  Object.keys(values).forEach( function(country) {
    values.valuesArray.push(values[country].total);
  })
  return values;
}
//
// function zipMap(countries, data) {
//   // console.log(data);
//   // console.log(countries);
//   let dataMap = [];
//   countries.forEach(function(country) {
//     let tempObj = {}
//     tempObj["features"] = country;
//     tempObj["name"] = country.properties.name;
//
//     let transfers = 0;
//     let totalExp = 0;
//     data.forEach(function(transfer) {
//       if (transfer.League_to === country.properties.name) {
//         transfers += 1;
//         totalExp += +transfer.Transfer_fee;
//       }
//     })
//     tempObj["transfers"] = transfers;
//     tempObj["totalExp"] = totalExp;
//     dataMap.push(tempObj);
//   })
//   return dataMap;
// }

function findMax(data) {
  let max = 0;
  let min = 0;
  Object.keys(data).forEach(function(country) {
    if (data[country]["total"] > max) {
      max = data[country]["total"];
    }
    if (data[country]["total"] < min) {

    }
  })
  maxMin = {};
  maxMin["max"] = max;
  maxMin["min"] = min;
  return maxMin;
}

function arrayStepsMap (min, max, steps) {
  let step = (max - min) / steps;
  let temp = [];
  for (let i = min; i <= max; i += step) {
    temp.push((Math.floor(i)));
  }
  return temp;
}

function dataMapClick(country) {
  console.log(info.data);
  season = d3.select("#seasonsdropdown").property("value");
  d3.select('#countriesdropdown').property('value', country);
  position = d3.select("#positionsdropdown").property("value")
  // if (!(country === "Libya")) {
  console.log(country);
  console.log(info.rootSun);
    updateBarChart(country, season, position, info["data"]);
    barZoomSunburst(country);
  // }
}

function drawDataMap(topology, data, season, position) {
  ready(0, topology, data, season, position);
}

// function updateData(data)

function ready(error, topology, data , season, position) {
  dataMap = topology;
  let newData = findValuesMap(data, season, position);
  // let maxMin = findMax(newData);
  console.log(newData);
  // let steps = arrayStepsMap(maxMin.min, maxMin.max, 7);
  // let colorPath = d3.scaleThreshold()
  //   .domain(steps)
  //   .range(colorsMap);
  let colorPath = d3.scaleQuantile()
                    .domain(newData.valuesArray)
                    .range(colorsMap);
  // let dataTotal = zipMap(topology.features, data);
  // console.log(dataTotal);

  // // Define the div for the tooltip
  // let div = d3.select("#map").append("div")
  //     .attr("class", "tooltip")
  //     .attr("id", "tooltipMap")
  //     .style("opacity", 0);

  // set format for data values (millions)
  let format = d3.format(",");

  let pathMap = svgMap.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topology.features)


        pathMap.enter().append("path")
        .on("mouseover", function(d) {
          if (d.properties.name in newData) {
            divMap.transition()
              .style("opacity", 0.9)
              divMap.html("Country: " + d.properties.name + "<br>" + "Transfers: " + newData[d.properties.name]["transfers"] + "<br>" + "Expenditures: " + format(newData[d.properties.name]["total"]))
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - heightMap / 2.5) + "px")
              d3.select(this).style('opacity', 0.5)
          }
          else {
            divMap.transition()
              .style("opacity", 0.9)
              divMap.html("Country: " + d.properties.name + "<br>" + "Transfers: " + 0 + "<br>" + "Expenditures: " + 0)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - heightMap / 2.5) + "px")
              d3.select(this).style('opacity', 0.5)
          }
        })
        .on("mouseout", function(d) {
            divMap.transition()
            .duration(750)
            .ease(d3.easeLinear)
                .style("opacity", 0)
            d3.select(this).style('opacity', 1);
        })
        .on("click", function(d) {
          dataMapClick(d.properties.name);
          // barZoomSunburst(d.properties.name);
          console.log(d.properties.name);
          console.log(d3.select("#seasonsdropdown").property("value"));
          console.log(d3.select("#positionsdropdown").property("value"));
        })
        .merge(pathMap)
        // .transition().duration(250)
        // .delay(function(d, i) {
        //   return i * 5;
        // })
        .attr("d", path)
        .transition()
        .attr("fill", function(d) {
          if (d.properties.name in newData) {
            return colorPath(newData[d.properties.name].total);
          }
          else {
            return "#fee6ce";
          }
        })
        .duration(750)
        .ease(d3.easeLinear)
        // .style("fill", "red")
        .style("stroke", "black")
        .style("stroke-width", 1.5)
        // .on("mouseover", function(d) {
        //   if (d.properties.name in newData) {
        //     divMap.transition()
        //       .style("opacity", 0.9)
        //       divMap.html("Country: " + d.properties.name + "<br>" + "Transfers: " + newData[d.properties.name]["transfers"] + "<br>" + "Expenditures: " + format(newData[d.properties.name]["total"]))
        //       .style("left", (d3.event.pageX) + "px")
        //       .style("top", (d3.event.pageY - heightMap / 2.5) + "px")
        //       d3.select(this).style('opacity', 0.5)
        //   }
        //   else {
        //     divMap.transition()
        //       .style("opacity", 0.9)
        //       divMap.html("Country: " + d.properties.name + "<br>" + "Transfers: " + 0 + "<br>" + "Expenditures: " + 0)
        //       .style("left", (d3.event.pageX) + "px")
        //       .style("top", (d3.event.pageY - heightMap / 2.5) + "px")
        //       d3.select(this).style('opacity', 0.5)
        //   }
        // })
        // .on("mouseover", function(d) {
        //   let transfers = 0;
        //   let amount = 0;
        //   data.forEach(function(transfer) {
        //     if ((d.properties.name === transfer.League_to)) {
        //       console.log("here");
        //       transfers += 1;
        //       amount += +transfer.Transfer_fee;
        //     }
        //   })
        //   divMap.transition()
        //   .style("opacity", 0.9)
        //   divMap.html("Country: " + d.properties.name + "<br>" + "Transfers: " + transfers + "<br>" + "Expenditures: " + format(amount))
        //   .style("left", (d3.event.pageX) + "px")
        //   .style("top", (d3.event.pageY - heightMap / 2.5) + "px")
        //   d3.select(this).style('opacity', 0.5)
        // })
        // .on("mouseout", function(d) {
        //     divMap.transition()
        //         .style("opacity", 0)
        //     d3.select(this).style('opacity', 1);
        // })
        // .on("click", function(d) {
        //   dataMapClick(d.properties.name);
        //   console.log(d.properties.name);
        //   console.log(d3.select("#seasonsdropdown").property("value"));
        //   console.log(d3.select("#positionsdropdown").property("value"));
        // });

  pathMap.exit()
  // .transition().duration(750)
  // .delay(function(d, i) {
  //   return i * 25;
  // })
    .remove();

  // svgMap.append("path")
  //     .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
  //      // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
  //     .attr("class", "names")
  //     .attr("d", path);
}
