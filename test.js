import { Feature, Map, View } from "ol";
import Circle from "ol/geom/Circle";
import Point from "ol/geom/Point";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import Text from "ol/style/Text";


const pnt = new Point([127,37]).transform('EPSG:4326','EPSG:3857'); 
const changePoints = pnt.getCoordinates();

const layer = new TileLayer({
    source: new OSM()
})

const source = new VectorSource();
const vector = new VectorLayer({
    source: source
});

const map = new Map({
    target: 'map',
    layers: [
        layer, vector
    ],
    view: new View({
        center: changePoints,
        zoom: 8
    })
});

const circle = new Circle(changePoints, 12000);
const circleFeature = new Feature(circle);
const vectorSource = new VectorSource({
    projection: 'EPSG:4326'
})

vectorSource.addFeatures([circleFeature])

const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: [
        new Style({
            stroke: new Stroke({
                color: 'red',
                width: 2
            }),
            fill: new Fill({
                color: 'rgba(255,0,0,0.5)'
            }),
            text: new Text({
                text: 'Hey!',
                textAlign: 'center',
                font: '15px arial'
            })
        })
    ]
});

map.addLayer(vectorLayer)