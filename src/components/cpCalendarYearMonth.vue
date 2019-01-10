<template>
    <li>
        <div class="caption">{{ obj.chineseMonth }}月</div>
        <div class="calendar-day">
            <div class="week">
                <div class="title">
                    <div>一</div>
                    <div>二</div>
                    <div>三</div>
                    <div>四</div>
                    <div>五</div>
                    <div>六</div>
                    <div>日</div>
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
    import cpCalendarYearWeek from '@/components/cpCalendarYearWeek'

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

<style scoped lang="scss">

</style>
