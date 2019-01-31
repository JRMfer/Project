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

![](doc/screenshot_dashboard.png)

A D3 dashboard tries to show the development of the total transfer fees over
time which can be examined in more depth with some indicators as the
country, season and position. The dashboar

## Technical Design
This section describes the functionality of the product, starting with a high
level overview and continuing on to more in depth technicalities like functions
and modules.

### High Level Overview
#### Dashboard Components
The visualization consists of the following components:

* Every html template contains a fixed navbar at the top with 4 navegational
links and 3 interactive elements (dropdowns) and a footer at the bottom

* A homepage with image  an on top of the image a text block (html template #1)

* Four D3 visualizations:
All visualizations are included with an on click function, colors representing
the values and a tooltip and thus interactive
  - Datamap
  - Line chart (includes button to start animation of drawing line chart)
  - Horizontal bar chart
  - Sunburst
