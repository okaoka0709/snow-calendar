import okaTool from './src/okaTool'
import snowCalendar from './src/components/gCalendar.vue'

export default {
    install: function(Vue, options) {
        Vue.component('snowCalendar', snowCalendar)
        Vue.use(okaTool)
    }
}
