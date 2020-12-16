const mapshaper = require('mapshaper');
const ogr2ogr = require('ogr2ogr');
const fs = require('fs');
const geojson = ogr2ogr('대상.shp').stream();
geojson.pipe(fs.createWriteStream('변환.json'))