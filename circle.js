import 'ol/ol.css';
import { Feature, Map, View } from 'ol';
import OlTileLayer from 'ol/layer/Tile'; // TileLayer에서 별칭 변경
import OSM from 'ol/source/OSM';
import Point from 'ol/geom/Point';
import Vector from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Draw from 'ol/interaction/Draw'
import Circle from 'ol/geom/Circle';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Text from 'ol/style/Text';
import Stroke from 'ol/style/Stroke';

// 위경도를 오픈레이어스에서 사용중인 값으로 변환
const pnt = new Point([126, 37]).transform('EPSG:4326', 'EPSG:3857'); 

const changePoints = pnt.getCoordinates();

const layer = new OlTileLayer({ // TileLayer에서 별칭 변경 - 임포트시 충돌 방지
    source: new OSM() // 지형정보가 존재하는 객체, ol의 기본 레이어
})

// wrapX는 세계지도를 가로로 펼친다는 의미, True인 경우 좌표계산 벡터가 실제 지형정보를 토대로 하므로 어긋남.
// 즉, 그냥 쓰면 된다.
const source = new Vector(); 

const vector = new VectorLayer({
    source: source // 벡터레이어, 가장 기본적인 ol의 화면 구성 레이어 값
})

const map = new Map({
    target: 'map',
    // 사용하는 레이어, 벡터레이어를 추가해야 이벤트에 따른 원그리기, 선그리기 객체를 지도에 넣을 수 있다.
    layers: [
        layer,
        vector
    ],
    view: new View({
        center: changePoints,
        zoom: 8
    })
})

// 도형 추가
// 벡터를 만들고 원 속성을 넣어주면 된다.
// 1. 원 그리기
const vectorSource = new Vector({
    projection: 'EPSG:4326'
})
const circle = new Circle(changePoints, 12000); // 좌표, 반경 넓이
const CicleFeature = new Feature(circle); // 구조체로 형성
vectorSource.addFeatures([CicleFeature]); // 벡터소스에 추가

// 2. 만들어진 벡터를 맵에 추가할 새로운 레이어를 생성
// Stroke 객체는 필수이며 나머지는 효과이다.
const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: [
        new Style({
            stroke: new Stroke({
                color: 'rgba(240,79,79,0.9)',
                width: 2
            }),
            fill: new Fill({
                color: 'rgba(255,133,133,0.5)'
            }),
            text: new Text({
                text: 'Hoi!',
                textAlign: 'center',
                font: '15px roboto,sans-serif'
            }), 
        })
    ]
})
// 3. map에 추가
map.addLayer(vectorLayer);

// Dom Event
const selector = document.getElementById('type'); 
let draw = null;

function startEvent() {
    let value = selector.value;
    if(value !== 'None') {
        draw = new Draw({
            source: source,
            type: selector.value
        });
        console.log(value, draw)
        map.addInteraction(draw);
    }
}

selector.onChange = function() {
    map.removeInteraction(draw);
    startEvent();
}

startEvent();