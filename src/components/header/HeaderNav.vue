<template>
  <Layout>
    <i-header class="layout-header-bar iview_header">
      <div class="iview_header_inner">
        <img src="../../assets/logo.png" alt style="height:100%;margin-right:10px" />
        <span>民航数据资源汇聚展现平台</span>
      </div>
    </i-header>
  </Layout>
</template>
<script>
export default {
  name: "HeaderNav",
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
          name: "空",
          value: "",
          icon_url: "",
          router: "/plane",
          selection: false,
        },
        // {
        //   name: "工具",
        //   value: "",
        //   selection: true,
        // },
        {
          name: "操作",
          value: "",
          icon_url: "",
          selection: false,
        },
      ],
    };
  },
  methods: {
    select(item, index) {
      item.selection = !item.selection;
      if (item.name === "工具") {
        this.$store.state.toolbar = item.selection;
      } else if (item.name === "操作") {
        this.$store.state.handlebars = item.selection;
      } else if (item.name === "空") {
        this.$store.state.plane = item.selection;
      }
    },
  },
};
</script>

<style scoped>
.nav_box {
  height: 100%;
  display: flex;
}
.nav,
.other {
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.nav li,
.other li {
  height: 100%;
  padding: 2px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nav li a {
  color: white;
  font-size: 14px;
}


</style>
