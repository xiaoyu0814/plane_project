<template>
  <div id="timeShow" class="box"  v-if="$store.state.time_module">
    <div id="progressTime_control" onclick="TimeProgress.progressTimeControl(this)" title="开始"></div>
    <div class="progressTime" id="progressTime" style="z-index:9">
      <div>
        <p id="startTime" style=" float:left;margin-left:33px;opacity: 0;display: none;"></p>
        <p id="endTime" style=" float:right;margin-right:33px;opacity: 0;display: none;"></p>
      </div>
      <div class="time_slot"></div>
      <div id="progressTime_concent">
        <div id="scrollBarBox">
          <div id="scrollBar">
            <div id="scroll_Track"></div>
            <div id="scroll_Thumb"></div>
          </div>
        </div>
        <div class="timecode"></div>
        <div style="width:90%; margin-left: auto;margin-right: auto;">
          <div style="width:300px;float:right;margin-right:-110px;margin-top:-8px">
            <p id="TimeSpeed" style="float:left;margin-right:40px;display:none">×1</p>
            <p style="float:right" id="scrollBarTxt"></p>
          </div>
        </div>
      </div>
    </div>
    <div class="set" @click="set_box=!set_box" v-if="false">
      <Icon type="md-settings" />
    </div>

    <Modal 
    title="播放设置" 
    v-model="$store.state.setTime_box" 
    class-name="vertical-center-modal"
      @on-ok="timeOk"
    >
      <div class="set_box">
        <Row type="flex" justify="start" align="middle" class="code-row-bg">
          <i-col span="6">起始时间</i-col>
          <i-col span="10">
            <DatePicker
              v-if="false"
              v-model="time_value"
              type="datetime"
              placeholder="选择时间"
              @focus="forbid"
              :disabled="nowTime"
              readonly
            ></DatePicker>
            <input
              class="DatePicker"
              type="text"
              @click="openByDrop($event)"
              v-model="calendar3.display"
              readonly
              :style="nowTime?{color:'#ccc'}:{}"
            />
          </i-col>
          <i-col span="1"></i-col>
          <i-col span="4">
            <i-switch v-model="nowTime" @on-change="change_nowTime" />
          </i-col>
          <i-col span="2">实时</i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" class="code-row-bg" style="margin-top:10px">
          <i-col span="6">时间长度</i-col>
          <i-col span="10">
            <Select v-model="timeInval">
              <Option
                v-for="item in time_list"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </i-col>
          <i-col span="6"></i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" class="code-row-bg" style="margin-top:10px">
          <i-col span="6">频次</i-col>
          <i-col span="4">
            <InputNumber :max="100" :min="1" v-model="frequency" @on-change="change_Frequency"></InputNumber>
          </i-col>
          <i-col span="6"></i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" class="code-row-bg" style="margin-top:10px">
          <i-col span="6">回放加速率</i-col>
          <i-col span="4">
            <InputNumber :max="10" :min="1" v-model="speed"></InputNumber>
          </i-col>
          <i-col span="4">{{unitLabel}}/帧</i-col>
          <i-col span="2">单位</i-col>
          <i-col span="6">
            <Select v-model="unit" @on-change="change_Unit">
              <Option
                v-for="item in unit_list"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </i-col>
        </Row>
      </div>
      <transition name="fade">
        <div
          class="calendar-dropdown"
          :style="{'left':calendar3.left+'px','top':calendar3.top+'px'}"
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
  </div>
</template>
<script>
import calendar from "@/components/planeMenu/calendar.vue";
import dateFormatter from "@/utils/dateFormatter";
export default {
  components: {
    calendar,
  },
  data() {
    return {
      time_value: "2018/08/01 00:00:00",
      set_box: false,
      nowTime: false,
      frequency: 1,
      speed: 1,
      timeInval:"day",
      time_list: [
        {
          label: "1天",
          value: "day",
        },
        {
          label: "1月",
          value: "month",
        },
        {
          label: "1年",
          value: "year",
        },
      ],
      unitLabel:"秒",
      unit: "Hours",
      unit_list: [
        {
          label: "秒",
          value: "Scend",
        },
        {
          label: "分",
          value: "Minute",
        },
        {
          label: "小时",
          value: "Hours",
        },
        {
          label: "日",
          value: "Day",
        },
        {
          label: "月",
          value: "Month",
        },
        {
          label: "年",
          value: "Year",
        },
      ],
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
          console.log(value)
        },
      },
    };
  },
  methods: {
    openByDrop(e) {
      if (this.nowTime) {
        return
      }
      this.calendar3.show = true;
      this.calendar3.left = e.target.offsetLeft + 143;
      this.calendar3.top = e.target.offsetTop + 117;

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
    forbid() {
      //禁止软键盘弹出
      document.activeElement.blur();
    },
    change_nowTime(status) {
      this.nowTime = status;
      this.time_value = new Date();
    },
    change_Frequency(num) {
      console.log(num);
      //this.frequency = num;
      let _speed = Math.ceil(1000 / num);
      TimeProgress._speed = _speed;
    },
    change_Unit() {
      TimeProgress.setUnit(this.unit);
    },
    timeOk(){
      console.log(this.time_value);
      let dateTemp = new Date(this.calendar3.display.replace("/","-"));
      TimeProgress.unit = this.unit;
      if(this.timeInval == "day"){
        
        let starttime = dateFormatter("yyyy-MM-dd",new Date(dateTemp))+" 00:00:00";
        dateTemp.setTime(dateTemp.getTime()+24*60*60*1000);
        let endtime = dateFormatter("yyyy-MM-dd",new Date(dateTemp))+" 00:00:00";
        this.setTimeValue(starttime,endtime)
        
      }else if(this.timeInval == "month"){
         let starttime = dateFormatter("yyyy-MM-dd",new Date(dateTemp))+" 00:00:00";
        dateTemp.setTime(dateTemp.getTime()+30*24*60*60*1000);
        let endtime = dateFormatter("yyyy-MM-dd",new Date(dateTemp))+" 00:00:00";
        this.setTimeValue(starttime,endtime)

      }else if(this.timeInval=="year"){
         let starttime = dateFormatter("yyyy-MM-dd",new Date(dateTemp))+" 00:00:00";
        dateTemp.setTime(dateTemp.getTime()+367*24*60*60*1000);
        let endtime = dateFormatter("yyyy-MM-dd",new Date(dateTemp))+" 00:00:00";
        this.setTimeValue(starttime,endtime)

      }
    },
    setTimeValue(start,end){
        TimeProgress.SetProgressTime(
          "",
          start,
          end)
    },
    initTime() {
      if(TimeProgress.startTime){
          TimeProgress.SetProgressTime(
          "",
          TimeProgress.startTime,
          TimeProgress.endTime
        );
      }else{

      }
     
    },
  },
  mounted() {
    this.initTime();
    var contW = $(".ivu-modal-content-drag").width();
    var contH = $(".ivu-modal-content-drag").height();
    var startX, startY, sX, sY, moveX, moveY, leftX, rightX, topY, bottomY;
    var winW = $(window).width();
    var winH = $(window).height();
    $(".ivu-modal-content-drag").on({
      //绑定事件
      touchstart: function (e) {
        startX = e.originalEvent.targetTouches[0].pageX; //获取点击点的X坐标
        startY = e.originalEvent.targetTouches[0].pageY; //获取点击点的Y坐标
        sX = $(this).offset().left; //相对于当前窗口X轴的偏移量
        sY = $(this).offset().top; //相对于当前窗口Y轴的偏移量
        leftX = startX - sX; //鼠标所能移动的最左端是当前鼠标距div左边距的位置
        rightX = winW - contW + leftX; //鼠标所能移动的最右端是当前窗口距离减去鼠标距div最右端位置
        topY = startY - sY; //鼠标所能移动最上端是当前鼠标距div上边距的位置
        bottomY = winH - contH + topY; //鼠标所能移动最下端是当前窗口距离减去鼠标距div最下端位置
      },
      touchmove: function (e) {
        e.preventDefault();
        //移动过程中XY轴的坐标要减去margin的距离
        moveX = e.originalEvent.targetTouches[0].pageX; //移动过程中X轴的坐标
        moveY = e.originalEvent.targetTouches[0].pageY; //移动过程中Y轴的坐标
        //判断的时候要计算加上padding的距离
        if (moveX < leftX) {
          moveX = leftX;
        }
        if (moveX > rightX) {
          moveX = rightX;
        }
        if (moveY < topY) {
          moveY = topY;
        }
        if (moveY > bottomY) {
          moveY = bottomY;
        }
        $(this).css({
          left: moveX + sX - startX,
          top: moveY + sY - startY,
        });
      },
    });
  },
};
</script>

<style scoped>
.set {
  width: 42px;
  height: 42px;
  float: left;
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.set_box {
  background-color: #555;
  padding: 10px;
  color: white;
  z-index: 100;
}
.set_box p {
  font-size: 18px;
  margin-bottom: 5px;
}
.set_box > table td:nth-child(2) {
  color: black;
}

.DatePicker {
  box-sizing: border-box;
  width: 100%;
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
  left: 0;
  top: 0;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 2px;
}
.calendar-dropdown:before {
  position: absolute;
  left: 30px;
  top: -10px;
  content: "";
  border: 5px solid rgba(0, 0, 0, 0);
  border-bottom-color: #dedede;
}
.calendar-dropdown:after {
  position: absolute;
  left: 30px;
  top: -9px;
  content: "";
  border: 5px solid rgba(0, 0, 0, 0);
  border-bottom-color: #fff;
}

.ivu-input-number {
  width: 100%;
}
</style>