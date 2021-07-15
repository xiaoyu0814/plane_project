<template>
  <div id="plane">
    <!-- 地图视口 -->
    <div id="map"></div>
    <!-- 工具栏 -->
    <!-- <tools_module></tools_module> -->
    <!-- 操作面板 -->
    <!-- <handleBars_module></handleBars_module> -->
    <!-- 航空列表 -->
    <!-- <planeMenu_module></planeMenu_module> -->
    <!-- 时间轴组件 -->
    <div class="time animation" :class="$store.state.nav?'after':'before'">
      <time_module v-if="$store.state.time_module"></time_module>
    </div>
    <search v-if="$store.state.searchShow"></search>
  </div>
</template>

<script>
import dateFormatter from "@/utils/dateFormatter"
import flightTeack from '@/utils/flightTrack';
import time_module from "@/components/time/time";
// import tools_module from "@/components/tools/Tools";
// import handleBars_module from "@/components/handleBar/HandleBars";
// import planeMenu_module from "@/components/planeMenu/planeMenu";
import search from "@/components/search/search";
import { getAirData } from "@/api/airget";
export default {
  components: {
    time_module,
    // tools_module,
    // handleBars_module,
    // planeMenu_module,
    search,
  },
  data() {
    return {};
  },
  methods: {
    initMap() {
      let obj = {
        zoom: 3,
        center: [106, 35],
        map: "map",
      };
      this.map.initMap(obj);
      let _this = this;
      this.map.map.on("load", () => {
        flightTeack.setMapbox(_this.map.map)
        flightTeack.start()
      });
    },
  },
  mounted() {
    this.initMap();
  },
};
</script>

<style scoped>
#plane {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
}
.layer_list_box li {
  margin: 5px 0;
}
.border {
  border: 1px solid #ccc;
  border-radius: 4px;
  position: relative;
  width: 100%;
  padding: 5px;
  padding-top: 10px;
  margin-top: 15px;
}
.border > span {
  position: absolute;
  top: -10px;
  left: 10px;
  padding: 0 3px;
}
.border > table td {
  padding: 3px 0;
}
.time {
  position: absolute;
  bottom: 0;
  left: 0px;
  right: 0px;
  z-index: 2;
}
.animation {
  transition: all 1s;
}
.before {
  /* right: -270px; */
  transform: translateY(80px);
}
.after {
  /* right: 0; */
  transform: translateY(0px);
}
</style>

<style>
body .ivu-btn-icon-only {
  padding: 5px 8px;
}
body .handlebars .ivu-tabs {
  color: white;
}
body .ivu-tabs-nav .ivu-tabs-tab:hover {
  color: #0072ff;
}
</style>