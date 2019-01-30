/*
Name: Julien Fer
University: University of Amsterdam
Studentnumber: 10649441

This script contains the functionality to draw a datamap with the colours
varying depending on the value of the total transfer fee in a country. Also
a tooltip and legend is included. All of these elements can be updated with a
transition.
*/

// const var for margins, width, height of datamap
const marginsMap = {
    top: 20,
    right: 75,
    bottom: 20,
    left: 20
  },
  widthMap = 750 - marginsMap.left - marginsMap.right,
  heightMap = 550 - marginsMap.top - marginsMap.bottom;

// const variable colors datamap
const colorsMap = ["#f1f9ff", "#d2ebfe", "#c3e5fe", "#abdcfe", "#8fd2fd", "#77cbfd", "#63c5fc", "#49c0fc"];

// create SVG for datamap
const svgMap = d3.select("#map").append("svg")
.attr("id", "svgMap")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "-60 0 960 702")
  .append("g");

// const variable svg legend and the width/height of the legend rectangles
const legendMap = svgMap.append("g").attr("class", "legend");
const legendWidth = 20;


// Create a new projection using Mercator (geoMercator)
// and center it (translate)
// and zoom in a certain amount (scale)
const projection = d3.geoMercator()
  .scale(140)
  .translate([widthMap / 1.85, heightMap / 1]);

// create a path (geoPath) using the projection
const path = d3.geoPath().projection(projection);

// Define the div for the tooltip
const divMap = d3.select("#map").append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltipMap")
  .style("opacity", 0);

function findValuesMap(data, season, position) {
  /*
    Update function to find the new array with all the values of the datamap
    (this is needed for the color scale), and the total transfer
    fees and amount of transfers per country (every country as object).
  */

  // object (dataMap) for the 2 datasets
  let dataMap = {};

  // loop over all transfers, transfers are objects
  data.forEach(function(transfer) {

    // temporary object
    let tempObj = {};

    // check if country already in dataMap and if transfer satisfies asked
    // dataset by user, if so add transfer fee to total and add 1 to transfers amount
    if (transfer.League_to in dataMap) {
      if (((transfer.Season === season) || (season === "All")) &&
        ((transfer.Position === position) || (position === "All")) &&
        (+transfer.Transfer_fee > 0)) {
        dataMap[transfer.League_to]["transfers"] += 1;
        dataMap[transfer.League_to]["total"] += +transfer.Transfer_fee;
      }
    }
    // if not, make new object for country
    else {
      if (((transfer.Season === season) || (season === "All")) &&
        ((transfer.Position === position) || (position === "All")) &&
        (+transfer.Transfer_fee > 0)) {
        tempObj["transfers"] = 1;
        tempObj["total"] = +transfer.Transfer_fee;
        dataMap[transfer.League_to] = tempObj;
      }
    }
  })

  // collect all values map in array and add to dataMap
  dataMap["allValuesMap"] = [];
  Object.keys(dataMap).forEach(function(country) {
    dataMap.allValuesMap.push(dataMap[country].total);
  })

  // returns dataMap
  return dataMap;

}

function dataMapClick(country) {
  /*
    Update function for country selected on datamap by user. The bar chart,
    line chart and sunbusrt will be updated. The dropdown will also be set on
    the selected country.
  */

  season = d3.select("#seasonsdropdown").property("value");
  position = d3.select("#positionsdropdown").property("value");

  d3.select('#countriesdropdown').property('value', country);

  updateBarChart(country, season, position, info["data"]);
  zoomSunburst(country);
}

function mouseoverMap(d) {
   // checks if country is in data set and gives the right values to tooltip
   if (d.properties.name in dataMap) {

     divMap.transition().style("opacity", 0.9);

     divMap.html("<strong>Country: </strong><span class='details'>" +
         d.properties.name + "</span>" + "<br><br>" + "<strong>" +
         "Total transfers: " + "</strong><span class='details'>" +
         dataMap[d.properties.name]["transfers"] + "</span><br><br>" +
         "<strong>Total transfer fees: </strong><br>" + '€ ' + format(dataMap[d.properties.name]["total"]))
       .style("left", (d3.event.pageX - marginsMap.left - marginsMap.right) + "px")
       .style("top", (d3.event.pageY - heightMap / 2.5) + "px");

     d3.select(this).style('opacity', 0.5);
     d3.select(this).style("fill", "#ffa31a");
     d3.select(this).style("stroke", "3px");
   }
   // if not set values to undefined
   else {
     divMap.transition().style("opacity", 0.9);

     divMap.html("<strong>Country: </strong><span class='details'>" +
         d.properties.name + "</span>" + "<br><br>" + "<strong>" +
         "Total transfers: " + "</strong><span class='details'>" +
         "undefined </span><br><br>" +
         "<strong>Total transfer fees: </strong><br> undefined")
       .style("left", (d3.event.pageX - marginsMap.left - marginsMap.right) + "px")
       .style("top", (d3.event.pageY - heightMap / 2.5) + "px");

     d3.select(this).style('opacity', 0.5);
     d3.select(this).style("fill", "#ffa31a");
     d3.select(this).style("stroke", "3px");
   }
}

function drawDataMap(topology, data, season, position) {
  /*
    function that draws datamap with a transition on the fill of colours, and
    legend and tooltip which can be updated. Tooltip shows country's name, the
    corresponding total transfer fee and amount of transfers. Legend shows all
    colours but only text for the min/max of the quantile color scale.
  */

  let dataMap = findValuesMap(data, season, position);

  // set up color scale
  let colorPath = d3.scaleQuantile()
    .domain(dataMap.allValuesMap)
    .range(colorsMap);

  // set up variable representing every path in dataMap
  let pathMap = svgMap.append("g")
    .selectAll("path")
    .data(topology.features);

  // enter dataset append path
  let pathDataMap = pathMap.enter().append("path");

  // set up tooltip
  pathDataMap.on("mouseover", function(d) {

    // checks if country is in data set and gives the right values to tooltip
    if (d.properties.name in dataMap) {

      divMap.transition().style("opacity", 0.9);

      divMap.html("<strong>Country: </strong><span class='details'>" +
          d.properties.name + "</span>" + "<br><br>" + "<strong>" +
          "Total transfers: " + "</strong><span class='details'>" +
          dataMap[d.properties.name]["transfers"] + "</span><br><br>" +
          "<strong>Total transfer fees: </strong><br>" + '€ ' + format(dataMap[d.properties.name]["total"]))
        .style("left", (d3.event.pageX - marginsMap.left - marginsMap.right) + "px")
        .style("top", (d3.event.pageY - heightMap / 2.5) + "px");

      d3.select(this).style("fill", "#ffa31a");
      d3.select(this).style("stroke", "3px");
    }
    // if not set values to undefined
    else {
      divMap.transition().style("opacity", 0.9);

      divMap.html("<strong>Country: </strong><span class='details'>" +
          d.properties.name + "</span>" + "<br><br>" + "<strong>" +
          "Total transfers: " + "</strong><span class='details'>" +
          "undefined </span><br><br>" +
          "<strong>Total transfer fees: </strong><br> undefined")
        .style("left", (d3.event.pageX - marginsMap.left - marginsMap.right) + "px")
        .style("top", (d3.event.pageY - heightMap / 2.5) + "px");

      d3.select(this).style("fill", "#ffa31a");
      d3.select(this).style("stroke", "3px");
    }
  })

  // set mouseout effects
  pathDataMap.on("mouseout", function(d) {
      divMap.transition()
        .duration(750)
        .ease(d3.easeLinear)
        .style("opacity", 0);

      d3.select(this).style('opacity', 1);

      if (d.properties.name in dataMap) {
        d3.select(this).style("fill", function(d) {
          return colorPath(dataMap[d.properties.name].total);
        })
      } else {
        d3.select(this).style("fill", function(d) {
          return "#1a1a1a";
        })
      }
    });

  // set click function with check if country is in dataset
  pathDataMap.on("click", function(d) {
    if (d.properties.name in dataMap) {
      dataMapClick(d.properties.name);
    }
  })
  // merge dataset
  pathDataMap.merge(pathMap)
    .attr("d", path)
    // transition on fill colours countries
    .transition()
    .style("fill", function(d) {
      if (d.properties.name in dataMap) {
        return colorPath(dataMap[d.properties.name].total);
      } else {
        return "#1a1a1a";
      }
    })
    .duration(1500)
    .delay(function(d, i) {
      return i * 15;
    })
    .ease(d3.easeLinear)
    .style("stroke", "darkgrey")
    .style("stroke-width", 2);

  // remove data dat not coincides
  pathMap.exit().remove();

  // add legend to map
  addLegendMap(colorPath);
}

function addLegendMap(colorPath) {
  /*
    Function to create a legend for a color scheme based on quantiles.
  */

  // bind dataset values transfer fees
  let legendRect = legendMap.selectAll("rect").data(colorPath.range());

  // enter dataset, merge dataset and draw rectangles with black stroke
  legendRect.enter().append("rect")
    .merge(legendRect)
    .attr("width", legendWidth)
    .attr('x', widthMap + marginsMap.left - legendWidth)
    .attr('y', function(d, i) {
      return (i * legendWidth) + 5;
    })
    .attr("height", legendWidth)
    .style("stroke", "#000")
    .style("fill", function(d, j) {
      return d;
    });

  // bind data text
  let legendText = legendMap.selectAll("text").data(colorPath.quantiles());

  // set text legend at appropriate place
  legendText.enter().append("text")
    .attr("id", "textLegendMap")
    .merge(legendText)
    .transition()
    .duration(750)
    .ease(d3.easeLinear)
    .attr('x', widthMap + marginsMap.left + 7.5)
    .attr('y', function(d, i) {
      return (colorsMap.length - i - 1) * legendWidth + legendWidth / 2;
    })
    .text(function(d, i) {

      // a check to make sure to only fill text for the border values
      if ((i === 0) || (i === (colorPath.quantiles().length - 1))) {
        var rv = Math.round(d * 10) / 10;
        if (i === 0) rv = '< ' + "€ " + format(rv / 1000000) + "M";
        else if (i === (colorPath.quantiles().length - 1)) rv = '> ' + "€ " + format(rv / 1000000) + "M";
        return rv;
      }
    });

  // remove text, rects that do not coincides
  legendRect.exit().remove();
  legendText.exit().remove();
}
