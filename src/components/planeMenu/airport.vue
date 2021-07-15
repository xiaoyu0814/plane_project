<template>
  <div id="airport" v-if="$store.state.airport.show">
    <div class="title">
      <van-icon name="arrow-left" @click="back" />
      <van-field
        v-model="search_value"
        clearable
        @click-left-icon="searchValue"
        left-icon="search"
        placeholder="CA9898/9898/B9898/PEK/ZBAA"
        style="background-color:rgb(45,121,197);color:#fff;width:calc(100% - 80px)"
      />
      <Icon type="md-close" @click="close" />
    </div>
    <ul class="tabs">
      <li :class="tabs_type?'select':''" @click="changeList('国内')">国内</li>
      <li :class="tabs_type?'':'select'" @click="changeList('国际')">国际</li>
    </ul>
    <div class="domestic_list">
      <van-index-bar sticky>
        <div v-for="(item, index) in list" :key="index">
          <van-index-anchor :index="item.name" style="color:#ccc" />
          <van-cell
            style="background-color:#333"
            :title="child.name+' '+child.code"
            v-for="(child, childindex) in item.children"
            :key=" childindex"
            @click="select(child)"
          />
        </div>
      </van-index-bar>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs_type: true,
      search_value: "",
      indexList: [],
      list: [],
      domestic_list: [
        
      ],
      international_list: [],
    };
  },
  methods: {
    close(){
      this.$store.state.searchShow = false;
      this.$store.state.airport.show = false;
    },
    back() {
      this.$store.state.airport.show = false;
    },
    changeList(name) {
      if (name === "国内") {
        this.tabs_type = true;
        this.initList()
        //this.list = this.domestic_list;
      } else if (name === "国际") {
        this.tabs_type = false;
        this.list = this.international_list;
      }
    },
    searchValue(item){
      console.log(item);
      console.log(this.search_value)
      let param ={
        code:this.search_value,
        name:'加载中',
      }
      this.select(param)
    },
    select(item) {
      console.log(item);
      console.log("abcd");
      this.$store.state.airport.show = false;
      if(this.$store.state.airport.value === 0){
        this.$store.state.search.select_airport = item.name;
        this.$store.state.search.select_airportIata = item.code;
        this.$store.state.airportInformation_show = true;
        this.$store.state.airportInformation_by = 0;
      }
      if( this.$store.state.search.startAirportStatus){
        this.$store.state.search.startAirportStatus = false;
         this.$store.state.search.startAirport = item.name+" " + item.code;
      }
      if( this.$store.state.search.endAirportStatus){
        this.$store.state.search.endAirportStatus = false
         this.$store.state.search.endAirport = item.name+" " + item.code;
      }
    },
    initList(){
      let url = this.$urlPath.airplane.getChinaAirport;
      
      this.$api.get(url).then((res)=>{
          console.log(res)
          if(res){
            this.indexList = [];
            for(let i=0;i<res.length;i++){
              this.indexList.push(res[i].name.charAt(0))
            }
            this.list =res;
          }
      }).catch((err)=>{
        this.$Message.error(err.data.error)
      })
    }
  },
  mounted() {
    //this.list = this.domestic_list;
    this.initList()
  },
};
</script>

<style scoped>
#airport {
  position: fixed;
  top: 0;
  width: 500px;
  bottom: 0;
  background-color: #555;
  z-index: 10;
}
.title {
  display: flex;
  justify-content: space-between;
  height: 60px;
  align-items: center;
  background-color: rgb(36, 140, 253);
  font-size: 18px;
  padding: 0 10px;
  position: fixed;
  width: 500px;
  top: 0;
  z-index: 2;
}
.tabs {
  padding: 10px;
  background-color: #333;
  display: flex;
  border-radius: 4px;
  height: 60px;
  position: fixed;
  width: 500px;
  top: 60px;
  z-index: 2;
}
.tabs li {
  width: 100%;
  padding: 10px;
  text-align: center;
  background-color: #555;
  color: #000;
  border-radius: 4px;
}
.tabs .select {
  background-color: #fff;
}
.domestic_list {
  color: #ccc;
  height: calc(100% - 60px - 60px);
  position: absolute;
  top: 120px;
  width: 500px;
  overflow-y: auto;
}
</style>
<style >
#airport .van-index-anchor,
#airport .van-cell {
  color: #ccc;
}
#airport .van-index-anchor--sticky {
  background-color: #555;
  top: 0;
}
#airport .van-index-bar__sidebar {
  left: 470px;
  right: auto;
}
/* #airport .van-index-anchor{
  top: 120px;
} */
</style>