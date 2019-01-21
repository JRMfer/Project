// const var for data source
let data = "https://raw.githubusercontent.com/JRMfer/Project/master/data/transfers250.csv"
let worldCountries = "https://raw.githubusercontent.com/JRMfer/Project/master/data/world_countries.json"
let info = {"Seasons": [], "data": [], "Countries": [], "Positions": [], "rootSun": 0};

// read in world_countries.topojson and data
let requests = [d3.json(worldCountries), d3.csv(data)];

function preproccesSunburst(data) {
  // console.log(data);
  let newData = {"name": "Football Transfers top 250", "children": []};
  let rootObj = {"name": "World", "children": []};
  newData.children.push(rootObj);

  data.forEach( function(transfer) {
    if (+transfer.Transfer_fee > 0) {
      newData.children.forEach(function(world) {
        let counterCompetition = 0;
        world.children.forEach( function(competition) {
          if (competition.name === transfer.League_to) {
            counterCompetition += 1;
            let counterClub = 0;
            // let counterSeason = 0;
            // let counterPosition = 0;
            competition.children.forEach( function(club) {
              if (club.name === transfer.Team_to) {
                counterClub += 1;
                club.size += +transfer.Transfer_fee;
                club[transfer.Season] += +transfer.Transfer_fee;
                club[transfer.Position] += +transfer.Transfer_fee;
              }
            })
            if ((counterClub === 0)) {
              let tempObj = {}
              tempObj["name"] = transfer.Team_to;
              tempObj["size"] = +transfer.Transfer_fee;
              tempObj[transfer.Season] = +transfer.Transfer_fee;
              tempObj[transfer.Position] = +transfer.Transfer_fee;
              competition.children.push(tempObj);
            }
          }
        })
        if (counterCompetition === 0) {
          let tempObj = {};
          let tempObj2 = {};
          // console.log(+transfer.Transfer_fee);
          tempObj["name"] = transfer.League_to;
          tempObj["children"] = [];
          tempObj2["name"] = transfer.Team_to;
          tempObj2["size"] = +transfer.Transfer_fee;
          info.Seasons.forEach( function(season) {
            tempObj2[season] = 0;
          })
          info.Positions.forEach( function(position) {
            tempObj2[position] = 0;
          })
          tempObj2[transfer.Season] = +transfer.Transfer_fee;
          tempObj2[transfer.Position] = +transfer.Transfer_fee;
          tempObj["children"].push(tempObj2);
          world.children.push(tempObj);
          // console.log(tempObj2);
        }
      })
    }
  })
  console.log(newData);
  return newData;
}


window.onload = function() {
  Promise.all(requests).then(function(response) {
    //gather data
    let topology = response[0];
    info["data"] = response[1];

    info.data.forEach(function(transfer) {
      let index = info.Seasons.indexOf(transfer.Season);
      let index2 = info.Countries.indexOf(transfer.League_to);
      let index3 = info.Positions.indexOf(transfer.Position);
      if (index < 0) {
        // seasons.push(transfer.Season);
        info.Seasons.push(transfer.Season);
      }
      if (index2 < 0) {
        info.Countries.push(transfer.League_to);
      }
      if (index3 < 0) {
        info.Positions.push(transfer.Position);
      }
    });

    let newData = preproccesSunburst(info.data)
    console.log(info);


  }).catch(function(e) {
    throw (e);
  });
}
