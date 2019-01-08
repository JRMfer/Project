# Project Minor Programming (UvA)
Name: Julien Fer (10649441)

This document contains the necessary information about the dataset used, an
overview of the technical compenents, as well as descriptions of each of the
components and what you need to implement these.

## Data sources
The csv file of the dataset can be found in the data folder inside the doc
folder. The following link will guide you to the official site of the dataset:

https://www.kaggle.com/vardan95ghazaryan/top-250-football-transfers-from-2000-to-2018/version/1

The first step is to convert the csv file to a JSON file, preferably indexed by
the season in which the player has been transferred. Inside a season the data
needs to be indexed on the different countries and within this the data needs to
be ordered by position of the player. This will be done with help of the pandas
library in python. As this is done it will be much easier to retrieve the
correct data depending on the season and subject needed.

## Diagram
Data (CSV) -> preprocces with python (pandas) -> JSON

"2000-2001": {
  "competition1": {
    "club1": [transfer expenditures],
    "club2": [transfer expenditures]
  }
  "competition2": {
    "club1": [transfer expenditures],
    "club2": [transfer expenditures]
  }
}

Topojson -> d3.geoMercator, d3.geoPath -> worldmap

#### Worldmap
Worldmap also needs the total expenditure of the specific country as well as the
amount of transfer that took place in that country. So the data of the correct
season needs te be selected, then the correct competition need to be selected.
As a JSON file is an object in javascript one can easily use the standard Object
function to retrieve the necessary data. Also a tooltip is necessary. One could
use a d3-tip.js.

#### Barchart
At first it shows the total expenditure of every country within that season.
When a country is selected (clicked on the worldmap) the total expenditure of
every club within that competition of the specific season will be shown. Drawing
the barchart should almost every time be the "same technique" using D3
(creating axis, rects etc..), however the correct data must be selected again
with ordinary Object functions. One could also consider to add transition with
every update.

#### Pie chart
Same story as the barchart, but different shapes.

#### Line chart
This line chart always contains info of all the seasons, but when a position or
country is selected the correspoding information needs to be shown. This can
again be done with Object functions. The line should appear animated, so it shows
the development of the transfer expenditures over time of a specific country/position.
In order to achieve this just ordinary D3 and Object functions are needed.

#### Dropdowns
Two dropdown menus will be created using HTML. One containing the different
seasons and the other containing the different positions. When the user selects
one of the option a d3.click("on") will be triggered and update all linked views.
