<template>
  <!-- 操作面板 -->
  <div class="handlebars" v-if="$store.state.handlebars" style="color:white">
    <Tabs value="name1">
      <TabPane label="地图显示" name="name1">
        <div style="text-align:center;">
          <RadioGroup v-model="handlebars_map">
            <Radio style="font-size:14px" label="地图"></Radio>
            <Radio style="font-size:14px" label="黑底"></Radio>
            <Radio style="font-size:14px" label="白底"></Radio>
          </RadioGroup>
        </div>
        <ul class="layer_list_box">
          <li v-for="(item,index) in layer_list" :key="index">
            <i-switch v-model="item.switch" @on-change="change_map(item)" />
            <span style="margin-left:10px">{{item.name}}</span>
            <span class="select_color" v-if="item.name==='航路点'" v-show="false">
              <div
                v-for="(item, index) in hld_list"
                :key="index"
                :style="'background-color:'+item.color"
                @click="hld_index=index"
                :class="hld_index===index?'select':''"
              ></div>
            </span>
            <span class="select_color" v-if="item.name==='航路航线'" v-show="false">
              <div
                v-for="(item, index) in hlhx_list"
                :key="index"
                :style="'background-color:'+item.color"
                @click="hlhx_index=index"
                :class="hlhx_index===index?'select':''"
              ></div>
            </span>
          </li>
        </ul>
      </TabPane>
      <TabPane label="航班显示" name="name3">
        <div>
          航班实时位置信息
          <i-switch
            v-model="nowFlightStatus"
            @on-change="change_attribute('实时航班',nowFlightStatus)"
          />
        </div>
        <div>
          航班标志颜色
          <RadioGroup v-model="handlebars_flights">
            <Radio label="蓝色"></Radio>
            <Radio label="黄色"></Radio>
          </RadioGroup>
        </div>
        <div style="display:flex;align-items:center;margin:5px 0;">
          显示尾迹
          <i-switch v-model="waker_show" @on-change.stop="change_flights" />
          <Input v-model="waker" placeholder="1-60秒" style="width: 70px" :disabled="!waker_show" />秒尾迹
        </div>
        <div class="border">
          <span>航班标签显示属性</span>
          <table>
            <tr>
              <td>
                <i-switch
                  v-model="flightNumber_show"
                  @on-change="change_attribute('航班号',flightNumber_show)"
                />航班号
              </td>
              <td>
                <i-switch v-model="ICOA_show" @on-change="change_attribute('ICOA',ICOA_show)" />ICOA
              </td>
            </tr>
            <tr>
              <td>
                <i-switch v-model="height_show" @on-change="change_attribute('高度',height_show)" />高度
              </td>
              <td>
                <i-switch v-model="lonLat_show" @on-change="change_attribute('经纬度',lonLat_show)" />经纬度
              </td>
            </tr>
            <tr>
              <td>
                <i-switch
                  v-model="groundSpeed_show"
                  @on-change="change_attribute('地速',groundSpeed_show)"
                />地速
              </td>
              <td>
                <i-switch v-model="course_show" @on-change="change_attribute('航向',course_show)" />航向
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <i-switch
                  v-model="riseFallRate_show"
                  @on-change="change_attribute('上升/下降率',riseFallRate_show)"
                />上升/下降率
              </td>
            </tr>
            <tr>
              <td>
                <i-switch
                  v-model="upAirport_show"
                  @on-change="change_attribute('起飞机场',upAirport_show)"
                />起飞机场
              </td>
              <td>
                <i-switch
                  v-model="downAirport_show"
                  @on-change="change_attribute('降落机场',downAirport_show)"
                />降落机场
              </td>
            </tr>
          </table>
        </div>
      </TabPane>
    </Tabs>
    <airportDetails ref="airportResultDetails"></airportDetails>
  </div>
</template>
<script>
import { addLineByWFS } from "@/utils/XMLLoad";
import flightTeack from "@/utils/flightTrack";
import airportDetails from "../planeMenu/airportDetails";
import layerManager from "@/utils/layerManager";
import airportMap from '@/utils/planeMenu/airport'
export default {
  components: {
    airportDetails,
  },
  data() {
    return {
      handlebars_map:this.$store.state.mapstatus,
      handlebars_flights: "黄色",
      waker_show: false,
      waker: 60,
      layer_list: [
        { name: "国界", switch: this.$store.state.cuntry_module },
        { name: "省界", switch: this.$store.state.pro_module },
        { name: "机场", switch: this.$store.state.airport_module },
        { name: "飞行情报区", switch: this.$store.state.infor_module },
        { name: "管制区", switch: this.$store.state.CAT_module },
        { name: "扇区", switch: this.$store.state.crowding_module },
        { name: "航路点", switch: this.$store.state.airland_module},
        { name: "航路航线", switch: this.$store.state.airline_module },
        { name: "时间轴", switch: this.$store.state.time_module },
      ],
      nowFlightStatus: this.$store.state.nowFlightStatus,
      flightDisplay_show: true,
      flightNumber_show: true,
      ICOA_show: true,
      height_show: true,
      lonLat_show: true,
      groundSpeed_show: true,
      course_show: true,
      riseFallRate_show: true,
      upAirport_show: true,
      downAirport_show: true,
      hld_index: -1,
      hld_list: [
        {
          color: "#ff9f00",
        },
        {
          color: "#a0ff00",
        },
        {
          color: "#ff9ff0",
        },
      ],
      hlhx_index: 0,
      hlhx_list: [
        {
          color: "#005f00",
        },
        {
          color: "#00dfff",
        },
        {
          color: "#555555",
        },
      ],
    };
  },
  watch: {
    handlebars_map(val) {
      switch (val) {
        case "地图":
          this.$store.state.mapstatus = '地图';
          if (this.map.map.getLayer("simple-tiles")) {
            this.map.map.setLayoutProperty(
              "simple-tiles",
              "visibility",
              "visible"
            );
          } else {
            this.map.map.addLayer({
              id: "simple-tiles",
              type: "raster",
              source: {
                type: "raster",
                tiles: ["http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"],
                tileSize: 256,
              },
              minzoom: 0,
              maxzoom: 18,
            });
            this.map.map.moveLayer("simple-tiles", "imageLayer");
          }
          break;
        case "白底":
          this.$store.state.mapstatus = '白底';
          this.map.map.setLayoutProperty("simple-tiles", "visibility", "none");
          document.getElementById("map").style.backgroundColor = "#fff";
          break;
        case "黑底":
          this.$store.state.mapstatus = '黑底';
          this.map.map.setLayoutProperty("simple-tiles", "visibility", "none");
          document.getElementById("map").style.backgroundColor = "#000";
          break;
        default:
          break;
      }
    },
  },
  methods: {
    change_flights() {},
    change_attribute(name, type) {
      console.log(type);
      switch (name) {
        case "实时航班":
          this.$store.state.nowFlightStatus = type
          if (type) {
            flightTeack.start();
          } else {
            flightTeack.remove();
          }
          break;
        case "航班号":
          if (type) {
            document.getElementById("flightNumber_show").style.display =
              "block";
          } else {
            document.getElementById("flightNumber_show").style.display = "none";
          }
          break;
        case "ICOA":
          break;
        case "高度":
          if (type) {
            document.getElementById("height_show").style.display = "block";
          } else {
            document.getElementById("height_show").style.display = "none";
          }
          break;
        case "经纬度":
          if (type) {
            document.getElementById("lon_show").style.display = "block";
            document.getElementById("Lat_show").style.display = "block";
          } else {
            document.getElementById("lon_show").style.display = "none";
            document.getElementById("Lat_show").style.display = "none";
          }
          break;
        case "地速":
          if (type) {
            document.getElementById("groundSpeed_show").style.display = "block";
          } else {
            document.getElementById("groundSpeed_show").style.display = "none";
          }
          break;
        case "航向":
          if (type) {
            document.getElementById("course_show").style.display = "block";
          } else {
            document.getElementById("course_show").style.display = "none";
          }
          break;
        case "上升/下降率":
          if (type) {
            document.getElementById("riseFallRate_show").style.display =
              "block";
          } else {
            document.getElementById("riseFallRate_show").style.display = "none";
          }
          break;
        case "起飞机场":
          if (type) {
            document.getElementById("upAirport_show").style.display = "block";
          } else {
            document.getElementById("upAirport_show").style.display = "none";
          }
          break;
        case "降落机场":
          if (type) {
            document.getElementById("downAirport_show").style.display = "block";
          } else {
            document.getElementById("downAirport_show").style.display = "none";
          }
          break;

        default:
          break;
      }
    },
    change_map(item) {
      switch (item.name) {
        case "国界":
           this.$store.state.cuntry_module = item.switch;
          if (item.switch) {
            this.addChinaLine();
          } else {
            this.map.remove("china");
          }

          break;
        case "省界":
           this.$store.state.pro_module = item.switch;
          if (item.switch) {
            this.addProvinceLine();
          } else {
            this.map.remove("province");
          }
          break;
        case "机场":
           this.$store.state.airport_module = item.switch;
          if (item.switch) {
            this.addAirPortByRegion();
          } else {
            this.map.remove("testairport");
          }
          break;
        case "飞行情报区":
           this.$store.state.infor_module = item.switch;
          if (item.switch) {
            this.flightInformationRegion();
          } else {
            this.map.remove("firRegion");
          }
          break;
        case "管制区":
           this.$store.state.CAT_module = item.switch;
          if (item.switch) {
            this.CAT();
          } else {
            this.map.remove("CAT");
          }
          break;
        case "扇区":
           this.$store.state.crowding_module = item.switch;
          if (item.switch) {
            this.sectorByRegion();
          } else {
            this.map.remove("sectorByRegion");
          }
          break;
        case "航路点":
           this.$store.state.airland_module = item.switch;
          if (item.switch) {
            this.airpointByRegion();
          } else {
            this.map.remove("airpointByRegion");
          }
          break;
        case "航路航线":
          this.$store.state.airline_module = item.switch;
          if (item.switch) {
            this.airLineByRegion();
          } else {
            this.map.remove("airLineByRegion");
          }
          break;
        case "时间轴":
          this.$store.state.time_module = item.switch;
          break;
        default:
          break;
      }
    },
    flightInformationRegion() {
      let colorPath = [
        "rgb(0, 255, 127)",
        "rgb(255, 255, 0)",
        "rgb(255, 0, 0)",
        "rgb(152, 245, 255)",
      ];
      let url = this.$urlPath.airplane.getFirRegion;
      this.$api.get(url).then((res) => {
        console.log(res);
        // var _features = [];
        for (var i = 0; i < res.features.length; i++) {
          // var wkbBuffer = new this.$Buffer(res[i].geom, "hex");
          // console.log(wkbBuffer);
          // var geometry = this.$wkx.Geometry.parse(wkbBuffer);
          // console.log(geometry.toGeoJSON());
          res.features[i].properties.valueColor = colorPath[i % 3];
          // var feature = turf.feature(geometry.toGeoJSON(), res[i]);
          // console.log(feature);
          // _features.push(feature);
        }
        this.map.addFillLayer(res, "firRegion");
      });
    },
    CAT() {
      // 展示中国境内的管制区
      layerManager.CAT();
    },
    sectorByRegion() {
      layerManager.sectorByRegion();
    },
    airpointByRegion() {
      // 展示中国境内的航路点
      let url = this.$urlPath.airplane.getAirpointByRegion;
      this.$api.get(url).then((res) => {
        var _features = [];
        for (var i = 0; i < res.length; i++) {
          var feature = turf.point([res[i].longtide, res[i].latitude], res[i]);
          _features.push(feature);
        }
        layerManager.addIconByairpoint(turf.featureCollection(_features),"airpointByRegion")
      
      });
    },
    airLineByRegion() {
      layerManager.airLineByRegion();
    },
    //全国机场展示
    addAirPortByRegion() {
      var _this = this;
      let url = this.$urlPath.airplane.getAirportByRegion;
      this.$api.get(url).then((res) => {
        var _features = [];
        for (var i = 0; i < res.length; i++) {
          if(res[i].using_type=="军民合用机场"){
              res[i].airportIcon = "jmhyairport"
          }else if(res[i].using_type=="民用机场"){
            res[i].airportIcon = "myairport"
          }else if(res[i].using_type=="军用机场"){
            res[i].airportIcon = "jyairport"
          }else{
            res[i].airportIcon = "myairport"
          }
          var feature = turf.point([res[i].longitude, res[i].latitude], res[i]);
          _features.push(feature);
        }
        // _this.map.addIconByairport(
        //   turf.featureCollection(_features),
        //   "testairport",
        //   this
        // );
        airportMap.addAllIconByairport(turf.featureCollection(_features),"testairport",this)
      });
    },
    //返回机场详细信息
    airportTxt(item, index) {
      this.$parent.$parent.$refs.airportDetails.airportTxt(item, index)
      //this.$refs.airportResultDetails.airportTxt(item, index);
    },
    showAirportDetails() {
      this.$parent.$parent.$refs.airportDetails.showAirportDetails();
    },
    addChinaLine() {
      let url = this.$urlPath.wfs.china;
      addLineByWFS(url, this.map, "china");
    },
    addProvinceLine() {
      let url = this.$urlPath.wfs.province;
      addLineByWFS(url, this.map, "province");
    },
  },
};
</script>>
<style scoped>
.handlebars {
  /* position: relative; */
  /* bottom: 160px; */
  /* left: 10px; */
  width: 230px;
  /* height: 310px; */
  padding: 10px;
  background-color: #5550;
  z-index: 1;
  text-align: left;
  /* font-size: 14px; */
}
.layer_list_box li {
  padding-top: 8px;
  display: flex;
  align-items: center;
}
.select_color {
  margin-left: 5px;
  display: flex;
}
.select_color div {
  width: 30px;
  height: 20px;
  margin-left: 5px;
}
.select {
  border: 2px solid #f00;
}
</style>

<style>
body  .ivu-btn-icon-only {
  padding: 5px 8px;
}
body  .ivu-tabs {
  color: white;
}
body  .ivu-tabs-nav .ivu-tabs-tab:hover {
  color: #0072ff;
}
</style>