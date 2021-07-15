import Mapbox from '../map'
import mapboxgl from 'mapbox-gl'
export default {
  map: Mapbox.map,
  addAirportDetails(lng, lat, pro, vue) {
    this.map = Mapbox.map;
    let point = turf.point([lng, lat], pro);
    let geojson = turf.featureCollection([point]);
    this.addIconByairport(geojson, "getAirport", vue);
    this.addAirportTakeoffandLandingRate(geojson, "getAirport");
    this.map.setCenter([lng, lat])
    this.map.setZoom(9)
  },
  //添加机场提示
  addAirPoper(e, id, vue) {
    let _this = this;
    console.log(e);
    _this.map.getCanvas().style.cursor = 'pointer';
    var features = e.features;
    console.log(features[0].properties);
    var coordinates = e.features[0].geometry.coordinates.slice();

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    let data = features[0].properties;
    let eq_popupContent = "";

    if (id === "getAirport" || id === "oneAirport") {
      let callback = function (res) {
        eq_popupContent = `
                  <div style="background-color:#6669;color:#fff;padding:3px 2px;">属性信息</div>
                  <table>
                    <tr>
                      <td>机场名称</td>
                      <td>${res.cn_name}</td>
                    </tr>
                    <tr>
                      <td>ICAO代号</td>
                      <td>${res.ICAO}</td>
                    </tr>
                    <tr>
                      <td>IATA代号</td>
                      <td>${res.IATA}</td>
                    </tr>
                    <tr>
                      <td>机场性质</td>
                      <td>${res.using_type}</td>
                    </tr>
                    <tr>
                      <td>经纬度</td>
                      <td>${res.coordinate}</td>
                    </tr>
                    <tr>
                      <td>管理机构</td>
                      <td>${res.controller}</td>
                    </tr>
                    <tr>
                      <td>机场标高</td>
                      <td>${res.height}</td>
                    </tr>
                    <tr>
                      <td>建设年份</td>
                      <td>${res.built_year}</td>
                    </tr>
                    <tr>
                      <td>最长跑道长度</td>
                      <td>${res.val_long_rwy}</td>
                    </tr>
                    <tr>
                      <td>所属民航地区管理局</td>
                      <td>${res.company}</td>
                    </tr>
                  </table>
                  <div style="text-align:center;margin:5px 0">
                      <button id="details" style="padding:5px 15px;border:1px solid #fff;color:#000;border-radius:4px">查看详情</button>
                  </div>
                  `;
        Mapbox.popup
          .setLngLat(coordinates)
          .setHTML(eq_popupContent)
          .addTo(_this.map);
        let button = document.getElementById("details")
        button.addEventListener("click", () => {

          vue.showAirportDetails()
          //_this.remove("testairport")

        })
      }
      vue.airportTxt(data, callback)
    } else {
      eq_popupContent += '<div style="color:#fff;text-align: left;">';
      eq_popupContent += '<div style="background-color:#6669;color:#fff;padding:3px 2px;">属性信息</div>'
      eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '名称：' + data.name + '</p> ';
      // eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '名称：' + name + '</p> ';
      eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '经度：' + data.longitude + '</p> ';
      eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + "纬度：" + data.latitude + '</p> ';

      eq_popupContent += '</div>';

      Mapbox.popup
        .setLngLat(coordinates)
        .setHTML(eq_popupContent)
        .addTo(_this.map);
    }
    // Populate the popup and set its coordinates
    // based on the feature found.
  },
  addIconByairport(data, id, vue) {
    let _this = this;
    this.map.loadImage("./static/img/my.png", function (error, image) {
      if (error) throw error;
      if (!_this.map.hasImage('airport')) _this.map.addImage('airport', image);
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
          "icon-image": "airport",
        }
      })
    })
    var fn = function (e) {

      if (e.type == "touchstart" && event.touches.length < 2) {
        _this.addAirPoper(e, id, vue);
      } else if (e.type == "click") {
        _this.addAirPoper(e, id, vue);
      }
    }
    this.map.on('click', id, fn)
    this.map.on('touchstart', id, fn)
  },
  addAirportTakeoffandLandingRate(data, id) {
    let _this = this;
    Mapbox.remove();

    function getid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    for (let i = 0; i < data.features.length; i++) {
      let _feature = data.features[i];
      let _properties = _feature.properties;
      if (_properties.departureNum >= 0 || _properties.arrivalNum >= 0) {
        let _coordinates = _feature.geometry.coordinates;
        let domid = "chart" + getid();
        let dom = document.createElement('div');
        dom.style.width = 20 + "px";
        dom.style.height = 40 + "px";
        Mapbox.markers.push(new mapboxgl.Marker({
          element: dom,
        }).setLngLat(_coordinates).addTo(_this.map));

        let myChart = echarts.init(dom);
        let option = {
          animation: false,
          color: ['#00af00', '#005600', '#4cabce', '#e5323e'],
          grid: {
            left: '0%',
            right: '0%',
            top: '50%',
            bottom: '0%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            axisTick: {
              show: false
            },
            axisLabel: {
              fontSize: 10,
              show: false,
              margin: 0
            },
            data: ['2012']
          }],
          yAxis: [{
            axisLabel: {
              show: false,
              margin: 0
            },
            show: false,
            type: 'value'
          }],
          series: [{
              name: 'Forest',
              type: 'bar',
              barGap: 0,
              label: {
                show: true,
                color: "#000",
                position: "top",
                fontSize: 10,
              },
              data: [_properties.departureNum]
            },
            {
              name: 'Steppe',
              type: 'bar',
              label: {
                show: true,
                color: "#000",
                position: "top",
                fontSize: 10,
              },
              data: [_properties.arrivalNum]
            },

          ]
        };
        myChart.setOption(option);
      } else {
        continue
      }

    }
  },
  addAirPlaneDetails(data) {
    this.map = Mapbox.map;
    console.log(data);
    if (data.location && data.location.coordinates.length > 1) {
      let point = turf.point(data.location.coordinates, data);
      let geojson = turf.featureCollection([point]);
      this.addAirPlane(geojson, "getAirplane")
      this.map.setCenter(data.location.coordinates)
      this.map.setZoom(9)
    }
  },
  addAirPlanePoper(e) {
    let _this = this;
    console.log(e);
    _this.map.getCanvas().style.cursor = 'pointer';
    var features = e.features;
    console.log(features[0].properties);
    var coordinates = e.features[0].geometry.coordinates.slice();
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    let data = features[0].properties;

    let eq_popupContent = "";
    eq_popupContent += '<div style="color:#fff;text-align: left;">';
    eq_popupContent += '<div style="background-color:#6669;color:#fff;padding:3px 2px;">属性信息</div>'
    eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="flightNumber_show">' + '航班号：' + data.callsign + '</p> ';
    // eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '名称：' + name + '</p> ';
    eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="lon_show">' + '经度：' + JSON.parse(data.location).coordinates[0] + '</p> ';
    eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="Lat_show">' + "纬度：" + JSON.parse(data.location).coordinates[1] + '</p> ';
    // eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="height_show">' + "高度：" + data.height + 'm</p> ';
    // eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="course_show">' + "航向角：" + data.heading + '</p> ';
    // eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="groundSpeed_show">' + "地速：" + data.groundspeed + 'km/h</p> ';
    // eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="riseFallRate_show">' + "上升/下移率：" + data.verticalrate + '</p> ';
    eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="upAirport_show">' + "起飞机场：" + data.depap + '</p> ';
    eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" id="downAirport_show">' + "降落机场：" + data.arrap + '</p> ';
    eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '机型：' + data.aircarft_type_plan + '</p></div>';
    eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '运输类型：' + data.transport_type + '</p></div>';
    eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '所属公司：' + data.ch_name + '</p></div>';
    eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '起飞时间：' + data.start_time + '</p></div>';
    eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '降落时间：' + data.end_time + '</p></div>';
    eq_popupContent += '</div>';
    // Populate the popup and set its coordinates
    // based on the feature found.
    Mapbox.popup
      .setLngLat(coordinates)
      .setHTML(eq_popupContent)
      .addTo(_this.map);
  },
  addAirPlane(data, id) {
    console.log(data)
    let _this = this;
    if (this.map.getSource(id)) {
      this.map.getSource(id).setData(data);
    } else {
      this.map.loadImage("./static/img/airplane_2_03.png", function (error, image) {
        if (error) throw error;
        if (!_this.map.hasImage('getairplane')) _this.map.addImage('getairplane', image);
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
            "icon-rotate": {
              "type": "identity",
              "property": "heading"
            },

            "icon-image": "getairplane",
          }
        })
        var fn = function (e) {

          if (e.type == "touchstart" && event.touches.length < 2) {
            _this.addAirPlanePoper(e);
          } else if (e.type == "click") {
            _this.addAirPlanePoper(e);
          }
        }
        _this.map.on('click', id, fn)
        _this.map.on('touchstart', id, fn)

      });
    }
  },
  remove: function () {
    Mapbox.remove("getAirport")
    Mapbox.remove("getAirplane")
  }
}
