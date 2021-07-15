<template>
  <div id="airportInformation" v-if="$store.state.airportInformation_show">
    <div class="title">
      <van-icon name="arrow-left" @click="back" />
      <div style="text-align: center">
        <div>{{ airport.cn_name }}</div>
      </div>
      <van-icon name="cross" @click="close" />
    </div>
    <div style="height: calc(100% - 60px - 60px); overflow-y: auto">
      <div class="weather_box">
        <div class="weather_top">
          <span>{{ airport.iata }}</span>
          <span> <Icon type="ios-eye-outline" />{{ airport.visibility }} </span>
        </div>
        <div class="weather">
          <div class="weather_left">
            <div>
              <img
                src="static/img/fine.png"
                style="margin: 5px; width: 40px; height: 40px"
              />
              <div style="min-width: 40px">
                <p>{{ airport.weathers[0].weather }}</p>
                <p style="font-size: 20px">
                  {{ airport.weathers[0].temperature }}
                </p>
              </div>
            </div>
            <div>{{ airport.weathers[0].time }}</div>
          </div>
          <div class="weather_right_box">
            <div
              class="weather_right"
              v-for="(item, index) in airport.weathers"
              :key="index"
              v-show="index != 0"
            >
              <p>{{ item.weather }}</p>
              <img src="static/img/overcast.png" alt />
              <p>{{ item.time }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="JCXQ">
        <Row v-show="false">
          <i-col span="4">机场性质</i-col>
          <i-col span="4">{{ airport.using_type }}</i-col>
          <i-col span="2">经纬度</i-col>
          <i-col span="4"
            >{{ Number(airport.lon).toFixed(2) }},{{
              Number(airport.lat).toFixed(2)
            }}</i-col
          >
          <i-col span="4">管理机构</i-col>
          <i-col span="4">{{ airport.company }}</i-col>
        </Row>
        <table style="width: 100%">
          <tr>
            <td>机场性质：</td>
            <td>{{ airport.using_type }}</td>
            <td>位置：</td>
            <td>
              {{ Number(airport.lon).toFixed(2) }},{{
                Number(airport.lat).toFixed(2)
              }}
            </td>
           
          </tr>
          <tr>
            <td>机场标高:</td>
            <td>{{ airport.height }}m</td>
            <td>建设年份:</td>
            <td>{{ airport.built_year }}年</td>
           
          </tr>
          <tr>
           <td>最长跑道:</td>
            <td>{{ airport.runway }}m</td>
           <td>管理机构:</td>
            <td>{{ airport.company }}</td>
          </tr>
          <tr>
            <td >所属民航地区管理局:</td>
            <td >{{ airport.bureau_name }}</td>
            
            <td></td>
            <td v-if="false">
              <Button @click="clase(airport)">展示机场位置</Button>
            </td>
          </tr>
        </table>
      </div>
      <div id="chart1"></div>
      <div id="chart2"></div>
      <div class="QXBW" v-show="false">
        <div class="QXBW_title">
          <strong style="font-size: 18px">气象报文</strong>
          <span>日出: 06：00</span>
          <span>日落: 18：12</span>
          <span>UTC+8</span>
        </div>
        <div class="QXBW_content">--</div>
      </div>
    </div>
    <div class="buttom_box">
      <Button
        type="text"
        style="width: 100px; color: #666"
        @click="showAirPlane"
        >机场过滤</Button
      >
      <Button
        type="text"
        style="width: 100px; color: #666"
        @click="$store.state.flightDisplay = true"
        >航显</Button
      >
      <Button type="text" style="width: 100px; color: #666" @click="showPdf"
        >手册</Button
      >
      <Button
        type="text"
        style="width: 100px; color: #666"
        @click="showGroundPdf"
        >地面情况</Button
      >
      <!-- <Button type="primary" style="width:100px">航班日志</Button> -->
    </div>
    <Modal v-model="manual" fullscreen footer-hide @on-cancel="close_manual">
      <div>
        <p
          v-if="false"
          class="arrow"
          style="position: absolute; left: 0; top: 0; z-index: 1"
        >
          <span
            @click="changePdfPage(0)"
            class="turn"
            :class="{ grey: currentPage == 1 }"
            >上一页</span
          >
          {{ currentPage }} / {{ pageCount }}
          <span
            @click="changePdfPage(1)"
            class="turn"
            :class="{ grey: currentPage == pageCount }"
            >下一页</span
          >
        </p>
        <div
          class="pdf"
          :style="'overflow:auto;position:relative'"
          v-show="fileType === 'pdf'"
        >
          <pdf
            v-for="i in numPages"
            :key="i"
            :src="src"
            :page="i"
            @num-pages="pageCount = $event"
            @page-loaded="currentPage = $event"
            @loaded="loadPdfHandler"
          ></pdf>
        </div>
      </div>
    </Modal>
    <Modal
      v-model="groundConditions"
      fullscreen
      footer-hide
      @on-cancel="close_groundConditions"
    >
      <div>
        <p
          v-if="false"
          class="arrow"
          style="position: absolute; left: 0; top: 0; z-index: 1"
        >
          <span
            @click="changeGroundPdfPage(0)"
            class="turn"
            :class="{ grey: GroundcurrentPage == 1 }"
            >上一页</span
          >
          {{ GroundcurrentPage }} / {{ GroundpageCount }}
          <span
            @click="changeGroundPdfPage(1)"
            class="turn"
            :class="{ grey: GroundcurrentPage == GroundpageCount }"
            >下一页</span
          >
        </p>
        <div
          class="pdf"
          :style="'overflow:auto;position:relative'"
          v-show="fileType === 'pdf'"
        >
          <pdf
            v-for="i in numPagesGround"
            :key="i"
            :src="surfacesrc"
            :page="i"
            @num-pages="GroundpageCount = $event"
            @page-loaded="GroundcurrentPage = $event"
            @loaded="loadGroundPdfHandler"
          ></pdf>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import airportMap from "@/utils/planeMenu/airport";
import flightTeack from "@/utils/flightTrack";
import pdf from "vue-pdf";
export default {
  components: {
    pdf,
  },
  data() {
    return {
      tableHeight: window.innerHeight - 90,
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      GroundcurrentPage: 0, // pdf文件页码
      GroundpageCount: 0, // pdf文件总页数
      fileType: "pdf", // 文件类型
      numPages: 0,
      numPagesGround:0,
      manual: false,
      src: "",
      groundConditions: false,
      surfacesrc: "",
      initairport: {
        cn_name: "",
        iata: "",
        lon: "",
        lat: "",
        using_type: "",
        visibility: "", //能见度
        visibilityIcon: "",
        weathers: [
          //未来6小时的，数组长度6个就行。
          {
            time: "",
            weather: "",
            temperature: "",
            weatherUrl: "",
          },
        ],
        departureList: [
          //从凌晨0点到第二天06点间隔一小时
        ],
        arrivalList: [
          //从凌晨0点到第二天06点间隔一小时
        ],

        departureNotList: [
          ////从凌晨1点到24点
        ],
        //当前延误和取消要是有的话，下面的字段最好也有
        departureDelay: 2,
        arrivalDelay: 2,
        departureCancel: 21,
        arrivalCancel: 21,
        //有气象报文的话
        meteorologicalMessage: [
          {
            name: "", //报文类型
            message: "", //报文信息
            detail: "", //报文描述
          },
        ],
      },
      airport: "",
      chartOpationDep: {
        title: {
          text: "起飞航班表",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        color: ["rgba(0,0,255,0.5)", "rgba(255,255,0,0.5)"],
        legend: {
          data: ["执行", "延误执行"],
        },
        dataZoom: [
          {
            type: "inside",
            realtime: true,
            start: 65,
            end: 100,
          },
        ],
        xAxis: {
          data: [],
        },
        yAxis: [
          {
            name: "航班架次(次)",
            type: "value",
          },
        ],
        series: [
          {
            name: "执行",
            type: "line",
            areaStyle: {},
            data: [],
          },
          {
            name: "延误执行",
            type: "line",
            areaStyle: {},
            data: [],
          },
        ],
      },
      chartOpationArr: {
        title: {
          text: "降落航班表",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        color: ["rgba(0,0,255,0.5)", "rgba(255,255,0,0.5)"],
        legend: {
          data: ["执行", "延误执行"],
        },
        xAxis: {
          data: [],
        },
        dataZoom: [
          {
            type: "inside",
            realtime: true,
            start: 65,
            end: 100,
          },
        ],
        yAxis: [
          {
            name: "航班架次(次)",
            type: "value",
          },
        ],
        series: [
          {
            name: "执行",
            type: "line",
            areaStyle: {},
            data: [],
          },
          {
            name: "延误执行",
            type: "line",
            areaStyle: {},
            data: [],
          },
        ],
      },
      chartDep: "",
      chartArr: "",
      showpdfStatus: false,
      showgroundpdfStatus: false,
    };
  },
  methods: {
    close() {
      this.$store.state.searchShow = false;
      this.$store.state.airportInformation_show = false;
      
    },
    back() {
       if(this.$store.state.airportInformation_by==0){
        this.$store.state.airport.show = true;
      this.$store.state.airportInformation_show = false;
      }else{
        this.$store.state.flightDetails.show  = true;
        this.$store.state.airportInformation_show = false;
      }
      
    },
    close_manual() {
      console.log(1);
      this.manual = false;
    },
    close_groundConditions() {
      console.log(2);
      this.groundConditions = false;
    },
    initChartArr(datas) {
      this.chartOpationArr.xAxis.data = [];
      this.chartOpationArr.series[0].data = [];
      this.chartOpationArr.series[1].data = [];
      for (let i = 0; i < datas.length; i++) {
        let item = datas[i];
        if (item.time) {
          this.chartOpationArr.xAxis.data.push(item.time);
          this.chartOpationArr.series[0].data.push(item.arr_hour_count);
          this.chartOpationArr.series[1].data.push(item.delay);
        }
      }
      if (document.getElementById("chart2")) {
        this.chartArr = this.$echarts.init(document.getElementById("chart2"));
        this.chartArr.setOption(this.chartOpationArr);
      }
      return;
    },
    initChartDep(datas) {
      this.chartOpationDep.xAxis.data = [];
      this.chartOpationDep.series[0].data = [];
      this.chartOpationDep.series[1].data = [];
      for (let i = 0; i < datas.length; i++) {
        let item = datas[i];
        if (item.time) {
          this.chartOpationDep.xAxis.data.push(item.time);
          this.chartOpationDep.series[0].data.push(item.dep_hour_count);
          this.chartOpationDep.series[1].data.push(item.delay);
        }
      }
      if (document.getElementById("chart1")) {
        this.chartDep = this.$echarts.init(document.getElementById("chart1"));
        this.chartDep.setOption(this.chartOpationDep);
      }
      return;
    },
    getSelectAirport() {
      this.airport = this.initairport;
      this.initChartDep(this.airport.departureList);
      this.initChartArr(this.airport.arrivalList);
      let url = this.$urlPath.airplane.getAirport;
      let param = {
        airport: this.$store.state.search.select_airport,
      };
      this.$api
        .get(url, param)
        .then((res) => {
          this.$store.state.airportInformation_show = true;
          if (res) {
            this.airport = res[0];
            this.initChartDep(this.airport.departureList);
            this.initChartArr(this.airport.arrivalList);
            this.$store.state.search.select_airport = "";
            this.$store.state.search.select_airportIata = this.airport.iata;
            let pro = {
              airportIcon: "myairport",
            };
            this.showpdfStatus = false;
            this.showgroundpdfStatus = false;
            airportMap.addAirportDetails(
              this.airport.lon,
              this.airport.lat,
              pro,
              "testairport"
            );
          }
        })
        .catch((res) => {
          this.$Message.error(res.data.error);
        });
    },
    initShowInformation() {
      if (this.$store.state.search.select_airport) {
        this.getSelectAirport();
      }
    },
    showAirPlane() {
      let url = this.$urlPath.airplane.getADSBDataByIata;
      let param = {
        iata: this.airport.iata,
      };
      this.$api
        .get(url, param)
        .then((res) => {
          flightTeack.addAirplaneByIata(res);
        })
        .catch((res) => {
          this.$Message.error(res.data.error);
        });
    },
    changePdfPage(val) {
      // console.log(val)
      if (val === 0 && this.currentPage > 1) {
        this.currentPage--;
        // console.log(this.currentPage)
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++;
        // console.log(this.currentPage)
      }
    },
    changeGroundPdfPage(val) {
      // console.log(val)
      if (val === 0 && this.GroundcurrentPage > 1) {
        this.GroundcurrentPage--;
        // console.log(this.currentPage)
      }
      if (val === 1 && this.GroundcurrentPage < this.GroundpageCount) {
        this.GroundcurrentPage++;
        // console.log(this.currentPage)
      }
    },
    // pdf加载时
    loadPdfHandler(e) {
      this.currentPage = 1; // 加载的时候先加载第一页
    },
    // pdf加载时
    loadGroundPdfHandler(e) {
      this.GroundcurrentPage = 1; // 加载的时候先加载第一页
    },
    showGroundPdf() {
      this.groundConditions = true;
      if (this.showgroundpdfStatus) {
        return;
      }
      this.surfacesrc = pdf.createLoadingTask(
        this.$urlPath.pdfsurfaceurl + this.airport.cn_name + ".pdf"
      );
      this.surfacesrc.promise.then((pdf) => {
        this.numPagesGround = pdf.numPages;
      });
      this.showgroundpdfStatus = true;
    },
    showPdf() {
      this.manual = true;
      if (this.showpdfStatus) {
        return;
      }
      this.src = pdf.createLoadingTask(
        this.$urlPath.pdfmanurl + this.airport.cn_name + ".pdf"
      );
      this.src.promise.then((pdf) => {
        this.numPages = pdf.numPages;
      });
      this.showpdfStatus = true;
    },
  },
  mounted() {
    this.initShowInformation();
  },
  computed: {
    selectAirport() {
      return this.$store.state.search.select_airport;
    },
  },
  watch: {
    selectAirport(val) {
      console.log(val);
      if (val) {
        this.getSelectAirport();
      } else {
        return;
      }
    },
  },
};
</script>

<style scoped>
#airportInformation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(235, 235, 235);
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
.weather_box {
  padding: 10px;
  background-color: rgb(36, 140, 253);
}
.weather {
  display: flex;
}
.weather img {
  width: 30px;
  height: 30px;
}
.weather_top {
  display: flex;
  justify-content: space-between;
  align-content: center;
  padding: 10px;
}
.weather_left {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  /* width: 80px; */
  /* height: 80px; */
  padding-right: 20px;
  border-right: 1px solid #ccc5;
}
.weather_left > div {
  display: flex;
}
.weather_right_box {
  display: flex;
  overflow-x: auto;
}
.weather_right {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 10px;
  min-width: 60px;
  height: 80px;
}

.JCXQ {
  background-color: #fff;
  margin-bottom: 10px;
  color: #000;
  padding: 5px;
}

#chart1,
#chart2 {
  width: 100%;
  height: 200px;
  margin-bottom: 10px;
  background-color: #fff;
}
.QXBW {
  background-color: #fff;
  color: #555;
}
.QXBW .QXBW_title {
  padding: 10px;
  border-bottom: 1px solid #ccc5;
}
.QXBW_content {
  padding: 10px;
  min-height: 50px;
  border-bottom: 1px solid #ccc5;
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