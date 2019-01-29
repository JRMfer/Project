/*
Name: Julien Fer
University: University of Amsterdam
Studentnumber: 10649441

This script contains the functionality to draw a linechart with the total transfer
fee over time (per season) including a tooltip that shows this amount and also
the top 3 transfers (per season). The dots in the chart contain a click function
to update the other 3 visualiszations.
*/

const marginLine = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 200
};
const colorsLine = ["#65cd94", "#52c786", "#52c786", "#3ec179", "#38ad6d", "#329a61", "#2c8755", "#257449", "#1f603c", "#194d30"];
const widthLine = 1200 - marginLine.right - marginLine.left;
const heightLine = 900 - marginLine.top - marginLine.bottom;

// create SVG for line chart
const svgLine = d3.select("#linechart")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 1360 995");

// append tooltip to line chart
const divLine = d3.select("#linechart").append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltipLine")
  .style("opacity", 0);

// append g with transform for xaxis line to svgLine
const xAxisSvgLine = svgLine.append("g")
  .attr("class", "axis")
  .attr("id", "xAxis")
  .attr("transform", "translate(0," + (heightLine - marginLine.bottom) + ")");

// append g with transform for yaxis line to svgLine
const yAxisSvgLine = svgLine.append("g")
  .attr("class", "axis")
  .attr("id", "yAxis")
  .attr("transform", "translate(" + (marginLine.left) + ",0)");


function updateLine(country, position, data) {
  /*
    Function to update the data to the input asked and gather the total transfer
    fee, the seasons and the top 3 transfers per season. The data is gathered in
    a way such that the arrays are in sync based on their index.
  */

  // set up object (dataLine) to keep track of the 3 datasets
  let dataLine = {
    "data": [],
    "seasons": [],
    "topTransfers": {}
  };

  // loop over every transfer
  data.forEach(function(transfer) {

    // checks if transfer satisfies data asked
    if (((transfer.League_to === country) || (country === "All")) &&
      ((transfer.Position === position) || (position === "All")) &&
      (+transfer.Transfer_fee > 0)) {

      /*
        checks if season is already in dataLine, collect all data for that season
        (transfer fee to data, season to seasons and name and value to topTransfers
        as objects)
        */
      let index = dataLine.seasons.indexOf(transfer.Season);
      if (index < 0) {
        let tempObj = {};
        dataLine.topTransfers[transfer.Season] = [];
        tempObj["name"] = transfer.Name;
        tempObj["value"] = +transfer.Transfer_fee;
        dataLine.topTransfers[transfer.Season].push(tempObj);
        dataLine.data.push(+transfer.Transfer_fee);
        dataLine.seasons.push(transfer.Season);
      }
      /*
        if in dataLine, add transfer fee for that season and append transfer
        name and value to toptransfer for that season.
      */
      else {
        dataLine.data[index] += +transfer.Transfer_fee;
        let tempObj = {};
        tempObj["name"] = transfer.Name;
        tempObj["value"] = +transfer.Transfer_fee;
        dataLine.topTransfers[transfer.Season].push(tempObj);
      }
    }
  });

  // sort the topTransfers in every season
  Object.keys(dataLine.topTransfers).forEach(function(season) {
    dataLine.topTransfers[season].sort(function(a, b) {
      return ((a.value > b.value) ? -1 : ((a.value == b.value) ? 0 : 1));
    })
  });
  // checks if there is any adata, if so return drawLineChart function
  if (dataLine.data.length > 0) {
    return drawLineChart(dataLine);
  }
}

// From https://bl.ocks.org/mbostock/5649592
function transition(path) {
  path.transition()
    .duration(6000)
    .attrTween("stroke-dasharray", tweenDash);
}

// From https://bl.ocks.org/mbostock/5649592
function tweenDash() {
  var l = this.getTotalLength(),
    i = d3.interpolateString("0," + l, l + "," + l);
  return function(t) {
    return i(t);
  };
}

function drawLineChart(data) {
  /*
    Function to draw the line chart with transition on the axis and dots and a
    animation for the paths.
  */

  // set up scale xaxis
  let xAxisScaleLine = d3.scaleBand()
    .domain(data.seasons)
    .range([marginLine.left, widthLine + marginLine.right]);

  // setup x scale paths and dots
  let xScaleLine = d3.scaleLinear()
    .domain([0, data.data.length])
    .range([marginLine.left, widthLine]);

  // tick correct scale x axis and paths/dots
  let tickCorrect = (widthLine / data.data.length) / 2;

  // set y scale path, dots and yaxis
  let yScaleLine = d3.scaleLinear()
    .domain([0, d3.max(data.data)])
    .range([heightLine - marginLine.bottom, marginLine.top]);

  // creat xaxis and yaxis
  let xAxisLine = d3.axisBottom().scale(xAxisScaleLine);
  let yAxisLine = d3.axisLeft().scale(yScaleLine).tickFormat(function(d) {
    return "€ " + format(d / 1000000) + "M";
  });

  // bind values axis wit transition
  xAxisSvgLine.transition().duration(1500).ease(d3.easeLinear).call(xAxisLine.bind(this)).selectAll("text").attr("transform", "rotate(40)");
  yAxisSvgLine.transition().duration(1500).ease(d3.easeLinear).call(yAxisLine.bind(this));

  // set up function to give the corresponding x,y values to draw lines
  let line = d3.line()
    .x(function(d, i) {
      return xAxisScaleLine(data.seasons[i]) + tickCorrect;
    })
    .y(function(d) {
      return yScaleLine(d);
    });

  // Add the valueline path with transition
  svgLine.append("path")
    .datum(data.data)
    .attr("class", "line")
    .attr("d", line)
    .call(transition);

  // bind data to every dot
  let dots = svgLine.selectAll(".dot")
                .data(data.data);

  // append for every data point a circle
  let dataDots = dots.enter().append("circle");

  // add onclick ability for dot to trigger seasonsDropdownChange()
  dataDots.on("click", function(d, i) {
    d3.select("#seasonsdropdown").property("value", data.seasons[i]);
    seasonsDropdownChange();
  });
  /*
    add tooltip to dot that show total transfer fee and top 3 transfers
    also checks if there is a top 3 otherwise return top 1/2 transfers
  */
  dataDots.on("mouseover", function(d, i) {

    if (data.topTransfers[data.seasons[i]].length >= 3) {
      divLine.transition()
        .style("opacity", 0.9);

      divLine.html("<strong>Total transfer fees: </strong><br><span class='details'>" +
          '€' + format(d) + "</span>" + "<br>" + "<strong>" +
          "Top 3 transfers: " + "</strong><br><span class='details'>" +
          "<strong>1. " + data.topTransfers[data.seasons[i]][0].name + "</strong><br>" +
          "<span class='details'>" + '€' + format(data.topTransfers[data.seasons[i]][0].value) + "</span><br>" +
          "<strong>2." + data.topTransfers[data.seasons[i]][1].name + "</strong><br>" +
          "<span class='details'>" + '€' + format(data.topTransfers[data.seasons[i]][1].value) + "</span><br>" +
          "<strong>3. " + data.topTransfers[data.seasons[i]][2].name + "</strong><br>" +
          "<span class='details'>" + '€' + format(data.topTransfers[data.seasons[i]][2].value) + "</span><br>")
        .style("left", (d3.event.pageX - widthLine + (marginLine.right + marginLine.left)) + "px")
        .style("top", (d3.event.pageY - heightLine / 3.5 + marginLine.top + marginLine.bottom) + "px");

      d3.select(this).style('opacity', 0.5);
      d3.select(this).style("fill", "#ffa31a");
      d3.select(this).style("r", 20);
    }
    else if (data.topTransfers[data.seasons[i]].length === 2) {
      divLine.transition()
        .style("opacity", 0.9);

      divLine.html("<strong>Total transfer fees: </strong><br><span class='details'>" +
          '€' + format(d) + "</span>" + "<br>" + "<strong>" +
          "Top 3 transfers: " + "</strong><br><span class='details'>" +
          "<strong>1. " + data.topTransfers[data.seasons[i]][0].name + "</strong><br>" +
          "<span class='details'>" + '€' + format(data.topTransfers[data.seasons[i]][0].value) + "</span><br>" +
          "<strong>2." + data.topTransfers[data.seasons[i]][1].name + "</strong><br>" +
          "<span class='details'>" + '€' + format(data.topTransfers[data.seasons[i]][1].value) + "</span><br>")
        .style("left", (d3.event.pageX - widthLine + (marginLine.right + marginLine.left)) + "px")
        .style("top", (d3.event.pageY - heightLine / 3.5 + marginLine.top + marginLine.bottom) + "px");

        d3.select(this).style('opacity', 0.5);
        d3.select(this).style("fill", "#ffa31a");
        d3.select(this).style("r", 20);
    }
    else if (data.topTransfers[data.seasons[i]].length === 1) {
      divLine.transition()
        .style("opacity", 0.9);

      divLine.html("<strong>Total transfer fees: </strong><br><span class='details'>" +
          '€' + format(d) + "</span>" + "<br>" + "<strong>" +
          "Top 3 transfers: " + "</strong><br><span class='details'>" +
          "<strong>1. " + data.topTransfers[data.seasons[i]][0].name + "</strong><br>" +
          "<span class='details'>" + '€' + format(data.topTransfers[data.seasons[i]][0].value) + "</span><br>")
        .style("left", (d3.event.pageX - widthLine + (marginLine.right + marginLine.left)) + "px")
        .style("top", (d3.event.pageY - heightLine / 3.5 + marginLine.top + marginLine.bottom) + "px");

        d3.select(this).style('opacity', 0.5);
        d3.select(this).style("fill", "#ffa31a");
        d3.select(this).style("r", 20);
    }
  });

  // mouseout effets: adjust opacity tooltip, radius and color dots
  dataDots.on("mouseout", function(d) {
    divLine.transition()
      .style("opacity", 0)
    d3.select(this).style('opacity', 1);
    d3.select(this).style("fill", "#49c0fc");
    d3.select(this).style("r", 10);
  });

  // transition on appending the circles
  dataDots.transition()
  .duration(1000)
  .attr("cx", function(d, i) {
    return xAxisScaleLine(data.seasons[i]) + tickCorrect;
  })
  .attr("cy", function(d) {
    return yScaleLine(d);
  })
  .attr("r", 10)
  .style("fill", "#49c0fc");
}

function animateLine() {
  /*
    Function to collect the data asked and start the drawing of the linechart
  */

  svgLine.selectAll("path").call(transition).remove();
  svgLine.selectAll("circle").remove();
  let country = d3.select("#countriesdropdown").property("value");
  let position = d3.select("#positionsdropdown").property("value");
  updateLine(country, position, info.data);
}
