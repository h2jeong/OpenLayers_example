import 'ol/ol.css';
import { Feature, Map, View } from 'ol';
import OlTileLayer from 'ol/layer/Tile'; // TileLayer에서 별칭 변경
import OSM from 'ol/source/OSM';
import Point from 'ol/geom/Point';
import Vector from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon'

// 위경도를 오픈레이어스에서 사용중인 값으로 변환
const pnt = new Point([126, 37]).transform('EPSG:4326', 'EPSG:3857'); 

const korea = pnt.getCoordinates(); // 중심 포인트

const layer = new OlTileLayer({ // TileLayer에서 별칭 변경 - 임포트시 충돌 방지
    source: new OSM() // 지형정보가 존재하는 객체, ol의 기본 레이어
})

const myView = new View({
    center: korea,
    zoom: 8
})

const map = new Map({
    target: 'map',
    layers: [
        layer
    ],
    view: myView
});

function createStyle(src) {
    return new Style({
        image: new Icon( /** @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 0.5],
          src: src,
          imgSize: [50, 50],
          crossOrigin: 'anonymous',
        }))
      });
  }

const vectorSource = new Vector({
    projection: 'EPSG:4326'
})
const iconFeature = new Feature(pnt);

iconFeature.set('style', createStyle('https://openlayers.org/en/v4.6.5/examples/data/icon.png'));
iconFeature.set('index', '001')

vectorSource.addFeature(iconFeature);

const iconLayer = new VectorLayer({
    style: (feature) => {
        return feature.get('style')
    }, 
    source: vectorSource
})
map.addLayer(iconLayer)

// hover
let hover = null;
map.on('pointermove', function(evt) {
    map.getTargetElement().style.cursor = map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';

    if(hover !== null) {
        if (hover.get('index') === '001') {
            hover.setStyle(createStyle('https://openlayers.org/en/v4.6.5/examples/data/icon.png'));
            console.log('hover 해제')
        }
        hover = null;
    }

    map.forEachFeatureAtPixel(evt.pixel, function(f) {
        hover = f;
        return true;
    });

    if(hover) {
        if(hover.get('index') === '001') {
            console.log('hover 효과');
            hover.setStyle(createStyle('https://openlayers.org/en/v4.6.5/examples/data/icon.png'))
        }
    }
})

// click 효과
let clicker = null;
map.on('click', function(evt) {
    map.forEachFeatureAtPixel(evt.pixel, function(f) {
        clicker = f;
        return true;
    })
    if(clicker !== null) {
        console.log(clicker.get('index'));

        if(clicker.get('index') === '001') {
            console.log('click 효과');
            clicker.setStyle(createStyle('https://openlayers.org/en/v4.6.5/examples/data/icon.png'))
        }
        clicker = null;
    }
})