# Project Minor Programming (UvA)
* Name: Julien Fer
* Student Number: 10649441
* University: University of Amsterdam


## Problem Statement
A hot topic in sport news is the development of the transfer values in
football. The last past years the values rised to high amounts and from clubs as
well associety complaints arises regarding this development. This project
tries toexplain this development based on the top 250 transfers from
2000-2018. Certainindicators will be examined as the competitions these
transfers took place, which club bought and the positions of the players.
Hopefully the statistics will show a pattern trough the years.

#### Solution
A D3 dashboard that tries to show the development of the total transfer fees over
time which can be examined in more depth with some indicators as the
country, season and position.

![](doc/screenshot_dashboard.png)

## Technical Design
This section describes the functionality of the product, starting with a high
level overview and continuing on to more in depth technicalities like functions
and modules.

### High Level Overview
#### Dashboard Components
The visualization consists of the following components:

* Every html template contains a fixed navbar at the top with 4 navegational
links (all with glyphicons) and 3 interactive elements (dropdowns), a
footer at the bottom and a title with favicon symbol of a football.

* A homepage with image and on top of the image a text block (html template #1)

* Four D3 visualizations (html template #2):
All (interactive) visualizations are included with an on click function, colors
representing the values (except line chart) and a tooltip.
  - Datamap
  - Line chart (includes button to start animation of drawing line chart)
  - Horizontal bar chart
  - Sunburst

### Detailed Overview
#### Data
The data folder contains 3 different files:

* [Orignal Dataset](data/top250-00-19.csv)
  - this one is preproccesed in python
* [Preproccesed Dataset](data/transfers250.csv)
  - The competition names are replaced by their corresponding country names
  - Removed whitespace
The data will be imported by the d3.csv function (see [football.js](scripts/football.js))
and this returns an array with transfers. The transfers are repsented as an
object with all containing the necassary information.

* [Data Topojson](data/world_countries.json)
  - Contains all the paths to draw a datamap of the world.

#### HTML, Bootstrap and FontAwesome
The repository knows 2 HTML templates located in the root of the repository. The
pages, homepage ([index.html](index.html)) and the visualizations
([football.html](football.html)). All pages have the same title with favicon shown
in the website-tab of the browser and the elements of the page are placed in a
Bootstrap grid system.

The two templates are linked with each other through the Bootstrap navigation
bar. More on the left of the navigation bar there is an element to show a modal
(works only for the visualization page) and a link to the Github repository.
On the right there are 3 dropdown menus (only for football.html). In the HTML
template these are regular <select> elements and are styled in the CSS file
([football.css](/stylesheets/football.css)). Also the line chart contains a
button element from Bootstrap but styled with CSS. At the bottom of the pages
there is a Bootstrap jumbotron containing some information which is also styled
with the CSS files in the repository.

#### Javascipts
Every visualization has its own Javscript file and are combined in
[football.js](scripts/football.js). In all scripts the svg is declared global
and in most of them elements as the axis, legend and scale are also declared
global.

* [datamap.js](scripts/datamap.js)
  - This script receives the loaded Topojson and transfers data from football.js
    and initiates a datamap with color.

  - Function to find the relevant dataset for the datamap (findValuesMap)
    - loop over array of transfers, returns object with an array for all the
      total transfer fee values for the color scale (quantile) and one for the
      transfers satisfying the condtions given by user (dropdown or onclick events).

  - Function for on click events
    - updates line chart, bar chart and sunburst. Also sets dropdown to new country

  - Function for tooltip text
    - Shows the total transfer fee and amount if country in the relevant dataset,
      other undefined values

  - Function to add legend
    - Follows the colorscheme and only shows the border values of the quantiles
      (formatted)

  - Function to draw datamap
    - Combines above function to draw datamap with transition on the fill of the

* [linechart.js](scripts/linechart.js)
  - 
