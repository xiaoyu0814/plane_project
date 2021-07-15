<template>
  <div id="planeMenu">
    <ul class="plane_data_list" v-if="false">
      <li v-for="(item, index) in data_list" :key="index">
        {{item.name}}
        <div
          v-for="(children_item, children_index) in item.children"
          :key="children_index"
          @click.stop="select_data(children_item, children_index)"
          :style="data_index===children_item.id?'background-color:#0072ff':'background-color:#5550'"
        >
          <Poptip placement="right" style="width:100%" :disabled="children_item.Poptip">
            {{children_item.name}}
            <div slot="content">
              <div class="crowdingDegree_set" v-if="children_item.name==='扇区拥挤度评估'" @click.stop>
                <div class="flightDisplay_title">扇区拥挤度评估所考虑因子</div>
                <div class="flightDisplay_content crowdingDegree_content">
                  <div>
                    <i-switch v-model="aircraft_number" @on-change="change_nowTime" />航空器数量
                  </div>
                  <div>
                    <i-switch v-model="aircraft_density" @on-change="change_nowTime" />航空器密度
                  </div>
                  <div>
                    <i-switch v-model="aircraft_Proximity" @on-change="change_nowTime" />航空器接近度
                  </div>
                  <div>
                    <i-switch v-model="aircraft_disorder" @on-change="change_nowTime" />航空器航向无序度
                  </div>
                  <div>
                    <i-switch v-model="aircraft_variance" @on-change="change_nowTime" />航空器地速方差
                  </div>
                  <div>
                    <i-switch v-model="aircraft_average" @on-change="change_nowTime" />航空器升降率绝对值均值
                  </div>
                  <div>
                    <i-switch v-model="aircraft_conflict" @on-change="change_nowTime" />航空器潜在冲突数量
                  </div>
                  <div>
                    <i-switch v-model="bad_weather" @on-change="change_nowTime" />恶劣天气影像范围占比
                  </div>
                </div>
              </div>
            </div>
          </Poptip>
        </div>
      </li>
    </ul>
    <ul class="plane_data_list" v-if="$store.state.nav_value==='监视'">
      <li
        v-for="(item, index) in $store.state.monitorData_list"
        :key="index"
        @click.stop="select_data(item, index)"
        :style="item.id==$store.state.data_index?'background-color:#fff5':'background-color:#fff0'"
      >{{item.name}}</li>
    </ul>
    <ul class="plane_data_list" v-if="$store.state.nav_value==='评估'">
      <li
        v-for="(item, index) in $store.state.assessmentData_list"
        :key="index"
        @click.stop="select_data(item, index)"
        :style="item.id==$store.state.data_index?'background-color:#fff5':'background-color:#fff0'"
      >{{item.name}}</li>
    </ul>
    <ul class="plane_data_list" v-if="$store.state.nav_value==='统计'">
      <li
        v-for="(item, index) in $store.state.statisticsData_list"
        :key="index"
        @click.stop="select_data(item, index)"
        :style="item.id==$store.state.data_index?'background-color:#fff5':'background-color:#fff0'"
      >{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      tableHeight: 200,
      tableWidth: 1000,
      flightPlan_show: false,
      flightDisplay_show: false,
      data_index: this.$store.state.data_index,
      data_list: [],
      flyFlights_show: true,
      flight_show: true,
      aircraft_number: true,
      aircraft_density: true,
      aircraft_Proximity: true,
      aircraft_disorder: true,
      aircraft_variance: true,
      aircraft_average: true,
      aircraft_conflict: true,
      bad_weather: true,
      monitorData_list: [
        {
          name: "全国航班监视",
          value: "",
          icon_url: "",
          selection: false,
          Poptip: false,
          id: 1,
        },
        {
          name: "全国机场起降率监控",
          value: "",
          icon_url: "",
          selection: false,
          Poptip: true,
          id: 2,
        },
      ],
      assessmentData_list: [
        {
          name: "航路通达度评估",
          value: "",
          icon_url: "",
          selection: false,
          Poptip: true,
          id: 3,
        },
        {
          name: "扇区拥挤度评估",
          value: "",
          icon_url: "",
          selection: false,
          Poptip: true,
          id: 4,
        },
        {
          name: "航路拥挤度评估",
          value: "",
          icon_url: "",
          selection: false,
          Poptip: true,
          id: 5,
        },
      ],
      statisticsData_list: [
        {
          name: "全国运力统计",
          value: "",
          icon_url: "",
          selection: false,
          Poptip: true,
          id: 6,
        },
      ],
    };
  },
  computed: {
    listenshowpage1() {
      return this.$store.state.flightPlan_show;
    },
  },
  watch: {
    listenshowpage1(newd) {
      if (newd) {
        this.tableHeight = window.innerHeight - 175;
        this.tableWidth = window.innerWidth - 30;
        this.timePointListnNum();
        this.timePointList();
      }
    },
  },
  methods: {
    select_data(item, index) {
      this.$store.state.data_index === item.id
        ? (this.$store.state.data_index = -1)
        : (this.$store.state.data_index = item.id);
      item.selection = !item.selection;
      TimeProgress._mProgressTimer = false;
      // this.$store.state.route_crowdingDegree_legend = false;
      // this.$store.state.flyDropRate_legend = false;
      if (this.map.map.getLayer("oneAirport")) {
        this.map.remove("oneAirport");
      }
     
      this.$emit('change',item);
      this.$store.state.nav_value = false;
    },
    clearSelect(){

    },
    clase(item) {
      this.$store.state.flightPlan_show = false;
      this.airportDetails_show = false;
      if (this.data_index !== -1) {
        this.data_list[2].children[0].selection = false;
        this.data_index = -1;
      }
      let str = item.coordinate.replace("N", "");
      let arr = str.split("E");
      var feature = turf.point([arr[1] / 10000, arr[0] / 10000], item);
      console.log(feature);
      let _features = [];
      _features.push(feature);
      this.map.addIconByairport(
        turf.featureCollection(_features),
        "oneAirport",
        this
      );
    },

    addHeatMapLayer() {
      this.map.addGridTileLayer("heatmap");
    },
    //返回机场详细信息
    airportTxt(item, index) {
      let url = this.$urlPath.airplane.getAirportTxt;
      let param = {
        airport: item.name || item.cn_name,
      };
      this.$api.get(url, param).then((res) => {
        if (res.length > 0) {
          this.airportDetails = res[0];
          if (typeof index === "function") {
            index(res[0]);
          }
        }
      });
    },
    showFlightPlanList() {
      this.$refs.flightPlanList.show();
    },
    change_nowTime() {},
    //关闭扇区
    closeCrowding(item) {
      this.data_index = -1;
      this.data_list[1].children[1].selection = false;
    },
    //关闭运力
    closeCapacity(item) {
      this.data_index = -1;
      this.data_list[2].children[0].selection = false;
    },
    //关闭单架航班
    closeOneAirplan(item) {
      this.data_index = -1;
    },
  },

  mounted() {
    var contW = $(".ivu-modal-content-drag").width();
    var contH = $(".ivu-modal-content-drag").height();
    var startX, startY, sX, sY, moveX, moveY, leftX, rightX, topY, bottomY;
    var winW = $(window).width();
    var winH = $(window).height();
    $(".ivu-modal-content-drag").on({
      //绑定事件
      touchstart: function (e) {
        startX = e.originalEvent.targetTouches[0].pageX; //获取点击点的X坐标
        startY = e.originalEvent.targetTouches[0].pageY; //获取点击点的Y坐标
        sX = $(this).offset().left; //相对于当前窗口X轴的偏移量
        sY = $(this).offset().top; //相对于当前窗口Y轴的偏移量
        leftX = startX - sX; //鼠标所能移动的最左端是当前鼠标距div左边距的位置
        rightX = winW - contW + leftX; //鼠标所能移动的最右端是当前窗口距离减去鼠标距div最右端位置
        topY = startY - sY; //鼠标所能移动最上端是当前鼠标距div上边距的位置
        bottomY = winH - contH + topY; //鼠标所能移动最下端是当前窗口距离减去鼠标距div最下端位置
      },
      touchmove: function (e) {
        e.preventDefault();
        //移动过程中XY轴的坐标要减去margin的距离
        moveX = e.originalEvent.targetTouches[0].pageX; //移动过程中X轴的坐标
        moveY = e.originalEvent.targetTouches[0].pageY; //移动过程中Y轴的坐标
        //判断的时候要计算加上padding的距离
        if (moveX < leftX) {
          moveX = leftX;
        }
        if (moveX > rightX) {
          moveX = rightX;
        }
        if (moveY < topY) {
          moveY = topY;
        }
        if (moveY > bottomY) {
          moveY = bottomY;
        }
        $(this).css({
          left: moveX + sX - startX,
          top: moveY + sY - startY,
        });
      },
    });
  },
};
</script>

<style scoped>
.plane_data_list {
  /* position: absolute; */
  /* bottom: 160px; */
  /* left: 10px; */
  padding: 5px;
  background-color: #5550;
  z-index: 100;
}
.plane_data_list li {
  padding: 4px 0px;
  font-size: 22px;
  color: #ccc;
  background-color: #5550;
  text-align: left;
  font-weight: bold;
}
.plane_data_list li div {
  text-align: left;
  text-indent: 5px;
  font-size: 18px;
  color: #fff;
  font-weight: normal;
  margin-top: 10px;
}

.crowdingDegree_set {
  background-color: #005b9d00;
  /* width: 180px; */
  color: white;
  z-index: 2;
  text-align: left;
  padding: 0 15px;
}
.crowdingDegree_content > div {
  margin-top: 5px;
}
</style>

<style>
body  .ivu-modal-content-drag {
  margin-left: -170px;
  left: 50%;
}
</style>