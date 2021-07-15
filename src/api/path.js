
const LOADIP = "http://f628.nat300.top/pad_backend"
const ISERVEIP = "http://chaotu.zicp.net"
const ADSBDIP = "http://f628.nat300.top/adcc-mq"
let Ip = {
  productIP: LOADIP + "/",
}
export default {
  airplane: {
    getAviationAccess: Ip.productIP + "getAviationAccess",
    getFirRegion: Ip.productIP + "getFirRegion",
    getAirportByRegion: Ip.productIP + "getAirportByRegion",
    getCTA: Ip.productIP + "getCTA", // 展示中国境内的管制区
    getSectorByRegion: Ip.productIP + "getSectorByRegion", // 展示中国境内扇区
    getAirpointByRegion: Ip.productIP + "getAirpointByRegion", // 展示中国境内的航路点
    getAirlineByRegion: Ip.productIP + "getAirlineByRegion", // 展示中国境内的航线
    getAirportByBureau: Ip.productIP + "getAirportByBureau", // 该管理局所管理的所有机场名字
    getAirportTxt: Ip.productIP + "getAirportTxt", // 单个机场详情信息
    getTimePointList: Ip.productIP + "getTimePointList", // 航班的计划列表
    getTimePointListNum: Ip.productIP + "getTimePointListNum", // 航班的计划列表数量
    getTimestampPointList: Ip.productIP + "getTimestampPointList", // 按照具体时刻返回航班的计划列表
    getTimePointListByName: Ip.productIP + "getTimePointListByName", // 按照航班号返回航班的计划列表
    flightTrack: Ip.productIP + "flightTrack", // 返回航迹点
    airrouteCongestion: Ip.productIP + "airrouteCongestion", // 返回航路拥挤多
    sectorCongestion: Ip.productIP + "sectorCongestion", //  返回宏观扇区拥挤多
    airportTakeoffandLandingRate: Ip.productIP + "airportTakeoffandLandingRate", //  起降率
    groundAircraft: Ip.productIP + "groundAircraft", //  地面情况
    flightDetailInfo: Ip.productIP + "flightDetailInfo", // 飞机详情
    getCapacityInAirportByProvince: Ip.productIP + "getCapacityInAirportByProvince", // 查询某省份在某时刻的运力
    getCapacityInAirport: Ip.productIP + "getCapacityInAirport", // 查询某机场在某时刻的运力
    getProvinceChinese: Ip.productIP + "getProvinceChinese", // 返回所有省份的中文名称
    getFlightList: Ip.productIP + "getFlightList", // 获取单架航班信息
    getAirportList:Ip.productIP + "getAirportList", // 获取航班信息
    getAirportByXX:Ip.productIP + "getAirportBy", // 获取航班信息
    //getAirportByIATA:Ip.productIP + "getAirportBy", // 获取航班信息
    getADSBData:ADSBDIP + "/getADSBData", // 获取航班信息
    queryByCallsignOrIdent:Ip.productIP + "queryByCallsignOrIdent",//获取信息
    getChinaAirport:Ip.productIP+"getChinaAirportList",//获取中国机场
    getChinaAirlinesCompanyList:Ip.productIP+"getChinaAirlinesCompanyList",//获取中国航司
    getAirport:Ip.productIP+"getAirportTxt",//获取中国航司
    getAirlinesList:Ip.productIP+"getAirlinesList",//获取航班列表
    getAirlineInformation:Ip.productIP+"getAirlineInformation",//获取航班详情
    getADSBDataByIata:ADSBDIP+"/getADSBDataByIata",//筛选航班
    getFlightDetail:Ip.productIP+"getFlightDetail",//获取机场航班
    //getFlightList:Ip.productIP+"/getFlightList",//获取航班list
  },
  // pdfurl:Ip.productIP +"pdf/viewAirportManual/",
  pdfmanurl:Ip.productIP +"airport_man/",
  pdfsurfaceurl:Ip.productIP +"airport_surface/",
  wfs:{
      china:ISERVEIP+"/iserver/services/data-wgs84_chinab/wfs100/utf-8?service=WFS&version=1.0.0&request=GetFeature&typeName=wgs84_chinab:wgs84_chinab&outputFormat=application%2Fjson",
      province:ISERVEIP+"/iserver/services/data-wgs84_province/wfs100/utf-8?service=WFS&version=1.0.0&request=GetFeature&typeName=wgs84_province:wgs84_province&outputFormat=application%2Fjson",
      world:ISERVEIP+"/iserver/services/data-wgs84_chinab/wfs100/utf-8?service=WFS&version=1.0.0&request=GetFeature&typeName=wgs84_chinab:wgs84_chinab&outputFormat=application%2Fjson",

  }
}
