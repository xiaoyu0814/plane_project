<template>
  <div id="segment" v-if="$store.state.segment_show">
    <div class="title">
      <van-icon name="arrow-left" @click="back" />按航段搜索
      <Icon type="md-close" @click="close" />
    </div>
    <ul>
      <li class="start_end_box">
        <img src="static/img/line.png" />
        <div class="start_end">
          <div style="border-bottom: 1px solid #ccc" @click="startAirport">
            <span style="color: #aaa; margin-right: 10px">出发</span>
            <span>{{ this.$store.state.search.startAirport }}</span>
          </div>
          <div @click="endAirport">
            <span style="color: #aaa; margin-right: 10px">到达</span>
            <span>{{ this.$store.state.search.endAirport }}</span>
          </div>
        </div>
        <Icon
          @click="changeAirport"
          type="md-swap"
          style="
            text-align: center;
            width: 80px;
            transform: rotate(90deg);
            color: rgb(36, 140, 253);
            font-size: 30px;
          "
        />
      </li>
      <li
        class="start_end_box"
        style="padding: 15px"
        @click="aviationDepartment"
      >
        <Icon
          type="ios-plane-outline"
          style="
            transform: rotate(-90deg);
            color: rgb(36, 140, 253);
            font-size: 24px;
            margin-right: 10px;
          "
        />
        <div
          style="
            width: 100%;
            padding: 0 10px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            color: rgb(36, 140, 253);
          "
        >
          <span style="color: #aaa; margin-right: 10px; font-size: 18px"
            >航司</span
          >
          <span style="color: #000; font-size: 18px">{{
            this.$store.state.search.aviation
          }}</span>
        </div>
        <van-icon name="arrow" color="rgb(36,140,253)" size="18px" />
      </li>
      <li class="start_end_box" style="padding:20px;color:#000">
        <div style="width:60px" @click="preDate">前一日</div>
        <Divider type="vertical" style="color:rgb(36,140,253)" />
        <div
          @click="$store.state.show_calendar = true;$store.state.search.dateStatus = true;"
          style=" width: 100%; padding: 0 10px; display: flex; justify-content: space-between; align-items: center; color: rgb(36, 140, 253);"
        >
          <span>{{ this.$store.state.search.date }}</span>
          <van-icon name="notes-o" color="rgb(36,140,253)" size="18px" />
        </div>
        <Divider type="vertical" />
        <div style="width:60px"  @click="nextDate">后一日</div>
      </li>
    </ul>
    <div style="padding: 20px">
      <div style="color: #ccc; margin-bottom: 20px">
        国际航班请选择出发城市当地日期
      </div>
      <Button type="primary" long @click="flightInformation">查询</Button>
    </div>
  </div>
</template>
 
<script>
import dateFormatter from "@/utils/dateFormatter";
export default {
  data() {
    return {};
  },
  methods: {
    close() {
      this.$store.state.searchShow = false;
      this.$store.state.segment_show = false;
    },
    back() {
      this.$store.state.segment_show = false;
    },
    preDate(){
      let date =new Date(this.$store.state.search.date)
      date.setTime(date.getTime()-24*60*60*1000)
      this.$store.state.search.date = dateFormatter("yyyy-MM-dd",new Date(date))
    },
    nextDate(){
      let date =new Date(this.$store.state.search.date)
      date.setTime(date.getTime()+24*60*60*1000)
      this.$store.state.search.date = dateFormatter("yyyy-MM-dd",new Date(date))
    },
    // 找机场
    startAirport() {
      this.$store.state.search.startAirportStatus = true;
      this.$store.state.airport.show = true;
      this.$store.state.airport.value = 1;
    },
    endAirport() {
      this.$store.state.search.endAirportStatus = true;
      this.$store.state.airport.show = true;
      this.$store.state.airport.value = 1;
    },
    changeAirport() {
      let temp = this.$store.state.search.startAirport;
      this.$store.state.search.startAirport = this.$store.state.search.endAirport;
      this.$store.state.search.endAirport = temp;
    },
    aviationDepartment() {
      this.$store.state.aviationDepartment_show = true;
    },
    flightInformation() {
      console.log("ddd");
      this.$store.state.flightInformation_show = true;
    },
  },
  mounted() {
    this.$store.state.search.date = dateFormatter("yyyy-MM-dd", new Date());
  },
};
</script>

<style scoped>
#segment {
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
  color: rgb(45, 121, 197);
  font-size: 18px;
  padding: 0 10px;
}
.start_end_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
}
.start_end_box img {
  width: 50px;
  height: 100px;
  margin: 10px 0;
}
#segment .start_end {
  width: 100%;
  color: #000;
  font-size: 18px;
}
#segment .start_end div {
  padding: 10px;
}
</style>