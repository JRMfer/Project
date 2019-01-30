# Project Minor Programming (UvA)
* Name: Julien Fer
* Student Number: 10649441
* University: University of Amsterdam

This repository contains the functionality for a dashboard viusalization

## [GitHub Pages](https://jrmfer.github.io/Project)

## Problem Statement
A hot topic in sport news is the development of the transfer values in
football.
The last past years the values rised to high amounts and from clubs as
well associety complaints arises regarding this development. This project
tries toexplain this development based on the top 250 transfers from
2000-2018. Certainindicators will be examined as the competitions these
transfers took place, which club bought and the positions of the players.
Hopefully the statistics will show a pattern trough the years.

## Solution
A D3 dashboard that shows the development of the total transfer fees over
time which can be examined in more depth with some indicators as the
country, season and position.

Main features:

* Interactive world map (MVP)
Shows all countries with hover and click.

* Interactive horizontal bar chart (MVP)
Shows the total transfer fees per country/club with hover and click.

* Sunburst (MVP)
Shows the distribtuion of the total transfer fee with tooltip and click

* Navbar with dropdowns (MVP)
Navbar to switch to home page, visualization, explanation (modal) and
Github

Extra features:

* line chart with animation
shows the development of the total transfer fee over time

Instead of a visual sketch a website walktrough will follow.

## Website Waltrough
#### Homepage
The website consists of a main homepage that shows the title and subtitle
of the product, projected on an image. At the top of the page is a
navigation bar, which contains links with symbols to the other webpages
of the site.

![](doc/homepage_boven.png)

At the bottom of the page (when scrolled down) some general information is
displayed. Some of the text is hyperlinked.

![](doc/homepage_onder.png)

#### Visualizations page
This page is the most interesting page of the website. It contains all
the data visualizations that have been made. At the top there is again a
navigation bar, with wich now a modal can be triggered by the explanation
nav-link and 3 dropdown menus with wich you can update the
visualizations.

At the left there is map of the world. The countries are color coded to
the amount of the total transfer fee in that country. A color that is
more blue has a higher value. The map holds a tooltip in which one can
see the exact total transfer fee and amount of transfers. When a country
is clicked the other 3 visualizations will be updated.

At the right there is a line chart which appear for the first time
animated and for every next update this animation can be triggered by
clicking the button in the chart. The line chart shows the development of
the total transfer fee over time for a given dataset. This exact amount
can be shown by the tooltip as well as the corresponding top 3 transfer
for that season. The dots contain a click function that updates the other
visualizations.

![](doc/visualizations_boven.png)

Fogot what the dashboard is about? Select the explanation in the navbar
and a modal will appear.

![](doc/modal.png)

When scrolling down one will encounter more visualizations.
At the left there will be a horizontal bar chart which visualiszes the
total transfer fees per country/club. There is a tooltip which shows this
exact amount and the amount of transfers. When a bar is clicked all the
visualizations will be updated.

At the right there is a sunburst with in the middle a representation of
the world's total transfer fee. This sunburst visualizes the distribution
of the transfer fees among the world. All elements in a layer are color
codedbased on their percentage in perspective to its parent. The first
layer represents all the clubs in the dataset, the second the countries
and the third (inner) layer the world. A tooltip shows the exact total
transfer fee and its percentage w.r.t its parent.

![](doc/visualizations_middle.png)

And again at the bottom of the page (when scrolled down) some general
information is displayed. Some of the text is hyperlinked.


## Prerequisites
#### Data source
All used data collected from [Kaggle](https://www.kaggle.com/), an
online community of data scientists and machine learners, owned by
Google, Inc. The exact data used is:
* [Top 250 transfers 2000-2018](https://www.kaggle.com/vardan95ghazaryan/top-250-football-transfers-from-2000-to-2018/version/1)


## External components
pandas, csv, d3.js

## Github page Link
https://JRMfer.github.io/Project
