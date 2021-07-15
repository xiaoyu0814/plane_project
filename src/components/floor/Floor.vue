<template>
  <div class="nav_box">
    <!-- <ul class="nav">
          <li v-for="(item, index) in nav_list" :key="index" @click="select(item, index)">
            <router-link
              :to="item.router"
              :style="nav_index===index?'color:#0072ff':'color:black'"
            >{{item.name}}</router-link>
          </li>
    </ul>-->
    <tools_module></tools_module>
    <ul class="other">
      <li v-for="(item, index) in other_list" :key="index" @click="select(item, index)">
        <Poptip placement="right" width="auto" :disabled="!(item.name==='工具')">
          <img :src="item.icon_url" style="width:25px" />
          <!-- <span>{{item.name}}</span> -->
          <div slot="content">
            
            <!-- <handleBars_module v-if="item.name==='操作'"></handleBars_module> -->
            <!-- <planeMenu_module v-if="item.name==='空运'"></planeMenu_module> -->
          </div>
        </Poptip>
      </li>
    </ul>
  </div>
</template>
<script>
import tools_module from "@/components/tools/Tools";
import handleBars_module from "@/components/handleBar/HandleBars";
import planeMenu_module from "@/components/planeMenu/planeMenu";
export default {
  name: "floor",
  components: {
    tools_module,
    handleBars_module,
    planeMenu_module,
  },
  data: function () {
    return {
      nav_list: [
        // {
        //   name: "公",
        //   value: "",
        //   router: "/car",
        // },
        // {
        //   name: "水",
        //   value: "",
        //   router: "/ship",
        // },
        // {
        //   name: "空",
        //   value: "",
        //   router: "/plane",
        //   selection: false,
        // },
        // {
        //   name: "铁",
        //   value: "",
        //   router: "/railways",
        // },
      ],
      nav_index: 0,
      other_list: [
        {
          name: "监视",
          value: "",
          // icon_url: "static/img/plane.svg",
          icon_url: "static/img/monitor.png",
          router: "/plane",
          selection: false,
        },
        {
          name: "评估",
          value: "",
          // icon_url: "static/img/plane.svg",
          icon_url: "static/img/assessment.png",
          router: "/plane",
          selection: false,
        },
        {
          name: "统计",
          value: "",
          // icon_url: "static/img/plane.svg",
          icon_url: "static/img/statistics.png",
          router: "/plane",
          selection: false,
        },
        // {
        //   name: "空运",
        //   value: "",
        //   // icon_url: "static/img/plane.svg",
        //   icon_url: "static/img/plane.png",
        //   router: "/plane",
        //   selection: false,
        // },
        // {
        //   name: "工具",
        //   icon_url: "static/img/tool.png",
        //   value: "",
        //   selection: true,
        // },
        {
          name: "操作",
          value: "",
          icon_url: "static/img/operate.png",
          selection: false,
        },
        {
          name: "回放",
          value: "",
          icon_url: "static/img/playback.png",
          selection: false,
        },
      ],
    };
  },
  methods: {
    select(item, index) {
      // item.selection = !item.selection;
      // // return;
      // if (item.name === "工具") {
      //   this.$store.state.toolbar = item.selection;
      // } else if (item.name === "操作") {
      //   this.$store.state.handlebars = item.selection;
      //   this.other_list[0].selection = false;
      //   this.$store.state.plane = false;
      // } else if (item.name === "空运") {
      //   this.$store.state.plane = item.selection;
      //   this.$store.state.handlebars = false;
      //   this.other_list[1].selection = false;
      // }
      switch (item.name) {
        case "工具":
        case "回放":
          if (item.name === "回放") {
            console.log(this.$store.state.setTime_box);
            this.$store.state.setTime_box = true;
            this.$store.state.time_module = true;
          }
          break;
        default:
          this.$store.state.nav_value = item.name;
          break;
      }
    },
  },
};
</script>
<style scoped>
.nav_box {
  height: 100%;
}
.nav,
.other {
  font-size: 20px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.nav li,
.other li {
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  background-color: rgba(50, 50, 50, 220);
  border-radius: 4px;
  padding: 5px;
}
</style>
