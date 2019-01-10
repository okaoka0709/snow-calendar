<template>
    <div class="md calendar-events" :class="[isFuture? 'is-future': '']">
        <ul>
            <li
                is="cpCalendarEventDays"
                v-for="(item, index) in obj.date"
                :obj="item"
                :today="today"
                :event="event"
                :source="source"
                :key="monthsn +'date'+ index"
                @sendEvent="receiveEvent"
            ></li>
        </ul>
    </div>
</template>

<script>
    import cpCalendarEventDays from '@/components/cpCalendarEventDays'

    export default {
        components: {
            cpCalendarEventDays
        },
        props: {
            obj: {
                require: true
            },
            monthsn: {
                require: true
            },
            today: {
                require: true
            },
            event: {
                require: true
            },
            source: {
                require: true
            }
        },
        computed: {
            isFuture: function(){
                return ((this.obj.year > this.today.year) || (this.obj.year === this.today.year && this.obj.month > this.today.month));
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
