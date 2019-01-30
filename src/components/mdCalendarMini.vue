<template>
    <div class="md calendar-mini">
        <div class="calendar-selector">
            <button @click.prevent="getAway('prev')">&lt;</button>
            <span class="thisMonth">{{ refCal.year }}/{{ refCal.month }}</span>
            <button @click.prevent="getAway('next')">&gt;</button>
        </div>
        <div class="calendar-day">
            <div class="week">
                <div class="title">
                    <div v-for="day in obj.week[0]" :key="'dayTag-'+ day.language_day">{{ day.language_shortDay }}</div>
                </div>
            </div>
            <cpCalendarMiniWeek
                v-for="n in 6"

                :mainCal="mainCal"
                :obj="obj.week[n - 1]"
                :today="today"
                :weeksn="monthsn +'week'+ n"
                :key="monthsn +'week'+ n"

                @sendEvent="receiveEvent"
            ></cpCalendarMiniWeek>
        </div>
    </div>
</template>

<script>
    import cpCalendarMiniWeek from './cpCalendarMiniWeek'

    export default {
        components: {
            cpCalendarMiniWeek
        },
        props: {
            refCal: {
                require: true
            },
            mainCal: {
                require: true
            },
            obj: {
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
            getAway: function(way){ //判斷方向並取回設定的時間
                this.$emit('sendEvent', 'computedCal', {
                    cal: 'ref',
                    way: way
                });
            },
            receiveEvent: function(){ //將收到的方法，推送給其他方法執行
                this.$okaTool.receiveEvent(this, arguments);
            }
        }
    }
</script>

<style scoped>

</style>
