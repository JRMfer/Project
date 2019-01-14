function updateBarChart(country, season, position, data) {
  console.log(data);
  let transferAmount = [];
  let countries = [];
  data.forEach(function(transfer) {
  if ((transfer.League_to === country) || (country = "All") &&
        (transfer.Season === season) || (season = "All") &&
        (transfer.Position === season) || (position = "All")) {}
  }
}
