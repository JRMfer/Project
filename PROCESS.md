# Day 1

Send in proposal for project. The main features and information needed to be
clarified in this proposal. A choice has been made to make a dashboard with a
datamap, barchart, piechart and a line chart. Furthermore there will be two
dropdown menus with which the user can change the dataset by season and/or the
position of the player transfered.

It was quite easy to choose which charts I wanted to display. The real problem
arised when one considers which dataset is needed for the correct display of all
the visualizations


# Day 2

Send in design proposal for project. The different technical elements are explained
in DESIGN.md such as the linked views with the datamap and the visualizations
(charts). A choice has been made to create the datamap and the charts in different
JavaScript files and "connect" them in the main file football.js. Also navbar will
be included to change to two other templates and in which the two dropdown menus
will be located.

A problem arised with the datamap. As the dataset of the football transfers consists
information about the two competitions ,instead of the countries, it took place
it was difficult to link the countries in the datamap to these transfer. So further
preproccesing of the dataset was necessary.


# Day 3

So the question became how to preprocces the dataset. After a long search I encounterd
the pandas dataframe loc function, but one should hardcode a lot of conditional
statements in order to achieve a correct way of adjusting the datatset. Another
option could be to copy the csv column with competitions into another csv file with
the column next to it the correct country. With this method one can easily merge
the two csv into one with pandas. This would work if not that the excel file, when
opened, has problems reading lettres with signs.

# Day 4

I've decided to preprocces the dataset with the dataframe loc function and it
worked well.

The next step is to already construct the datamap. At first I constructed
the datamap the old-fashioned way, but I encoutered a problem. The svg containing
the datamap was larger then the space available in the bootstrap grid element.
This was easily solved with changing the width and height of the svg to two elements
that keep the size of the div element it is placed in.

The second step was to consruct the core of the different charts. The greatest
difficulty lies in the correct selection of the data. So the decision was made to
first make an update function for every charts. The main purpose of the update
function is to select the data according the country, season and position selected.
This will be done by a simple for loop with the correct conditional statements.

# Day 5

While creating the update function for the barchart I encountered some difficulties:

1. After retrieving the correct selection of the dataset I found that some values
   were 0 because they contained a blank value in the csv file. The biggesst difficulty here
   was that I needed to get rid of the zeros while containing the same order of
   the values as these are the same as the array with the correspoding country/clubs.

2. Also an alert or message should be shown if no information is available.

# Day 6

After constructing the update function it was time to add an HTML element which
can trigger the update function to work. I've chosen for a dropdown menu in the
navbar.

Although it seems easy to add the correct list items to the dropdown menu of the
navbar it was not possible to retrieve the selected value by the user trough d3.
After searching on the internet I encountered that it is not possible to select
ul elements.

So the dropdown was removed and another type of dropdown, with a select tag
was added with help of d3 and the options were added as option tags. Now it is
possible to retrieve the selecte value from the dropdown menu.

Furthermore a sequential color scheme by colorbrewer was chosen to set the style
for the barchart and probably the other visualizations as well.

# Day 7

Dropdown menus were added to the navbar. All the options are passed with the function
addOptions.

This succeeded for one dropdownn for the seasons. However if two more dropdowns
are added to the navbar all the possible options appear as a blank value, but can
in turn be selected by clicking on them and this causes the barchart update correctly.
Reason why still not found.

Also a start for creating an update functionn of the datamap was made. This is
still under progress.

# Day 8

Sunburst was added.

Datamap can update, but it still has problems with setting the appropriate color
for the country (perhaps scaling not good).
Also encountered some crashes while switching with the dropdown menus. Could also be
because of the low speed of the internet?

# Day 9

Found a good scale for dataMap: its an quantile scale based on the whole dataset.
Fixed some crashes, such as loading errors whenever the "new" dataset did not contain
any data to create the charts.

Also a different way for creating the sunburst was implemented. With this new method
it was now possible to have linked views with the datamap and barchart and an update
with the dropdown was fixed. The sunburst is also zoomable.

Datamap also has an onclick function and updates the barchart with it. Sunburst
still needs to be done.

Also onclcik for barchart needs to be done.

Considering to skip the line graph as this may become too much work.

# Day 10:

Fixed the crashes when an empty dataset was given.
Also completed the linked views with the datamap, barchart and sunburst. All 3
have an onclick function and can be changed by the 3 dropdown menus.
Furthermore both the barchart and sunburst are sorted at the load of the page and
after every transition.

To achieve this I changed the updateBarChart function such that this returns an object
with as entries a list with all the transfer fees and another list filled with objects
representing the values per category.

# Day 11:

Completed the line chart, with button to start the animtion of the chart.
Dataset of the chart is linked to the selected country and/or position in the
dropdown menus.

# Day 12:

Styled the dashboard a bit more:

Added space around the charts with different background-color.
Added borders around the chartsn in the same color as the space around it.
Changed colors charts. Sequential base color is now a shade of blue.

Changed stroke color sunburst.

To do next time:

Complete tooltips Linechart to show the top 3 transfers in that season for the
required dataset.

Also need to smoothen the update for the sunburst when season and/or position of
the dataset are changed. This could be done by extending the options at the
end of the hierachy (not only size, but also keys for the season/position asked).

# Day 13:

Solved the update of the sunburst by calling the tween function after redrawing
the sunburst (already with a merge update).

Completed tooltip line chart, also correct after update. it now shows the total
transfer fees in that season together with the corresponding top 3 transfers.

Added a legend to the data map based on the sequential color scheme.

Made a start with a modal for a explanation about the dashboard.

# Day 14:

Finished modal for Explanation.
Added homepage and link to github source.

# Day 15:

While creating the homepage I discovered that boostrap automatically works with
margins and padding. These were removed to get rid of the horizontal scroll.

Changed header barchart. Now it shows the subject by which the bars are ordered.

Added a linked view at the line chart. When a point is clicked the other 3 Visualizations
will be updated by the corresponding season.

Changed the "show up place" of the tooltip for all the 4 visualizations.

Furthermore some styling of the visualizations: Dropdowns still need to be done.

# Day 16:

Fineshed styling dropdowns, and the rest of the pages.

To style the dropdowns it was necessary to increase the height of the navbar and
its contents.

Ordered code, made functions for the different actions.

Ordered style sheets
