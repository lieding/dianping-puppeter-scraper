# Geohash Precison Selection

The distance between two adjacent geohashes depends on the latitude & longitude of the center points. In order to get an accurate distance of your bounding box you need to get the adjacent boxes, calculate their center lat/lon and get the distance.

For example, to the get distance of each geohash in dqcjqcperh9tdqcj, you will get the following distances for adjacent boxes. Keep in mind that these numbers change slightly as the center geohash changes.

Precision, Distance of Adjacent Cell in Meters:
- 1, 5003530
- 2, 625441
- 3, 123264
- 4, 19545
- 5, 3803
- 6, 610
- 7, 118
- 8, 19
- 9, 3.71
- 10, 0.6

I would calculate the center point of each bounding box and calculate the distance using one of the formulas listed [here](http://www.movable-type.co.uk/scripts/latlong.html)

[Here](https://github.com/davetroy/geohash-js) is a good javascript library that calculates adjacent geohashes and provides lat/lons to use for calculations.
