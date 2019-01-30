/*
Name: Julien Fer
University: University of Amsterdam
Studentnumber: 10649441

This script contains the functionality to draw a bar chart with sorted bars.
The barchart also contains a transition on the rects and on the axis with every update.
*/

// const var for marginsBar svg Bar chart
const marginsBar = {
    top: 50,
    right: 100,
    bottom: 100,
    left: 150
  },
  widthBar = 1200 - marginsBar.left - marginsBar.right,
  heightBar = 960 - marginsBar.top - marginsBar.bottom,
  animateDuration = 700,
  animateDelay = 75,
  barPadding = 5;

// colors for bar chart
const colorsBar = ["#f1f9ff", "#d2ebfe", "#c3e5fe", "#abdcfe", "#8fd2fd", "#77cbfd", "#63c5fc", "#49c0fc"];

// create SVG for bar chart
const svgBar = d3.select("#barchart")
  .append("svg")
  .attr("id", "barChart")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "-100 0 1350 1020");

// set tooltip for barchart
const divBar = d3.select("#barchart").append("divBar")
  .attr("class", "tooltip")
  .attr("id", "tooltipBars")
  .style("opacity", 0);

// append g and add transform for y axis
const yAxisSvg = svgBar.append("g")
  .attr("class", "axis")
  .attr("id", "yAxis")
  .attr("transform", "translate(" + (marginsBar.left - barPadding) + ",0)");

// append g and add transform for x axis
const xAxisSvg = svgBar.append("g")
  .attr("class", "axis")
  .attr("id", "xAxis")
  .attr("transform", "translate(0," + (marginsBar.top + marginsBar.bottom) * 6.06 + ")");

// set up var for x and y axis
let xAxis = d3.axisBottom();
let yAxis = d3.axisLeft();

function drawBarChart(data) {
  /*
    Function to draw a barchart with transition. Tooltip shows total amount of
    transfers and the total transfer fee. The axis also contain a transition.
  */

  // set up scale
  let colorBar = d3.scaleQuantile()
    .domain(data.valuesArray)
    .range(colorsBar);

  // set x scale barchart
  let xScale = d3.scaleLinear()
    .domain([0, d3.max(data.transfers, function(d) {
      return d[Object.keys(d)].value;
    })])
    .range([marginsBar.left, widthBar]);

  // set yScale barchart
  let yScale = d3.scaleLinear()
    .domain([0, data.transfers.length])
    .range([marginsBar.top, heightBar + marginsBar.bottom]);

  // bind data
  let bars = svgBar.selectAll("rect")
    .data(data.transfers);

  // enter data set and append rect to svg bar chart
  let rectsBar = bars.enter().append("rect");

  // set starting points bars
  rectsBar.attr("x", widthBar)
    .attr("y", function(d, i) {
      return yScale(i);
    })
    .attr("width", 0)
    .attr("height", heightBar / data.transfers.length - barPadding);

    // set on click function for bars (linked to sunburst and line chart)
  rectsBar.on("click", function(d) {
      zoomSunburst(Object.keys(d)[0]);
    });

  // set mouseover effects
  rectsBar.on("mouseover", function(d) {

      divBar.transition()
        .style("opacity", 0.9);
      if (d3.select("#countriesdropdown").property("value") === "All") {
        divBar.html("<strong>Country: </strong><span class='details'>" + Object.keys(d)[0] + "</span><br><br>"
            + "<strong>Total transfers: </strong><span class='details'>" +
            format(d[Object.keys(d)].count) + "</span><br><br>" +
            "<strong>Total transfer fees: </strong><br><span class='details'>" +
            '€' + format(d[Object.keys(d)].value) + "</span>");
      }
      else {
        divBar.html("<strong>Club: </strong><span class='details'>" + Object.keys(d)[0] + "</span><br><br>"
            + "<strong>Total transfers: </strong><span class='details'>" +
            format(d[Object.keys(d)].count) + "</span><br><br>" +
            "<strong>Total transfer fees: </strong><br><span class='details'>" +
            '€' + format(d[Object.keys(d)].value) + "</span>");
      }

      divBar.style("left", (d3.event.pageX - marginsBar.left) + "px")
        .style("top", (d3.event.pageY - heightBar / .925 + (marginsBar.top + marginsBar.bottom)) + "px");

      d3.select(this).style("opacity", 0.5);
    });

  // set mouse out effects
  rectsBar.on("mouseout", function(d) {

      divBar.transition()
        .style("opacity", 0);

      d3.select(this).style('opacity', 1);
    });

  // merge bars
  let mergedBars = rectsBar.merge(bars);

  // set transition
  mergedBars.transition()
    .duration(850)
    .ease(d3.easeLinear)
    // set attributes bars updated data set
    .attr("x", xScale(marginsBar.left))
    .attr("y", function(d, i) {
      return yScale(i);
    })
    .attr("width", function(d) {
      return xScale(d[Object.keys(d)].value);
    })
    .attr("height", heightBar / data.transfers.length - barPadding)
    // .transition()
    .style("fill", function(d) {
      return colorBar(d[Object.keys(d)].value);
    });

  // remove bars
  bars.exit().transition()
    .attr("width", 0)
    .attr("x", widthBar)
    .remove();

  // set axis bar chart
  axisBarchart(data);

  // set correct header chart
  if (d3.select("#countriesdropdown").property("value") === "All") {
    d3.select("#headerBarchart").text("By Competition")
  } else {
    d3.select("#headerBarchart").text("By Club")
  }
}

function axisBarchart(data) {
  /*
    Function to set axis for bar chart
  */

  // set scale for y axis with strings
  let yAxisScale = d3.scaleBand()
    .domain(data.categories)
    .range([marginsBar.top, heightBar + marginsBar.bottom])
    .paddingInner(0.05);

  yAxis.scale(yAxisScale);

  // set x scale axis
  let xAxisScale = d3.scaleLinear()
    .domain([0, d3.max(data.transfers, function(d) {
      return d[Object.keys(d)].value;
    })])
    .range([marginsBar.left, widthBar + marginsBar.right]);

  xAxis.scale(xAxisScale).tickFormat(function(d) {
    return "€ " + format(d / 1000000) + "M";
  });

  // set transition for axis
  xAxisSvg.transition().duration(750).ease(d3.easeLinear).call(xAxis.bind(this)).selectAll("text").attr("transform", "rotate(20)");
  yAxisSvg.transition().duration(750).ease(d3.easeLinear).call(yAxis.bind(this)).selectAll("text").attr("transform", "rotate(0)");
}

function updateBarChart(country, season, position, data) {
  /*
    Collects the data asked by the user from the total dataset. It returns an
    object with 3 arrays. 1 for all the values, 1 with objects of the total
    transfer fee and amount of transfers of every Category and 1 with all the
    categories (countries/clubs).
  */

  // set object (infoBar) for the 3 arrays
  let infoBar = {
    "valuesArray": [],
    "transfers": [],
    "categories": []
  };

  // check if data for the world ("All") is needed
  if (country === "All") {
    checkAllCountriesBar(data, infoBar, season, position);
  }
  // if a country is selected
  else {
    checkCountryBar(data, infoBar, country, season, position);
  }
}

function checkAllCountriesBar(data, infoBar, season, position) {
  /*
    Gathers the updated data when All countries is selected.
  */

  // loop for every transfer
  data.forEach(function(transfer) {

    // checks if transfer satisfies condition
    if (((transfer.Season === season) || (season === "All")) &&
      ((transfer.Position === position) || (position === "All")) &&
      (+transfer.Transfer_fee > 0)) {

      // set op tempObj and count var
      let tempObj = {};
      let count = 0;

      // loop for every country in infoBar's transfers
      infoBar.transfers.forEach(function(country) {

        // If country in transfers add the values to it
        if (transfer.League_to in country) {
          count += 1;
          country[transfer.League_to].value += +transfer.Transfer_fee;
          country[transfer.League_to].count += 1;

        }
      });

      // if country not in infobar make a new object and add this
      if (count === 0) {
        let tempObj2 = {};
        tempObj2["value"] = +transfer.Transfer_fee;
        tempObj2["count"] = 1;
        tempObj[transfer.League_to] = tempObj2;
        infoBar.transfers.push(tempObj);
      }
    }
  });

  // sort the transfers according the total transfer fee of each country
  infoBar.transfers.sort(function(a, b) {
    return ((a[Object.keys(a)].value > b[Object.keys(b)].value) ? -1 : ((a[Object.keys(a)].value == b[Object.keys(b)].value) ? 0 : 1));
  });

  // add total transfer fee and corresponding in sync to an array
  infoBar.transfers.forEach(function(transfer) {
    infoBar.valuesArray.push(transfer[Object.keys(transfer)].value);
    infoBar.categories.push(Object.keys(transfer)[0]);
  });

  // checks if infobar contains any data, if so draw bar chart,
  // if not show alert
  if (infoBar.transfers.length > 0) {
    drawBarChart(infoBar);
  } else {
    alert("no data found");
  }
}


function checkCountryBar(data, infoBar, country, season, position) {
  /*
    Gathers all the data for a certain country.
  */

  // loop for every transfer in dataset
  data.forEach(function(transfer) {

    // checks if transfer satisfies condition
    if (((transfer.League_to === country)) &&
      ((transfer.Season === season) || (season === "All")) &&
      ((transfer.Position === position) || (position === "All")) &&
      (+transfer.Transfer_fee > 0)) {

      // set op tempObj and count var
      let tempObj = {};
      let count = 0;

      // loop over every tclub in infoBar.transfers
      infoBar.transfers.forEach(function(club) {

        // if club in transfers add the values to it
        if (transfer.Team_to in club) {
          count += 1;
          club[transfer.Team_to].value += +transfer.Transfer_fee;
          club[transfer.Team_to].count += 1;
        }
      });

      // if not make a new object for the club and add it to inforbar.transfers
      if (count === 0) {
        let tempObj2 = {}
        tempObj2["value"] = +transfer.Transfer_fee;
        tempObj2["count"] = 1;
        tempObj[transfer.Team_to] = tempObj2;
        infoBar.transfers.push(tempObj);
      }
    }
  });

  // sort infobar.transfers
  infoBar.transfers.sort(function(a, b) {
    return ((a[Object.keys(a)].value > b[Object.keys(b)].value) ? -1 : ((a[Object.keys(a)].value == b[Object.keys(b)].value) ? 0 : 1));
  });

  // fill array with all total transfer fees and one with all clubs in sync
  infoBar.transfers.forEach(function(transfer) {
    infoBar.valuesArray.push(transfer[Object.keys(transfer)].value);
    infoBar.categories.push(Object.keys(transfer)[0]);
  });

  // if data in infobar draw bar chart, if not show alert
  if (infoBar.transfers.length > 0) {
    return drawBarChart(infoBar);
  } else {
    alert("no data found");
  }
}
