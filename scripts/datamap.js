// const var for marginsMap svg Data map
const marginsMap = {top: 20, right: 75, bottom: 20, left: 20},
            widthMap = 750 - marginsMap.left - marginsMap.right,
            heightMap = 550 - marginsMap.top - marginsMap.bottom;

// let colorsMap = ["#65cd94", "#52c786", "#52c786", "#3ec179", "#38ad6d", "#329a61", "#2c8755","#257449", "#1f603c", "#194d30"];
let colorsMap = ["#f1f9ff", "#d2ebfe", "#c3e5fe", "#abdcfe", "#8fd2fd", "#77cbfd", "#63c5fc", "#49c0fc"];
;
let dataMap;

// // const var topojson worldmap and data
// let worldCountries = "https://bl.ocks.org/micahstubbs/raw/8e15870eb432a21f0bc4d3d527b2d14f/a45e8709648cafbbf01c78c76dfa53e31087e713/world_countries.json"
// let data = "https://raw.githubusercontent.com/JRMfer/Project/master/data/top250-00-19.csv"

// Create SVG for datamap
let svgMap = d3.select("#map")
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "-60 0 960 702")
      // .attr("height", heightMap + marginsMap.top + marginsMap.bottom)
      // .attr("width", widthMap + marginsMap.left + marginsMap.right)
      .append("g")
      .attr("class", "svg")
      .attr("id", "svgMap")
      // .attr("transform", "translate(" + marginsMap.left + "," + marginsMap.top + ")");

let legendMap = svgMap.append("g").attr("class", "legend");
let legendWidth = 20;



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
              divMap.html("<strong>Country: </strong><span class='details'>"
                        + d.properties.name + "</span>" + "<br>" + "<strong>"
                        + "Total transfers: " + "</strong><span class='details'>"
                        + newData[d.properties.name]["transfers"] + "</span><br>" +
                        "<strong>Total transfer fees: </strong><br>" + '€' + format(newData[d.properties.name]["total"]))
                // "Country: " + d.properties.name + "<br>" + "Transfers: " + newData[d.properties.name]["transfers"] + "<br>" + "Expenditures: " + format(newData[d.properties.name]["total"]))
              .style("left", (d3.event.pageX - marginsMap.left - marginsMap.right) + "px")
              .style("top", (d3.event.pageY - heightMap / 2.5) + "px")
              d3.select(this).style('opacity', 0.75)
              d3.select(this).style("fill", "#fee6ce")
          }
          else {
            divMap.transition()
              .style("opacity", 0.9)
              divMap.html("<strong>Country: </strong><span class='details'>"
                        + d.properties.name + "</span>" + "<br>" + "<strong>"
                        + "Total transfers: " + "</strong><span class='details'>"
                        + "undefined </span><br>" +
                        "<strong>Total transfer fees: </strong><br> undefined")
              .style("left", (d3.event.pageX - marginsMap.left - marginsMap.right) + "px")
              .style("top", (d3.event.pageY - heightMap / 2.5) + "px")
              d3.select(this).style('opacity', 0.75)
              d3.select(this).style("fill", "#fee6ce")
          }
        })
        .on("mouseout", function(d) {
            divMap.transition()
            .duration(750)
            .ease(d3.easeLinear)
                .style("opacity", 0)
            d3.select(this).style('opacity', 1);
            if (d.properties.name in newData) {
            d3.select(this).style("fill", function(d) {
              return colorPath(newData[d.properties.name].total);
            })
          }
          else {
            d3.select(this).style("fill", function(d) {
              return "#1a1a1a";
          })}
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
            return "#1a1a1a";
            // return "darkgrey";
          }
        })
        .duration(1500)
        .delay(function(d, i) {
          return i * 15
        })
        .ease(d3.easeLinear)
        // .style("fill", "red")
        .style("stroke", "darkgrey")
        .style("stroke-width", 1.5);

  pathMap.exit()
  // .transition().duration(750)
  // .delay(function(d, i) {
  //   return i * 25;
  // })
    .remove();
    console.log(colorPath.quantiles);

let legendRect = legendMap.selectAll("rect").data(colorPath.range());
console.log(colorPath.range());

legendRect.enter().append("rect")
  .merge(legendRect)
  .transition()
  .duration(750)
  .ease(d3.easeLinear)
  .attr("width", legendWidth)
  // .attr('x', function(d, i) {
  //   return i * legendWidth;
  // })
  // .attr('y', 50)
  .attr('x', widthMap + marginsMap.left - legendWidth)
  .attr('y', function(d, i) {
    // return (colorsMap.length - i) * legendWidth / 1;
    return (i * legendWidth) + 5;
  })
  .attr("height", legendWidth)
  .style("stroke", "#000")
  .style("fill", function(d, j) {
    return d;
  })

  let legendText = legendMap.selectAll("text").data(colorPath.quantiles())
  console.log(colorPath.quantiles());

  legendText.enter().append("text")
    .merge(legendText)
    .transition()
    .duration(750)
    .ease(d3.easeLinear)
    .attr('x', widthMap + marginsMap.left + 7.5)
    .attr('y', function(d, i) {
      return (colorsMap.length - i - 1) * legendWidth + legendWidth / 2;
    })
    // .attr('x', function(d, i) {
    //   return (i + 1) * legendWidth;
    // })
    // .attr('y', 80)
    .text(function(d,i){
      if ((i === 0) || (i === (colorPath.quantiles().length - 1))) {
          var rv = Math.round(d*10)/10;
          if (i === 0) rv = '< ' + '€ ' + format(rv);
          else if (i === (colorPath.quantiles().length - 1))  rv = '> ' + '€ ' + format(rv);
          return  rv + " <br> Total transfer fee <br> for season: " + d3.select("#seasonsdropdown");
        }
        })
        .style('fill', 'white')
        .style('stroke', 'none')
        .style("font-size", "20px");

    legendRect.exit().remove();
    legendText.exit().remove();

//
// // make legend
// legend = svgMap.data([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]).enter()
//   .append("g")
//   .attr("class", ".legend")
//   .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
//
// legend.append("rect")
//     .attr("x", widthMap - 800)
//     .attr("y", 0)
//     .attr("width", 32)
//     .attr("height", 20)
//     .style("fill", d => color(d))
//
// // add text to legend
// legend.append("text")
//     .attr("x", widthMap - 760)
//     .attr("y", 20)
//     .text(function(d) {
//       return d;
//     })

  // svgMap.append("path")
  //     .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
  //      // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
  //     .attr("class", "names")
  //     .attr("d", path);
}
