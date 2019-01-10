import Vue from 'vue'
import App from './App.vue'
import okaTool from './okaTool'

Vue.config.productionTip = false
Vue.use(okaTool)

new Vue({
  render: h => h(App)
}).$mount('#app')

import './sass/global.scss'
