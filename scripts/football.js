// This script contains the necessary functionality to create a dashboard

// const var for data source
let data = "https://raw.githubusercontent.com/JRMfer/Project/master/data/top250-00-19.csv"

// const var for seasons
const seasons = []

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
