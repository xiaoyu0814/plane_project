<template>
  <div id="TrackPlayback" v-if="$store.state.TrackPlayback.show">
    <div class="title">
      <div>
        航司
        <span>MU5181</span>
        <span>B300P</span>
        <span>A330-343E</span>
      </div>
      <div style="text-align:center">
        <Icon type="ios-play-outline" />
        <span>08:34</span>
        <span>utc+8</span>
      </div>
      <div style="text-align:right">
        <Icon type="md-close" @click="close" />
      </div>
    </div>
    <div class="TrackPlayback_box">
      <div class="TrackPlayback_content">
        <div class="top">
          <p>滑出：14min(s)</p>
          <p>在云端</p>
          <p>滑入：7min(s)</p>
        </div>
        <div class="center">
          <div>
            <p>海拔高度</p>
            <p>11612.88m</p>
          </div>
          <div>
            <p>地速</p>
            <p>809.81km/h</p>
          </div>
          <div>
            <p>垂直速度</p>
            <p>0.00m/s</p>
          </div>
          <div>
            <p>航向</p>
            <p>175°</p>
          </div>
        </div>
        <div id="chart" style="height:100%"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      chartArr:"",
      chartOpation: {
      animation: false,
      tooltip: {
          triggerOn: 'none',
          position: function (pt,params) {
              console.log(params);
              return [pt[0], 130];
          }
      },
      legend: {
        textStyle:{
            color:"#fff"
        },
            data: ["高度", "速度"],
      },
      xAxis: {
          type: 'time',
          // boundaryGap: [0, 0],
          axisPointer: {
              value: '2016-10-7',
              snap: false,
              lineStyle: {
                  color: '#004E52',
                  opacity: 0.5,
                  width: 2
              },
              label: {
                  formatter: function (params) {
                      return echarts.format.formatTime('yyyy-MM-dd hh:mm:ss', params.value);
                  },
                  backgroundColor: '#004E52'
              },
              handle: {
                  show: true,
                  size:[2,270],
                  margin:-130,
                  color: '#fff'
              }
          },
          axisLabel:{
            formatter: function (value) {
              return echarts.format.formatTime('hh:mm', value);
            },
            color:"#fff"
          },
          axisLine:{
            lineStyle:{
              color:"#fff"
            }
          },
          splitLine: {
              show: false
          }
      },
      yAxis: [{
          name: "高度(米)",
          nameTextStyle:{color:"#fff"},
          type: 'value',
          axisTick: {
              inside: true
          },
          splitLine: {
              show: false
          },
          axisLine:{
            lineStyle:{
              color:"#fff"
            }
          },
          axisLabel: {
              inside: false,
              color:"#fff",
              formatter: '{value}\n'
          },
          z: 10
      },{
          name: "速度(km/h)",
          nameTextStyle:{color:"#fff"},
          type: 'value',
          axisTick: {
              inside: true
          },
          splitLine: {
              show: false
          },
          axisLine:{
            lineStyle:{
              color:"#fff"
            }
          },
          axisLabel: {
              inside: false,
              color:"#fff",
              formatter: '{value}\n'
          },
          z: 10
      },],
      grid: {
          left: 40,
          right: 40,
          bottom:120,
      },
      series: [
          {
            
              name: '高度',
              type: 'line',
              smooth: true,
              sampling: 'average',
              itemStyle: {
                  color: '#8ec6ad'
              },
              
            symbolSize: 0,
              data: []
          },
          {
              yAxisIndex:1,
              name: '速度',
              type: 'line',
              smooth: true,
            
              sampling: 'average',
              itemStyle: {
                  color: '#d68262'
              },
              symbolSize: 0,
              data: []
          }

        ]
      },
      
    };
  },
  methods: {
    close() {
      this.$store.state.search.select_callsign = "";
      this.$store.state.TrackPlayback.show = false;
      //this.$store.state.searchShow = true;
    },
    initChart(datas){
      this.chartOpation.xAxis.data = [];
      this.chartOpation.series[0].data = [];
      this.chartOpation.series[1].data = [];
      let data1 = [];
      let data2=[];
      for (let i = 0; i < datas.length; i++) {
        let item = datas[i];
        if (item.time) {
          data1.push([item.time,item.height])
          data2.push([item.time,item.groundspeed])
        }
      }
      if (document.getElementById("chart")) {
        this.chartOpation.xAxis.axisPointer.value = data1[0][0]
        this.chartOpation.series[0].data=data1;
        this.chartOpation.series[1].data=data2;
        this.chartArr = this.$echarts.init(document.getElementById("chart"));
        this.chartArr.setOption(this.chartOpation);
      }
      return;
    },
    initList(){
      let _this = this;
      let url = this.$urlPath.airplane.getFlightList;
      // let params = {
      //   callsign:this.$store.state.search.select_callsign,
      //   time:this.$store.state.search.date,//this.$store.state.search.date
      // }
      this.$api.get(url).then((res)=>{
          var _features = [];
          console.log(res);

          let planeGround = res[0].shift();
          if (planeGround.arrapInfo.coordinate) {
            let str = planeGround.arrapInfo.coordinate.replace("N", "");
            let arr = str.split("E");
            var startfeature = turf.point(
              [arr[1] / 10000, arr[0] / 10000],
              planeGround.arrapInfo
            );
          }
          if (planeGround.depapInfo.coordinate) {
            let str = planeGround.depapInfo.coordinate.replace("N", "");
            let arr = str.split("E");
            var endfeature = turf.point(
              [arr[1] / 10000, arr[0] / 10000],
              planeGround.depapInfo
            );
          }
          let points = res[0];
          let pointsFeatures = [];
          let linePoints = [];
          for (let i = 0; i < points.length; i++) {
            let point = points[i];
            if (point.lng && point.lat) {
              let coordinate = [point.lng, point.lat];
              point.num = i;
              let feature = turf.point(coordinate, point);
              linePoints.push(coordinate);
              pointsFeatures.push(feature);
            }
          }
          this.initChart(points)
          let pointGeo = turf.featureCollection(pointsFeatures);
          let lineGeo = turf.featureCollection([turf.lineString(linePoints)]);
          _this.map.addLineLayer(lineGeo, "onePlaneLine");
          _this.map.addOnePlaneLayer(pointGeo, "onePlanePoint");
      }).catch(res=>{
        this.$Message.error(res.data.error)
      })
    }
  },
  mounted() {
    
    console.log("TrackPlayback")
  },
  computed: {
    selectCallsign() {
      return this.$store.state.search.select_callsign;
    },
  },
  watch: {
    selectCallsign(val) {
      console.log(val);
      if (val) {
        this.initList();
      } else {
        return;
      }
    },
  },
};
</script>

<style scoped>
#TrackPlayback {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 300px;
  background-color: #555;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  color: #fff;
}
.title {
  display: flex;
  /* height: 40px; */
  justify-content: space-between;
  padding: 5px 10px;
  font-size: 16px;
}

.TrackPlayback_box {
  height: calc(100% - 30px);
  background-image:  url(../../../static/img/BG_plane.jpg);
  background-repeat: no-repeat;
  background-size: 100%;
}
.TrackPlayback_content{
  width: 100%;
  height: 100%;
  background-color: #000a;
}
.top{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}
.center{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 10px;
}
.center p{
  text-align: center;
}
</style>