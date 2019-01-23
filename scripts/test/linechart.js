let marginLine = {top: 20, right: 20, bottom: 20, left: 50};
let colorsLine = ["#65cd94", "#52c786", "#52c786", "#3ec179", "#38ad6d", "#329a61", "#2c8755","#257449", "#1f603c", "#194d30"];
let widthLine = 800 - marginLine.right - marginLine.left;
let heightLine = 650 - marginLine.top - marginLine.bottom;
//
// let svgLine = d3.select("#linechart").append("svg")
//   .attr("class", "svgLine")
//   .attr("height", heightLine).attr("width", widthLine)
//   .append("g")
//     .attr("transform", `translate(${marginLine.left}, ${marginLine.right})`)

// Create SVG for line chart
let svgLine = d3.select("#linechart")
      .append("svg")
      .attr("class", "svg")
      .attr("id", "lineChart")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "-25 0 960 700");

// let g = svgLine.append("g")
// .attr("transform",
//       "translate(" + marginLine.left + "," + marginLine.top + ")");

let xAxisSvgLine = svgLine.append("g")
  .attr("class", "axis")
  .attr("id", "xAxis")
 .attr("transform", "translate(15,"  + ((marginLine.top + marginLine.bottom) * 15.75) + ")")

let yAxisSvgLine = svgLine.append("g")
  .attr("class", "axis")
  .attr("id", "yAxis")
  .attr("transform", "translate(" + (marginLine.left + marginLine.right) / 1.1 + ",0)")


let xAxisLine = d3.axisBottom();

let yAxisLine = d3.axisLeft();

// let line = d3.line()
//   .x(d => xScale(d.x))
//   .y(d => yScale(d.y))
//   .curve(d3.curveMonotoneX);

function updateLine(country, position, data) {
  let seasons = {"data": [], "seasons": []};
  // let dataLine = {"data": [], "seasons": []};
  data.forEach(function(transfer) {
    if (((transfer.League_to === country) || (country === "All")) &&
        ((transfer.Position === position) || (position === "All")) &&
        (+transfer.Transfer_fee > 0)) {
          let index = seasons.seasons.indexOf(transfer.Season);
          if (index < 0) {
            seasons.data.push(+transfer.Transfer_fee);
            seasons.seasons.push(transfer.Season);
          }
          else {
            data[index] += +transfer.Transfer_fee;
          }
        }
  })
  console.log(seasons);

  return drawLineChart(seasons);
}

// From https://bl.ocks.org/mbostock/5649592
function transition(path) {
    path.transition()
        .duration(4000)
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
        .paddingInner(0.05);

  console.log(data.seasons.length);
  console.log(data.data.length);

  let xScaleLine = d3.scaleLinear()
                    .domain([0, data.seasons.length])
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
                    .range([heightLine + marginLine.bottom, marginLine.top]);

  xAxisLine.scale(xAxisScaleLine);
  yAxisLine.scale(yScaleLine);
  //
  let color = d3.scaleLinear()
                .domain([d3.min(data.data), d3.max(data.data)])
                .range(colorsLine);
  //
  let divLine = d3.select("#linechart").append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltipLine")
      .style("opacity", 0);
  //
  let line = d3.line()
    .x(function(d, i) { return xScaleLine(i + 1); })
    .y(function(d) { return yScaleLine(d); });
    // .curve(d3.curveMonotoneX);

      // Add the valueline path.
  svgLine.append("path")
      .datum(data.data)
      .attr("class", "line")
    .attr("d", line)
    .call(transition)
    .style("stroke", "#65cd94")
    .style("fill", "none");

  svgLine.selectAll(".dot")
    .data(data.data)
    .enter().append("circle")
    .transition()
    .duration(2000)
    // .delay(function(d, i) {
    //   return i * 25;
    // })
    .attr("cx", function(d, i) { return xScaleLine(i + 1) })
    .attr("cy", function(d) { return yScaleLine(d) })
    .attr("r", 5)
    // .style("stroke", "green")
    .style("fill", "#65cd94");


    xAxisSvgLine.transition().duration(1500).ease(d3.easeLinear).call(xAxisLine.bind(this)).selectAll("text").attr("transform", "rotate(20)");
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
