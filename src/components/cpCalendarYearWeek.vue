<template>
    <div class="week">
        <div class="days">
            <cpCalendarYearDate
                v-for="n in 7"
                :mainCal="mainCal"
                :obj="obj[n - 1]"
                :today="today"
                :key="weeksn +'date'+ n"
                @sendEvent="receiveEvent"
            ></cpCalendarYearDate>
        </div>
    </div>
</template>

<script>
    import cpCalendarYearDate from '@/components/cpCalendarYearDate'

    export default {
        components: {
            cpCalendarYearDate
        },
        props: {
            mainCal: {
                require: true
            },
            obj: {
                require: true
            },
            today: {
                require: true
            },
            weeksn: {
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
