<template>
  <!-- 工具栏 -->
  <div>
    <div class="animation" :class="$store.state.toolbar ? 'after' : 'before'">
      <ButtonGroup vertical v-if="false" class="toolbar_left">
        <Button
          :icon="item.icon_url"
          v-for="(item, index) in leftToolbar_list"
          :key="index"
          @click="toolbar(item)"
          style="background-color: #555; color: #fff"
          >{{ item.name }}</Button
        >
      </ButtonGroup>
      <ul class="tool_box">
        <li
          v-for="(item, index) in leftToolbar_list"
          :key="index"
          @click="toolbar(item)"
        >
          <Icon :type="item.icon_url" style="font-size:25px"/>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      leftToolbar_list: [
        {
          name: "放大",
          icon_url: "md-add",
          value: "",
        },
        {
          name: "缩小",
          icon_url: "md-remove",
          value: "",
        },
        {
          name: "测距",
          icon_url: "md-resize",
          value: "",
        },
        {
          name: "测面",
          icon_url: "md-square",
          value: "",
        },
        // {
        //   name: "角度",
        //   icon_url: "md-done-all",
        //   value: "",
        // },
        {
          name: "移除",
          icon_url: "md-trash",
          value: "",
        },
      ],
      timeout: null,
      animation_type: true,
    };
  },
  methods: {
    toolbar(item) {
      switch (item.name) {
        case "放大":
          this.map.ZoomIn();
          break;
        case "缩小":
          this.map.ZoomOut();
          break;
        case "测距":
          this.map.draw.changeMode("draw_line_string");
          this.map.map.on("draw.create", this.updateDistance);
          this.map.map.on("draw.delete", this.updateDistance);
          this.map.map.on("draw.update", this.updateDistance);
          break;
        case "测面":
          this.map.draw.changeMode("draw_polygon");
          this.map.map.on("draw.create", this.updateArea);
          this.map.map.on("draw.delete", this.updateArea);
          this.map.map.on("draw.update", this.updateArea);
          break;
        case "角度":
          break;
        case "移除":
          this.map.draw.deleteAll();
          this.$store.state.rounded_area = "";
          this.$store.state.rounded_distance = "";
          this.map.map.off("draw.create", this.updateArea);
          this.map.map.off("draw.delete", this.updateArea);
          this.map.map.off("draw.update", this.updateArea);
          this.map.map.off("draw.create", this.updateDistance);
          this.map.map.off("draw.delete", this.updateDistance);
          this.map.map.off("draw.update", this.updateDistance);
          break;
        case "全屏":
          this.$store.state.toolbar = false;
          this.$store.state.header = false;
          this.$store.state.nav = false;
          this.$store.state.contract = false;
          this.animation_type = false;
          // window.addEventListener("click", this.handler);
          break;
        case "退出全屏":
          this.$store.state.toolbar = true;
          this.$store.state.header = true;
          this.$store.state.nav = true;
          this.$store.state.contract = true;
          this.animation_type = true;
          // clearTimeout(this.timeout);
          // window.removeEventListener("click", this.handler);
          break;
        default:
          break;
      }
    },
    handler() {
      this.$store.state.toolbar = true;
      clearTimeout(this.timeout);
      this.timeout = window.setTimeout(() => {
        this.$store.state.toolbar = false;
      }, 5000);
    },
    updateArea(e) {
      var data = this.map.draw.getAll();
      if (data.features.length > 0) {
        var area = turf.area(data.features[data.features.length - 1]);
        // restrict to area to 2 decimal points
        this.$store.state.rounded_area = Math.round(area * 100) / 100;
        console.log(this.$store.state.rounded_area);
      }
    },
    updateDistance(e) {
      var data = this.map.draw.getAll();
      if (data.features.length > 0) {
        var distance = turf.lineDistance(
          data.features[data.features.length - 1]
        );
        // restrict to area to 2 decimal points
        this.$store.state.rounded_distance = Math.round(distance * 100) / 100;
      }
    },
  },
  mounted() {},
};
</script>

<style scoped>

.toolbar_left {
  position: relative;
  /* top: 50px;
  left: 130px; */
  /* border-radius: 5px; */
  /* background-color: #ccc; */
}

.animation {
  transition: all 1s;
}

.before {
  /* right: -270px; */
  transform: translateX(-85px);
}

.after {
  /* right: 0; */
  transform: translateX(0px);
}

.tool_box{
  position: absolute;
  bottom: 100%;
}

.tool_box li{
  width: 32px;
  height: 32px;
  background-color: rgba(50, 50, 50, 220);
  border-radius: 4px;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}

</style>
