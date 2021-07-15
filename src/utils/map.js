import lodash from 'lodash';
import mapboxgl from 'mapbox-gl'
import urlPath from '../api/path'
import api from '../api/index'
import layerManager from './layerManager'
import {
  addLineByWFS
} from "@/utils/XMLLoad"
export default {
  //全局函数1
  map: '',

  //鼠标事件
  MouseEvent: '',
  drawHelper: "",
  // 地图上已经加载的source
  sources: [],
  // 地图上已经加载的layer
  layers: [],
  // 地图上的marker
  markers: [],
  popup: new mapboxgl.Popup(),
  eventKey: '',
  mapInfoPopup: null,
  beforeMap: '',
  compare: '',
  //一下为3维地图变量 start
  MapServerLayers: [],
  IconData: null,
  Iconhandler: null,
  map2D_map3D_show: false,
  thematicMapLayer: "",
  iconLayer: [],
  key: null,
  draw: null,
  // 初始化地图
  initMap: function (mapObj, callback) {
    const {
      center = [116.40769, 39.89945], divId = 'map', zoom = 4, key = false
    } = mapObj;
    //$('#' + divId).empty();

    let map = new mapboxgl.Map({
      container: divId,
      center: center,
      zoom: zoom,
      // style: {
      //   "version": 8,
      //   "bearing": 0,
      //   "pitch": 0,
      //   "sources": {
      //     "raster-tiles": {
      //       "type": "raster",
      //       "tiles": ['http://c.tile.openstreetmap.org/{z}/{x}/{y}.png'],
      //       "tileSize": 256
      //     }
      //   },
      //   "layers": [{
      //     "id": "simple-tiles",
      //     "type": "raster",
      //     "source": "raster-tiles",
      //     "minzoom": 0,
      //     "maxzoom": 18
      //   }],

      // },
      dragRotate: false,
      //touchRotate:false,
      // touchZoomRotate:false,
    });
    this.map = map;
    this.map.touchZoomRotate.disableRotation();
    this.draw = new MapboxDraw();
    this.map.addControl(this.draw);
    this.map.on("load", () => {
      let FirstP = {
        id: "first",
        type: "symbol",
        source: {
          "type": "geojson",
          "data": {
            "type": "FeatureCollection",
            "features": []
          }
        }
      };
      this.map.addLayer(FirstP);
    })
    let url = urlPath.wfs.china;
    this.initImage();
    this.initLayer();
    addLineByWFS(url, this, "china");

    // debugger
    if (callback && typeof callback == 'function') this.callback = callback
  },
  initImage(){
    let _this = this;
    this.map.loadImage("./static/img/my.png", function (error, image) {
      if (error) throw error;
      if (!_this.map.hasImage('myairport')) _this.map.addImage('myairport', image);
    })
    this.map.loadImage("./static/img/jmhy.png", function (error, image) {
      if (error) throw error;
      if (!_this.map.hasImage('jmhyairport')) _this.map.addImage('jmhyairport', image);
    })
    this.map.loadImage("./static/img/jy.png", function (error, image) {
      if (error) throw error;
      if (!_this.map.hasImage('jyairport')) _this.map.addImage('jyairport', image);
    }) 
    this.map.loadImage("./static/img/point.png", function (error, image) {
      if (error) throw error;
      if (!_this.map.hasImage('airpoint')) _this.map.addImage('airpoint', image);
    })
  },
  initLayer() {
    layerManager.map = this.map;
    layerManager.addCenterLayer()
    // layerManager.sectorByRegion()
    layerManager.airLineByRegion()
  },
  ZoomOut() {
    this.map.zoomOut();
  },
  //缩小
  ZoomIn() {
    this.map.zoomIn();
  },
  addGridTileLayer(id) {
    let _this = this;
    _this.map.addLayer({
      type: "raster",
      id: id,
      source: {
        "type": "raster",
        tiles: ["http://r.wuduoyun.net:8090/iserver/services/map-aviation_access/rest/maps/%E8%88%AA%E7%A9%BA%E9%80%9A%E8%BE%BE%E5%BA%A6%E7%83%AD%E5%8A%9B%E5%9B%BE/zxyTileImage.png?x={x}&y={y}&z={z}"],
        "tileSize": 256
      }
    },'imageLayer')

  },
  addIconByairport(data, id, vue) {
    let _this = this;
    if (_this.map.hasImage('myairport')){
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
          "icon-image":{
            "type": "identity",
            "property": "airportIcon"
          },
        }
      });
    } 

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

    if (id === "testairport" || id === "oneAirport") {
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
                    <td>${res.height}m</td>
                  </tr>
                  <tr>
                    <td>建设年份</td>
                    <td>${res.built_year}</td>
                  </tr>
                  <tr>
                    <td>最长跑道长度</td>
                    <td>${res.val_long_rwy}m</td>
                  </tr>
              
                </table>
                <div style="text-align:center;margin:5px 0">
                    <button id="details" style="padding:5px 15px;border:1px solid #fff;color:#000;border-radius:4px">查看详情</button>
                </div>
                `;
        _this.popup
          .setLngLat(coordinates)
          .setHTML(eq_popupContent)
          .addTo(_this.map);
        let button = document.getElementById("details")
        button.addEventListener("click", () => {
          vue.showAirportDetails(data);
        })
      }
      vue.airportTxt(data, callback)
    } else {
      eq_popupContent += '<div style="background-color:#ffffff00;text-align: left;">';
      eq_popupContent += '<div style="background-color:#6669;color:#fff;padding:3px 2px;">属性信息</div>'
      eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '名称：' + data.name + '</p> ';
      // eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '名称：' + name + '</p> ';
      eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '经度：' + data.longitude + '</p> ';
      eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + "纬度：" + data.latitude + '</p> ';

      eq_popupContent += '</div>';

      _this.popup
        .setLngLat(coordinates)
        .setHTML(eq_popupContent)
        .addTo(_this.map);
    }
    // Populate the popup and set its coordinates
    // based on the feature found.
  },
  addAirportDetails(lng, lat, pro, vue,id) {
    let point = turf.point([lng, lat], pro);
    let geojson = turf.featureCollection([point]);
    this.addIconByairport(geojson, id, vue);
    this.map.setCenter([lng, lat])
    this.map.setZoom(9)
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
    }, "centerLayer")
    var fn = function (e) {
      if (e.type == "touchstart" && event.touches.length < 2) {
        _this.addFillPoper(e);
      } else if (e.type == "click") {
        _this.addFillPoper(e);
      }
    }
    _this.map.on('click', id, fn)
    _this.map.on('touchstart', id, fn)
  },
  addElementAirPlane(callsign, datetime) {
    let _this = this;
    api.get(urlPath.airplane.flightDetailInfo, {
      callsign: callsign,
      datetime: datetime
    }).then(res => {
      let _data = res;
      let coordinates = [Number(_data.longitude), Number(_data.latitude)];
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
      _this.popup
        .setLngLat(coordinates)
        .setHTML(eq_popupContent)
        .addTo(_this.map);
    })
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
    this.addElementAirPlane(data.callsign, data.datetime);
  },
  //宏观扇区
  addSectorCongestion(data, id) {
    if (this.map.getSource(id)) {
      this.map.getSource(id).setData(data);
    } else {
      this.map.addLayer({
        source: {
          type: "geojson",
          data: data
        },
        id: id,
        type: "fill",
        paint: {
          "fill-opacity": 0.6,
          "fill-color": {
            "type": "identity",
            "property": "valueColor"
          },
          "fill-outline-color":"#000"
        }
      },"centerLayer")
    }
  },
  addAirrouteCongestionPoper(e) {
    let _this = this;
    console.log(e);
    _this.map.getCanvas().style.cursor = 'pointer';
    var features = e.features;
    var coordinates = [e.lngLat.lng, e.lngLat.lat];
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    const levels = ["基本畅通", "轻度拥堵", "中度拥堵", "高度拥堵"]
    let data = features[0].properties;
    let eq_popupContent = "";
    eq_popupContent += '<div style="color:#fff;text-align: left;">';
    eq_popupContent += '<div style="background-color:#6669;color:#fff;padding:3px 2px;">属性信息</div>'
    eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" >' + '航路段号：' + data.airroute_ident + '</p> ';
    eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;">' + '航路名称：' + data.airroute_name + '</p> ';
    eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" >' + "飞机数量：" + data.count + '</p> ';
    eq_popupContent += '<p style="padding-left: 5px;font-weight: 500;" >' + "拥挤程度：" + levels[Number(data.level) - 1] + '</p> ';
    eq_popupContent += '</div>';

    _this.popup
      .setLngLat(coordinates)
      .setHTML(eq_popupContent)
      .addTo(_this.map);
  },
  addAirrouteCongestion(data, id) {
    let _this = this;
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
          "line-opacity": 0.5,
          "line-width": 3,
          "line-color": {
            "type": "identity",
            "property": "valueColor"
          }
        }

      },'centerlineLayer');
      var fn = function (e) {
        if (e.type == "touchstart" && event.touches.length < 2) {
          _this.addAirrouteCongestionPoper(e);
        } else if (e.type == "click") {
          _this.addAirrouteCongestionPoper(e);
        }

      }
      _this.map.on('click', id, fn)
      _this.map.on('touchstart', id, fn)

    }

  },
  addGroundAircraft(data, datetime) {
    let _this = this;
    this.remove();

    function getid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    for (let i = 0; i < data.length; i++) {
      let _feature = data[i];
      // let _properties =  _feature.properties;
      if (_feature.positon.coordinates) {
        let _coordinates = _feature.positon.coordinates;
        let domid = "chart" + getid();
        let dom = document.createElement('div');
        dom.style.width = 20 + "px";
        dom.style.height = 80 + "px";
        this.markers.push(new mapboxgl.Marker({
          element: dom,
        }).setLngLat(_coordinates).addTo(_this.map));


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
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
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
            data: [datetime]
          }],
          yAxis: [{
            axisLabel: {
              show: false,
              margin: 0
            },
            show: false,
            type: 'value'
          }],
          series: []
        };


        var newArr = [];
        //使用set进行数组去重
        newArr = [...new Set(_feature.flights)];
        var newarr2 = new Array(newArr.length);
        for (var t = 0; t < newarr2.length; t++) {
          newarr2[t] = 0;
        }
        for (var p = 0; p < newArr.length; p++) {
          for (var j = 0; j < _feature.flights.length; j++) {
            if (newArr[p].code_group_plan == _feature.flights[j].code_group_plan) {
              newarr2[p]++;
            }
          }
          // _properties.flights[index].code_group_plan
          // _properties.flights[index].transport_type_plan

        }
        let _newArr = [];
        for (var m = 0; m < newArr.length; m++) {
          //console.log(newArr[m].code_group_plan + "重复的次数为：" + newarr2[m]);
          newArr[m].number = newarr2[m];
          let _index = _newArr.findIndex((item) => {
            return newArr[m].code_group_plan == item.code_group_plan
          })
          if (_index == -1) {
            _newArr.push(newArr[m])
          }
        }
        console.log(_newArr);
        for (let index = 0; index < _newArr.length; index++) {
          let tempseries = {
            name: _newArr[index].code_group_plan + _newArr[index].transport_type_plan,
            type: 'bar',
            label: {
              show: true,
              color: "#000",
              formatter: '{c}  {name|{a}}',
              position: "top",
              fontSize: 8,
              align: "left",
              rotate: 90,
              rich: {
                name: {
                  fontSize: 8,

                }
              }
            },
            data: [_newArr[index].number]
          };
          if (index == 0) tempseries.barGap = 0;
          option.series.push(tempseries);

        }
        dom.style.width = _newArr.length * 10 + "px";
        let myChart = echarts.init(dom);
        myChart.setOption(option);
      } else {
        continue
      }

    }
  },
  //添加起降率分析
  addAirportTakeoffandLandingRate(data, id) {
    let _this = this;
    this.remove();

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
      if (_properties.takeoff_num || _properties.landing_num) {
        let _coordinates = _feature.geometry.coordinates;
        let domid = "chart" + getid();
        let dom = document.createElement('div');
        dom.style.width = 20 + "px";
        dom.style.height = 40 + "px";
        this.markers.push(new mapboxgl.Marker({
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
              data: [_properties.takeoff_num]
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
              data: [_properties.landing_num]
            },

          ]
        };
        myChart.setOption(option);
      } else {
        continue
      }

    }
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
          "line-width": 2,
          "line-color": "green"
        }
      }, 'centerLayer')
    }
  },
  addWFSLineLayer(data, id) {
    this.map.addLayer({
      source: {
        type: "geojson",
        data: data
      },
      id: id,
      type: "line",
      paint: {
        "line-opacity": 1,
        "line-color": {
          "type": "identity",
          "property": "valueColor"
        },
        "line-width": 3
      }
    })
  },

  //添加单架航班
  addOnePlaneLayer(data, id) {
    let _this = this;
    let num = 0;
    let fn = function () {
      num++;
      _this.map.setFilter(id, [
        "all",
        [
          "==",
          "num",
          num
        ],
        ["==", "$type", "Point"]
      ]);
    };
    TimeProgress.myfun = fn;
    TimeProgress.invelData = 5;
    TimeProgress.unit = "Hours";
    //TimeProgress.setNewTime(data.features[0].properties.time, data.features[data.features.length - 1].properties.time);
    if (this.map.getSource(id)) {
      this.map.getSource(id).setData(data);
    } else {
      this.map.loadImage("./static/img/airplane1.png", function (error, image) {
        if (error) throw error;
        if (!_this.map.hasImage('airplane')) _this.map.addImage('airplane', image);
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

            "icon-image": "airplane",
          },
          "filter": ["all",
            [
              "in",
              "num",
              0
            ],
            ["==", "$type", "Point"]
          ]
        })
      })
    }



  },
  // 清空底图上的图层和操作
  clean() {
    if (this.map) {
      // 删除layers
      this.removeAllLayers()
      // 删除source
      this.removeAllSources()
      // 删除markers
      if (this.markers.length) {
        this.markers.forEach((item) => {
          item.remove()
        })
      }
      this.markers = []
      if (this.popup) this.popup.remove()
    }
  },
  // 重新加载底图
  reload(callback) {
    // if (this.map) this.map.remove() // 去除现有底图
    // const userEntity = vm.$store.state.userEntity
    // this.initMap(
    // 	{
    // 		mapUrl: vm.$store.state.basicMapUrl,
    // 		lon: Number(userEntity.longitude || 0),
    // 		lat: Number(userEntity.latitude || 0)
    // 	},
    // 	callback
    // )
  },
  remove: function (item) {
    if (this.map.getLayer(item)) {
      this.map.removeLayer(item)
      lodash.remove(this.layers, item)
    }
    if (this.map.getSource(item)) {
      this.map.removeSource(item)
      lodash.remove(this.sources, item)
    }
    if (this.markers.length) {
      this.markers.forEach((item) => {
        item.remove()
      })
    }
    this.markers = []
    if (this.popup) this.popup.remove()
  },
  removeLayers: function (item) {
    // 删除layers
    if (this.map.getLayer(item)) {
      this.map.removeLayer(item)
      lodash.remove(this.layers, item)
    }
  },
  removeSources: function (item) {
    if (this.map.getSource(item)) {
      this.map.removeSource(item)
      lodash.remove(this.sources, item)
    }
  },
  removeAllLayers: function () {
    const _this = this
    this.layers.forEach((item) => {
      _this.removeLayers(item)
      if (_this.map.hasImage(item)) _this.map.removeImage(item)
    })
  },
  removeAllSources: function () {
    const _this = this
    this.sources.forEach((item) => {
      _this.removeSources(item)
    })
  },


}
