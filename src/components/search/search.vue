<template>
  <div id="search">
    <div class="search" v-if="search_show">
      <div style="background-color:rgb(36,140,253);padding:10px;display:flex;padding-right:0">
        <van-field
          v-model="search_value"
          clearable
          :label="datelabel"
          left-icon="notes-o"
          placeholder="CA9898/9898/B9898/PEK/ZBAA"
          @click-left-icon="test"
          style="background-color:rgb(45,121,197);color:#fff;width:calc(100% - 30px)"
        />
        <button
          style="background-color:#fff0;border:none;width:60px;font-size:18px;text-algin:center"
          @click="close"
        >取消</button>
      </div>
      <ul class="search_list_box">
        <li @click="segment">
          <van-icon name="location-o" style="margin-right:10px" />按航段搜索
        </li>
        <li @click="airport">
          <van-icon name="hotel-o" style="margin-right:10px" @click="airport" />找机场
        </li>
        <div style="color:#ccc;padding:5px;font-size">试试这样搜索：PEK SHA/ZGGG/ ZBAA/北京到上海</div>
      </ul>
      <div v-if="false">
        <Collapse accordion>
          <Panel>
            航班查询
            <div slot="content">
              <Row :gutter="16">
                <i-col span="12">
                  <Select v-model="airportType">
                    <Option
                      v-for="item in selectType"
                      :value="item.value"
                      :key="item.value"
                    >{{ item.label }}</Option>
                  </Select>
                </i-col>
                <i-col span="12">
                  <Input v-model="airplaneNumber" placeholder="请输入" />
                </i-col>
              </Row>
              <br />
              <Row :gutter="16">
                <i-col span="12">
                  <Input v-model="departure" placeholder="起飞机场" />
                </i-col>
                <i-col span="12">
                  <Input v-model="landing" placeholder="降落机场" />
                </i-col>
              </Row>
              <br />
              <Button long @click="searchAirPlane('按起飞降落机场查询')">查询</Button>
            </div>
          </Panel>
          <Panel>
            机场查询
            <div slot="content">
              <Row :gutter="16">
                <i-col span="12">
                  <Select v-model="airportSelectType">
                    <Option
                      v-for="item in airportTypes"
                      :value="item.value"
                      :key="item.value"
                    >{{ item.label }}</Option>
                  </Select>
                </i-col>
                <i-col span="12">
                  <Input v-model="airportNumber" placeholder="请输入" />
                </i-col>
              </Row>
              <br />
              <Button long @click="searchAirport('按起航班查询')">查询</Button>
            </div>
          </Panel>
        </Collapse>
      </div>
    </div>
    <div class="search_plane" v-if="search_plane_show">
      <div v-for="(plane_attribute,index) in airplaneList" :key="index" v-show="plane_show.message">
        <div class="close">
          <div class="title">
            <div style="color:#fa0;font-size:25px">{{plane_attribute.callsign}}</div>
            <span style="font-size:14px">{{plane_attribute.aircraft_type_plan}}</span>
          </div>
          <Icon type="md-close" @click="close" style="font-size:38px" />
        </div>
        <img src="static/img/search_plane.jpg" style="width:100%;border-radius:4px" />
        <div class="airport_box">
          <div class="airport">
            <div>{{plane_attribute.depap}}</div>
            <span style="font-size:14px;color:#ccc">{{plane_attribute.start_time}}</span>
          </div>
          <Icon
            type="ios-plane"
            style="font-size:40px;position: absolute;top:15px;background-color:#555"
          />
          <div class="airport" style="border-left:1px solid #fff">
            <div>{{plane_attribute.arrap}}</div>
            <span style="font-size:14px;color:#ccc">{{plane_attribute.end_time}}</span>
          </div>
        </div>
        <div class="up_down_time">
          <table>
            <tr>
              <td>
                <span>计划起飞时间</span>
                <span>{{plane_attribute.start_time_plan}}</span>
              </td>
              <td>
                <span>实际起飞时间</span>
                <span>{{plane_attribute.start_time}}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span>计划降落时间</span>
                <span>{{plane_attribute.end_time_plan}}</span>
              </td>
              <td>
                <span>实际降落时间</span>
                <span>{{plane_attribute.end_time}}</span>
              </td>
            </tr>
          </table>
        </div>
        <Collapse v-model="value1">
          <Panel name="1">
            详细信息
            <div slot="content" class="detailedInformation">
              <!-- <div class="detailedInformation_icon"> -->
              <Icon type="md-plane" style="font-size:40px;color:#555" />
              <!-- </div> -->
              <table>
                <tr>
                  <td>
                    <span>航班号</span>
                    <p>{{plane_attribute.callsign}}</p>
                  </td>
                  <td>
                    <span>机型</span>
                    <p>{{plane_attribute.aircarft_type_plan}}</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span>状态</span>
                    <p>{{plane_attribute.status}}</p>
                  </td>
                  <td>
                    <span>客货类型</span>
                    <p>{{plane_attribute.transport_type}}</p>
                  </td>
                </tr>
                <tr v-if="plane_attribute.location">
                  <td>
                    <span>当前经度</span>
                    <p>{{plane_attribute.location.coordinates[0]}}</p>
                  </td>
                  <td>
                    <span>当前纬度</span>
                    <p>{{plane_attribute.location.coordinates[1]}}</p>
                  </td>
                </tr>
                <tr v-show="false">
                  <td colspan="2">
                    <span>路线</span>
                    <p>{{plane_attribute.route_plan}}</p>
                  </td>
                </tr>
              </table>
            </div>
          </Panel>
        </Collapse>
      </div>
      <Button style="margin-top:20px" @click="showFlightPlanList" long>全国航班飞行计划查询</Button>
      <div v-show="plane_show.trajectory">
        <div class="close">
          <div class="title">
            <div style="color:#fa0;font-size:25px"></div>
            <span style="font-size:14px"></span>
          </div>
          <Icon type="md-close" @click="close" style="font-size:38px" />
        </div>功能开发中...
      </div>
      <ul class="tabs" v-if="search_plane_show">
        <li
          @click="plane_show.trajectory=false;plane_show.message=true"
          :style="plane_show.message?'color:#0072ff':'color:#ccc'"
        >信息</li>
        <li
          @click="plane_show.message=false;plane_show.trajectory=true"
          :style="plane_show.trajectory?'color:#0072ff':'color:#ccc'"
        >航迹</li>
      </ul>
    </div>

    <div class="search_airport" v-if="search_airport_show">
      <div class="close">
        <div class="title">
          <div style="color:#fa0;font-size:25px">{{airport_attribute.cn_name}}</div>
          <div>
            <span style="font-size:14px">{{time}}</span>
            <Divider type="vertical" />
            <span style="font-size:14px">{{date}}</span>
            <Divider type="vertical" />
            <span style="font-size:14px">{{airport_attribute.company}}</span>
          </div>
        </div>
        <Icon type="md-close" @click="close" style="font-size:38px" />
      </div>
      <div v-if="airport_show.message">
        <img
          src="static/img/search_airport_.jpg"
          style="width:100%;border-radius:4px;margin-bottom:20px"
        />
        <ul class="weather">
          <li style="border-right:1px solid #fff">
            <span>天气</span>
            <span>
              <Icon type="md-sunny" />
            </span>
            <span>{{airport_attribute.weather}}</span>
          </li>
          <li style="border-right:1px solid #fff">
            <span>温度</span>
            <span>{{airport_attribute.temperature}}</span>
          </li>
          <li>
            <span>风向</span>
            <span>
              <Icon type="md-arrow-back" />
            </span>
            <span>{{airport_attribute.winddirection}} {{airport_attribute.windspeed}}</span>
          </li>
        </ul>
        <Collapse v-model="value1">
          <Panel name="1">
            起降率信息
            <div slot="content" class="detailedInformation">
              <!-- <div class="detailedInformation_icon"> -->
              <Icon type="md-pin" style="font-size:40px;color:#555" />
              <!-- </div> -->
              <table>
                <tr>
                  <td>
                    <span>起飞率</span>
                    <p>{{airport_attribute.departureNum}}</p>
                  </td>
                  <td>
                    <span>降落率</span>
                    <p>{{airport_attribute.arrivalNum}}</p>
                  </td>
                </tr>
              </table>
            </div>
          </Panel>
          <Panel name="2">
            运力信息
            <div slot="content" class="detailedInformation">
              <!-- <div class="detailedInformation_icon"> -->
              <Icon type="md-pin" style="font-size:40px;color:#555" />
              <!-- </div> -->
              <table>
                <tr v-for="item in airport_attribute.capacity">
                  <td>
                    <span>机型</span>
                    <p>{{item.type}}</p>
                  </td>
                  <td>
                    <span>运力</span>
                    <p>{{item.num}}</p>
                  </td>
                </tr>
              </table>
            </div>
          </Panel>
        </Collapse>
        <Button @click="showAirportDetails" long style="margin-top:20px">全国机场详情查阅</Button>
      </div>
      <div v-if="airport_show.reach">功能开发中...</div>
      <div v-if="airport_show.leave">功能开发中...</div>
      <div v-if="airport_show.flight">功能开发中...</div>
    </div>
    <ul class="tabs" v-if="search_airport_show">
      <li
        @click="airport_show={message:false,reach:false,leave:false,flight:false};airport_show.message=true"
        :style="airport_show.message?'color:#0072ff':'color:#ccc'"
      >信息</li>
      <li
        @click="airport_show={message:false,reach:false,leave:false,flight:false};airport_show.reach=true"
        :style="airport_show.reach?'color:#0072ff':'color:#ccc'"
      >到港</li>
      <li
        @click="airport_show={message:false,reach:false,leave:false,flight:false};airport_show.leave=true"
        :style="airport_show.leave?'color:#0072ff':'color:#ccc'"
      >离岗</li>
      <li
        @click="airport_show={message:false,reach:false,leave:false,flight:false};airport_show.flight=true"
        :style="airport_show.flight?'color:#0072ff':'color:#ccc'"
      >航班</li>
    </ul>
    <airportDetails ref="airportResultDetails"></airportDetails>
    <flightPlan ref="flightPlanList"></flightPlan>
    <segment></segment>
    <flightInformation></flightInformation>
    <show_calendar></show_calendar>
    <flightDetails></flightDetails>
    <moreMessage></moreMessage>
    <airportInformation ></airportInformation>
    <flightDisplay></flightDisplay>
  </div>
</template>

<script>
import airportDetails from "../planeMenu/airportDetails";
import flightPlan from "../planeMenu/flightPlan";
import dateFormatter from "@/utils/dateFormatter";
import searchResult from "@/utils/searchResult/searchResult";

import segment from "@/components/planeMenu/segment";
import flightInformation from "@/components/planeMenu/flightInformation";
import show_calendar from "@/components/planeMenu/show_calendar";
import flightDetails from "@/components/planeMenu/flightDetails";
import moreMessage from "@/components/planeMenu/moreMessage";
import airportInformation from "@/components/planeMenu/airportInformation";
import flightDisplay from "@/components/planeMenu/flightDisplay";
export default {
  components: {
    airportDetails,
    flightPlan,
    segment,
    flightInformation,
    show_calendar,
    flightDetails,
    moreMessage,
    airportInformation,
    flightDisplay,
  },
  data() {
    return {
      selectAtrportTxt:{},
      time: dateFormatter("HH:mm", new Date()),
      date: dateFormatter("MM月dd日", new Date()),
      airportType: "hbh",
      selectType: [
        { label: "航班号", value: "hbh" },
        { label: "机尾号", value: "jwh" },
      ],
      airplaneNumber: "",
      airportSelectType: "ICAO",
      airportTypes: [
        { label: "ICAO", value: "ICAO" },
        { label: "IATA", value: "IATA" },
      ],
      airportNumber: "",
      search_show: true,
      search_plane_show: false,
      search_airport_show: false,
      value1: [1, 2],
      search_value: "",
      departure: "",
      landing: "",
      flight: "",
      airport_attribute: {
        cn_name: "",
        company: "",
        controller: "",
        latitude: "",
        longitude: "",
        using_type: "",
        val_long_rwy: "",
        capacity: [],
        arrivalNum: "",
        departureNum: "",
        height: "",
        IATA: "",
        ICAO: "",
      },
      airplaneList: [
        {
          aircraft_code_plan: "",
          aircraft_code_real: null,
          aircarft_type_plan: "",
          aircraft_type_real: null,
          ch_name: "",
          arr_datetime_plan: "2018-10-21 01:38:00",
          end_time: "",
          arrap: "N/A",
          callsign: "",
          dep_datetime_plan: "2018-10-20 23:20:00",
          start_time: "",
          depap: "N/A",
          route_plan: "",
          route_real: null,
          transport_type: "",
        },
      ],
      plane_show: {
        message: true,
        trajectory: false,
      },
      airport_show: {
        message: true,
        reach: false,
        leave: false,
        flight: false,
      },
      datelabel:dateFormatter("MM-dd",new Date(this.$store.state.search.date))
    };
  },
  methods: {
    close() {
      this.$store.state.searchShow = false;
      this.search_show = true;
      this.search_plane_show = false;
      this.search_airport_show = false;
      searchResult.remove();
    },
    search(key) {
      console.log(this.search_value);
      if (this.search_value == "") {
        this.$Message.error("搜索信息为空");
        return;
      }
      // this.search_show = false;
      let param = {
        queryStr: this.search_value,
      };
      let _this = this;
      let url = this.$urlPath.airplane.queryByCallsignOrIdent;
      this.$api.get(url, param).then((res) => {
        console.log(res);
        if (res.length > 0) {
          _this.search_show = false;
          _this.search_plane_show = true;
          let result = res[0];
          _this.airplaneList = res;
          if (result) {
            //searchResult.addAirPlaneDetails(result);
          }
        } else {
          _this.$Message.error("没有找到");
        }
      });
    },
    showFlightPlanList() {
      this.$refs.flightPlanList.show();
    },
    //返回机场详细信息
    airportTxt(item, index) {
      this.$refs.airportResultDetails.airportTxt(item, index);
    },
    showAirportDetails() {
      this.$refs.airportResultDetails.showAirportDetails();
    },
    searchAirport() {
      (this.time = dateFormatter("HH:mm", new Date())),
        (this.date = dateFormatter("MM月dd日", new Date()));

      let param = {
        datetime: "2018-10-29 12:12:12",
      };
      if (this.airportSelectType == "ICAO") {
        param.ICAO = this.airportNumber;
      } else {
        param.IATA = this.airportNumber;
      }
      let _this = this;
      let url = this.$urlPath.airplane.getAirportByXX + this.airportSelectType; //getAirportByIATA
      this.$api.get(url, param).then((res) => {
        console.log(res);
        if (res.length > 0) {
          _this.search_show = false;
          _this.search_airport_show = true;
          let result = res[0];
          _this.airport_attribute = Object.assign(
            _this.airport_attribute,
            res[0]
          );
          searchResult.addAirportDetails(
            res[0].longitude,
            res[0].latitude,
            res[0],
            _this
          );
        } else {
          _this.$Message.error("没有找到");
        }
      });
    },
    searchAirPlane() {
      let param = {
        callsign: this.airplaneNumber,
        depap: this.departure,
        arrap: this.landing,
        datetime: "2018-10-29 20:19:00",
      };
      let _this = this;
      let url = this.$urlPath.airplane.getAirportList;
      this.$api.get(url, param).then((res) => {
        console.log(res);
        if (res.length > 0) {
          _this.search_show = false;
          _this.search_plane_show = true;
          let result = res[0];
          _this.airplaneList = res;
          if (result) {
            searchResult.addAirPlaneDetails(result);
          }
        } else {
          _this.$Message.error("没有找到");
        }
      });
    },
    test() {
      this.$store.state.show_calendar = true;
      console.log(this.$store.state.show_calendar);
    },
    // 按航段搜索
    segment() {
      this.$store.state.segment_show = true;
    },
    // 找机场
    airport() {
      this.$store.state.airport.show = true;
      this.$store.state.airport.value = 0;
    },
  },
  mounted() {
    //this.$refs["autofocus"].$refs["input"].focus();
  },
 computed: {
    selectDate() {
      return this.$store.state.search.date;
    },
  },
  watch: {
    selectDate(val) {
      console.log(val);
      if (val) {
        this.datelabel = dateFormatter("MM-dd",new Date(this.$store.state.search.date));
      } else {
        return;
      }
    },
  },
 
};
</script>

<style scoped>
#search {
  width: 500px;
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 10;
  background-color: #555;
  color: #fff;
  overflow-y: hidden;
}
.search_list_box {
  /* border-bottom: 1px solid #ccca; */
}
.search_list_box li {
  border-bottom: 1px solid #ccc5;
  padding: 10px;
  font-size: 18px;
}
.close {
  /* position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  font-size: 38px; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.search_input {
  width: calc(100% - 40px);
}
.airport_box {
  font-size: 22px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  border: 1px solid #fff;
  border-radius: 4px;
  margin: 20px 0;
}
.airport {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 50%;
  padding: 10px;
}
.detailedInformation {
  display: flex;
  align-items: stretch;
}
.detailedInformation_icon {
  height: 100%;
  background: #555;
  padding: 5px;
}
.detailedInformation table {
  width: 100%;
  height: 100%;
}
.detailedInformation table td {
  padding: 5px;
  border-bottom: 1px solid #555;
}
.detailedInformation table td span {
  font-size: 12px;
  color: #ccc;
}
.detailedInformation table td p {
  font-size: 14px;
}
.title {
  display: flex;
  flex-direction: column;
}
.up_down_time {
  width: 100%;
  margin-bottom: 15px;
}
.up_down_time table {
  width: 100%;
}
.up_down_time table tr {
  display: flex;
}
.up_down_time table td {
  background-color: #fff;
  border-bottom: 4px solid #555;
  color: #999;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 50%;
}
.up_down_time table tr td:nth-child(1) {
  border-right: 4px solid #555;
}
.up_down_time table td span:nth-child(2) {
  font-size: 16px;
  font-weight: bold;
  color: #666;
}
.tabs {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 400px;
  display: flex;
  justify-content: space-around;
  background-color: #555;
}
.tabs li {
  height: 30px;
  display: flex;
  align-items: center;
}
.weather {
  width: calc(100%);
  display: flex;
  justify-content: space-around;
  padding: 1px;
  margin-bottom: 20px;
}
.weather li {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 10px;
}
.weather li span {
  margin-bottom: 0px;
  font-size: 16px;
}
.weather li span:nth-child(2) {
  margin-bottom: 0px;
  font-size: 40px;
}
</style>

<style>
#app .van-field__label {
  width: auto;
  color: #fff;
}
#app .van-field__control {
  color: #fff;
}
#app .van-cell::after{
  content: none;
}
</style>