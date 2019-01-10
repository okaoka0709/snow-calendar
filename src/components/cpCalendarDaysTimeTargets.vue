<template>
    <div class="calendar-caption">
        <cpCalendarDaysTimeTarget
            v-for="(item, index) in obj"
            :obj="item"
            :today="today"
            :activeNode="activeNode"
            :key="sn +'timetarget'+ index"
            @sendEvent="receiveEvent"
        ></cpCalendarDaysTimeTarget> <!-- timetarget-day -->
    </div>
</template>

<script>
    import cpCalendarDaysTimeTarget from '@/components/cpCalendarDaysTimeTarget'

    export default {
        components: {
            cpCalendarDaysTimeTarget
        },
        props: {
            obj: {
                require: true
            },
            activeNode: {
                require: true
            },
            sn: {
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
