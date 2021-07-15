<template>
  <div id="show_calendar" v-if="$store.state.show_calendar">
    <div class="title">
      <van-icon name="arrow-left" @click="back" />选择日期
      <van-icon name="cross" @click="close" />
    </div>

    <van-calendar
      :lazy-render="false"
      :default-date="new Date()"
      :min-date="new Date(2000, 0, 0)"
      :show-title="false"
      :poppable="false"
      :show-confirm="false"
      color="rgb(36,140,253)"
      @select="select"
      :style="{ color: '#333', height: 'calc(100% - 60px)' }"
    />

    <calendar
      v-if="false"
      ref="calendar1"
      :events="calendar1.events"
      :lunar="calendar1.lunar"
      :value="calendar1.value"
      :begin="calendar1.begin"
      :end="calendar1.end"
      :weeks="calendar1.weeks"
      :months="calendar1.months"
      @select="calendar1.select"
      @selectMonth="calendar1.selectMonth"
      @selectYear="calendar1.selectYear"
    ></calendar>
  </div>
</template>

<script>
import calendar from "./calendar.vue";
import dateFormatter from "@/utils/dateFormatter";
export default {
  components: {
    calendar,
  },
  data() {
    return {
      calendar1: {
        value: [], //默认日期
        lunar: true, //显示农历
        weeks: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        // months:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        // events:{
        //     '2017-7-7':'$408',
        //     '2017-7-20':'$408',
        //     '2017-7-21':'$460',
        //     '2017-7-22':'$500',
        // },
        select(value) {
          console.log(value.toString());
        },
        selectMonth(month, year) {
          console.log(year, month);
        },
        selectYear(year) {
          console.log(year);
        },
        timestamp: Date.now(),
      },
    };
  },
  methods: {
    close() {
      this.$store.state.searchShow = false;
      this.$store.state.show_calendar = false;
    },
    back() {
      this.$store.state.show_calendar = false;
    },
    select(value) {
      console.log(value);
      this.$store.state.show_calendar = false;
      if (this.$store.state.search.dateStatus) {
        this.$store.state.search.dateStatus = false;
        this.$store.state.search.date = dateFormatter("yyyy-MM-dd", value);
      }
      this.$store.state.search.date = dateFormatter("yyyy-MM-dd", value);
    },
  },
  mounted() {},
};
</script>

<style scoped>
#show_calendar {
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
</style>>