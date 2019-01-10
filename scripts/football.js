// This script contains the necessary functionality to create a dashboard

// const var for data source
// let data = "https://raw.githubusercontent.com/JRMfer/Project/master/data/top250-00-19.csv"
// let worldCountries = "https://bl.ocks.org/micahstubbs/raw/8e15870eb432a21f0bc4d3d527b2d14f/a45e8709648cafbbf01c78c76dfa53e31087e713/world_countries.json"

window.onload = function() {
  d3.csv(data)
    .then(function(data) {
        // data is now whole data set
        // draw chart in here!
        data.forEach(function(d) {
          d.Transfer_fee = +d.Transfer_fee;
        });
        console.log(data);
        console.log(data[0]);
    })
    .catch(function(error){
       // handle error

    });
}
