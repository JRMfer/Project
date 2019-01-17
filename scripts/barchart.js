// const var for marginsBar svg Bar chart
const marginsBar = {top: 0, right: 100, bottom: 100, left: 100},
            widthBar = 750 - marginsBar.left - marginsBar.right,
            heightBar = 500 - marginsBar.top - marginsBar.bottom,
            animateDuration = 700,
            animateDelay = 75,
            barPadding = 1;

let colors = ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837", "#004529"];
// let colors2 = ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"];
let colors2 = ["#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"];
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
      .attr("viewBox", "0 0 800 500")
      // .attr("height", heightBar + marginsBar.top + marginsBar.bottom)
      // .attr("width", widthBar + marginsBar.left + marginsBar.right)

function zip(arrays) {
    return arrays[0].map(function(_,i){
        return arrays.map(function(array){return array[i]})
    });
}


function updateBarChart(country, season, position, data) {
  if (country === "All") {
    let transferAmount = [];
    let countries =[];
    data.forEach(function(transfer) {
      if (((season === "All") || (transfer.Season === season)) &&
          ((position === "All") || (transfer.Position === position))) {
        let index = countries.indexOf(transfer.League_to);
        if (index > -1) {
          transferAmount[index] += +transfer.Transfer_fee;
        }
        else {
          countries.push(transfer.League_to);
          transferAmount.push(+transfer.Transfer_fee);
        }
      }
    })
    let zeros = transferAmount.reduce(function(a, e, i) {
      if (e === 0)
          a.push(i);
      return a;
    }, []);
    zeros.forEach(function(zero, i) {
      countries.splice(zero - i, 1);
      transferAmount.splice(zero - i, 1);
    })
    drawBarChart(countries, transferAmount);
  }
  else {
    let transferAmount =[];
    let clubs = [];
    data.forEach(function(transfer) {
      if ((transfer.League_to === country) &&
          ((season === "All") || (transfer.Season === season)) &&
          ((position === "All") || (transfer.Position === position))) {
            let index = clubs.indexOf(transfer.Team_to);
            if (index > -1) {
              transferAmount[index] += +transfer.Transfer_fee;
            }
            else {
              clubs.push(transfer.Team_to);
              transferAmount.push(+transfer.Transfer_fee);
            }
          }
    })
    let zeros = transferAmount.reduce(function(a, e, i) {
      if (e === 0)
          a.push(i);
      return a;
    }, []);
    zeros.forEach(function(zero, i) {
      clubs.splice(zero - i, 1);
      transferAmount.splice(zero - i, 1);
    })
    drawBarChart(clubs, transferAmount);
  }
}


function arrayWithSteps (min, max, steps) {
  let step = (max - min) / steps;
  let temp = [];
  for (let i = min; i <= max; i += step) {
    temp.push((Math.floor(i)));
  }
  return temp;
}

function drawBarChart(categories, amounts) {

  // set format for data values (millions)
  let format = d3.format(",");

  let steps = arrayWithSteps(d3.min(amounts), d3.max(amounts), 7);
  let colorBar = d3.scaleQuantile()
    .domain(amounts)
    // .range(d3.schemeBlues[9]);
    .range(colors2);

  // let colorBar = d3.scaleOrdinal(d3.interpolateBuGn);
  //                   // d3.scaleOrdinal(  d3.schemeBuGn[5])
  //                   // .domain([0, d3.max(amounts)]);


  // set yScale barchart
  let yScale = d3.scaleLinear()
    .domain([0, categories.length])
    .range([marginsBar.top, heightBar + marginsBar.bottom]);


  // set yScale barchart
  let xScale = d3.scaleLinear()
    .domain([0, d3.max(amounts)])
    .range([marginsBar.left, widthBar]);

  // set tooltip for barchart
  let div = d3.select("#map").append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltipBars")
      .style("opacity", 0)
      // .html(function(d, country) {
      //   return "<strong>Country: </strong><span class='details'>" + d.League_to + "<br></span>" + "<strong>Government spending: </strong><span class='details'>" + format(total) + "%" + "</span>";
      // }

  let data = zip([amounts, categories]);
  // console.log(data);

  // let t = d3.transition()
  //   .duration(750);

  // draw graph
  let bars = svgBar.selectAll("rect")
    .data(data)

    bars.enter()
    .append("rect")
    .attr("class", "bar")
    .attr("id", "competitionsRects")
    // .attr("x", xScale(marginsBar.left))
    .attr("x", widthBar)
    .attr("y", function(d, i) {
      return yScale(i);
    })
    // .attr("fill", function(d) {
    //   console.log(color(d));
    //   return color(d);
    // })
    .attr("width", 0)
    .attr("height", heightBar / categories.length - barPadding)
    .on("mouseover", function(d) {
      // console.log(d[1]);
      // console.log(d[0]);
          div.transition()
          .style("opacity", 0.9)
          div.html(d[1] + ": " + format(d[0]))
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
    .delay(function(d, i) {
      return i * 25;
    })
    // .attr("x", xScale(marginsBar.left))
    .attr("x", xScale(marginsBar.left))
    .attr("y", function(d, i) {
      return yScale(i);
    })
    .attr("width", function(d) {
      return xScale(d[0]);
    })
    .attr("height", heightBar / categories.length - barPadding)
    .attr("fill", function(d) {
      // console.log(color(d));
      // console.log(d);
      return colorBar(d[0]);
    })
    // .on("mouseover", function(d) {
    //   div.transition()
    //   .style("opacity", 0.9)
    //   div.html(d[1] + ": " + format(d[0]))
    //   .style("left", (d3.event.pageX) + "px")
    //   .style("top", (d3.event.pageY - heightBar / 2) + "px")
    //   d3.select(this).style('opacity', 0.5)
    // })
    // .on("mouseout", function(d) {
    //     div.transition()
    //         .style("opacity", 0)
    //     d3.select(this).style('opacity', 1);
    // });

  bars.exit()
      .transition()
      .duration(750)
      .delay(function(d, i) {
        return i * 25;
      })
      .attr("width", 0)
      .attr("x", widthBar)
      .remove();

  // bars.on("mouseover", function(d) {
  //   // console.log(d[1]);
  //   // console.log(d[0]);
  //       div.transition()
  //       .style("opacity", 0.9)
  //       div.html(d[1] + ": " + format(d[0]))
  //       .style("left", (d3.event.pageX) + "px")
  //       .style("top", (d3.event.pageY - heightBar / 2) + "px")
  //       d3.select(this).style('opacity', 0.5)
  //     })
  //     .on("mouseout", function(d) {
  //         div.transition()
  //             .style("opacity", 0)
  //         d3.select(this).style('opacity', 1);
  //     });
}
