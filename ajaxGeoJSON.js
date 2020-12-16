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

// 위경도를 오픈레이어스에서 사용중인 값으로 변환
const pnt = new Point([126, 37]).transform('EPSG:4326', 'EPSG:3857'); 
const korea = pnt.getCoordinates(); // 중심 포인트

const layer = new OlTileLayer({ // TileLayer에서 별칭 변경 - 임포트시 충돌 방지
    source: new OSM() // 지형정보가 존재하는 객체, ol의 기본 레이어
})

const myView = new View({
  center: korea,
  zoom: 8
}); //뷰 객체를 전역변수로 뺀다.

$.ajax({
    url: 'data/SIGUNGU.json',
    type: 'get',
    contentType: 'application/x-www-form-urlencoded;charset=utf8',
    success: function (data) {
        console.log(data);    
        var format = new GeoJSON({   //포멧할 GeoJSON 객체 생성
            featureProjection:'EPSG:3857'
        });
        var parsing = format.readFeatures(data);  //읽어온 데이터 파싱
        var source = new Vector({  //벡터의 구조를 파싱한 데이터로 넣기
            features : parsing
        });
        var geoVector = new VectorLayer({ //벡터 레이어 생성 
            source : source,
            style: (feature, resolution) => {
                let name = feature.values_.adm_nm;
                return new Style({
                stroke: new Stroke({
                    color: '#5c68ff',
                    width: 1
                }), fill: new Fill({  //채우기
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

        var map = new Map({
            layers: [layer, geoVector],
            target: 'map',
            view: myView
        });
    }
});