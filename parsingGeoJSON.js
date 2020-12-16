import 'ol/ol.css';
import { Map, View } from 'ol';
import OlTileLayer from 'ol/layer/Tile'; // TileLayer에서 별칭 변경
import OSM from 'ol/source/OSM';
import Point from 'ol/geom/Point';
import Vector from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON'
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Text from 'ol/style/Text';
import sig from './dist/data/SIGUNGU.json';
import emd from './dist/data/TC_SPBE17_2015_W.json'

// 위경도를 오픈레이어스에서 사용중인 값으로 변환
const pnt = new Point([126, 37]).transform('EPSG:4326', 'EPSG:3857'); 
const korea = pnt.getCoordinates(); // 중심 포인트

const layer = new OlTileLayer({ // TileLayer에서 별칭 변경 - 임포트시 충돌 방지
    source: new OSM() // 지형정보가 존재하는 객체, ol의 기본 레이어
})

// geoJSON 파일로 화면 구성
// 1. geoJSON 파일 불러오기
// 2. 임포트한 geoJSON 객체를 통해서 가져온 데이터를 오픈레이어스에서 사용 가능한 객체로 파싱한다.
// 3. 파싱된 객체를 벡터에 집어 넣는다.
// 4. 해당 벡터를 레이어에 넣고 스타일과 관련된 객체를 통해 선, 채우기, 글씨를 그려준다.
// 5. 다 만들어진 레이어를 map의 layers 배열에 넣어준다.

// ----- OpenLayers 3 버전 -----
// const parsing = new Vector({
//     url: 'data/TC_SPBE17_2015_W.json',
//     format: new GeoJSON(),
//     projection: 'EPSG:3857'
// })

// const geoSource = new Vector({
//     title: 'added Layer',
//     source: parsing
// })

const format = new GeoJSON({
    featureProjection: 'EPSG:3857'
})

// const parsing = format.readFeatures(emd);
// const geoSource = new Vector({
//     features: parsing
// })

const geoSource = new Vector({
    features: format.readFeatures(sig)
})

const geoVectorLayer = new VectorLayer({
    source: geoSource,
    style: (feature, resolution) => {
        let name = feature.values_.emd_nm;
        return new Style({
            stroke: new Stroke({
                color: '#5c68ff',
                width: 1
            }), 
            fill: new Fill({  //채우기
                color: 'rgba( 255, 133, 133 ,0.15)'
            }),
            text: new Text({  //텍스트
                text: name,
                textAlign: 'center',
                font: '15px roboto,sans-serif'
            })
        })
    }
});

const myView = new View({
    center: korea,
    zoom: 8
})

const map = new Map({
    target: 'map',
    // 사용하는 레이어, 벡터레이어를 추가해야 이벤트에 따른 원그리기, 선그리기 객체를 지도에 넣을 수 있다.
    layers: [
        layer,
        geoVectorLayer
    ],
    view: myView
})
