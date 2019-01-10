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

function drawBarChart(country, season, position, data) {
  console.log(data);
  if (country === "All" && season === "All" && position === "All") {
    let transferAmount = [];
    let countries = [];
    data.forEach(function(transfer) {
      let index = countries.indexOf(transfer.League_to);
      if (index > -1) {
        transferAmount[index] += transfer.Transfer_fee;
        console.log(transferAmount);
      }
      else {
        countries.push(transfer.League_to);
        transferAmount.push(0);
        console.log(countries);
      }

    })
  }

  // set yScale barChart
}
