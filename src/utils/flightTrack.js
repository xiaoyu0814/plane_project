import api from '@/api/index.js';
import path from '@/api/path.js';
import Mapboxmap from './map'
import dateFormatter from "@/utils/dateFormatter"
export default{
      mapbox:"",
      stop:false,
      drawTime:false,
      setMapbox(mapbox){
        this.mapbox = mapbox
      },
      start:function(){
        this.stop = false;
        this.run();
      },
      run:function(){
        if(this.stop)return
        let _this = this;
        this.addNowAirPlane();
        setTimeout(function(){_this.run()},3000);
      },
      
      //添加实时轨迹线
      addNowAirPlane() {
        let _this = this;
        let url = path.airplane.getADSBData;
        api.get(url, null).then((res) => {
          if(_this.stop)return
          //console.log(res);
          if(res){
            let points = [];
            for(let item in res){
              let lng = res[item].longtitudeFloat;
              let lat = res[item].latitudeFloat;
              res[item].heading = Number(res[item].vector)
              let point = turf.point([lng,lat],res[item]);
              points.push(point);
            }
            let geojson = turf.featureCollection(points);
            _this.addFlightTrack(geojson, "nowflightTrack");
          }
          
         //  
        });
      },
      addElementAirPlane(callsign,datetime){
        let _this = this;
        api.get(path.airplane.flightDetailInfo, {
          callsign: callsign,
          datetime: datetime
        }).then(res => {
          let _data = res;
          let coordinates = [Number(_data.longitude),Number(_data.latitude)];
          let eq_popupContent = "";
          eq_popupContent += '<div style="color:#fff;text-align: left;">';
          eq_popupContent += '<div style="background-color:#6669;color:#fff;padding:3px 2px;">属性信息</div>'
          eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="flightNumber_show">' + '航班号：' + callsign + '</p> ';
          // eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '名称：' + name + '</p> ';
          eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="lon_show">' + '经度：' + _data.longitude + '</p> ';
          eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="Lat_show">' + "纬度：" + _data.latitude + '</p> ';
          eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="height_show">' + "高度：" + _data.height + 'm</p> ';
          eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="course_show">' + "航向角：" + _data.heading + '</p> ';
          eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="groundSpeed_show">' + "地速：" + _data.groundspeed + 'km/h</p> ';
          eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="riseFallRate_show">' + "上升/下移率：" + _data.verticalrate + '</p> ';
          eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="upAirport_show">' + "起飞机场：" + _data.departure + '</p> ';
          eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="downAirport_show">' + "降落机场：" + _data.arrival + '</p> ';
          eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '机型：' + _data.aircraft_type + '</p></div>';
          eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '运输类型：' + _data.transport_type + '</p></div>';
          eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '所属公司：' + _data.airline + '</p></div>';
          eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '时间：' + datetime + '</p></div>';
          eq_popupContent += '</div>';
          // Populate the popup and set its coordinates
          // based on the feature found.
          Mapboxmap.popup
            .setLngLat(coordinates)
            .setHTML(eq_popupContent)
            .addTo(_this.mapbox);
        })
      },
      addPopup:function(data){
        let _this = this;
        let coordinates = [Number(data.longitudeFloat),Number(data.latitudeFloat)];
          let eq_popupContent = "";
          eq_popupContent += '<div style="color:#fff;text-align: left;">';
          eq_popupContent += '<div style="background-color:#6669;color:#fff;padding:3px 2px;">属性信息</div>'
          eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="flightNumber_show">' + '航班号：' + data.callsign + '</p> ';
          // eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '名称：' + name + '</p> ';
          eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="lon_show">' + '经度：' + data.longitudeFloat + '</p> ';
          eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="Lat_show">' + "纬度：" + data.latitudeFloat + '</p> ';
          eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="height_show">' + "高度：" + data.height + 'm</p> ';
          eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="course_show">' + "航向角：" + Number(data.heading).toFixed(2) + '</p> ';
          eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="groundSpeed_show">' + "地速：" + data.groudSpeed + 'km/h</p> ';
          // eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="riseFallRate_show">' + "上升/下移率：" + data.verticalrate + '</p> ';
          // eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="upAirport_show">' + "起飞机场：" + data.departure + '</p> ';
          // eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="downAirport_show">' + "降落机场：" + data.arrival + '</p> ';
          // eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '机型：' + data.aircraft_type + '</p></div>';
          // eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '运输类型：' + data.transport_type + '</p></div>';
          // eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '所属公司：' + data.airline + '</p></div>';
          eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '时间：' + data.timestamp + '</p></div>';
          eq_popupContent += '</div>';
          // Populate the popup and set its coordinates
          // based on the feature found.
          Mapboxmap.popup
            .setLngLat(coordinates)
            .setHTML(eq_popupContent)
            .addTo(_this.mapbox);
      },
      addAirPlanePoper(e,id) {
        let _this = this;
        console.log(e);
        _this.mapbox.getCanvas().style.cursor = 'pointer';
        var features = e.features;
        console.log(features[0].properties);
        var coordinates = e.features[0].geometry.coordinates.slice();
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        let data = features[0].properties;
        if(id=="nowflightTrack"){
          this.addPopup(data);
        }else{
          this.addElementAirPlane(data.callsign,data.datetime); 
        }
       
      },
      //轨迹线
      addFlightTrack(data, id) {
        let _this = this;
        if (this.mapbox.getSource(id)) {
          this.mapbox.getSource(id).setData(data);
        } else {
          this.mapbox.loadImage("./static/img/airplane1.png", function (error, image) {
            if (error) throw error;
            if (!_this.mapbox.hasImage('airplane'))_this.mapbox.addImage('airplane', image);
            _this.mapbox.addLayer({
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
                "icon-size":0.5,
                "icon-allow-overlap": true,
                "icon-rotate": {
                  "type": "identity",
                  "property": "heading"
                },
  
                "icon-image": "airplane",
              }
            })
            var fn = function (e) {
            
              if(e.type == "touchstart"&& event.touches.length<2){
                _this.addAirPlanePoper(e,id);
              }else if(e.type == "click"){
                _this.addAirPlanePoper(e,id);
              }
            }
            _this.mapbox.on('click', id, fn)
            _this.mapbox.on('touchstart', id, fn)
  
          });
        }
      },
      remove:function(){
        this.setStop();
        Mapboxmap.remove("nowflightTrack")
      },
      setStop:function(){
        this.stop = true;
      },
      addAirplaneByIata:function(res){
        this.setStop();
        if(res){
          let points = [];
          for(let item in res){
            let lng = res[item].longitudeFloat;
            let lat = res[item].latitudeFloat;
            res[item].heading = Number(res[item].vector)
            let point = turf.point([lng,lat],res[item]);
            points.push(point);
          }
          let geojson = turf.featureCollection(points);
          this.addFlightTrack(geojson, "nowflightTrack");
        }
      }
}