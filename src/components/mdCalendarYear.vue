<template>
    <div class="md calendar-year">
        <ul>
            <li
                is="cpCalendarYearMonth"

                v-for="n in 12"

                :mainCal="mainCal"
                :obj="obj[n]"
                :month="n"
                :today="today"
                :monthsn="obj.year +'month'+ n"
                :key="obj.year +'month'+ n"

                @sendEvent="receiveEvent"
            ></li>
        </ul>
    </div>
</template>

<script>
    import cpCalendarYearMonth from '@/components/cpCalendarYearMonth'

    export default {
        components: {
            cpCalendarYearMonth
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
