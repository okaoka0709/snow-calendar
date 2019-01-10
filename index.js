import okaTool from './src/okaTool'
import snowCalendar from './src/components/gCalendar.vue'

const snowCalendarPlugin {
    install(Vue) {
        Vue.component('snowCalendar', snowCalendar)
        Vue.use(okaTool)
    }
};

export default snowCalendarPlugin;
