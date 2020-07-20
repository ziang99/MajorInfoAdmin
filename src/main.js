import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入ElementUi
import './plugins/element.js'

// 配置全局图片基准路径
// Vue.prototype.baseURL = "http://192.168.0.102:3000"
Vue.prototype.baseURL = "http://39.97.191.34:2019"

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
