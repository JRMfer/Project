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
it was difficult to linkt the countries in the datamap to these transfer. So further
preproccesing of the dataset was necessary.


# Day 3

So the question became how to preprocces the dataset. After a long search I encounterd
the pandas dataframe loc function, but one should hardcode a lot of conditional
statements in order to achieve a correct way of adjusting the datatset. Another
option could be to copy the csv column with competitions into another csv file with
the column next to it the correct country. With this method one can easily merge
the two csv into one with pandas. This would work if not that the excel file, when
opened, has problems reading lettres with signs.
