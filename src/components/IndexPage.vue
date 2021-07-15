<template>
  <div class="layout">
    <!-- 头部导航 -->
    <!-- <Layout style="height:100%">
      <Header class="layout_header animation" :class="$store.state.header?'after':'before'">
        <HeaderNav></HeaderNav>
      </Header>
      <Content style="height:calc(100%)" class="content">
        <router-view></router-view>
      </Content>
      <Footer class="animation" :class="$store.state.nav?'footAfter':'footBefore'">
        <Floor></Floor>
      </Footer>
    </Layout>-->
    <!-- 标题 -->
    <div class="layout_header animation" :class="$store.state.header?'after':'before'">
      <HeaderNav></HeaderNav>
    </div>
    <!-- 地图 -->
    <div class="content">
      <router-view></router-view>
    </div>
    <!-- 导航栏 -->
    <div class="layout_footer animation" :class="$store.state.nav?'footAfter':'footBefore'">
      <Floor></Floor>
      <div
        v-if="false"
        class="animation_switch"
        @click="animation_type=!animation_type;$store.state.nav=animation_type"
        style="background-color:#555;color:#fff"
      >
        <Icon :type="!animation_type?'md-arrow-dropleft':'md-arrow-dropright'" />
      </div>
    </div>
    <!-- 全屏按钮 -->
    <div
    · v-if="false"
      class="animation toolbar_right"
      :class="$store.state.contract?'right_after':'right_before'"
    >
      <!-- <ButtonGroup>
        <Button
          :icon="item.icon_url"
          v-for="(item, index) in rightToolbar_list"
          :key="index"
          @click="toolbar(item)"
          style="background-color:#555;color:#fff"
        ></Button>
      </ButtonGroup>-->
      <Button
        :icon="fullScreen?'md-contract':'md-expand'"
        @click="toolbar()"
        style="background-color:#555;color:#fff"
      ></Button>
    </div>
    <!-- 搜索 -->
    <div class="search_box animation" :class="$store.state.contract?'right_after':'right_before'">
      <Button shape="circle" icon="ios-search" class="openSearch" @click="$store.state.searchShow=true"></Button>
    </div>
    <!-- 距离、面积结果 -->
    <div class="result_box" v-if="$store.state.rounded_area||$store.state.rounded_distance">
      <p v-if="$store.state.rounded_area">面积：{{$store.state.rounded_area}} km²</p>
      <p v-if="$store.state.rounded_distance">距离：{{$store.state.rounded_distance}} km</p>
    </div>
    <!-- 颜色条 -->
    <div class="legend_box">
      <!-- 扇区拥挤度 -->
      <div class="crowdingDegree_legend" v-if="$store.state.crowdingDegree_legend">
        <div style="background-color:#f00;">高</div>
        <div style="background-color:#ff0;">中</div>
        <div style="background-color:#0f0;">低</div>
      </div>
      <!-- 航路拥挤度 -->
      <div class="route_crowdingDegree_legend" v-if="$store.state.route_crowdingDegree_legend">
        <div style="background-color:#0f0;">基本畅通</div>
        <div style="background-color:#ff0;">轻度拥堵</div>
        <div style="background-color:#f70;">中度拥堵</div>
        <div style="background-color:#f00;">重度拥堵</div>
      </div>
      <!-- 全国机场起降率 -->
      <div class="flyDropRate_legend" v-if="$store.state.flyDropRate_legend">
        <div style="background-color:#0a0;width:20px">近1小时起飞量</div>
        <div style="background-color:#050;width:20px">近1小时降落量</div>
        <div style="color:#f00;width:100%;background-color:#eee;padding:20px">注：红色代表机场起降率总和超限</div>
      </div>
    </div>
    <Drawer :title="$store.state.nav_value" v-model="$store.state.nav_value">
      <handleBars_module v-if="$store.state.nav_value==='操作'" @showDetail="showDetails($event)"></handleBars_module>
      <planeMenu_module
        ref="planeMenu"
        @change="select_data($event)"
        v-if="$store.state.nav_value==='监视'||$store.state.nav_value==='评估'||$store.state.nav_value==='统计'"
      ></planeMenu_module>
    </Drawer>

    <!-- 机场详情 -->
    <airportDetails ref="airportDetails"></airportDetails>

    <!-- 飞行计划 -->
    <flightPlan ref="flightPlanList"></flightPlan>

    <!-- 扇区拥挤度 -->
    <crowdingDegree ref="crowdingDegreeType" @close="closeCrowding($event)"></crowdingDegree>

    <!-- 单架监控 -->
    <oneAirPlan ref="oneAirplan" @close="closeOneAirplan($event)"></oneAirPlan>

    <!-- 运力综合统计 -->
    <transportCapacity @close="closeCapacity($event)" ref="transportCapacityList"></transportCapacity>

    <!-- 航班设置 -->
    <FlightMenu :flightDisplay_show="flightDisplay_show"></FlightMenu>

    <airport></airport>
    <aviationDepartment></aviationDepartment>
    <TrackPlayback></TrackPlayback>
  </div>
</template>
<script>
//  面包屑导航应该是在每个页面下
import HeaderNav from "@/components/header/HeaderNav";
import Floor from "@/components/floor/Floor";
import handleBars_module from "@/components/handleBar/HandleBars";
import planeMenu_module from "@/components/planeMenu/planeMenu";
import FlightMenu from "@/components/planeMenu/flightMenu";
import airportDetails from "@/components/planeMenu/airportDetails";
import flightPlan from "@/components/planeMenu/flightPlan";
import transportCapacity from "@/components/planeMenu/transportCapacity";
import crowdingDegree from "@/components/planeMenu/crowdingDegree";
import oneAirPlan from "@/components/planeMenu/oneAirPlan";
import airportTakeoffandLanding from "@/utils/planeMenu/airportTakeoffandLanding";
import airLine from "@/utils/planeMenu/airLine";
import airport from "@/components/planeMenu/airport";
import aviationDepartment from "@/components/planeMenu/aviationDepartment";
import TrackPlayback from "@/components/planeMenu/TrackPlayback";
export default {
  name: "IndexPage",
  components: {
    HeaderNav,
    Floor,
    handleBars_module,
    planeMenu_module,
    FlightMenu,
    airportDetails,
    transportCapacity,
    flightPlan,
    crowdingDegree,
    oneAirPlan,
    airport,
    aviationDepartment,
    TrackPlayback
  },
  data() {
    return {
      module: false,
      animation_type: true,
      fullScreen: true,
      flightDisplay_show: false,
      rightToolbar_list: [
        {
          name: "退出全屏",
          icon_url: "md-contract",
          value: "",
        },
        {
          name: "全屏",
          icon_url: "md-expand",
          value: "",
        },
      ],
      
    };
  },
  computed: {},
  watch: {},
  methods: {
    select_data(item) {
      console.log(item);
      if( !item.selection ){
        this.clearBtnData(this.$store.state.airTransport)
          return;
      }else{
         this.clearBtnData(this.$store.state.airTransport)
      }
   
      console.log(this.$store.state.airTransport)
      
      switch (item.name) {
        case "全国杰普逊航图查阅":
          break;
        // case "全国机场展示":
        //   if (item.selection) {
        //     this.addAirPortByRegion();
        //   } else {
        //     this.map.remove("testairport");
        //   }
        //   break;
        case "全国机场详情查阅":
          this.$refs.airportDetails.showAirportDetails();
          break;
        case "航路通达度评估":
          this.map.addGridTileLayer("heatmap");
          break;
        case "扇区拥挤度评估":
           this.$store.state.time_module = true;
            this.$refs.crowdingDegreeType.show();
          break;
        case "航路拥挤度评估":
          this.$store.state.time_module = true;
          airLine.airrouteCongestion();
          this.$store.state.route_crowdingDegree_legend = true;
          break;
        case "全国航班监视":
           this.flightDisplay_show = true;
          break;
        case "全国航班飞行计划查询":
          this.$refs.flightPlanList.show();
          break;
        case "单架航班飞行监视":
          this.$refs.oneAirplan.show();
          break;
        case "全国机场起降率监控":
            this.$store.state.flyDropRate_legend = true;
            this.$store.state.time_module = true;
            // this.airportTakeoffandLandingRate();
            airportTakeoffandLanding.airportTakeoffandLandingRate();
          break;
        case "全国运力统计":
          this.$refs.transportCapacityList.show();
          break;
        default:
          break;
      }
      this.$store.state.airTransport = item;
    },
    clearBtnData(item){
      if(!item.name) return;
      item.selection = false;
      this.map.remove("heatmap");
      this.map.remove("sectorCongestion");
      this.$store.state.time_module = false;
      this.map.remove("airrouteCongestion");
      this.$store.state.route_crowdingDegree_legend = false;
      this.map.remove("flightTrack");
      this.flightDisplay_show = false;
      this.map.remove("onePlaneLine");
      this.map.remove("onePlanePoint");
      this.$store.state.flyDropRate_legend = false;
      this.map.remove("airportTakeoffandLandingRate");
      this.$refs.crowdingDegreeType.close();
      this.$refs.transportCapacityList.close();
      this.map.remove("flightTrack" + 1);
      this.map.remove("flightTrack" + 0);
    },
    toolbar() {
      this.fullScreen = !this.fullScreen;
      if (this.fullScreen) {
        this.$store.state.toolbar = false;
        this.$store.state.header = false;
        this.$store.state.nav = false;
        this.$store.state.contract = false;
        this.animation_type = false;
      } else {
        this.$store.state.toolbar = true;
        this.$store.state.header = true;
        this.$store.state.nav = true;
        this.$store.state.contract = true;
        this.animation_type = true;
      }
    },
    showDetails(item) {
      console.log("254", item);
      this.$refs.airportDetails.airportTxt(item);
    },
  },
  mounted() {},
};
</script>

<style scoped>
.layout {
  width: 100%;
  height: 100%;
  position: relative;
}
.layout_header {
  width: 100%;
  padding: 0px;
  height: auto;
  line-height: auto;
  position: absolute;
  right: 0;
  top: 0;
  left: 0;
  z-index: 1;
  user-select: none;
}
.layout_footer {
  position: absolute;
  /* right: 0; */
  /* margin-top: -50px; */
  top: 50%;
  /* bottom: 200px; */
  right: 20px;
  height: 250px;
  /* z-index: 1; */
  /* background-color: #555d; */
  color: #fff;
  border-radius: 10000px;
  user-select: none;
}

.animation {
  transition: all 1s;
}
.before {
  /* right: -270px; */
  transform: translateY(-50px);
}
.after {
  /* right: 0; */
  transform: translateY(0px);
}
.footAfter {
  transform: translateX(0px);
}

.footBefore {
  transform: translateX(75px);
}

.content {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}

.toolbar_right {
  position: absolute;
  /* top: 10px; */
  right: 10px;
  /* border-radius: 5px; */
  /* background-color: #ccc; */
}
.right_after {
  transform: translateY(50px);
}
.right_before {
  transform: translateY(10px);
}

.result_box {
  position: fixed;
  top: 50px;
  left: 100px;
  background-color: #555e;
  padding: 10px;
  color: white;
}

.animation_switch {
  position: absolute;
  top: calc(50% - 22px);
  right: 50px;
  width: 30px;
  height: 44px;
  z-index: 1000;
  border-top-left-radius: 10000px;
  border-bottom-left-radius: 10000px;
  background-color: white;
  font-size: 30px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 5px;
}

.crowdingDegree_legend,
.route_crowdingDegree_legend,
.flyDropRate_legend {
  /* float: right; */
  margin-left: 10px;
}
.crowdingDegree_legend > div {
  font-size: 12px;
  padding: 5px;
  color: #000;
  border: 2px solid #005b9d;
}
.route_crowdingDegree_legend > div {
  width: 20px;
  font-size: 12px;
  padding: 2px;
  border: 2px solid #005b9d;
}
.flyDropRate_legend {
  display: flex;
  width: 160px;
  flex-wrap: wrap;
  justify-content: center;
}
.flyDropRate_legend > div {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  justify-content: center;
  color: #000;
  margin: 5px;
}
.search_box {
  position: fixed;
  /* top: 10px; */
  left: 10px;
}
.openSearch {
  background-color: #555e;
  color: #fff;
  font-size: 20px;
}
.legend_box {
  position: absolute;
  left: 10px;
  bottom: 50px;
  display: flex;
  flex-direction: row-reverse;
  align-items: flex-end;
}
.test {
  position: absolute;
  top: 100px;
  left: 100px;
  background-color: #fff;
}
</style>

<style>
body .mapboxgl-popup-content {
  color: #fff;
}
body .ivu-poptip-inner {
  background-color: #555e;
}
body .ivu-poptip-popper[x-placement^="right"] .ivu-poptip-arrow:after {
  border-right-color: #555e;
}
body .ivu-poptip-popper[x-placement^="left"] .ivu-poptip-arrow:after {
  border-left-color: #555e;
}
body .ivu-poptip-popper {
  min-width: auto;
}
body .other > li > .ivu-poptip > .ivu-poptip-rel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2px 10px;
}
body .ivu-modal-content {
  background-color: #555;
  color: #fff;
}
body .ivu-modal-header p,
body .ivu-modal-header-inner {
  color: #fff;
}

body .ivu-poptip-body {
  padding: 8px 5px;
  text-align: center;
}
body .ivu-btn-circle-outline.ivu-btn-icon-only,
body .ivu-btn-circle.ivu-btn-icon-only {
  width: 40px;
  height: 40px;
}
body .ivu-drawer-content {
  background-color: #555;
}
body .ivu-drawer-header p,
body .ivu-drawer-header-inner {
  color: #fff;
  font-size: 20px;
}
body .ivu-drawer-body {
  padding: 0 16px;
}
</style>

