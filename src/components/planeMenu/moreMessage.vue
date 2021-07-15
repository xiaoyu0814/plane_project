<template>
  <div id="moreMessage" v-if="$store.state.moreMessage.show">
    <div class="title">
      <van-icon name="arrow-left" @click="back" />更多信息
      <van-icon name="cross" @click="close" />
    </div>
    <table>
      <tr>
        <td>飞机编号：{{$store.state.flightDetails.value.name}}</td>
        <td></td>
        <td>机龄：</td>
        <td></td>
      </tr>
      <tr>
        <td>机型：{{$store.state.flightDetails.value.aircraft_code}}-{{$store.state.flightDetails.value.aircraft_type}}</td>
        <td></td>
        <td>有无Wifi：</td>
        <td></td>
      </tr>
    </table>
    <div class="img_box">
			<img src="static/img/moreMessage.png" alt />
		</div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    close() {
      this.$store.state.searchShow = false;
      this.$store.state.segment_show = false;
      this.$store.state.flightInformation_show = false;
      this.$store.state.flightDetails.show = false;
      this.$store.state.moreMessage.show = false;
    },
    back() {
      this.$store.state.moreMessage.show = false;
    },
  },
  mounted() {},
};
</script>

<style scoped>
#moreMessage {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
	z-index: 2;
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
table {
  background-color: rgb(36, 140, 253);
  width: 100%;
}
table td {
  padding: 5px 20px;
}
.img_box{
	width: 100%;
	overflow: hidden;
}
.img_box img{
	width: 100%;
}
</style>