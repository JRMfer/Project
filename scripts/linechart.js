/*
Name: Julien Fer
University: University of Amsterdam
Studentnumber: 10649441

This script contains the functionality to draw a datamap with the colours
varying depending on the value of the total transfer fee in a country. Also
a tooltip and legend is included. All of these elements can be updated with a
transition.
*/

const marginLine = {top: 20, right: 20, bottom: 20, left: 200};
const colorsLine = ["#65cd94", "#52c786", "#52c786", "#3ec179", "#38ad6d", "#329a61", "#2c8755","#257449", "#1f603c", "#194d30"];
const widthLine = 1200 - marginLine.right - marginLine.left;
const heightLine = 900 - marginLine.top - marginLine.bottom;

// Create SVG for line chart
let svgLine = d3.select("#linechart")
      .append("svg")
      .attr("class", "svg")
      .attr("id", "lineChart")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 1360 995");

//
let divLine = d3.select("#linechart").append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltipLine")
    .style("opacity", 0);

// let g = svgLine.append("g")
// .attr("transform",
//       "translate(" + marginLine.left + "," + marginLine.top + ")");

let xAxisSvgLine = svgLine.append("g")
  .attr("class", "axis")
  .attr("id", "xAxis")
 .attr("transform", "translate(0,"  + (heightLine - marginLine.bottom) + ")")

let yAxisSvgLine = svgLine.append("g")
  .attr("class", "axis")
  .attr("id", "yAxis")
  .attr("transform", "translate(" + (marginLine.left)+ ",0)")


let xAxisLine = d3.axisBottom();

let yAxisLine = d3.axisLeft();

// let line = d3.line()
//   .x(d => xScale(d.x))
//   .y(d => yScale(d.y))
//   .curve(d3.curveMonotoneX);

function updateLine(country, position, data) {
  let seasons = {"data": [], "seasons": [], "topTransfers": {}};
  // let dataLine = {"data": [], "seasons": []};
  data.forEach(function(transfer) {
    // let tempObj = {};
    if (((transfer.League_to === country) || (country === "All")) &&
        ((transfer.Position === position) || (position === "All")) &&
        (+transfer.Transfer_fee > 0)) {
          let index = seasons.seasons.indexOf(transfer.Season);
          if (index < 0) {
            let tempObj = {};
            seasons.topTransfers[transfer.Season] = [];
            tempObj["name"] = transfer.Name;
            tempObj["value"] = +transfer.Transfer_fee;
            seasons.topTransfers[transfer.Season].push(tempObj);
            // tempObj[transfer.Season] = [tempObj2];
            seasons.data.push(+transfer.Transfer_fee);
            seasons.seasons.push(transfer.Season);
          }
          else {
            seasons.data[index] += +transfer.Transfer_fee;
            let tempObj = {};
            tempObj["name"] = transfer.Name;
            tempObj["value"] = +transfer.Transfer_fee;
            seasons.topTransfers[transfer.Season].push(tempObj);
            // seasons.topTransfers.forEach(function(transfer) {
            //   if (transfer.Season in transfer) {
            //     transfer[transfer.Season]
            //   }
            // })
          }
        }
  })
  // seasons.topTransfers.forEach( function(transfer, i) {
  //   transfer[Object.keys(transfer)].sort(function(a, b) {
  //     return ((a.value > b.value) ? -1 : ((a.value == b.value) ? 0 : 1));
  //   })
  // })
  Object.keys(seasons.topTransfers).forEach(function(season) {
    seasons.topTransfers[season].sort(function(a, b) {
      return ((a.value > b.value) ? -1 : ((a.value == b.value) ? 0 : 1));
    })
  })
  // infoBar.transfers.sort(function(a, b) {
  //   return ((a[Object.keys(a)].value > b[Object.keys(b)].value) ? -1 : ((a[Object.keys(a)].value == b[Object.keys(b)].value) ? 0 : 1)); })
  console.log(seasons);
  if (seasons.data.length > 0) {
    return drawLineChart(seasons);
  }
}

// From https://bl.ocks.org/mbostock/5649592
function transition(path) {
    path.transition()
        .duration(6000)
        .attrTween("stroke-dasharray", tweenDash);
}
function tweenDash() {
    var l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
    return function (t) { return i(t); };
}

// function updateLine(country, position, data) {
//   let seasons = {"data": [], "seasons": []};
//   // let dataLine = {"data": [], "seasons": []};
//   data.forEach(function(transfer) {
//     if (((transfer.League_to === country) || (country === "All")) &&
//         ((transfer.position === position) || (position === "All")) &&
//         (+transfer.Transfer_fee > 0)) {
//           let count = 0
//           seasons.data.forEach( function(season) {
//             if (transfer.Season in season) {
//               count += 1;
//               season[transfer.Season].value += +transfer.Transfer_fee;
//             }
//           })
//           if (count === 0) {
//             let tempObj = {};
//             let tempObj2 = {}
//             tempObj2["value"] = +transfer.Transfer_fee;
//             tempObj[transfer.Season] = tempObj2;
//             seasons.data.push(tempObj);
//           }
//         }
//   })
//
//   return drawLineChart(seasons);
// }


function drawLineChart(data) {
  let format = d3.format(",");
  console.log(data);

  let xAxisScaleLine = d3.scaleBand()
        .domain(data.seasons)
        .range([marginLine.left, widthLine + marginLine.right])
        // .paddingInner(0.05);

  let tickCorrect =( widthLine / data.data.length) / 2;

  console.log(data.seasons.length);
  console.log(data.data.length);

  let xScaleLine = d3.scaleLinear()
                    .domain([0, data.data.length])
                    .range([marginLine.left, widthLine]);
  //
  // let yMin = d3.min(data.data, function(d) {
  //   return d[Object.keys(d)].value;
  // })
  // console.log(yMin);
  // let yMax = d3.max(data.data, function(d) {
  //   return d[Object.keys(d)].value;
  // })
  //
  let yScaleLine = d3.scaleLinear()
                    .domain([0, d3.max(data.data)])
                    .range([heightLine - marginLine.bottom, marginLine.top]);

  xAxisLine.scale(xAxisScaleLine);
  yAxisLine.scale(yScaleLine).tickFormat(function(d) {
    return "€ " + format(d / 1000000) + "M";
  })
//   .tickFormat(function(d) { if (d > 1000000) {
//     return "€" + d3.formatPrefix(".1", 1e6)(d);
//   }
//   else {
//     return "€" + d3.formatPrefix(".1", 1e5)(d);
//   }
// })
  // .tickFormat(d3.formatPrefix("$.0", 1e6));
  //
  let color = d3.scaleLinear()
                .domain([d3.min(data.data), d3.max(data.data)])
                .range(colorsLine);
  // //
  // let divLine = d3.select("#linechart").append("div")
  //     .attr("class", "tooltip")
  //     .attr("id", "tooltipLine")
  //     .style("opacity", 0);
  //
  let line = d3.line()
    .x(function(d, i) { return xAxisScaleLine(data.seasons[i]) + tickCorrect; })
    .y(function(d) { return yScaleLine(d); });
    // .curve(d3.curveMonotoneX);

      // Add the valueline path.
  svgLine.append("path")
      .datum(data.data)
      .attr("class", "line")
    .attr("d", line)
    .call(transition)
    .style("stroke", "#49c0fc")
    .style("stroke-width", 3)
    .style("fill", "none")
    // .on("mouseover", function(d, i) {
    //   // console.log(d[1]);
    //   // console.log(d[0]);
    //       divLine.transition()
    //       .style("opacity", 0.9)
    //       div.html("Total expenditures: " + format(d) + "<br>" + "Top 3 transfers: " + "<br>" +
    //       data.topTransfers[data.seasons[i]][0].name + ": " + data.topTransfers[data.seasons[i]][0].value + "<br>" +
    //       data.topTransfers[data.seasons[i]][1].name + ": " + data.topTransfers[data.seasons[i]][1].value + "<br>" +
    //       data.topTransfers[data.seasons[i]][2].name + ": " + data.topTransfers[data.seasons[i]][2].value)
    //       .style("left", (d3.event.pageX) + "px")
    //       .style("top", (d3.event.pageY - heightLine / 2) + "px")
    //       d3.select(this).style('opacity', 0.5)
    //     })
    //     .on("mouseout", function(d) {
    //         divLine.transition()
    //             .style("opacity", 0)
    //         d3.select(this).style('opacity', 1);
    //     });

  svgLine.selectAll(".dot")
    .data(data.data)
    .enter().append("circle")
    .on("click", function(d, j) {
      d3.select("#seasonsdropdown").property("value", data.seasons[j]);
      seasonsDropdownChange();
    })
    .on("mouseover", function(d, i) {
          if (data.topTransfers[data.seasons[i]].length >= 3) {
            divLine.transition()
            .style("opacity", 0.9)
            divLine.html("<strong>Total transfer fees: </strong><br><span class='details'>"
                      + '€' + format(d) + "</span>" + "<br>" + "<strong>"
                      + "Top 3 transfers: " + "</strong><br><span class='details'>"
                      + "<strong>1. " + data.topTransfers[data.seasons[i]][0].name + "</strong><br>" +
                      "<span class='details'>" + '€' + format(data.topTransfers[data.seasons[i]][0].value) + "</span><br>"
                      + "<strong>2." + data.topTransfers[data.seasons[i]][1].name + "</strong><br>" +
                      "<span class='details'>" + '€' + format(data.topTransfers[data.seasons[i]][1].value) + "</span><br>"
                      + "<strong>3. " + data.topTransfers[data.seasons[i]][2].name + "</strong><br>" +
                      "<span class='details'>" + '€' + format(data.topTransfers[data.seasons[i]][2].value) + "</span><br>")
              // .style("left", (xAxisScaleLine(data.seasons[i]) - marginLine.left - marginLine.right) + "px")
              // .style("top", (d3.event.pageY - heightLine / 3 + marginLine.top + marginLine.bottom) + "px")
            .style("left", (d3.event.pageX - widthLine  + (marginLine.right + marginLine.left)) + "px")
            .style("top", (d3.event.pageY - heightLine / 3.5 + marginLine.top + marginLine.bottom) + "px")
            d3.select(this).style('opacity', 0.5)
          }
          else if (data.topTransfers[data.seasons[i]].length === 2) {
            divLine.transition()
            .style("opacity", 0.9)
            divLine.html("<strong>Total transfer fees: </strong><br><span class='details'>"
                      + '€' + format(d) + "</span>" + "<br>" + "<strong>"
                      + "Top 3 transfers: " + "</strong><br><span class='details'>"
                      + "<strong>1. " + data.topTransfers[data.seasons[i]][0].name + "</strong><br>" +
                      "<span class='details'>" + '€' + format(data.topTransfers[data.seasons[i]][0].value) + "</span><br>"
                      + "<strong>2." + data.topTransfers[data.seasons[i]][1].name + "</strong><br>" +
                      "<span class='details'>" + '€' + format(data.topTransfers[data.seasons[i]][1].value) + "</span><br>")
                      .style("left", (d3.event.pageX - widthLine  + (marginLine.right + marginLine.left)) + "px")
                      .style("top", (d3.event.pageY - heightLine / 3.5 + marginLine.top + marginLine.bottom) + "px")
            d3.select(this).style('opacity', 0.5)
          }
          else if (data.topTransfers[data.seasons[i]].length === 1) {
            divLine.transition()
            .style("opacity", 0.9)
            divLine.html("<strong>Total transfer fees: </strong><br><span class='details'>"
                      + '€' + format(d) + "</span>" + "<br>" + "<strong>"
                      + "Top 3 transfers: " + "</strong><br><span class='details'>"
                      + "<strong>1. " + data.topTransfers[data.seasons[i]][0].name + "</strong><br>" +
                      "<span class='details'>" + '€' + format(data.topTransfers[data.seasons[i]][0].value) + "</span><br>")
                      .style("left", (d3.event.pageX - widthLine  + (marginLine.right + marginLine.left)) + "px")
                      .style("top", (d3.event.pageY - heightLine / 3.5 + marginLine.top + marginLine.bottom) + "px")
            d3.select(this).style('opacity', 0.5)
          }


          // divLine.transition()
          // .style("opacity", 0.9)
          // divLine.html("<strong>Total transfer fees: </strong><br><span class='details'>"
          //           + '€' + format(d) + "</span>" + "<br>" + "<strong>"
          //           + "Top 3 transfers: " + "</strong><br><span class='details'>"
          //           + "<strong>1. " + data.topTransfers[data.seasons[i]][0].name + "</strong><br>" +
          //           "<span class='details'>" + '€' + format(data.topTransfers[data.seasons[i]][0].value) + "</span><br>"
          //           + "<strong>2." + data.topTransfers[data.seasons[i]][1].name + "</strong><br>" +
          //           "<span class='details'>" + '€' + format(data.topTransfers[data.seasons[i]][1].value) + "</span><br>"
          //           + "<strong>3. " + data.topTransfers[data.seasons[i]][2].name + "</strong><br>" +
          //           "<span class='details'>" + '€' + format(data.topTransfers[data.seasons[i]][2].value) + "</span><br>")
          // .style("left", (d3.event.pageX - widthLine / 1.25 + marginLine.left + marginLine.right) + "px")
          // .style("top", (d3.event.pageY - heightLine / 3 + marginLine.top + marginLine.bottom) + "px")
          // d3.select(this).style('opacity', 0.5)
        })
        .on("mouseout", function(d) {
            divLine.transition()
                .style("opacity", 0)
            d3.select(this).style('opacity', 1);
        })
    .transition()
    .duration(1000)
    // .delay(function(d, i) {
    //   return i * 25;
    // })
    .attr("cx", function(d, i) { return xAxisScaleLine(data.seasons[i]) + tickCorrect; })
    .attr("cy", function(d) { return yScaleLine(d); })
    .attr("r", 10)
    // .style("stroke", "green")
    .style("fill", "#49c0fc")
    // .on("mouseover", function(d, i) {
    //   console.log(d);
    //   // console.log(d[1]);
    //   // console.log(d[0]);
    //       divLine.transition()
    //       .style("opacity", 0.9)
    //       divLine.html("Total expenditures: " + format(d) + "<br>" + "Top 3 transfers: " + "<br>" +
    //       data.topTransfers[data.seasons[i]][0].name + ": " + data.topTransfers[data.seasons[i]][0].value + "<br>" +
    //       data.topTransfers[data.seasons[i]][1].name + ": " + data.topTransfers[data.seasons[i]][1].value + "<br>" +
    //       data.topTransfers[data.seasons[i]][2].name + ": " + data.topTransfers[data.seasons[i]][2].value)
    //       .style("left", (d3.event.pageX) + "px")
    //       .style("top", (d3.event.pageY - heightLine / 2) + "px")
    //       d3.select(this).style('opacity', 0.5)
    //     })
    //     .on("mouseout", function(d) {
    //         divLine.transition()
    //             .style("opacity", 0)
    //         d3.select(this).style('opacity', 1);
    //     });


    xAxisSvgLine.transition().duration(1500).ease(d3.easeLinear).call(xAxisLine.bind(this)).selectAll("text").attr("transform", "rotate(40)");
    yAxisSvgLine.transition().duration(1500).ease(d3.easeLinear).call(yAxisLine.bind(this));
  // //
  //   lines.exit().remove();
}

function animateLine() {
  svgLine.selectAll("path").call(transition).remove();
  svgLine.selectAll("circle").remove();
  let country = d3.select("#countriesdropdown").property("value");
  let position = d3.select("#positionsdropdown").property("value");
  console.log(position);
  updateLine(country, position, info.data);
}
