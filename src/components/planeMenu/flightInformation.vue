<template>
  <div id="flightInformation" v-if="$store.state.flightInformation_show">
    <div class="title">
      <van-icon name="arrow-left" @click="back" />
      <div style="text-align:center">
        <div>{{$store.state.search.startAirport}} - {{$store.state.search.endAirport}}</div>
        <div style="font-size:14px">{{$store.state.search.date}}</div>
      </div>
      <van-icon name="cross" @click="close" />
    </div>
    <ul class="list_box">
      <li class="box_shadow" v-for="(item,index) in list" :key="index" @click="goToDetails(item)">
        <div class="flex" style="border-bottom:1px solid #ccc">
          <div>
            <span>{{item.airline_company}}</span>
            <span>{{item.name}}</span>
            <span>{{item.jixing}}</span>
          </div>
        </div>
        <div class="flex">
          <div>
            <span style="color:#888">{{item.departure.IATA}}</span>
            <span class="font1">{{item.departure.name}}</span>
          </div>
          <div v-if="item.status == '提前取消'" style="color:rgb(255,0,0);font-size:12px">{{item.status}}</div>
          <div v-else-if="item.status == '起飞'"  style="color:rgb(0,255,0);font-size:12px">{{item.status}}</div>
          <div v-else style="color:rgb(36,140,253);font-size:12px">{{item.status}}</div>
          <div>
            <span class="font1">{{item.arrival.name}}</span>
            <span style="color:#888">{{item.arrival.IATA}}</span>
          </div>
        </div>
        <div class="flex" style="padding-top:0">
          <div>
            <strong style="font-size:20px">{{item.departure.dep_datetime_plan}}</strong>
            <span class="font1">计划</span>
          </div>
          <div>
            <span class="font1" style="color:#666">飞行时长</span>
            <span class="font1" style="color:#666">{{item.flytime}}</span>
          </div>
          <div>
            <span class="font1">计划</span>
            <strong style="font-size:20px">{{item.arrival.arr_datetime_plan}}</strong>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      derails: "",
      list: [
       
      ],
    };
  },
  methods: {
    close() {
      this.$store.state.searchShow = false;
      this.$store.state.segment_show = false;
      this.$store.state.flightInformation_show = false;
    },
    back() {
      this.$store.state.flightInformation_show = false;
    },
    goToDetails(item) {
      this.$store.state.flightDetails.show = true;
      this.$store.state.flightDetails.value = item;
    },
    goToDetails(item){
      let url = this.$urlPath.airplane.getAirlineInformation;
      let param = {
        callsign:item.name,
        timeStr:this.$store.state.search.date
      }
      this.$api.get(url,param).then((res)=>{
        console.log(res);
        if(res.length>0){
            this.$store.state.flightDetails.show = true;
            let arrdate = res[0].arrival.arr_datetime_plan.split(" ")[0]
            res[0].arrival.time = arrdate
            let depdate = res[0].departure.dep_datetime_plan.split(" ")[0]
            res[0].departure.time = depdate
            this.$store.state.flightDetails.value = res[0];
           
        }else{
          this.$Message.error("数据为空")
        }
      }).catch(res=>{
        this.$Message.error(res.data.error)
      })
    },
    getList(){
      let url = this.$urlPath.airplane.getAirlinesList;
      let aviation = this.$store.state.search.aviation;
      if(this.$store.state.search.aviation == "不限"){
        aviation = ""
      }
      //this.$store.state.search.date
      let param = {
        depDatetime:this.$store.state.search.date,
        arrDatetime:this.$store.state.search.date,
        departureAirportName:this.$store.state.search.startAirport.split(" ")[0],
        arrivalAirportName:this.$store.state.search.endAirport.split(" ")[0],
        airlineCompany:aviation
      }
      this.$api.get(url,param).then((res)=>{
        console.log(res);
        if(res.length>0){
          this.list =res
        }else{
           this.$Message.error("数据为空")
        }
       
      }).catch(res=>{
        this.$Message.error(res.data.error)
      })

    }
  },
  computed:{
    flightInformation(){
       console.log("ddd")
      return this.$store.state.flightInformation_show;
    }
  },
  watch:{
    flightInformation(val){
      console.log(val);
      if(val){
         this.list =[];
        this.getList()
      }else{
        return
      }
    }
  },
  mounted() {
    
  },
};
</script>

<style scoped>
#flightInformation {
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
.list_box {
  height: calc(100% - 60px);
  overflow-y: auto;
}
.box_shadow {
  margin-bottom: 10px;
  box-shadow: 0px 5px 5px #ccc;
}
.flex {
  background-color: #fff;
  color: #000;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex div {
  width: 100%;
  font-size: 16px;
}
.flex div:nth-child(2) {
  text-align: center;
}
.flex div:nth-child(3) {
  text-align: right;
}
.font1 {
  font-size: 12px;
  color: #888;
}
</style>