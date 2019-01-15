let widthSun = 500;  // <-- 1
let heightSun = 500;
let radiusSun = Math.min(widthSun, heightSun) / 2;  // < -- 2
let colorSun = d3.scaleOrdinal(d3.schemeCategory20b);   // <-- 3

// var g = d3.select('svg')  // <-- 1
//     .attr('width', width)  // <-- 2
//     .attr('height', height)
//     .append('g')  // <-- 3
//     .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');  //

let svgSun = d3.select("#sunburst")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "-300 -300 750 750")
    // .attr("height", heightMap + marginsMap.top + marginsMap.bottom)
    // .attr("width", widthMap + marginsMap.left + marginsMap.right)
    .append("g")
    .attr("class", "svgSun")
    .attr("id", "dataSun")

let div = d3.select("#sunburst").append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltipSun")
    .style("opacity", 0)

let partition = d3.partition()  // <-- 1
    .size([2 * Math.PI, radiusSun]);  // <-- 2


function preproccesSunburst(data) {
  console.log(data);
  let newData = {};
  newData["name"] = "World";
  newData["children"] = [];
  data.forEach(function(transfer) {
    let counterCompetition = 0;
    newData.children.forEach(function(competition) {
      let counterClub = 0;
      if (competition.name === transfer.League_to) {
        counterCompetition += 1;
        competition.children.forEach(function(club) {
          if (club.name === transfer.Team_to) {
            counterClub += 1;
            club.size += +transfer.Transfer_fee;
          }
        })
        if (counterClub === 0) {
          let tempObj = {};
          tempObj["name"] = transfer.Team_to;
          tempObj["size"] = +transfer.Transfer_fee;
          competition.children.push(tempObj);
        }
      }
    })
    if (counterCompetition === 0) {
      let tempObj = {};
      tempObj["name"] = transfer.League_to;
      tempObj["children"] = [];
      newData.children.push(tempObj);
    }
  })
  console.log(newData);
  return newData;
}

function drawSunburst(data) {
  // set format for data values (millions)
  let format = d3.format(",");

  let newData = preproccesSunburst(data);

  let root = d3.hierarchy(newData)  // <-- 1
    .sum(function (d) { return d.size});  // <-- 2

  partition(root);  // <-- 1
  let arc = d3.arc()  // <-- 2
      .startAngle(function (d) { return d.x0 })
      .endAngle(function (d) { return d.x1 })
      .innerRadius(function (d) { return d.y0 })
      .outerRadius(function (d) { return d.y1 });

  svgSun.selectAll('path')  // <-- 1
    .data(root.descendants())  // <-- 2
    .enter()  // <-- 3
    .append('path')  // <-- 4
    .attr("display", function (d) { return d.depth ? null : "none"; })  // <-- 5
    .attr("d", arc)  // <-- 6
    .style('stroke', '#fff')  // <-- 7
    .style("fill", function (d) { console.log(d); return colorSun((d.children ? d : d.parent).data.name); })  // <-- 8
    .on("mouseover", function(d) {
      if (d.data.size) {
            div.transition()
            .style("opacity", 0.9)
            div.html(d.data.name + ": " + format(d.data.size))
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - heightSun) + "px")
            d3.select(this).style('opacity', 0.5)
          }
          else {
            let amount = 0;
            d.data.children.forEach(function(club) {
              amount += club.size;
            })
            div.transition()
            .style("opacity", 0.9)
            div.html(d.data.name + ": " + format(amount))
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - heightSun) + "px")
            d3.select(this).style('opacity', 0.5)
          }
        })
        .on("mouseout", function(d) {
            div.transition()
                .style("opacity", 0)
            d3.select(this).style('opacity', 1);
        });
}
