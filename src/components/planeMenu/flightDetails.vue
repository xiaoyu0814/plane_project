<template>
  <div id="flightDetails" v-if="$store.state.flightDetails.show">
    <div class="title">
      <van-icon name="arrow-left" @click="back" />{{
        $store.state.flightDetails.value.name
      }}
      <van-icon name="cross" @click="close" />
    </div>
    <div style="height: calc(100% - 60px - 60px); overflow-y: auto">
      <div class="shichang_box">
        <span style="font-size: 18px">{{
          $store.state.flightDetails.value.status
        }}</span>
        <span v-if="$store.state.flightDetails.value.status=='计划'">预计飞行{{ $store.state.flightDetails.value.flytime }}</span>
        <span v-else-if="$store.state.flightDetails.value.status=='起飞'">已飞行{{ $store.state.flightDetails.value.flightTime }}，剩余{{ $store.state.flightDetails.value.remainingFlightTime }}</span>
        <span v-else-if="$store.state.flightDetails.value.status=='到达'">共飞行{{ $store.state.flightDetails.value.flytime }}</span>
      </div>
      <div class="weizhi_box">
        <Icon type="ios-plane" :style="{'left':getPlaneLeft}" class="plane" />
        <div class="lineShodaw" :style="{'width':getPlaneLeft}"></div>
        <div class="line"></div>
      </div>
      <div
        style="margin-bottom: 10px; color: #aaa"
        v-for="item in [1]"
        :key="item"
      >
        <div
          style="padding: 5px; text-decoration: underline; color: #999"
          @click="goToMessage(item)"
        >
          <span style="color: #999">机号:</span>
          <span style="color: #999">{{
            $store.state.flightDetails.value.name
          }}</span>
          <span style="color: #999">{{
            $store.state.flightDetails.value.jixing
          }}</span>
        </div>
        <div class="xiangqing_box" style="border-bottom: 1px solid #ccc5">
          <div class="flex">
            <div
              @click="
                goToAirport($store.state.flightDetails.value.departure.name)
              "
            >
              <span class="font1">{{
                $store.state.flightDetails.value.departure.time
              }}</span>
              <span class="font2">{{
                $store.state.flightDetails.value.departure.name
              }}</span>
            </div>
            <div style="text-align: right">
              <Icon type="ios-sunny-outline" />
              <span>{{
                $store.state.flightDetails.value.departure.temperature
              }}</span>
              <Icon type="ios-arrow-forward" />
            </div>
          </div>
          <div class="flex">
            <div>
              <div style="margin-bottom: 10px">
                <span>计划起飞</span>
                <span>{{
                  $store.state.flightDetails.value.departure.dep_datetime_plan
                }}</span>
              </div>
              <div>
                七天平均
                {{ $store.state.flightDetails.value.departure.sevenDaysAvg }}
              </div>
            </div>
            <table>
              <tr>
                <td>跑道</td>
                <td>登机口</td>
                <td>机位</td>
              </tr>
              <tr>
                <td>{{ $store.state.flightDetails.value.departure.runway }}</td>
                <td>
                  {{ $store.state.flightDetails.value.departure.boardingGate }}
                </td>
                <td>
                  {{ $store.state.flightDetails.value.departure.planeSeat }}
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="xiangqing_box">
          <div class="flex">
            <div
              @click="
                goToAirport($store.state.flightDetails.value.arrival.name)
              "
            >
              <span class="font1">{{
                $store.state.flightDetails.value.arrival.time
              }}</span>
              <span class="font2">{{
                $store.state.flightDetails.value.arrival.name
              }}</span>
            </div>
            <div style="text-align: right">
              <Icon type="ios-cloud-outline" />
              <span>{{
                $store.state.flightDetails.value.arrival.temperature
              }}</span>
              <Icon type="ios-arrow-forward" />
            </div>
          </div>
          <div class="flex">
            <div>
              <div style="margin-bottom: 10px">
                <span>计划到达</span>
                <span>{{
                  $store.state.flightDetails.value.arrival.arr_datetime_plan
                }}</span>
              </div>
              <div>
                七天平均
                {{ $store.state.flightDetails.value.arrival.sevenDaysAvg }}
              </div>
            </div>
            <table>
              <tr>
                <td>跑道</td>
                <td>登机口</td>
                <td>机位</td>
              </tr>
              <tr>
                <td>{{ $store.state.flightDetails.value.arrival.runway }}</td>
                <td>
                  {{ $store.state.flightDetails.value.arrival.boardingGate }}
                </td>
                <td>
                  {{ $store.state.flightDetails.value.arrival.planeSeat }}
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="lundang_box">
          <div class="set_box">
            <p>上轮挡</p>
            <p>--</p>
            <p>{{ $store.state.flightDetails.value.upperChock }}</p>
          </div>
          <div class="set_box">
            <p>开客舱</p>
            <p>--</p>
            <p>{{ $store.state.flightDetails.value.openCabin }}</p>
          </div>
          <div class="set_box">
            <p>上客</p>
            <p>--</p>
            <p>{{ $store.state.flightDetails.value.guestSaid }}</p>
          </div>
          <div class="set_box">
            <p>客齐</p>
            <p>--</p>
            <p>{{ $store.state.flightDetails.value.guestAreHere }}</p>
          </div>
          <div class="set_box">
            <p>关客舱</p>
            <p>--</p>
            <p>{{ $store.state.flightDetails.value.closeCabin }}</p>
          </div>
          <div class="set_box">
            <p>撤轮档</p>
            <p>--</p>
            <p>{{ $store.state.flightDetails.value.removewheelStop }}</p>
          </div>
        </div>
        <div v-show="false" class="PEKzhi_box">PEK值机柜台：--</div>
      </div>
      <div class="xu_box" v-show="false">
        <div style="border-right: 1px solid #ccc5">
          <Icon type="ios-arrow-back" />
          <span style="margin-left: 10px">前序</span>
          <div style="width: 80%; text-align: center">
            <span>--</span>
          </div>
        </div>
        <div>
          <div style="width: 80%; text-align: center">--</div>
          <span style="margin-right: 10px">后序</span>
          <Icon type="ios-arrow-forward" />
        </div>
      </div>
    </div>
    <div class="buttom_box">
      <Button type="text" style="width: 100px; color: #666"   @click="goToTrackPlayback">航迹展示</Button>
      <Button
        type="text"
        style="width: 100px; color: #666"
      
        >航路分析</Button
      >
      <Button type="text" style="width: 100px; color: #666">航班日志</Button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      testLeft:0.60
    };
  },
  methods: {
    close() {
      this.$store.state.searchShow = false;
      this.$store.state.segment_show = false;
      this.$store.state.flightInformation_show = false;
      this.$store.state.flightDetails.show = false;
    },
    back() {
      this.$store.state.flightDetails.show = false;
    },
    goToMessage(item) {
      this.$store.state.moreMessage.show = true;
    },
    goToTrackPlayback() {
      this.$store.state.TrackPlayback.show = true;
      this.$store.state.search.select_callsign = this.$store.state.flightDetails.value.name;
      this.close();
    },
    goToAirport(item) {
      this.$store.state.flightDetails.show = false;
      this.$store.state.search.select_airport = item;
      this.$store.state.airportInformation_show = true;
      this.$store.state.airportInformation_by = 1;
    },
  },
  mounted() {
    console.log(this.$store.state.flightDetails.value);
  },
  computed:{
    getPlaneLeft:function(){
      return 480*this.$store.state.flightDetails.value.position +"px"
    }
  }
};
</script>

<style scoped>
#flightDetails {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #eee;
}
.title {
  display: flex;
  justify-content: space-between;
  height: 60px;
  align-items: center;
  background-color: rgb(36, 140, 253);
  color: #fff;
  font-size: 18px;
  padding: 0 10px;
}
.shichang_box {
  background-color: rgb(36, 140, 253);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}
.weizhi_box {
  background-color: rgb(36, 140, 253);
  position: relative;
  height: 50px;
}
.plane {
  position: absolute;
  left: 10px;
  top: 50%;
  font-size: 24px;
  margin-top: -10px;
  z-index: 1;
}
.line {
  position: absolute;
  left: 10px;
  right: 10px;
  top: 50%;
  border-top: 1px solid #555;
}
.lineShodaw {
  position: absolute;
  left: 10px;
  right: 10px;
  top: 50%;
  z-index: 10;
  border-radius: 1;
  border-top: 2px solid #fff;
}
.xiangqing_box {
  background-color: #fff;
  padding: 10px;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  color: #666;
}
.flex div {
  width: 50%;
}
.flex table {
  width: 50%;
}
.flex table td:nth-child(2) {
  text-align: center;
}
.flex table td:nth-child(3) {
  text-align: right;
}

.font1 {
  color: rgb(36, 140, 253);
  font-size: 20px;
}
.font2 {
  color: #333;
  font-size: 14px;
}
.lundang_box {
  display: flex;
  background-color: #fff;
}
.lundang_box .set_box {
  width: 100px;
  text-align: center;
  border: 1px solid #ccc5;
  color: #666;
}
.PEKzhi_box {
  padding: 10px;
  background-color: #fff;
}
.xu_box {
  background-color: #fff;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  color: #ccc;
}
.xu_box > div {
  width: 50%;
  display: flex;
  align-items: center;
}
.buttom_box {
  position: fixed;
  bottom: 0;
  width: 500px;
  background-color: #fff;
  padding: 10px;
  padding-bottom: 20px;
  display: flex;
  justify-content: space-evenly;
  height: 60px;
  border-top: 1px solid #ccc5;
}
</style>