import { Map, View } from 'ol';
import { GeoJSON } from 'ol/format'
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
// import TileWMS from 'ol/source/TileWMS';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Stroke } from 'ol/style';
import {fromLonLat} from 'ol/proj';
import emd from './db/TC_SPBE17_2015_W.json'

const format = new GeoJSON({ // 선표시
    featureProjection: "EPSG:3857"
});

const vectorSource = new VectorSource({ // 선표시 벡터 적용
    feature:format.readFeatures(emd)
})

const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
        stroke: new Stroke({
            color: 'blue',
            width: 2
        })
    })
})

// 지도 사진이 있는 객체, 해당 내부에 존재하는 url을 활용해서 사진을 받아온다.
// 해당 데이터는 여러 형식으로 변경 가능하다.
const osmLayer = new TileLayer({
    source: new OSM()
})

let currentZoolLevel = 8;
const schladming = [127.18771061903684, 38.29537836038208];
const schladmingWebMercator = new fromLonLat(schladming);

const map = new Map({
    target: 'map',
    layers: [
        osmLayer,
        vectorLayer
    ],
    view: new View({
        center: schladmingWebMercator,
        zoom: currentZoolLevel
    })
})