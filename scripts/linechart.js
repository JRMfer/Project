let widthLine = 960;
let heightLine = 500;

let marginLine = {top: 20, right: 20, bottom: 20, left: 50};
let colorsLine = ["#65cd94", "#52c786", "#52c786", "#3ec179", "#38ad6d", "#329a61", "#2c8755","#257449", "#1f603c", "#194d30"];

//
// let svgLine = d3.select("#linechart").append("svg")
//   .attr("class", "svgLine")
//   .attr("height", heightLine).attr("width", widthLine)
//   .append("g")
//     .attr("transform", `translate(${marginLine.left}, ${marginLine.right})`)

// Create SVG for line chart
let svgLine = d3.select("#linechart")
      .append("svg")
      .attr("class", "svgLine")
      .attr("id", "lineChart")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "-300 -300 960 500");

let xAxisSvgLine = svgLine.append("g")
  .attr("class", "axis")
  .attr("id", "xAxis");
let yAxisSvgLine = svgLine.append("g")
  .attr("class", "axis")
  .attr("id", "yAxis");

// let g = svgLine.append("g")
//             .attr("transform", "translate(" + marginLine.left +  "," + marginLine.top +")");



// let xScaleLine = d3.scaleBand()
//       .range([0, widthLine - marginLine.left - marginLine.right]);

let xAxisLine = d3.axisBottom();

// let yScaleLine = d3.scaleLinear()
  // .range([heightLine - marginLine.top - marginLine.bottom, 0]);

let yAxisLine = d3.axisLeft();

// let line = d3.line()
//   .x(d => xScale(d.x))
//   .y(d => yScale(d.y))
//   .curve(d3.curveMonotoneX);

function updateLine(country, position, data) {
  let seasons = {"data": []};
  // let dataLine = {"data": [], "seasons": []};
  data.forEach(function(transfer) {
    if (((transfer.League_to === country) || (country === "All")) &&
        ((transfer.position === position) || (position === "All")) &&
        (+transfer.Transfer_fee > 0)) {
          let count = 0
          seasons.data.forEach( function(season) {
            if (transfer.Season in season) {
              count += 1;
              season[transfer.Season].value += +transfer.Transfer_fee;
            }
          })
          if (count === 0) {
            let tempObj = {};
            let tempObj2 = {}
            tempObj2["value"] = +transfer.Transfer_fee;
            tempObj[transfer.Season] = tempObj2;
            seasons.data.push(tempObj);
          }
        }
  })

  return drawLineChart(seasons);
}


function drawLineChart(data) {
  let format = d3.format(",");
  console.log(data);

  let xAxisScaleLine = d3.scaleBand()
        .domain(Object.keys(data))
        .range([marginLine.left, widthLine - marginLine.right]);

  let yMin = d3.min(data.data, function(d) {
    return d[Object.keys(d)].value;
  })
  console.log(yMin);
  let yMax = d3.max(data.data, function(d) {
    return d[Object.keys(d)].value;
  })

  let yScaleLine = d3.scaleLinear()
                    .domain([yMin, yMax])
                    .range([heightLine - marginLine.top - marginLine.bottom, marginLine.top]);

  xAxisLine.scale(xAxisScaleLine);
  yAxisLine.scale(yScaleLine);

  let color = d3.scaleLinear()
                .domain([yMin, yMax])
                .range(colorsLine);

  let divLine = d3.select("#linechart").append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltipLine")
      .style("opacity", 0);

  let line = d3.line()
    .x(function(d) { return xAxisScale(Object.keys(d)); })
    .y(function(d) { return yScaleLine(d[Object.keys(d)].value); })
    .curve(d3.curveMonotoneX);

  let lines = svgLine.selectAll("line")
  	.data(data.data)
    	.attr("class", "line");

    //   // exit
    // lines.exit()
    //   .remove();

    // enter any new data
    lines.enter()
      .append("path")
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", function(d) {
          return color(d[Object.keys(d)].value);
        })
      .merge(lines)
        .transition().duration(1500)
        .attr("d", line)
        .style("stroke", function(d) {
          return color(d[Object.keys(d)].value);
        })

    xAxisSvgLine.transition().duration(1500).ease(d3.easeLinear).call(xAxis.bind(this)).selectAll("text").attr("transform", "rotate(20)");
    yAxisSvgLine.transition().duration(1500).ease(d3.easeLinear).call(yAxis.bind(this));

    lines.exit().remove();
}
