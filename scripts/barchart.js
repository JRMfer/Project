// const var for marginsBar svg Bar chart
const marginsBar = {top: 0, right: 100, bottom: 100, left: 100},
            widthBar = 800 - marginsBar.left - marginsBar.right,
            heightBar = 400 - marginsBar.top - marginsBar.bottom,
            animateDuration = 700,
            animateDelay = 75,
            barPadding = 1;

// Create SVG for datamap
let svgBar = d3.select("#barchart")
      .append("svg")
      .attr("class", "svgBar")
      .attr("id", "barChart")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 800 400")
      // .attr("height", heightBar + marginsBar.top + marginsBar.bottom)
      // .attr("width", widthBar + marginsBar.left + marginsBar.right)

function zip(arrays) {
    return arrays[0].map(function(_,i){
        return arrays.map(function(array){return array[i]})
    });
}

function updateBarChart(country, season, position, data) {
  console.log(data);
  if (country === "All" && (season === "All") && position === "All") {
    let transferAmount = [];
    let countries = [];
    data.forEach(function(transfer) {
      let index = countries.indexOf(transfer.League_to);
      if (index > -1) {
        transferAmount[index] += +transfer.Transfer_fee;
      }
      else {
        countries.push(transfer.League_to);
        transferAmount.push(+transfer.Transfer_fee);
      }
    })
    let zeros = transferAmount.reduce(function(a, e, i) {
      if (e === 0)
          a.push(i);
      return a;
    }, []);
    // console.log(zeros);
    zeros.forEach(function(zero, i) {
      countries.splice(zero - i, 1);
      transferAmount.splice(zero - i, 1);
    })
    // console.log(countries);
    // console.log(transferAmount);
    drawBarChart(countries, transferAmount);
  }
  else {
    let transferAmount = [];
    let clubs= [];
    data.forEach(function(transfer) {
    if ((transfer.League_to === country) &&
        ((transfer.Season === season) || (season === "All")) &&
        ((transfer.Position === position) || (position === "All"))) {
          // console.log(transfer);
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
    console.log(clubs);
    console.log(transferAmount);
    let zeros = transferAmount.reduce(function(a, e, i) {
      if (e === 0)
          a.push(i);
      return a;
    }, []);
    // console.log(zeros);
    zeros.forEach(function(zero, i) {
      clubs.splice(zero - i, 1);
      transferAmount.splice(zero - i, 1);
    })
    drawBarChart(clubs, transferAmount);
  }
}

function drawBarChart(categories, amounts) {

  // set format for data values (millions)
  let format = d3.format(",");

  // // set yScale barchart
  // let yScale = d3.scaleLinear()
  //   .domain([d3.min(amounts), d3.max(amounts)])
  //   .range([heightBar + marginsBar.top + marginsBar.bottom, marginsBar.bottom]);

  // set yScale barchart
  let yScale = d3.scaleLinear()
    .domain([0, categories.length])
    .range([marginsBar.top, heightBar + marginsBar.bottom]);

  // // set xScale graph
  // let xScale = d3.scaleLinear()
  //   .domain([0, categories.length])
  //   .range([marginsBar.left, widthBar + marginsBar.left]);

  // set yScale barchart
  let xScale = d3.scaleLinear()
    .domain([0, d3.max(amounts)])
    .range([marginsBar.left, widthBar]);

  // set tooltip for barchart
  let div = d3.select("#map").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      // .html(function(d, country) {
      //   return "<strong>Country: </strong><span class='details'>" + d.League_to + "<br></span>" + "<strong>Government spending: </strong><span class='details'>" + format(total) + "%" + "</span>";
      // }

  let data = zip([amounts, categories]);
  // console.log(data);

  // draw graph
  let myChart = svgBar.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("id", "competitionsRects")
    // .attr("x", function(d, i) {
    //   return xScale(i);
    // })
    .attr("x", xScale(marginsBar.left))
    // .attr("y", function(d) {
    //   return yScale(d);
    // })
    .attr("y", function(d, i) {
      return yScale(i);
    })
    .attr("fill", "black")
    // .attr("width", widthBar  / categories.length -
    //   barPadding)
    .attr("width", function(d) {
      // console.log(xScale(d));
      return xScale(d[0]);
    })
    // .attr("height", function(d) {
    //   return (heightBar + marginsBar.top + marginsBar.bottom) - yScale(d);
    // })
    .attr("height", heightBar / categories.length - barPadding)
    .on("mouseover", function(d) {
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
    });
}
