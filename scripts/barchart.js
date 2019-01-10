// const var for marginsBar svg Bar chart
const marginsBar = {top: 100, right: 100, bottom: 100, left: 100},
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

function updateBarChart(country, season, position, data) {
  console.log(data);
  if (country === "All" && season === "All" && position === "All") {
    let transferAmount = [];
    let countries = [];
    data.forEach(function(transfer) {
      let index = countries.indexOf(transfer.League_to);
      if (index > -1) {
        transferAmount[index] += +transfer.Transfer_fee;
      }
      else {
        countries.push(transfer.League_to);
        transferAmount.push(0);
      }
    })
    let zeros = transferAmount.reduce(function(a, e, i) {
      if (e === 0)
          a.push(i);
      return a;
    }, []);
    console.log(zeros);
    zeros.forEach(function(zero, i) {
      countries.splice(zero - i, 1);
      transferAmount.splice(zero - i, 1);
    })
    console.log(countries);
    console.log(transferAmount);
    drawBarChart(countries, transferAmount);
  }
  else {

  }
  // set yScale barChart
}

function drawBarChart(categories, amounts) {

  // set yScale barchart
  let yScale = d3.scaleLinear()
    .domain([d3.min(amounts), d3.max(amounts)])
    .range([heightBar + marginsBar.top + marginsBar.bottom, marginsBar.bottom]);

  // set xScale graph
  let xScale = d3.scaleLinear()
    .domain([0, categories.length])
    .range([marginsBar.left, widthBar + marginsBar.left]);

  // set tooltip for barchart
  let div = d3.select("#map").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // draw graph
    var myChart = svgBar.selectAll("rect")
      .data(amounts)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("id", "competitionsRects")
      .attr("x", function(d, i) {
        return xScale(i);
      })
      .attr("y", function(d) {
        return yScale(d);
      })
      .attr("fill", "black")
      .attr("width", widthBar  / categories.length -
        barPadding)
      .attr("height", function(d) {
        return (heightBar + marginsBar.top + marginsBar.bottom) - yScale(d);
      })
}
