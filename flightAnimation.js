import 'ol/ol.css';
import { Feature, Map, View } from 'ol';
import OlTileLayer from 'ol/layer/Tile'; // TileLayer에서 별칭 변경
import OSM from 'ol/source/OSM';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import LineString from 'ol/geom/LineString';
import arc from 'arc'
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import {getVectorContext} from 'ol/render';

const flights = new Array();
flights[0] = [[126.11,37.12], [7.51,11.831]];
flights[1] = [[110.11,25.12], [178.21,33.561]];
flights[2] = [[55.11,43.12], [47.21,13.42]];
flights[3] = [[12.11,3.12], [126.21,37.42]];
flights[4] = [[-113.11,39.12], [45.42,37.21]];

// 위경도를 오픈레이어스에서 사용중인 값으로 변환
const pnt = new Point([55.11,43.12]).transform('EPSG:4326', 'EPSG:3857'); 
const africa = pnt.getCoordinates(); // 중심 포인트
const layer = new OlTileLayer({ // TileLayer에서 별칭 변경 - 임포트시 충돌 방지
    source: new OSM() // 지형정보가 존재하는 객체, ol의 기본 레이어
})
const myView = new View({
    center: africa,
    zoom: 1
})

// 선 스타일 주기 test
const style = new Style({
    stroke: new Stroke({
        color: 'rgba(41,129,63,0.7)',
        width: 2
    })
})

const flightSource = new VectorSource();
const flightLayer = new VectorLayer({
    source: flightSource,
    style: (feature) => {
        return null;
    }
});

// 배열의 값을 벡터레이어에서 사용 할 수 있는 벡터소스로 변환
function makeAirLine() {
    flights.forEach((flight, i) => {
        let from = flight[0];
        let to = flight[1];
        
        // arc : Calculate great circles routes as lines in GeoJSON or WKT format.
        let arcGenerator = new arc.GreatCircle(
            {x: from[0], y: from[1]},
            {x: to[0], y: to[1]}
        );
        let arcLine = arcGenerator.Arc(100, {offset: 50}); // 라인이 그려진다.

        if(arcLine.geometries.length === 1) {
            // LineString 객체를 통해 맵에서 사용한 가능한 형태로 만든다.
            let line = new LineString(arcLine.geometries[0].coords);
            
            line.transform('EPSG:4326', 'EPSG:3857');

            let feature = new Feature({ // 구조물을 만들어
                geometry: line
            });

            feature.set('startTime', new Date().getTime()); // 이벤트의 시작 종료를 위해 필요함
            feature.set('myIndex', i); 
            flightSource.addFeature(feature); // 벡터레이어가 참조하는 소스에 추가
        }
    })
}

makeAirLine();

const map = new Map({
    target: 'map',
    // 사용하는 레이어, 벡터레이어를 추가해야 이벤트에 따른 원그리기, 선그리기 객체를 지도에 넣을 수 있다.
    layers: [
        layer,
        flightLayer
    ],
    view: myView
})

let duration = 0.03 // 주기
const colorCode = [
    'rgba(41,129,63,0.8)',
    'rgba(129,41,41,0.8)',
    'rgba(54,41,129,0.8)',
    'rgba(120,129,41,0.8)',
    'rgba(34,147,169,0.8)',
    'rgba(41,129,63,0.8)'
];

function airPlainAnimation(evt) {
    let vectorContext = getVectorContext(evt) // 벡터 대상
    const frameState = evt.frameState;

    // vectorContext.setStyle(style); // 스타일 넣기

    let features = flightSource.getFeatures(); 

    for(let i = 0; i < features.length; i++) { // 반복문을 통해서 이동시킨다.
        vectorContext.setStyle(new Style({
            stroke: new Stroke({
                color: colorCode[i],
                width: 2
            })
        }))
        let feature = features[i];
        let coords = feature.getGeometry().getCoordinates(); 
        let elapsedTime = frameState.time - feature.get('startTime');
        let elapsedPoints = elapsedTime * duration;

        if(elapsedPoints >= coords.length) { // 끝나면 반복 시키기
            flightSource.clear();
            makeAirLine();
        } else {
            // 좌표 이동을 위한 계산식
            let maxIndex = Math.min(elapsedPoints, coords.length);
            let currentLine = new LineString(coords.slice(0, maxIndex));
            vectorContext.drawGeometry(currentLine);
        }
    }
    map.render();
}

// map.on('postcompose', airPlainAnimation); 
// With ol6 use postrender event on layers and new getVectorContext function provides access to the immediate vector rendering API.
// onstruct your map and layers as usual
layer.on('postrender', airPlainAnimation); // 지도를 그린 후 발행해라 의미