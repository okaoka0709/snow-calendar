<template>
    <div class="week">
        <div class="days">
            <cpCalendarMiniDate
                v-for="n in 7"

                :mainCal="mainCal"
                :obj="obj[n - 1]"
                :today="today"
                :key="weeksn +'date'+ n"

                @sendEvent="receiveEvent"
            ></cpCalendarMiniDate>
        </div>
    </div>
</template>

<script>
    import cpCalendarMiniDate from '@/components/cpCalendarMiniDate'

    export default {
        components: {
            cpCalendarMiniDate
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
