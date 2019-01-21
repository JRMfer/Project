// const var for marginsBar svg Bar chart
const marginsBar = {top: 50, right: 100, bottom: 100, left: 100},
            widthBar = 750 - marginsBar.left - marginsBar.right,
            heightBar = 500 - marginsBar.top - marginsBar.bottom,
            animateDuration = 700,
            animateDelay = 75,
            barPadding = 1;

let colors = ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837", "#004529"];
// let colors2 = ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"];
let colors2 = ["#65cd94", "#52c786", "#52c786", "#3ec179", "#38ad6d", "#329a61", "#2c8755","#257449", "#1f603c", "#194d30"];
// let colors2 = ["#194d30", "#1f603c", "#257449", "#2c8755", "##329a61", "#38ad6d"];
// let colorBar = d3.scaleThreshold()
//                 // .domain([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
//                 .range(d3.schemeBuGn[5]);

// let colorBar = d3.scaleSequential(d3.interpolateBuGn);

// Create SVG for datamap
let svgBar = d3.select("#barchart")
      .append("svg")
      .attr("class", "svgBar")
      .attr("id", "barChart")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 800 500");

let yAxisSvg = svgBar.append("g")
        .attr("class", "axis")
        .attr("id", "yAxis")
        .attr("transform", "translate(" + (marginsBar.left - barPadding) + ",0)");

let xAxisSvg = svgBar.append("g")
        .attr("class", "axis")
        .attr("id", "xAxis")
        .attr("transform", "translate(0,"  +(marginsBar.top + marginsBar.bottom) * 3 + ")")

let xAxis = d3.axisBottom();
let yAxis = d3.axisLeft();
// // x axis at the appropriate place and rotate the labels
// svgBar.append("g")
//   .attr("class", "axis")
//   .attr("id", "yAxis")
//   .attr("transform", "translate(0," + (heightBar
//                                         - barPadding) + ")")
//   .call(yAxis);

function updateBarChart(country, season, position, data) {

  // let transfersBar = [];
  let infoBar = {"valuesArray": [], "transfers": [], "categories": []};
  // let tempObj = {};

  if (country === "All") {
    // let tempObj = {};

    data.forEach(function(transfer) {
      if (((transfer.Season === season) || (season === "All")) &&
          ((transfer.Position === position) || (position === "All")) &&
          (+transfer.Transfer_fee > 0)) {
            let tempObj = {};
            let count = 0;
            infoBar.transfers.forEach(function(tBar) {
              if (transfer.League_to in tBar) {
                count += 1;
                tBar[transfer.League_to].value += +transfer.Transfer_fee;
                tBar[transfer.League_to].count += 1;
              }
            })
            if (count === 0) {
              let tempObj2 = {};
              tempObj2["value"] = +transfer.Transfer_fee;
              tempObj2["count"] = 1;
              tempObj[transfer.League_to] = tempObj2;
              infoBar.transfers.push(tempObj);
            }
          }
    })
    infoBar.transfers.sort(function(a, b) {
      // console.log(a);
      // console.log("b")
      // console.log(b);
      return ((a[Object.keys(a)].value > b[Object.keys(b)].value) ? -1 : ((a[Object.keys(a)].value == b[Object.keys(b)].value) ? 0 : 1));
  });
    infoBar.transfers.forEach(function(transfer) {
      // console.log(transfer[Object.keys(transfer)]);
      infoBar.valuesArray.push(transfer[Object.keys(transfer)].value);
      infoBar.categories.push(Object.keys(transfer)[0]);
      // infoBar.valuesArray.push(transfer[Object.keys(transfer).value]);
    })
    console.log(infoBar.categories);
    if (infoBar.transfers.length > 0) {
      drawBarChart(infoBar);
    }
  }
  else {
    data.forEach(function(transfer) {
      if (((transfer.League_to === country)) &&
          ((transfer.Season === season) || (season === "All")) &&
          ((transfer.Position === position) || (position === "All")) &&
          (+transfer.Transfer_fee > 0)) {
            let tempObj = {};
            let count = 0;
            infoBar.transfers.forEach(function(tBar) {
              if (transfer.Team_to in tBar) {
                count += 1;
                tBar[transfer.Team_to].value += +transfer.Transfer_fee;
                tBar[transfer.Team_to].count += 1;
              }
            })
            if (count === 0) {
              let tempObj2 = {};
              tempObj2["value"] = +transfer.Transfer_fee;
              tempObj2["count"] = 1;
              tempObj[transfer.Team_to] = tempObj2;
              infoBar.transfers.push(tempObj);
            }
          }
        })
        infoBar.transfers.sort(function(a, b) {
          // console.log(a);
          // console.log("b")
          // console.log(b);
          return ((a[Object.keys(a)].value > b[Object.keys(b)].value) ? -1 : ((a[Object.keys(a)].value == b[Object.keys(b)].value) ? 0 : 1));
      });
        infoBar.transfers.forEach(function(transfer) {
          infoBar.valuesArray.push(transfer[Object.keys(transfer)].value);
          infoBar.categories.push(Object.keys(transfer)[0]);
        })
        if (infoBar.transfers.length > 0) {
          return drawBarChart(infoBar);
        }
    }
}


function drawBarChart(data) {

  // set format for data values (millions)
  let format = d3.format(",");
  console.log(data);

//   data.transfers.sort(function(a, b) {
//     // console.log(a);
//     // console.log("b")
//     // console.log(b);
//     return ((a[Object.keys(a)].value > b[Object.keys(b)].value) ? -1 : ((a[Object.keys(a)].value == b[Object.keys(b)].value) ? 0 : 1));
// });
  console.log(data.transfers);


  let colorBar = d3.scaleQuantile()
    .domain(data.valuesArray)
    .range(colors2);
  //
  //
  //
  // set yScale barchart
  let yScale = d3.scaleLinear()
    .domain([0, data.transfers.length])
    .range([marginsBar.top, heightBar + marginsBar.bottom]);
  //
  // console.log(data.categories)
  // set scale for y axis with strings
  let yAxisScale = d3.scaleBand()
    .domain(data.categories)
    .range([marginsBar.top, heightBar + marginsBar.bottom])
    .paddingInner(0.05);

  yAxis.scale(yAxisScale);
  // x axis at the appropriate place and rotate the labels
  // svgBar.append("g")
  //   .attr("class", "axis")
  //   .attr("id", "yAxis")
  //   .attr("transform", "translate(" + marginsBar.left + ",0)")
  //   .call(yAxis);


  // set yScale barchart
  let xScale = d3.scaleLinear()
    .domain([0, d3.max(data.transfers, function(d) {
      return d[Object.keys(d)].value;
    })])
    .range([marginsBar.left, widthBar]);

  let xAxisScale = d3.scaleLinear()
    .domain([0, d3.max(data.transfers, function(d) {
      return d[Object.keys(d)].value;
    })])
    .range([marginsBar.left, widthBar + marginsBar.right]);

  xAxis.scale(xAxisScale);
  // xAxisSvg.call(xAxis);
  // yAxisSvg.call(yAxis);
  //
  // set tooltip for barchart
  let div = d3.select("#map").append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltipBars")
      .style("opacity", 0);

  // draw graph
  let bars = svgBar.selectAll("rect")
    .data(data.transfers)

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
          div.transition()
          .style("opacity", 0.9)
          div.html(Object.keys(d) + "<br>" + "Number of transfers: " + format(d[Object.keys(d)].count))
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - heightBar / 2) + "px")
          d3.select(this).style('opacity', 0.5)
        })
        .on("mouseout", function(d) {
            div.transition()
                .style("opacity", 0)
            d3.select(this).style('opacity', 1);
        })
    .merge(bars)
    .transition()
    .duration(750)
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

      xAxisSvg.transition().duration(750).ease(d3.easeLinear).call(xAxis.bind(this)).selectAll("text").attr("transform", "rotate(20)");;
      yAxisSvg.transition().duration(750).ease(d3.easeLinear).call(yAxis.bind(this));

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
  }
  else if (root.depth === 1) {
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
  }
  else if (root.depth === 2) {
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
  }
  else {
    if (countryName === "All") {
      return click(root.parent.parent);
    }
    let rootWorld =  root.parent.parent;
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
