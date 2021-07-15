import mapboxgl from 'mapbox-gl'
import api from '@/api/index.js';
import path from '@/api/path.js';
var wkx = require('wkx');
var Buffer = require('buffer').Buffer;
export default {
    map:'',
    popup: new mapboxgl.Popup(),

    addCenterLayer(){
        let pointdata = {
          "type":"FeatureCollection",
          "features":[]
        };
        this.map.addLayer({
          source: {
            type: "geojson",
            data: pointdata
          },
          id: "imageLayer",
          type: "fill",
          paint: {}
        });
        this.map.addLayer({
          source: {
            type: "geojson",
            data: pointdata
          },
          id: "centerLayer",
          type: "fill",
          paint: {}
        });
        this.map.addLayer({
          source: {
            type: "geojson",
            data: pointdata
          },
          id: "centerlineLayer",
          type: "fill",
          paint: {}
        });
    },
    flightInformationRegion() {
        let colorPath = [
          "rgb(0, 255, 127)",
          "rgb(255, 255, 0)",
          "rgb(255, 0, 0)",
          "rgb(152, 245, 255)",
        ];
        let url = path.airplane.getFirRegion;
        api.get(url).then((res) => {
          for (var i = 0; i < res.features.length; i++) { 
            res.features[i].properties.valueColor = colorPath[i % 3]; 
          }
          this.addFillLayer(res, "firRegion");
        });
      },
    CAT() {
        // 展示中国境内的管制区
        let colorPath = [
          "rgb(0, 255, 127)",
          "rgb(255, 255, 0)",
          "rgb(255, 0, 0)",
          "rgb(152, 245, 255)",
        ];
        let url = path.airplane.getCTA;
        api.get(url).then((res) => {
          var _features = [];
          for (var i = 0; i < res.length; i++) {
            var wkbBuffer = new Buffer(res[i].geom, "hex");
            var geometry = wkx.Geometry.parse(wkbBuffer);
            res[i].valueColor = colorPath[i % 2];
            var feature = turf.feature(geometry.toGeoJSON(), res[i]);
            _features.push(feature);
          }
          this.addFillLayer(turf.featureCollection(_features), "CAT");
        });
    },
    sectorByRegion() {
        // 展示中国境内扇区
        let colorPath = [
          "rgb(152, 245, 255)"
        ];
        let url = path.airplane.getSectorByRegion;
        api.get(url).then((res) => {
          var _features = [];
          for (var i = 0; i < res.length; i++) {
            var wkbBuffer = new Buffer(res[i].geographic, "hex");
            var geometry = wkx.Geometry.parse(wkbBuffer);
            res[i].valueColor = colorPath[0];
            var feature = turf.feature(geometry.toGeoJSON(), res[i]);
            _features.push(feature);
          }
          this.addFillLayer(
            turf.featureCollection(_features),
            "sectorByRegion"
          );
        });
      },
    airLineByRegion() {
        let url = path.airplane.getAirlineByRegion;
        api.get(url).then((res) => {
          this.addLineLayer(res, "airLineByRegion");
        });
    },
    addLineLayer(data, id) {
        if (this.map.getSource(id)) {
          this.map.getSource(id).setData(data);
        } else {
          this.map.addLayer({
            source: {
              type: "geojson",
              data: data
            },
            id: id,
            type: "line",
            paint: {
              "line-opacity": 0.8,
              "line-width":2,
              "line-color": "green"
            }
          },'centerlineLayer')
        }
    },
    addFillPoper(e) {
        let _this = this;
        console.log(e);
        _this.map.getCanvas().style.cursor = 'pointer';
        var features = e.features;
        console.log(features[0].properties);
        var coordinates = [e.lngLat.lng, e.lngLat.lat];
    
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
    
        let data = features[0].properties;
        let name = data.cn_name || data.fir_cn_name;
        let eq_popupContent = "";
        eq_popupContent += '<div style="color:#fff;text-align: left;">';
        eq_popupContent += '<div style="background-color:#6669;color:#fff;padding:3px 2px;">属性信息</div>'
        eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '名称：' + name + '</p> ';
        // eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '名称：' + name + '</p> ';
        // eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '经度：' + data.longitude + '</p> ';
        // eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + "纬度：" + data.latitude + '</p> ';
    
        eq_popupContent += '</div>';
    
        _this.popup
          .setLngLat(coordinates)
          .setHTML(eq_popupContent)
          .addTo(_this.map);
    
    },
    addFillLayer(data, id) {
        let _this = this;
        this.map.addLayer({
          source: {
            type: "geojson",
            data: data
          },
          id: id,
          type: "fill",
          paint: {
            "fill-opacity": 0.5,
            "fill-color": {
              "type": "identity",
              "property": "valueColor"
            },
            "fill-outline-color":"#000"
          }
        },"centerLayer")
        var fn = function (e) {
          if (e.type == "touchstart" && event.touches.length < 2) {
           // _this.addFillPoper(e);
          } else if (e.type == "click") {
           // _this.addFillPoper(e);
          }
        }
        _this.map.on('click', id, fn)
        _this.map.on('touchstart', id, fn)
    },

    addIconByairpoint(data, id, vue) {
      let _this = this;
      if (_this.map.hasImage('airpoint')){
        _this.map.addLayer({
          "id": id,
          "source": {
            "type": "geojson",
            "data": data
          },
          "type": "symbol",
          "paint": {
            "icon-opacity": 1,
          },
          "layout": {
            "icon-size": 0.5,
            "icon-allow-overlap": true,
            "icon-image":"airpoint",
          }
        });
      }
    },
}