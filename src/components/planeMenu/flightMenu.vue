<template>
  <div>
    <Drawer title="航班展示设置" v-model="childFlightDisplay">
      <div class="flightDisplay_box" @click.stop>
        <div class="flightDisplay_title" v-if="false">
          <span>航班展示设置</span>
          <!-- <div style="float: right;" @click="closeFlight">X</div> -->
        </div>
        <div class="flightDisplay_content">
          <i-switch v-model="flyFlights_show" @on-change="change_nowTime" />
          <span style="margin-left:10px">展示飞行航班情况</span>
          <div style="margin-top:10px">
            <Input v-model="planeNumvalue" placeholder="航班号或机尾号" style="width: 140px" />
            <Button type="success" @click="getOneAirPlane">搜索</Button>
          </div>
          <div style="margin-bottom:10px">
            <div style="margin:10px 0 5px;display:flex;justify-content: space-between;">
              <span>机型过滤</span>
              <Checkbox
                :indeterminate="indeterminate"
                :value="checkAll"
                @click.prevent.native="handleCheckAll"
              >全选</Checkbox>
            </div>
            <CheckboxGroup
              v-model="checkAllGroup"
              @on-change="checkAllGroupChange"
              style="display: flex;flex-wrap: wrap;"
            >
              <Checkbox label="318"></Checkbox>
              <Checkbox label="319"></Checkbox>
              <Checkbox label="320"></Checkbox>
              <Checkbox label="321"></Checkbox>
              <Checkbox label="330"></Checkbox>
              <Checkbox label="340"></Checkbox>
              <Checkbox label="350"></Checkbox>
              <Checkbox label="380"></Checkbox>
              <Checkbox label="737"></Checkbox>
              <Checkbox label="747"></Checkbox>
              <Checkbox label="757"></Checkbox>
              <Checkbox label="767"></Checkbox>
              <Checkbox label="777"></Checkbox>
              <Checkbox label="787"></Checkbox>
              <Checkbox label="其他">其他</Checkbox>
            </CheckboxGroup>
          </div>

          <p style="text-align: left;">客货类型过滤</p>
          <!-- <CheckboxGroup v-model="carry_type" style="margin-bottom:10px" > -->
          <Checkbox label="1" v-model="keyun" @on-change="getAirPlane(1)">客运</Checkbox>
          <Checkbox label="0" v-model="huoyun" @on-change="getAirPlane(0)">货运</Checkbox>
          <!-- </CheckboxGroup> -->
          <Row style="margin-top:8px">
            <i-col span="8">
              <i-switch v-model="groundFlights_show" @on-change="change_groundAircraft" />
            </i-col>
            <i-col span="16" style="margin-top:3px">展示地面航班情况</i-col>
          </Row>
          <!-- ground -->
        </div>
      </div>
    </Drawer>
  </div>
</template>
<script>
import dateFormatter from "@/utils/dateFormatter";
import flightTeack from '@/utils/flightTrack';
export default {
  props: {
    flightDisplay_show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      childFlightDisplay: this.flightDisplay_show,
      flyFlights_show: true,
      planeNumvalue: "",
      indeterminate: false,
      checkAll: false,
      checkAllGroup: [],
      airplaneDataTime: "2018/08/01 00:00:00",
      groundFlights_show: false,
      keyun: false,
      huoyun: false,
    };
  },
  computed: {
    listenplane() {
      return this.$store.state.plane;
    },
  },

  watch: {
    flightDisplay_show() {
      this.childFlightDisplay = this.flightDisplay_show;
      this.keyun = false;
      this.huoyun = false;
    },
    listenplane: function (old, newd) {
      if (old) {
        this.childFlightDisplay = false;
      }
    },
  },
  methods: {
    closeFlight() {
      this.childFlightDisplay = false;
      TimeProgress._mProgressTimer = false;
      this.map.remove("flightTrack" + 1);
      this.map.remove("flightTrack" + 0);
    },
    change_nowTime() {},
    getOneAirPlane() {
      console.log(this.planeNumvalue);
      console.log(this.airplaneDataTime);
      this.map.addElementAirPlane(this.planeNumvalue, this.airplaneDataTime);
    },
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.checkAllGroup = [
          "318",
          "319",
          "320",
          "321",
          "330",
          "340",
          "350",
          "380",
          "737",
          "747",
          "757",
          "767",
          "777",
          "787",
          "其他",
        ];
        this.addflightTrack();
      } else {
        this.map.remove("flightTrack" + 1);
        this.map.remove("flightTrack" + 0);
        this.checkAllGroup = [];
      }
    },
    checkAllGroupChange(data) {
      if (data.length === 15) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
      this.addflightTrack();
    },
    addNowFlight() {
      let times = dateFormatter("yyyy-MM-dd HH:mm:ss", new Date());
    },
    addflightTrack() {
      if (this.huoyun) {
        var params = {
          datetime: "2018-10-01 00:00:00",
          transport_type: 0,
          aircraft_code_type: this.checkAllGroup.toString(),
        };
        this.flightTrack(params);
      }
      if (this.keyun) {
        var params = {
          datetime: "2018-10-01 00:00:00",
          transport_type: 1,
          aircraft_code_type: this.checkAllGroup.toString(),
        };

        this.flightTrack(params);
      }
       this.$store.state.time_module = true;
    },
    getAirPlane(num) {
      console.log("getAirPlane");
      let times = dateFormatter("yyyy-MM-dd HH:mm:ss", new Date());
      if ((this.huoyun && num == 0) || (this.keyun && num == 1)) {
        var params = {
          datetime: times,
          transport_type: num,
          aircraft_code_type: this.checkAllGroup.toString(),
        };
        this.flightTrack(params);
      } else {
        this.map.remove("flightTrack" + num);
      }
    },
    //全国航班轨迹
    flightTrack(params) {
      var _this = this;
      var timecallback = function (item) {
        var nowTime = new Date(item);
        const {
          Year,
          Month,
          currentDate,
          Hours,
          Minutes,
          week,
          Seconds,
        } = TimeProgress.dateFormat(nowTime);
        console.log(params);
        params.datetime =
          Year +
          "-" +
          Month +
          "-" +
          currentDate +
          " " +
          Hours +
          ":" +
          Minutes +
          ":" +
          Seconds;
        _this.airplaneDataTime = params.datetime;
        if (_this.keyun) {
          params.transport_type = 1;
          _this.addAirPlane(params);
        }
        if (_this.huoyun) {
          params.transport_type = 0;
          _this.addAirPlane(params);
        }
        if (_this.groundFlights_show) {
          _this.addGroundAircraft();
        }
      };
      TimeProgress._speed = 1000;
      TimeProgress.invelData = 10 / 60;
      TimeProgress.myfun = timecallback;
      TimeProgress.unit = "Hours";
      TimeProgress.setNewTime("2018/10/01 00:00:00", "2018/10/02 00:00:00");
      this.addAirPlane(params);
    },
    addAirPlane(params) {
      let _this = this;
      let url = this.$urlPath.airplane.flightTrack;

      this.$api.get(url, params).then((res) => {
        for (var i = 0; i < res.features.length; i++) {
          res.features[i].properties.heading = Number(
            res.features[i].properties.heading
          );
        }
        flightTeack.addFlightTrack(res, "flightTrack" + params.transport_type);
      });
    },
    change_groundAircraft(item) {
      console.log(item);
      let _this = this;
      if (this.groundFlights_show) {
        this.addGroundAircraft();
      } else {
        this.map.remove();
      }
    },
    addGroundAircraft() {
      let _this = this;
      let _url = this.$urlPath.airplane.groundAircraft;
      let params = {
        datetime: _this.airplaneDataTime,
      };
      this.$api.get(_url, params).then((res) => {
        _this.map.addGroundAircraft(res, params.datetime);
      });
    },
  },
};
</script>

<style scoped>
.flightDisplay_box {
  /* position: absolute; */
  /* bottom: 80px; */
  /* left: 10px; */
  background-color: #5550;
  /* width: 180px; */
  color: white;
}
.flightDisplay_title {
  font-size: 16px;
  background-color: #555;
  padding: 2px 5px;
  justify-content: space-between;
}
.flightDisplay_content {
  padding: 10px;
}
</style>