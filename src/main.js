// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/router.js'
import iView from 'iview'
import 'iview/dist/styles/iview.css' 
import './common/css/common.css'
import api from './api/index.js';
import store from './store/index'
import echarts from 'echarts'
import map from '@/utils/map.js';
import path from './api/path.js';
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);

var wkx = require('wkx');
var Buffer = require('buffer').Buffer;
Vue.config.productionTip = false

Vue.prototype.$api = api
Vue.prototype.$wkx = wkx
Vue.prototype.$Buffer = Buffer
Vue.prototype.$urlPath = path

Vue.prototype.$echarts = echarts
Vue.prototype.map =map
Vue.use(iView)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
