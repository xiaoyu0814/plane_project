<template>
  <!-- 飞行计划 -->
  <Modal v-model="flightPlan_show" fullscreen footer-hide title="飞行计划列表" @on-cancel="close">
    <div class="screen_box">
      <div class="screen_box_left">
        <span>起飞机场</span>
        <Select v-model="airportOfDeparture" style="width:150px" @on-change="airportChange">
          <Option
            v-for="item in airportOfDeparture_list"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
        <span>降落机场</span>
        <Select v-model="airportOfLanding" style="width:150px" @on-change="airportChange">
          <Option
            v-for="item in airportOfLanding_list"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </div>
      <div class="screen_box_right">
        <Checkbox v-model="playback_Checkbox">仅显示当前回放/监视时刻航班</Checkbox>
        <span>选择日期</span>
        <DatePicker
          v-if="false"
          v-model="flightDate"
          format="yyyy-MM-dd"
          type="date"
          placeholder="请选择日期"
          style="width: 120px;color:#000"
        ></DatePicker>
        <input
          class="DatePicker"
          type="text"
          @click="openByDrop($event)"
          v-model="calendar3.display"
          readonly
        />
        <Input v-model="flightNumber" placeholder="请输入航班号" style="width: 120px" />
        <Button @click="query">查询</Button>
      </div>
    </div>
    <Table
      :height="tableHeight"
      :width="tableWidth"
      :columns="flightPlan_tableHeader"
      :data="flightPlan_tableData"
      border
    ></Table>
    <div style="margin-top:10px;text-align:center;">
      <Page :total="total" :current="current" :page-size="20" @on-change="flightPlanChangePage" />
    </div>
    <transition name="fade">
      <div
        class="calendar-dropdown"
        :style="{'right':calendar3.right+'px','top':calendar3.top+'px'}"
        v-if="calendar3.show"
      >
        <calendar
          :zero="calendar3.zero"
          :lunar="calendar3.lunar"
          :value="calendar3.value"
          :begin="calendar3.begin"
          :end="calendar3.end"
          @select="calendar3.select"
        ></calendar>
      </div>
    </transition>
  </Modal>
</template>
<script>
import dateFormatter from "@/utils/dateFormatter";
import calendar from "@/components/planeMenu/calendar.vue";
export default {
  components: {
    calendar,
  },
  data() {
    return {
      tableHeight: window.innerHeight - 175,
      tableWidth: window.innerWidth - 30,
      flightPlan_show: false,
      airportOfDeparture: "全国机场",
      airportOfDeparture_list: [
        {
          label: "全国机场",
          value: "全国机场",
        },
      ],
      airportOfLanding: "全国机场",
      airportOfLanding_list: [
        {
          label: "全国机场",
          value: "全国机场",
        },
      ],
      playback_Checkbox: false,
      flightDate: "2018-10-01",
      flightNumber: "CHH7105",
      flightPlan_tableHeader: [
        {
          type: "index",
          width: 60,
          align: "center",
        },
        {
          title: "航班号",
          key: "callsign",
          resizable: true,
          width: 100,
          align: "center",
        },
        {
          title: "起飞机场",
          key: "departure",
          resizable: true,
          width: 120,
          align: "center",
        },
        {
          title: "降落机场",
          key: "arrival",
          resizable: true,
          width: 100,
          align: "center",
        },
        {
          title: "计划起飞时间",
          key: "dep_datetime_plan",
          resizable: true,
          width: 150,
          align: "center",
        },
        {
          title: "实际起飞时间",
          key: "dep_datetime_real",
          resizable: true,
          width: 150,
          align: "center",
        },
        {
          title: "计划降落时间",
          key: "arr_datetime_plan",
          resizable: true,
          width: 150,
          align: "center",
        },
        {
          title: "实际降落时间",
          key: "arr_datetime_real",
          resizable: true,
          width: 150,
          align: "center",
        },
        {
          title: "计划机型",
          key: "aircraft_type_plan",
          resizable: true,
          width: 100,
          align: "center",
        },
        {
          title: "实际机型",
          key: "aircraft_type_real",
          resizable: true,
          width: 100,
          align: "center",
        },
        {
          title: "机尾号(计划)",
          key: "aircraft_code_plan",
          resizable: true,
          width: 120,
          align: "center",
        },
        {
          title: "机尾号(实际)",
          key: "aircraft_code_real",
          resizable: true,
          width: 120,
          align: "center",
        },
        {
          title: "计划路线",
          key: "route_plan",
          resizable: true,
          width: 300,
          align: "center",
        },
        {
          title: "实际路线",
          key: "route_real",
          resizable: true,
          width: 100,
          align: "center",
        },
        {
          title: "客货类型",
          key: "tranport_type",
          resizable: true,
          width: 100,
          align: "center",
        },
      ],
      flightPlan_tableData: [
        {
          callsign: "QDA9854",
          tranport_type: "客运",
          departure: "张家界/荷花",
          arrival: "青岛/流亭",
          airline_company: "青岛航空股份有限公司",
          dep_datetime_plan: "2018-10-20 23:20:00",
          dep_datetime_real: "2018-10-21 00:00:00",
          arr_datetime_plan: "2018-10-21 01:38:00",
          arr_datetime_real: "2018-10-21 01:54:00",
          aircraft_type_plan: "A320",
          aircraft_type_real: null,
          aircraft_code_plan: "B1648",
          aircraft_code_real: null,
          route_plan:
            " DYG W141 LIN A581 WHA W88 HOK A461 WXI H20 WFG H30  P308 J96 GOD OP W5 ATLED",
          route_real: null,
        },
      ],
      current: 1,
      total: 13000,
      calendar3: {
        display: "请选择日期",
        show: false,
        zero: true,
        value: [], //默认日期
        lunar: true, //显示农历
        select: (value) => {
          this.calendar3.show = false;
          this.calendar3.value = value;
          this.calendar3.display = value.join("/");
          this.flightDate = value.join("-");
        },
      },
    };
  },
  methods: {
    openByDrop(e) {
      this.calendar3.show = true;
      this.calendar3.right = 15;
      this.calendar3.top = e.target.offsetTop + 40;

      e.stopPropagation();
      window.setTimeout(() => {
        document.addEventListener(
          "click",
          (e) => {
            this.calendar3.show = false;
            document.removeEventListener("click", () => {}, false);
          },
          false
        );
      }, 1000);
    },
    show() {
      this.flightPlan_show = true;
      this.allAirportByBureau();
      this.timePointListnNum();
      this.timePointList();
    },
    close() {
      this.flightPlan_show = false;
    },
    airportChange() {
      let aircraft_code_type = [
        "318",
        "319",
        "320",
        "321",
        "330",
        "340",
        "350",
        "380",
        "737",
        "747",
        "757",
        "767",
        "777",
        "787",
        "其他",
      ];
      this.current = 1;
      let url = this.$urlPath.airplane.getTimestampPointList;
      let departure =
        this.airportOfDeparture == "全国机场" ? "" : this.airportOfDeparture;
      let arrival =
        this.airportOfLanding == "全国机场" ? "" : this.airportOfLanding;
      let param = {
        time: dateFormatter("yyyy-MM-dd HH:mm:ss", this.flightDate),
        index: this.current,
        departure: departure,
        arrival: arrival,
        type_group: aircraft_code_type.toString(),
      };
      this.$api
        .get(url, param)
        .then((res) => {
          this.flightPlan_tableData = res;
        })
        .catch((res) => {
          this.$Message.error("请求错误");
        });
    },
    flightPlanChangePage(page) {
      this.current = page;
      this.timePointList();
    },
    // 航班的计划列表数量
    timePointListnNum() {
      let url = this.$urlPath.airplane.getTimePointListNum;
      this.$api.get(url).then((res) => {
        this.total = Number(res[0].total);
      });
    },
    // 航班的计划列表
    timePointList() {
      let url = this.$urlPath.airplane.getTimePointList;
      let param = {
        index: this.current,
      };
      this.$api.get(url, param).then((res) => {
        this.flightPlan_tableData = res;
      });
    },
    //返回全部机场
    allAirportByBureau() {
      let url = this.$urlPath.airplane.getAirportByBureau;
      this.$api.get(url).then((res) => {
        if (res.length > 0) {
          this.airportOfLanding_list = [
            {
              label: "全国机场",
              value: "全国机场",
            },
          ];
          this.airportOfDeparture_list = [
            {
              label: "全国机场",
              value: "全国机场",
            },
          ];
          res.forEach((item) => {
            let temp = {
              label: item,
              value: item,
            };
            this.airportOfLanding_list.push(temp);
            this.airportOfDeparture_list.push(temp);
          });
        }
      });
    },
    // 按照具体时刻返回航班的计划列表
    timestampPointList() {
      // let url = `${this.$urlPath.airplane.getTimestampPointList}?time=${this.flightDate} 00:00:00`;
      let url = this.$urlPath.airplane.getTimestampPointList;
      let param = {
        time: dateFormatter("yyyy-MM-dd HH:mm:ss", this.flightDate),
        index: this.current,
      };
      this.$api.get(url, param).then((res) => {
        this.flightPlan_tableData = res;
      });
    },
    // 按照航班号返回航班的计划列表
    timePointListByName() {
      // let url = `${this.$urlPath.airplane.getTimePointListByName}?callsign=${this.flightNumber}&${this.flightDate}`;
      let url = this.$urlPath.airplane.getTimePointListByName;
      let param = {
        callsign: this.flightNumber,
        time: dateFormatter("yyyy-MM-dd HH:mm:ss", this.flightDate),
      };
      this.$api.get(url, param).then((res) => {
        this.flightPlan_tableData = res;
      });
    },
    query() {
      this.current = 1;
      if (this.flightDate === "" && this.flightNumber === "") {
        this.timePointListnNum();
        this.timePointList();
      } else {
        if (this.flightNumber) {
          this.timePointListByName();
        } else {
          this.timestampPointList();
        }
      }
    },
  },
};
</script>

<style scoped>
span.ivu-date-picker-cells-cell {
  color: black;
}
.screen_box {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.ivu-date-picker-cells span {
  color: black;
}

.DatePicker {
  box-sizing: border-box;
  width: 120px;
  border-radius: 4px;
  border: 1px solid #dedede;
  padding: 6px 10px;
  background: #fff
    url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWwpAZm9udC1mYWNlIHsgZm9udC1mYW1pbHk6IGlmb250OyBzcmM6IHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xNDQyMzczODk2XzQ3NTQ0NTUuZW90PyNpZWZpeCIpIGZvcm1hdCgiZW1iZWRkZWQtb3BlbnR5cGUiKSwgdXJsKCIvL2F0LmFsaWNkbi5jb20vdC9mb250XzE0NDIzNzM4OTZfNDc1NDQ1NS53b2ZmIikgZm9ybWF0KCJ3b2ZmIiksIHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xNDQyMzczODk2XzQ3NTQ0NTUudHRmIikgZm9ybWF0KCJ0cnVldHlwZSIpLCB1cmwoIi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfMTQ0MjM3Mzg5Nl80NzU0NDU1LnN2ZyNpZm9udCIpIGZvcm1hdCgic3ZnIik7IH0KCl1dPjwvc3R5bGU+PC9kZWZzPjxnIGNsYXNzPSJ0cmFuc2Zvcm0tZ3JvdXAiPjxnIHRyYW5zZm9ybT0ic2NhbGUoMC4wMTU2MjUsIDAuMDE1NjI1KSI+PHBhdGggZD0iTTcxMS4zMDYyIDI5MC42OTcyYzI0LjI4MjEgMCA0NS4zNzY1LTE5LjcwNjkgNDUuMzc2NS00NC4wMzJWNDYuNTYwMjU1OTk5OTk5OTk1YzAtMjQuMzI1MS0yMS4wOTU0LTQ0LjA1MzUtNDUuMzc2NS00NC4wNTM1LTI0LjMwMjYgMC00My45ODggMTkuNzI4NC00My45ODggNDQuMDUzNXYyMDAuMTA0OTZDNjY3LjMxODMgMjcwLjk5MDMgNjg3LjAwMzYgMjkwLjY5NzIgNzExLjMwNjIgMjkwLjY5NzJ6TTYyMy40ODA4IDExMy40MjAzSDQwMC43NjQ5Mjh2NjYuNTEzOTJoMjIyLjcxNTkwNDAwMDAwMDAyVjExMy40MjAyODh6TTg4NC4wNTMgMTEzLjQyMDNoLTgyLjc3NDAxNnY2Ni4xNDUyOGg4NS45NDAyMjRjMjUuMjc4NSAwIDQ2LjYxMTUgMjEuMzc2IDQ2LjYxMTUgNDYuNjc3djE1My45Mjc2OEg5MC40Mzg2NTYwMDAwMDAwMXYtMTUzLjkyNzY4YzAtMjUuMyAyMS4zMzMtNDYuNjc3IDQ2LjYxMTUtNDYuNjc3aDg2LjUwMzQyNFYxMTMuNDIwMjg4aC04Mi42NDI5NDRjLTY0LjA4NiAwLTExNi41MDc2IDUyLjUwODctMTE2LjUwNzYgMTE2LjcwMzJ2Njc2LjgwMTUzNTk5OTk5OTljMCA2NC4xNzQxIDUwLjQ5MTQgMTE2LjY4MDcgMTE0LjU3NzQgMTE2LjY4MDdIODg0LjA1Mjk5MmM2NC4wNjI1IDAgMTE2LjUwNjYtNTIuNTA2NiAxMTYuNTA2Ni0xMTYuNjgwN1YyMzAuMTIzNTE5OTk5OTk5OThDMTAwMC41NTk2IDE2NS45MjkgOTQ4LjExNDQgMTEzLjQyMDMgODg0LjA1MyAxMTMuNDIwM3pNOTMzLjgyOTYgOTEwLjM1MTRjMCAyNS4zLTIxLjMzMyA0Ni42NzYtNDYuNjExNSA0Ni42NzZIMTM3LjA1MDExMTk5OTk5OTk4Yy0yNS4yNzg1IDAtNDYuNjExNS0yMS4zNzYtNDYuNjExNS00Ni42NzZWNDQ2LjQ0NTU2OEg5MzMuODI5NjMyVjkxMC4zNTEzNnpNMjY3LjEwODQgNjQ2LjE4MTljMzYuODc3MyAwIDY2Ljc1MjUtMjkuOTM5NyA2Ni43NTI1LTY2Ljg4MTUgMC0zNi45MjI0LTI5Ljg3NTItNjYuODYxMS02Ni43NTI1LTY2Ljg2MTEtMzYuODU0OCAwLTY2Ljc1MjUgMjkuOTM5Ny02Ni43NTI1IDY2Ljg2MTFDMjAwLjM1NTggNjE2LjI0MjIgMjMwLjI1MjUgNjQ2LjE4MTkgMjY3LjEwODQgNjQ2LjE4MTl6TTUxMS41NDg0IDY0Ni4xODE5YzM2Ljg1NTggMCA2Ni43NTI1LTI5LjkzOTcgNjYuNzUyNS02Ni44ODE1IDAtMzYuOTIyNC0yOS44OTU3LTY2Ljg2MTEtNjYuNzUyNS02Ni44NjExLTM2Ljg3NzMgMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44NjExQzQ0NC43OTU5IDYxNi4yNDIyIDQ3NC42NzExIDY0Ni4xODE5IDUxMS41NDg0IDY0Ni4xODE5ek0yNjUuOTE2NCA4OTAuNzA5YzM2Ljg3NzMgMCA2Ni43NTE1LTI5LjkzOTcgNjYuNzUxNS02Ni44NjExIDAtMzYuOTQyOC0yOS44NzQyLTY2Ljg4MjYtNjYuNzUxNS02Ni44ODI2LTM2Ljg1NTggMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44ODI2QzE5OS4xNjM5IDg2MC43NjkzIDIyOS4wNTk2IDg5MC43MDkgMjY1LjkxNjQgODkwLjcwOXpNNTExLjU0ODQgODkwLjcwOWMzNi44NTU4IDAgNjYuNzUyNS0yOS45Mzk3IDY2Ljc1MjUtNjYuODYxMSAwLTM2Ljk0MjgtMjkuODk1Ny02Ni44ODI2LTY2Ljc1MjUtNjYuODgyNi0zNi44NzczIDAtNjYuNzUyNSAyOS45Mzk3LTY2Ljc1MjUgNjYuODgyNkM0NDQuNzk1OSA4NjAuNzY5MyA0NzQuNjcxMSA4OTAuNzA5IDUxMS41NDg0IDg5MC43MDl6TTc1NS42NDEzIDY0Ni4xODE5YzM2Ljg1NjggMCA2Ni43NTM1LTI5LjkzOTcgNjYuNzUzNS02Ni44ODE1IDAtMzYuOTIyNC0yOS44OTY3LTY2Ljg2MTEtNjYuNzUzNS02Ni44NjExLTM2Ljg3NzMgMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44NjExQzY4OC44ODk5IDYxNi4yNDIyIDcxOC43NjQgNjQ2LjE4MTkgNzU1LjY0MTMgNjQ2LjE4MTl6TTMxMS43MDM2IDI5MC42OTcyYzI0LjI4MTEgMCA0NS4zNzY1LTE5LjcwNjkgNDUuMzc2NS00NC4wMzJWNDYuNTYwMjU1OTk5OTk5OTk1YzAtMjQuMzI1MS0yMS4wOTQ0LTQ0LjA1MzUtNDUuMzc2NS00NC4wNTM1LTI0LjMwMTYgMC00My45ODkgMTkuNzI4NC00My45ODkgNDQuMDUzNXYyMDAuMTA0OTZDMjY3LjcxNDYgMjcwLjk5MDMgMjg3LjQwMiAyOTAuNjk3MiAzMTEuNzAzNiAyOTAuNjk3MnoiIGZpbGw9IiM1ZTdhODgiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==)
    no-repeat right 8px center;
  color: #666;
}
/*下拉框*/
.calendar-dropdown {
  background: #fff;
  position: absolute;
  /* left: 0; */
  top: 0;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 2px;
  z-index: 3;
}
.calendar-dropdown:before {
  position: absolute;
  left: 50px;
  top: -10px;
  content: "";
  border: 5px solid rgba(0, 0, 0, 0);
  border-bottom-color: #dedede;
}
.calendar-dropdown:after {
  position: absolute;
  left: 50px;
  top: -9px;
  content: "";
  border: 5px solid rgba(0, 0, 0, 0);
  border-bottom-color: #fff;
}
</style>