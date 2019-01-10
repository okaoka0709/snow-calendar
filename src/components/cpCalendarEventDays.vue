<template>
    <li
        v-if="events.length > 0"
        :class="[isToday ? 'is-today': '']"
    >
        <div class="time">
            <a class="inner" @click.prevent="update">
                <div class="date">{{ obj.month }}月{{ obj.date }}日</div>
                <div class="day">({{ obj.chineseDay }})</div>
            </a>
        </div>
        <div class="event">
            <ul>
                <li
                    is="cpCalendarEventEvents"
                    v-for="item in events"
                    :obj="item"
                    :source="source"
                    :key="item.cal +'-'+ item.sn"
                    @sendEvent="receiveEvent"
                ></li>
            </ul>
        </div>
    </li>
    <!-- <li v-else :class="[isToday ? 'is-today': '']">
        <div class="time">
            <a class="inner" @click.prevent="update">
                <div class="date">{{ obj.month }}/{{ obj.date }}</div>
                <div class="day">({{ obj.chineseDay }})</div>
            </a>
        </div>
        <div class="event"><ul><li><a><span class="name">無事件</span></a></li></ul></div>
    </li> -->
</template>

<script>
    import cpCalendarEventEvents from '@/components/cpCalendarEventEvents'

    export default {
        components: {
            cpCalendarEventEvents
        },
        props: {
            obj: {
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
            isToday: function(){
                return (this.obj.year === this.today.year && this.obj.month === this.today.month && this.obj.date === this.today.date);
            },
            events: function(){
                let $evts = [];

                if( this.event && this.event[this.obj.year] && this.event[this.obj.year][this.obj.month] && this.event[this.obj.year][this.obj.month][this.obj.date] ){
                    let $target = this.event[this.obj.year][this.obj.month][this.obj.date];

                    $target.forEach((item, index) => { //過濾沒有勾選顯示的物件
                        if( this.source[item.cal].active ){
                            $evts.push(item);
                        }
                    });
                }

                $evts.sort((a, b) => {
                    return (a.startTime.hour - b.startTime.hour) || (a.startTime.minutes - b.startTime.minutes);
                });

                return $evts;
            }
        },
        methods: {
            update: function(){ //推送日期的更新
                this.$emit('sendEvent', 'updateCal', {
                    cal: 'main',
                    data : {
                        year: this.obj.year,
                        month: this.obj.month,
                        date: this.obj.date,
                    }
                });

                this.$emit('sendEvent', 'updateMode', 'date');
            },
            receiveEvent: function(){ //將收到的方法，推送給其他方法執行
                this.$okaTool.receiveEvent(this, arguments);
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
