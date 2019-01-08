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
the season in which the player has been transferred and with the column names as
keys. This will be done with help of the pandas library in python. As this is
done it will be much easier to retrieve the correct data depending on the season
and subject needed.

## Diagram
