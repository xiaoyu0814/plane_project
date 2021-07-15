<template>
  <div id="flightDisplay" v-if="$store.state.flightDisplay">
    <div class="title">
      <van-icon name="arrow-left" @click="back" />
      <div style="text-align: center">
        <div>{{$store.state.search.select_airportIata}} 机场航显</div>
      </div>
      <van-icon name="cross" @click="close" />
    </div>
    <div class="tabs_box">
      <van-tabs
        @click="menuClick"
        v-model="active"
        style="width: 80%"
        background="rgb(45,121,197)"
        color="#ffffff"
        title-active-color="#fff"
        title-inactive-color="#fff"
      >
        <van-tab v-for="(item,index) in menus" :title="item.title" :key='index'></van-tab>
      </van-tabs>
      <van-switch
        v-model="checked"
        @change="switchChange"
        active-color="rgb(36,140,253)"
        inactive-color="rgb(81,98,128)"
      />
    </div>
    <ul class="list_box">
      <li class="list_header">
        <table style="width: 100%">
          <tr>
            <td style="width: 15%">航班号</td>
            <td style="width: 15%">机号</td>
            <td style="width: 15%">目的地</td>
            <td style="width: 15%">计划到达</td>
            <td style="width: 20%">到达+延误时间</td>
            <td style="width: 20%">状态</td>
          </tr>
        </table>
      </li>
      <li
        class="list_content"
        :style="'height:' + (height - 60 - 44 - 40 - 28) + 'px;'"
      >
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <table style="width: 100%">
              <tr v-for="item in list" :key="item">
                <td style="width: 15%">{{item.fnum}}</td>
                <td style="width: 15%">{{item.code}}</td>
                <td style="width: 15%">{{item.fdstAptCname}}</td>
                <td style="width: 15%">{{item.scheduledArrtime}}</td>
                <td style="width: 20%">
                  <span style="float: left; margin-left: 5px">{{item.scheduledArrtime}}</span
                  ><span
                    style="
                      color: rgb(255, 151, 0);
                      float: right;
                      margin-right: 5px;
                    "
                    >{{item.endtime}}</span
                  >
                </td>
                <td style="width: 20%">{{item.flightStatus}}</td>
              </tr>
            </table>
          </van-list>
        </van-pull-refresh>
      </li>
      <li class="list_footer">
        <van-pagination
          @change="pageChange"
          v-model="pageNum"
          :total-items="total"
          :show-page-size="pages"
          force-ellipses
        />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      height: window.innerHeight,
      active: 0,
      checked: false,
      loading: false,
      finished: false,
      refreshing: false,
      list: [],
      pageSize:30,
      total:124,
      pages:3,
      pageNum:1,
      code:'',
      menus:[
       {
         title: "全部",
         code:""
       },
       {
         title: "延误",
         code:"D"
       },
       {
         title: "取消",
         code:"C"
       },
       {
         title: "异常",
         code:"O"
       },
       {
         title: "已进港",
         code:"A"
       },
      ]
    };
  },
  methods: {
    close() {},
    back() {
      this.$store.state.flightDisplay = false;
    },
    onLoad() {
      let url  = this.$urlPath.airplane.getFlightDetail;
      let param = {
        iata:this.$store.state.search.select_airportIata,
        code:this.code,
        pageSize:this.pageSize,
        pageNum:this.pageNum
      }
      if(this.checked){
        param.status = "arrival"
      }else{
        param.status = "departures"
      }
      this.$api.get(url,param).then((res)=>{
        console.log(res)
        if(res){
          this.list = res.list;
          this.pageSize = res.pageSize;
          this.total = res.total;
          this.refreshing = false;
          this.loading = false;
          this.finished = true;
        }
      }).catch((res)=>{

      })
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.pageNum++;
      this.onLoad();
    },
    switchChange(){
      console.log(this.checked)
      this.pageNum = 1;
      this.refreshing = true;
      this.loading = true;
      this.onLoad();
    },
    menuClick(item,title){
      console.log(item,title,this.active)
      this.code =  this.menus[this.active].code;
      this.pageNum = 1;
      this.refreshing = true;
      this.loading = true;
      this.onLoad();
    },
    pageChange(item){
      console.log(item)
      this.pageNum = item;
      this.refreshing = true;
      this.loading = true;
      this.onLoad();
    }
  },
  mounted() {},
};
</script>

<style scoped>
#flightDisplay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
}
.title {
  display: flex;
  justify-content: space-between;
  height: 60px;
  align-items: center;
  background-color: rgb(36, 140, 253);
  font-size: 18px;
  padding: 0 10px;
  color: #fff;
}
.tabs_box {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: rgb(45, 121, 197);
}
.list_box {
  background-color: rgb(48, 52, 64);
}
.list_box table {
  border-collapse: collapse;
}
.list_box table td {
  text-align: center;
  border: 2px solid #ccc1;
  padding: 3px 1px;
}
.list_header {
}
.list_content {
  overflow-y: auto;
}
.list_footer {
}
</style>

<style>
#flightDisplay .van-pagination__item {
  background-color: rgb(48, 52, 64);
}
</style>