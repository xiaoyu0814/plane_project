<template>
   <!-- 扇区拥挤度 -->
    <Modal
      title="空域拥挤度评估"
      v-model="crowdingDegree"
      width="auto"
      footer-hide
      draggable
      scrollable
      style="top:50px;left:50%"
      @on-cancel="close"
    >
      空域拥挤度评估
      <RadioGroup
        v-model="crowdingDegree_radio"
        style="margin-left:20px"
        @on-change="crowdingDegreeChange"
      >
        <Radio label="微观滚动评估"></Radio>
        <Radio label="宏观滚动评估"></Radio>
      </RadioGroup>
    </Modal>  
</template>
<script>
export default {
    data(){
        return{
            crowdingDegree_radio:[],
            crowdingDegree:false,
            crowdingDegree_show: false,
        }
    },
    methods:{
        crowdingDegreeChange() {
            this.crowdingDegree_show = true;
            this.map.remove('sectorByRegion')
            if (this.crowdingDegree_radio == "微观滚动评估") {
                var params = {
                date: "2018-10-01 00:00:00",
                end_date: "2018-10-01 00:10:00",
                };
                this.getComplexity(params);
            } else {
                var params = {
                date: "2018-08-01",
                };
                this.sectorCongestion(params);
            }
        },
        show(){
            this.crowdingDegree = true;
            this.crowdingDegree_radio = [];
            this.$store.state.crowdingDegree_legend = true;
        },
        close(){
            this.crowdingDegree = false;
            this.$store.state.crowdingDegree_legend = false;
            this.map.remove("sectorCongestion");
            this.$emit('close',false)
        },
        //微观扇区
        getComplexity(params) {
            var _this = this;
            var timecallback = function (item) {
                var nowTime = new Date(item);
                const {
                Year,
                Month,
                currentDate,
                Hours,
                Minutes,
                Seconds,
                } = TimeProgress.dateFormat(nowTime);
                nowTime.setTime(nowTime.getTime() + 60 * 1000 * 10);
                let nextTime = TimeProgress.dateFormat(nowTime);
                let _param = {
                date:
                    Year +
                    "-" +
                    Month +
                    "-" +
                    currentDate +
                    " " +
                    Hours +
                    ":" +
                    Minutes +
                    ":" +
                    Seconds,
                end_date:
                    nextTime.Year +
                    "-" +
                    nextTime.Month +
                    "-" +
                    nextTime.currentDate +
                    " " +
                    nextTime.Hours +
                    ":" +
                    nextTime.Minutes +
                    ":" +
                    nextTime.Seconds,
                };
                _this.addSectorCongestion(_param);
            };
            TimeProgress._speed = 1000;
            TimeProgress.invelData = 10;
            TimeProgress.myfun = timecallback;
            TimeProgress.unit = "Hours";
            TimeProgress.setNewTime("2018/10/01 00:00:00", "2018/10/02 00:00:00");
            this.addSectorCongestion(params);
        },
        //宏观扇区
        sectorCongestion(params) {
            var _this = this;
            var timecallback = function (item) {
                var nowTime = new Date(item);
                const {
                Year,
                Month,
                currentDate,
                Hours,
                Minutes,
                week,
                Seconds,
                } = TimeProgress.dateFormat(nowTime);
                let _param = {
                date: Year + "-" + Month + "-" + currentDate,
                };
                _this.addSectorCongestion(_param);
            };
            TimeProgress._speed = 1000;
            TimeProgress.invelData = 60 * 24 * 31;
            TimeProgress.myfun = timecallback;
            TimeProgress.unit = "Month";
            TimeProgress.setNewTime("2018/08/01 00:00:00", "2020/08/02 00:00:00");
            this.addSectorCongestion(params);
        },
        addSectorCongestion(params) {
            let _this = this;
            let url = this.$urlPath.airplane.sectorCongestion;
            var colorPath = [
                "rgb(0, 255, 127)",
                "rgb(255, 255, 0)",
                "rgb(255, 0, 0)",
                "rgb(152, 245, 255)",
            ];
            let num = 0;
            this.$api.get(url, params).then((res) => {
                for (var i = 0; i < res.features.length; i++) {
                    res.features[i].properties.valueColor =
                        colorPath[Number(res.features[i].properties.level)];
                    if (Number(res.features[i].properties.level) == 0) {
                        num++;
                    }
                }
                console.log(res.features.length, num);
                _this.map.addSectorCongestion(res, "sectorCongestion");
            }).catch((res)=>{
                if(res.data){
                    this.$Message.error(res.data.error)
                }
               
            });
        },
    }
}
</script>