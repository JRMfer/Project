# Project Minor Programming (UvA)

Name: Julien Fer (10649441)

This repository now only contains the proposal for the final project of the minor programming at the University of Amsterdam

## Problem Statement
A hot topic in sport news is the development of the transfer values in football.
The last past years the values rised to high amounts and from clubs as well as
society complaints arises regarding this development. This project tries to
explain this development based on the top 250 transfers from 2000-2018. Certain
indicators will be examined as the competitions these transfers took place,
which club bought and the positions of the players. Hopefully the statistics
will show a pattern trough the years.

## Solution
At first the statistics will be shown for all the years. But the user can
navigate trough the different competitions, seasons and position to see the
statistics more explicitly.

Main features:

1. Minimun viable product

A worldmap representing the different countries in which the competitions are
located, while hovering one sees the total transfer expenditures of that country
and the amount of transfers. When country is clicked the other visualizations
will be adjusted to show only the statistics of the selected country. (MVP)

A barchart that shows the total expenditure per country, except when a country
is selected one sees the total expenditures per club in country (competition). (MVP)

A pie chart with the percentage spent of a country compared to the other countries,
unless a country is selected than the percentages of the different clubs within
the country will be shown. (MVP)

Two dropdown menus:

One to give options for the different seasons (MVP) and another one for the
different positions (MVP).

Maybe a navbar for other templates such as a story, personal information and data.


2. Extra features

A line chart which shows the devlopment of the transfer expenditure over time (2000-2018).

For the visual sketch see the visual_sketch.jpg in the doc folder.

## Prerequisites
Data source: https://www.kaggle.com/vardan95ghazaryan/top-250-football-transfers-from-2000-to-2018/version/1

## External components
pandas, csv, d3.js

## Github page Link
https://JRMfer.github.io/Project
