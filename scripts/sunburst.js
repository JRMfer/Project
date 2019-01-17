let widthSun = 500;  // <-- 1
let heightSun = 500;
let radiusSun = Math.min(widthSun, heightSun) / 2;  // < -- 2
// //Continuous sequential scale
// let colorSun = d3.scaleSequential(d3.interpolateBuGn)
//                 .domain([0, 100]);
// let colors2 = ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"];


let colorSun = d3.scaleThreshold()
                .domain([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
                .range(colors2);



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


function preproccesSunburst(country, season, position, data) {
  // console.log(data);
  let newData = {"name": "Football Transfers top 250", "children": []};
  let rootObj = {"name": "World", "children": []};
  newData.children.push(rootObj);

  data.forEach(function(transfer) {
    if (((transfer.League_to === country) || (country = "All")) &&
        ((transfer.Season === season) || (season === "All")) &&
        ((transfer.Position === position) || (position === "All")) &&
        (+transfer.Transfer_fee > 0)) {
          newData.children.forEach(function(world) {
            let counterCompetition = 0;
            world.children.forEach(function(competition) {
              if (competition.name === transfer.League_to) {
                counterCompetition += 1;
                let counterClub = 0;
                competition.children.forEach(function(club) {
                  if ((club.name === transfer.Team_to)) {
                    counterClub += 1;
                    club.size += +transfer.Transfer_fee;
                  }
                })
                if ((counterClub === 0)) {
                  let tempObj = {}
                  tempObj["name"] = transfer.Team_to;
                  tempObj["size"] = +transfer.Transfer_fee;
                  competition.children.push(tempObj);
                }
              }
            })
            if ((counterCompetition === 0) && (+transfer.Transfer_fee > 0)) {
                let tempObj = {};
                let tempObj2 = {};
                tempObj["name"] = transfer.League_to;
                tempObj["children"] = [];
                tempObj2["name"] = transfer.Team_to;
                tempObj2["size"] = +transfer.Transfer_fee;
                tempObj["children"].push(tempObj2);
                world.children.push(tempObj);
            }
          })
        }
  })
  console.log(newData);
  return newData;
}

function arcTweenPath(a, i) {

    console.log(a.x1s);
    var oi = d3.interpolate({ x0: a.x0s, x1: a.x1s }, a);


    function tween(t) {
        var b = oi(t);
        a.x0s = b.x0;
        a.x1s = b.x1;
        return arc(b);
    }

    return tween;
}

function updateSun(country, season, position, data) {
  let dataSun = preproccesSunburst(country, season, position, data);
  let root = d3.hierarchy(dataSun)  // <-- 1
    .sum(function (d) { return d.size})
    .sort(function(a, b) { return b.vakue - a.vlue; });  // <-- 2

  // console.log(root);

  partition(root);  // <-- 1


  let nodes = d3.selectAll(".node");
  nodes.selectAll("path").transition().duration(750).attrTween("d", arcTweenPath);
}

function drawSunburst(country, season, position, data) {
  // set format for data values (millions)
  let format = d3.format(",");

  let newData = preproccesSunburst(country, season, position, data);

  let root = d3.hierarchy(newData)  // <-- 1
    .sum(function (d) { return d.size})
    .sort(function(a, b) { return b.vakue - a.vlue; });  // <-- 2

  // console.log(root);

  partition(root);  // <-- 1
  let arc = d3.arc()  // <-- 2
      .startAngle(function (d) { d.x0s = d.x0; return d.x0 })
      .endAngle(function (d) { d.x1s = d.x1; return d.x1 })
      .innerRadius(function (d) { return d.y0 })
      .outerRadius(function (d) { return d.y1 });

  // let node = svgSun.selectAll('g')  // <-- 1
  //   .data(root.descendants())  // <-- 2

  let node = svgSun.selectAll('g.node').data(root.descendants(), function(d) { return d.data.name; });
  let newNode = node.enter().append('g').attr("class", "node").merge(node);
  node.exit()
  .transition()
  .duration(750)
  .delay(function(d, i) {
    return i * 5;
  })
  .remove();
  node.selectAll("path").remove();


  node.enter().append('g').attr("class", "node")
    // .merge(node)
    // .transition()
    // .duration(750)// <-- 3

    newNode.append('path')  // <-- 4
    .attr("display", function (d) { return d.depth ? null : "none"; })  // <-- 5
    .attr("d", arc)  // <-- 6
    .style('stroke', '#fff')  // <-- 7
    // .style("fill", function (d) { console.log((d.children ? d : d.parent).data); return colorSun((d.children ? d : d.parent).data.name); })  // <-- 8
    .style("fill", function(d) {
      if ((d.children ? d : d.parent).data.name === "Football Transfers top 250") {
        return;
      }
			else if ((d.children ? d : d.parent).data.name === "World") {
        var parentValue = d.parent.value;
				var childValue = d.value;
				var childPercentage = Math.round((childValue / parentValue) * 100);
				return colorSun(childPercentage);
			}
      else {
				var parentValue = d.parent.value;
				var childValue = d.value;
				var childPercentage = Math.round((childValue / parentValue) * 100);
				return colorSun(childPercentage);
			}
			})
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
              if (club.size) {
                amount += club.size;
              }
              else {
                club.children.forEach(function(competition) {
                  amount += competition.size;
                })
              }
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

  // d3.select("#seasonsdropdown").on("change", function(d, i) {
  //   let data = newData
  // })
}
