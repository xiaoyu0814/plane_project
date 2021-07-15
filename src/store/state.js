export default {
  mapstatus: "黑底",
  toolbar: true,
  contract: false,
  header: false,
  nav: true,
  handlebars: true,
  plane: true,
  airportDetails: true,
  tableHeight: 200,
  cuntry_module: true,
  pro_module: false,
  airport_module: false,
  CAT_module: false,
  infor_module: false,
  crowding_module: false,
  airland_module: false,
  airline_module: true,
  time_module: false,
  menuStatus: 0,
  rounded_area: "",
  rounded_distance: "",
  crowdingDegree_legend: false,
  route_crowdingDegree_legend: false,
  flyDropRate_legend: false,
  searchShow: false,
  flightPlan_show: false,
  nav_value: false,
  setTime_box: false,
  airTransport: "",
  monitorData_list: [{
      name: "全国航班监视",
      value: "",
      icon_url: "",
      selection: false,
      Poptip: false,
      id: 1,
    },
    {
      name: "全国机场起降率监控",
      value: "",
      icon_url: "",
      selection: false,
      Poptip: true,
      id: 2,
    },
  ],
  assessmentData_list: [{
      name: "航路通达度评估",
      value: "",
      icon_url: "",
      selection: false,
      Poptip: true,
      id: 3,
    },
    {
      name: "扇区拥挤度评估",
      value: "",
      icon_url: "",
      selection: false,
      Poptip: true,
      id: 4,
    },
    {
      name: "航路拥挤度评估",
      value: "",
      icon_url: "",
      selection: false,
      Poptip: true,
      id: 5,
    },
  ],
  statisticsData_list: [{
    name: "全国运力统计",
    value: "",
    icon_url: "",
    selection: false,
    Poptip: true,
    id: 6,
  }, ],
  data_index: -1,
  nowFlightStatus: true,
  segment_show: false,
  airport: {
    show: false,
    value: ""
  },
  aviationDepartment_show: false,
  flightInformation_show: false,
  show_calendar: false,
  flightDetails: {
    show: false,
    value: ""
  },
  moreMessage: {
    show: false,
    value: ""
  },
  TrackPlayback: {
    show: false,
    value: ""
  },
  search: {
    startAirportStatus: false,
    endAirportStatus: false,
    startAirport: "点击选择出发机场",
    endAirport: '点击选择到达机场',
    date: new Date(),
    dateStatus: false,
    select_airport: "",
    select_callsign:'',
    aviation: '不限'
  },
  airportInformation_show: false,
  airportDetails_by:0,//0是机场列表过去的，1是航班信息过去的
  airportDetails_show: false,
  flightDisplay: false
}
