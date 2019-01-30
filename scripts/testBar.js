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
  // if a country is selected
  else {

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


function drawBarChart(data) {
  /*
    Function to draw a barchart with transition. Tooltip shows total amount of
    transfers and the total transfer fee. The axis also contain a transition.
  */

  // set up scale
  let colorBar = d3.scaleQuantile()
    .domain(data.valuesArray)
    .range(colorsBar);

  axisBarchart(data);

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
    .data(data.transfers)

  // enter data a
  bars.enter()
    .append("rect")
    .attr("class", "bar")
    .attr("id", "competitionsRects")
    // .attr("x", xScale(marginsBar.left))
    .attr("x", widthBar)
    .attr("y", function(d, i) {
      return yScale(i);
    })
    .attr("width", 0)
    .attr("height", heightBar / data.transfers.length - barPadding)
    .on("click", function(d) {
      barZoomSunburst(Object.keys(d)[0]);
    })
    .on("mouseover", function(d) {
      // console.log(d[1]);
      // console.log(d[0]);
      divBar.transition()
        .style("opacity", 0.9)
      divBar.html("<strong>Total transfers: </strong><span class='details'>" +
          format(d[Object.keys(d)].count) + "<br></span>" +
          "<strong>Total transfer fees: </strong><br><span class='details'>" +
          '€' + format(d[Object.keys(d)].value) + "</span>")
        .style("left", (d3.event.pageX - marginsBar.left) + "px")
        .style("top", (d3.event.pageY - heightBar + (marginsBar.top + marginsBar.bottom)) + "px")
      d3.select(this).style('opacity', 0.5)
    })
    .on("mouseout", function(d) {
      divBar.transition()
        .style("opacity", 0)
      d3.select(this).style('opacity', 1);
    })
    .merge(bars)
    .transition()
    .duration(850)
    // .delay(function(d, i) {
    //   return i * 10;
    // })
    .ease(d3.easeLinear)
    // .ease(d3.easePoly.exponent(2))
    // .delay(function(d, i) {
    //   return i * 5;
    // })
    .attr("x", xScale(marginsBar.left))
    .attr("y", function(d, i) {
      return yScale(i);
    })
    .attr("width", function(d) {
      return xScale(d[Object.keys(d)].value);
    })
    .attr("height", heightBar / data.transfers.length - barPadding)
    // .transition()
    .attr("fill", function(d) {
      // console.log(color(d));
      // console.log(d);
      return colorBar(d[Object.keys(d)].value);
    })

  bars.exit()
    .transition()
    // .duration(750)
    // .delay(function(d, i) {
    //   return i * 25;
    // })
    .attr("width", 0)
    .attr("x", widthBar)
    .remove();

  if (d3.select("#countriesdropdown").property("value") === "All") {
    // console.log(d3.select("#countriesdropdown").property("value"));
    d3.select("#headerBarchart").text("By Competition")
    // .property("text", "By Country");
  } else {
    // console.log(d3.select("#countriesdropdown").property("value"));
    d3.select("#headerBarchart").text("By Club")
    // .property("text", "By Club");
  }

  // // bars.on("click", barZoomSunburst("s"))
}

function barZoomSunburst(countryName) {
  console.log(countryName);
  console.log(info);
  let root = info.rootSun;
  console.log(root);

  if (root.depth === 0) {
    if (countryName === "All") {
      return click(root.children[0]);
    }
    console.log("test");
    root.children.forEach(function(world) {
      world.children.forEach(function(competition) {
        if (competition.data.name === countryName) {
          info.rootSun = competition;
          d3.select("#countriesdropdown").property("value", countryName);
          return click(competition);
        }
      })
    })
  } else if (root.depth === 1) {
    if (countryName === "All") {
      return click(root);
    }
    root.children.forEach(function(competition) {
      if (competition.data.name === countryName) {
        info.rootSun = competition;
        d3.select("#countriesdropdown").property("value", countryName);
        return click(competition);
      }
    })
  } else if (root.depth === 2) {
    if (countryName === "All") {
      return click(root.parent);
    }
    let rootWorld = root.parent;
    rootWorld.children.forEach(function(competition) {
      if (competition.data.name === countryName) {
        info.rootSun = competition;
        d3.select("#countriesdropdown").property("value", countryName);
        return click(competition);
      }
      competition.children.forEach(function(club) {
        if (club.data.name === countryName) {
          info.rootSun === club;
          return click(club);
        }
      })
    })
  } else {
    if (countryName === "All") {
      return click(root.parent.parent);
    }
    let rootWorld = root.parent.parent;
    rootWorld.children.forEach(function(competition) {
      if (competition.data.name === countryName) {
        info.rootSun = competition;
        d3.select("#countriesdropdown").property("value", countryName);
        return click(competition);
      }
      competition.children.forEach(function(club) {
        if (club.data.name === countryName) {
          info.rootSun === club;
          return click(club);
        }
      })
    })

  }
}
