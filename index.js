import okaTool from './src/okaTool'
import snowCalendar from './src/components/gCalendar.vue'
import './src/sass/global.scss'

export default {
    install: function(Vue, options) {
        Vue.component('snowCalendar', snowCalendar)
        Vue.use(okaTool)
    }
}
