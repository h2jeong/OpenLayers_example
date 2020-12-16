import { Map, View } from 'ol';
import KML from 'ol/format/KML';
import Point from 'ol/geom/Point';
import { Heatmap as HeatmapLayer, Tile as TileLayer } from 'ol/layer';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';

const pnt = new Point([127,37]).transform('EPSG:4326', 'EPSG:3857');
const changePoints = pnt.getCoordinates();

const vector = new HeatmapLayer({
    source: new VectorSource({
        url: 'data/heating.kml',
        format: new KML({
            extractStyles: false
        })
    }),
    blur: 15, // 블러값이 낮을수록 번짐이 커지고 겹치는 곳은 붉은색으로 표기된다.
    radius: 20
})

const layer = new TileLayer({
    source: new OSM()
})

const map = new Map({
    layers: [layer, vector],
    target: 'map',
    view: new View({
        center: changePoints,
        zoom: 8
    })
})