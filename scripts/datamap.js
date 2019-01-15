// const var for marginsMap svg Data map
const marginsMap = {top: 0, right: 0, bottom: 0, left: 0},
            widthMap = 750 - marginsMap.left - marginsMap.right,
            heightMap = 500 - marginsMap.top - marginsMap.bottom;

let colorsMap = ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"];

// // const var topojson worldmap and data
// let worldCountries = "https://bl.ocks.org/micahstubbs/raw/8e15870eb432a21f0bc4d3d527b2d14f/a45e8709648cafbbf01c78c76dfa53e31087e713/world_countries.json"
// let data = "https://raw.githubusercontent.com/JRMfer/Project/master/data/top250-00-19.csv"

// Create SVG for datamap
let svgMap = d3.select("#map")
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 800 500")
      // .attr("height", heightMap + marginsMap.top + marginsMap.bottom)
      // .attr("width", widthMap + marginsMap.left + marginsMap.right)
      .append("g")
      .attr("class", "svgMap")
      .attr("id", "dataMap")
      // .attr("transform", "translate(" + marginsMap.left + "," + marginsMap.top + ")");


let projection = d3.geoMercator()
                   .scale(100)
                   .translate( [widthMap / 2, heightMap / 1.75]);

let path = d3.geoPath().projection(projection);

// function zipMap(countries, data) {
//   console.log(data);
//   let dataMap = [];
//   let competitions = [];
//   let transfers = [];
//   let totalExp = [];
//   data.forEach(function(transfer) {
//     countries.forEach(function(country) {
//       if (country.properties.name === transfer.League_to) {
//         let index = competitions.indexOf(transfer.League_to);
//         if (index < 0) {
//           competitions.push(transfer.League_to);
//           transfers.push(1);
//           totalExp.push(+transfer.Transfer_fee);
//         }
//         else {
//           transfers[index] += 1;
//           totalExp[index] += +transfer.Transfer_fee;
//         }
//       }
//     })
//   })
//
//   countries.forEach(function(country) {
//     let index = competitions.indexOf(country.properties.name);
//     if (index < 0) {
//       competitions.push(country.properties.name);
//       transfers.push(0);
//       totalExp.push(0);
//     }
//   })
//   dataMap.push(countries);
//   dataMap.push(competitions);
//   dataMap.push(transfers);
//   dataMap.push(totalExp);
//   // console.log(dataMap);
//   return dataMap;
// }

function zipMap(countries, data) {
  console.log(data);
  console.log(countries);
  let dataMap = [];
  countries.forEach(function(country) {
    let tempObj = {}
    tempObj["features"] = country;
    tempObj["name"] = country.properties.name;

    let transfers = 0;
    let totalExp = 0;
    data.forEach(function(transfer) {
      if (transfer.League_to === country.properties.name) {
        transfers += 1;
        totalExp += +transfer.Transfer_fee;
      }
    })
    tempObj["transfers"] = transfers;
    tempObj["totalExp"] = totalExp;
    dataMap.push(tempObj);
  })
  console.log(dataMap);
  return dataMap;
}

// function updateMap(data) {
//   let info = {"expenditures": [], "amounts": []};
//   data.forEach( function(transfer) {
//     if (transfer.League_to in amounts)
//   })
// }

function drawDataMap(topology, data) {
  console.log(topology);
  ready(0, topology, data);
}

// function updateData(data)

function ready(error, topology, data) {
  console.log(data);
  // let dataTotal = zipMap(topology.features, data);
  // console.log(dataTotal);

  // Define the div for the tooltip
  let div = d3.select("#map").append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltipMap")
      .style("opacity", 0);

  svgMap.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topology.features)
        .enter().append("path")
        .attr("d", path)
        .attr("fill", function(d) {
          return "rgb(0,0,0)"
        })
        // .style("fill", "red")
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
