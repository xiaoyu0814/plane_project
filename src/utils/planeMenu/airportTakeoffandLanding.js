import mapboxgl from 'mapbox-gl'
import api from '@/api/index.js';
import path from '@/api/path.js';
import Mapbox from '../map'
export default{
     //添加起降率分析
     airportTakeoffandLandingRate() {
        let _this = this;
  
        let params = {
          end_datetime: "2018-10-01 00:00:00",
        };
        var timecallback = function (item) {
          let nowTime = new Date(item);
          const {
            Year,
            Month,
            currentDate,
            Hours,
            Minutes,
            week,
            Seconds,
          } = TimeProgress.dateFormat(nowTime);
          console.log(params);
          params.end_datetime =
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
            Seconds;
          _this.addAirportTakeoffandLandingRate(params);
        };
        TimeProgress._speed = 1000;
        TimeProgress.invelData = 60;
        TimeProgress.myfun = timecallback;
        TimeProgress.unit = "Hours";
        TimeProgress.setNewTime("2018/08/01 00:00:00", "2018/08/02 00:00:00");
        _this.addAirportTakeoffandLandingRate(params);
      },
      addAirportTakeoffandLandingRate(params) {
        let _this = this;
        let url = path.airplane.airportTakeoffandLandingRate;
        api.get(url, params).then((res) => {
          console.log(res);
          Mapbox.addAirportTakeoffandLandingRate(
            res,
            "airportTakeoffandLandingRate"
          );
        });
      },
      
}