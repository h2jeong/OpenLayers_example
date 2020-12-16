import 'ol/ol.css';
import { Map, View } from 'ol';
import OlTileLayer from 'ol/layer/Tile'; // TileLayer에서 별칭 변경
import OSM from 'ol/source/OSM';
import Point from 'ol/geom/Point';
import Vector from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';

// 위경도를 오픈레이어스에서 사용중인 값으로 변환
const pnt = new Point([126, 37]).transform('EPSG:4326', 'EPSG:3857'); 

const korea = pnt.getCoordinates(); // 중심 포인트

const layer = new OlTileLayer({ // TileLayer에서 별칭 변경 - 임포트시 충돌 방지
    source: new OSM() // 지형정보가 존재하는 객체, ol의 기본 레이어
})

// wrapX는 세계지도를 가로로 펼친다는 의미, True인 경우 좌표계산 벡터가 실제 지형정보를 토대로 하므로 어긋남.
// 즉, 그냥 쓰면 된다.
const source = new Vector(); 

const vector = new VectorLayer({
    source: source // 벡터레이어, 가장 기본적인 ol의 화면 구성 레이어 값
})

const myView = new View({
    center: korea,
    zoom: 8
})

const map = new Map({
    target: 'map',
    // 사용하는 레이어, 벡터레이어를 추가해야 이벤트에 따른 원그리기, 선그리기 객체를 지도에 넣을 수 있다.
    layers: [
        layer,
        vector
    ],
    view: myView
})
