import mapboxgl from 'mapbox-gl'
import api from '@/api/index.js';
import path from '@/api/path.js';
import Mapbox from '../map'
export default{
    //航路拥挤度
    airrouteCongestion() {
        Mapbox.remove('airLineByRegion')
        var _this = this;
        var params = {
          date: "2018-10-01",
        };
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
          let _param = { date: Year + "-" + Month + "-" + currentDate + " "+Hours+":"+Minutes+":" };
          _this.addAirLine(_param);
        };
        TimeProgress._speed = 1000;
        TimeProgress.invelData = 60*24;
        TimeProgress.myfun = timecallback;
        TimeProgress.unit = "Day";
        TimeProgress.setNewTime("2018/10/01 00:00:00", "2018/10/20 00:00:00");
        this.addAirLine(params);
      },
      addAirLine(params) {
        let _this = this;
        let url = path.airplane.airrouteCongestion;
        var colorPath = [
          "rgb(0, 0, 255)",
          "rgb(0, 255, 0)",
          "rgb(255, 255, 0)",
          "rgb(255, 122, 31)",
          "rgb(255, 0, 0)",
        ];
        let num =0 ;
        let num1 = 0;
        let num2 = 0;
        let num3 = 0;
        let num4 = 0;
        api.get(url, params).then((res) => {
          var _features = [];
          for (var i = 0; i < res.features.length; i++) {
            res.features[i].properties.valueColor =
              colorPath[res.features[i].properties.level];
              if(res.features[i].properties.level == 0){
                num++
              }
              if(res.features[i].properties.level == 1){
                num1++
              }
              if(res.features[i].properties.level == 2){
                num2++
              }
              if(res.features[i].properties.level == 3){
                num3++
              }
              if(res.features[i].properties.level == 4){
                num4++
              }
          }
          console.log(res.features.length,num,num1,num2,num3,num4)
          Mapbox.addAirrouteCongestion(res, "airrouteCongestion");
        });
      },
      
}