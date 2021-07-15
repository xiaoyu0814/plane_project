import flightTrack from './flightTrack';
import dateFormatter from './dateFormatter'
export default{
    flightGo:false,
    airlineGo:false,
    crowdingGo:false,
    airportTakeOfGo:false,

    TimeCallBack:function(item){
        var nowTime = new Date(item);
        const { Year,Month,currentDate, Hours, Minutes, Seconds} = TimeProgress.dateFormat(nowTime);
        let _param = {
            date: Year + "-" + Month + "-" + currentDate,
        };

    },
    setCallback:function(){

    }
}