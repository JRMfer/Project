/*
Name: Julien Fer
University: University of Amsterdam
Studentnumber: 10649441

This script contains the functionality to draw a Sunburst of depth 3. The root
represents the world's total transfer fee value for the given dataset. From there
every slice is represented as its weight relative to its parent. This is also
represented in the color of te slice.

Had a lot of help thanks to the sunburst tutorial of David Richards:
https://bl.ocks.org/denjn5/e1cdbbe586ac31747b4a304f8f86efa5

Many thanks!
*/

// width, height and radius
const widthSun = 900; // <-- 1
const heightSun = 600;
const radiusSun = Math.min(widthSun, heightSun) / 2 - 10; // < -- 2

// creat svg for sunburst
const svgSun = d3.select("#sunburst")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "-465 -350 960 725")
  .append("g");

// append tooltip to svg
const divSun = d3.select("#sunburst").append("divSun")
  .attr("class", "tooltip")
  .attr("id", "tooltipSun")
  .style("opacity", 0);

// color scheme and scale
const colorsSun = ["#f1f9ff", "#d2ebfe", "#c3e5fe", "#abdcfe", "#8fd2fd", "#77cbfd", "#63c5fc", "#49c0fc"];
const colorSun = d3.scaleThreshold()
  .domain([2.5, 5, 7.5, 10, 15, 20, 30, 40, 60])
  .range(colorsSun);

// set up partition variable
let partition = d3.partition();

// set x scale
const x = d3.scaleLinear()
  .range([0, 2 * Math.PI]);

// set y scale
const y = d3.scaleSqrt()
  .range([0, radiusSun]);

// arc var
let arc = d3.arc();


function drawSunburst(newData) {
  /*
    Function to draw a sunburst which
    can be updated with a new dataset
  */

  // create root based on dataset and sort this  root
  let root = d3.hierarchy(newData) // <-- 1
    .sum(function(d) {
      return d.size
    })
    .sort(function(a, b) {
      return b.value - a.value;
    });

  // keep track of root
  info.rootSun = root;

  // partiition data
  partition(root);

  // set up arc attributes
  arc.startAngle(function(d) {
      return Math.max(0, Math.min(2 * Math.PI, x(d.x0)));
    })
    .endAngle(function(d) {
      return Math.max(0, Math.min(2 * Math.PI, x(d.x1)));
    })
    .innerRadius(function(d) {
      return Math.max(0, y(d.y0));
    })
    .outerRadius(function(d) {
      return Math.max(0, y(d.y1));
    });

  // bind data to slice
  let slice = svgSun.selectAll('g.slice').data(root.descendants(), function(d) {
    return d.data.name;
  });

  // merge slices
  let newSlice = slice.enter().append('g').attr("class", "slice").merge(slice);

  // remove old slices
  slice.exit().transition()
    .duration(750)
    .delay(function(d, i) {
      return i * 5;
    })
    .remove();

  // remove paths slices
  slice.selectAll("path").remove();

  // append paths for slices
  newSlice.append('path')

    // set attributes
    .attr("display", function(d) {
      return d.depth ? null : "none";
    })
    .attr("d", arc)

    // set stroke and fill slices
    .style('stroke', '#000')
    .style("fill", function(d) {
      if ((d.children ? d : d.parent).data.name === "Football Transfers top 250") {
        return;
      } else if ((d.children ? d : d.parent).data.name === "World") {
        let parentValue = d.parent.value;
        let childValue = d.value;
        let childPercentage = Math.round((childValue / parentValue) * 100);
        return colorSun(childPercentage);
      } else {
        let parentValue = d.parent.value;
        let childValue = d.value;
        let childPercentage = Math.round((childValue / parentValue) * 100);
        return colorSun(childPercentage);
      }
    });

  // add mouseover effects tooltip
  newSlice.on("mouseover", function(d) {
    if ((d.children ? d : d.parent).data.name === "Football Transfers top 250") {
      return;
    } else if ((d.children ? d : d.parent).data.name === "World") {
      let parentValue = d.parent.value;
      let childValue = d.value;
      let childPercentage = Math.round((childValue / parentValue) * 100);
      divSun.transition()
        .style("opacity", 0.9)
      divSun.html("<strong>" + d.data.name + ": " + "</strong><span class='details'>" +
          "<br>" + '€' + format(childValue) + "</span><br><br><strong>" +
          "Percentage: " + "</strong><span class='details'>" +
          "<br>" + childPercentage + "%" + "</span>")
        // d.data.name + ": " + format(childValue) + ' (' + childPercentage + "%)")
        .style("left", (d3.event.pageX - widthSun + widthSun / 10) + "px")
        .style("top", (d3.event.pageY - heightSun / .85) + "px")
      d3.select(this).style('opacity', 0.75)
    } else {
      let parentValue = d.parent.value;
      let childValue = d.value;
      let childPercentage = Math.round((childValue / parentValue) * 100);
      divSun.transition()
        .style("opacity", 0.9)
      divSun.html("<strong>" + d.data.name + ": " + "</strong><span class='details'>" +
          "<br>" + '€' + format(childValue) + "</span><br><br><strong>" +
          "Percentage: " + "</strong><span class='details'>" +
          "<br>" + childPercentage + "% of " + d.parent.data.name + "</span>")
        // d.data.name + ": " + format(childValue) + ' (' + childPercentage + "% of " + d.parent.data.name + ')')
        .style("left", (d3.event.pageX - widthSun + widthSun / 10) + "px")
        .style("top", (d3.event.pageY - heightSun / .85) + "px")
      d3.select(this).style('opacity', 0.75)
    }
  });

  // set mouseout effects
  newSlice.on("mouseout", function(d) {
    divSun.transition()
      .style("opacity", 0)
    d3.select(this).style('opacity', 1);
  });

  // add on click function
  newSlice.on("click", clickSun);
}


function preproccesSunburst(country, season, position, data) {
  /*
    Preprocces function sunburst that receives the dataset as an array for every
    transfer (object) and the conditions for this dataset and turns this into an
    hierarchical data structure for the sunburst.
  */

  // create root obj and and one representing world value and combine
  let newData = {
    "name": "Football Transfers top 250",
    "children": []
  };
  let rootObj = {
    "name": "World",
    "children": []
  };
  newData.children.push(rootObj);

  // loop for every transfer
  data.forEach(function(transfer) {

    // checks if transfer satisfies conditions
    if (((transfer.League_to === country) || (country = "All")) &&
      ((transfer.Season === season) || (season === "All")) &&
      ((transfer.Position === position) || (position === "All")) &&
      (+transfer.Transfer_fee > 0)) {

      // loop over  world, with counter for country
      newData.children.forEach(function(world) {
        let counterCompetition = 0;

        // loop for every country (competition) in world
        world.children.forEach(function(competition) {

          // if country in world start counter club
          if (competition.name === transfer.League_to) {
            counterCompetition += 1;
            let counterClub = 0;

            // start loop for every club in country
            competition.children.forEach(function(club) {

              // if club already in country adjust values
              if ((club.name === transfer.Team_to)) {
                counterClub += 1;
                club.size += +transfer.Transfer_fee;
              }
            });

            // if club nut found, create new object for club and add to data
            if ((counterClub === 0)) {
              let tempObj = {}
              tempObj["name"] = transfer.Team_to;
              tempObj["size"] = +transfer.Transfer_fee;
              competition.children.push(tempObj);
            }
          }
        });

        // if country not in data create object for country
        if ((counterCompetition === 0)) {
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
  });

  // return preproccesed data
  return newData;
}

function clickSun(d) {
  /*
    Function to update bar chart and
    add transition to update sunburst
  */

  // keep track of root
  info.rootSun = d;

  // check for depth, then update bar chart
  if (d.data.name === "World") {

    d3.select("#countriesdropdown").property("value", "All");
    let season = d3.select("#seasonsdropdown").property("value");
    let position = d3.select("#positionsdropdown").property("value");
    updateBarChart("All", season, position, info.data);

  } else if (d.depth === 2) {

    d3.select("#countriesdropdown").property("value", d.data.name);
    let season = d3.select("#seasonsdropdown").property("value");
    let position = d3.select("#positionsdropdown").property("value");
    updateBarChart(d.data.name, season, position, info.data);

  }

  // transition sunburst
  // https://bl.ocks.org/maybelinot/5552606564ef37b5de7e47ed2b7dc099
  svgSun.transition()
    .duration(1000)
    .tween("scale", function() {
      var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
        yd = d3.interpolate(y.domain(), [d.y0, 1]),
        yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radiusSun]);
      return function(t) {
        x.domain(xd(t));
        y.domain(yd(t)).range(yr(t));
      };
    })
    .selectAll("path")
    .attrTween("d", function(d) {
      return function() {
        return arc(d);
      }
    });
}

function zoomSunburst(countryName) {
  /*
    Function that updates the sunburst at input of country name.
    It checks for the given depth of the root if country name is equal to All.
    If not then we move on to the children array containing the countries and
    check for country name. When found keep track of root, set dropdown value
    to country name and return cliclSun with new root
  */

  let root = info.rootSun;

  if (root.depth === 0) {
    if (countryName === "All") {
      return clickSun(root.children[0]);
    }
    root.children.forEach(function(world) {
      world.children.forEach(function(competition) {
        if (competition.data.name === countryName) {
          info.rootSun = competition;
          d3.select("#countriesdropdown").property("value", countryName);
          return clickSun(competition);
        }
      });
    });
  } else if (root.depth === 1) {
    if (countryName === "All") {
      return clickSun(root);
    }
    root.children.forEach(function(competition) {
      if (competition.data.name === countryName) {
        info.rootSun = competition;
        d3.select("#countriesdropdown").property("value", countryName);
        return clickSun(competition);
      }
    });
  } else if (root.depth === 2) {
    if (countryName === "All") {
      return clickSun(root.parent);
    }
    let rootWorld = root.parent;
    rootWorld.children.forEach(function(competition) {
      if (competition.data.name === countryName) {
        info.rootSun = competition;
        d3.select("#countriesdropdown").property("value", countryName);
        return clickSun(competition);
      }
      competition.children.forEach(function(club) {
        if (club.data.name === countryName) {
          info.rootSun === club;
          return clickSun(club);
        }
      });
    });
  } else {
    if (countryName === "All") {
      return clickSun(root.parent.parent);
    }
    let rootWorld = root.parent.parent;
    rootWorld.children.forEach(function(competition) {
      if (competition.data.name === countryName) {
        info.rootSun = competition;
        d3.select("#countriesdropdown").property("value", countryName);
        return clickSun(competition);
      }
      competition.children.forEach(function(club) {
        if (club.data.name === countryName) {
          info.rootSun === club;
          return clickSun(club);
        }
      });
    });
  }
}
