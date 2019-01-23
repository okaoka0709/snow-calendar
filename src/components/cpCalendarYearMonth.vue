<template>
    <li>
        <div class="caption">{{ obj.language_month }}</div>
        <div class="calendar-day">
            <div class="week">
                <div class="title">
                    <div v-for="day in obj.week[0]" :key="'dayTag-'+ day.language_day">{{ day.language_day[0] }}</div>
                </div>
            </div>
            <cpCalendarYearWeek
                v-for="n in 6"

                :mainCal="mainCal"
                :obj="obj.week[n - 1]"
                :today="today"
                :weeksn="monthsn +'week'+ n"
                :key="monthsn +'week'+ n"

                @sendEvent="receiveEvent"
            ></cpCalendarYearWeek>
        </div>
    </li>
</template>

<script>
    import cpCalendarYearWeek from './cpCalendarYearWeek'

    export default {
        components: {
            cpCalendarYearWeek
        },
        props: {
            mainCal: {
                require: true
            },
            obj: {
                require: true
            },
            month: {
                require: true
            },
            today: {
                require: true
            },
            monthsn: {
                require: true
            }
        },
        methods: {
            receiveEvent: function(){ //將收到的方法，推送給其他方法執行
                this.$okaTool.receiveEvent(this, arguments);
            }
        }
    }
</script>

<style scoped>

</style>
