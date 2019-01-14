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
    drawBarChart(categories, transferAmount);
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
    drawBarChart(categories, transferAmount);
  }
}
