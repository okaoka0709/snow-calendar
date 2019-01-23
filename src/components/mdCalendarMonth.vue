<template>
    <div class="md calendar-month" :class="[dropState? 'is-drop':'']">
        <div class="calendar-caption">
            <div v-for="day in obj.week[0]" :key="'dayTag-'+ day.language_day">{{ day.language_day }}</div>
        </div>
        <div class="calendar-day">
            <cpCalendarMonthWeek
                v-for="n in 6"
                :obj="obj.week[n - 1]"
                :today="today"
                :event="event"
                :source="source"
                :activeNode="activeNode"
                :weeksn="monthsn +'week'+ n"
                :lang="lang"
                :key="'week'+ n"
                @sendEvent="receiveEvent"
            ></cpCalendarMonthWeek>
        </div>
    </div>
</template>

<script>
    import cpCalendarMonthWeek from './cpCalendarMonthWeek'

    export default {
        components: {
            cpCalendarMonthWeek
        },
        data: function(){
            return {
                moveNode: null, //開始拖曳的物件為何
                moveType: null,
                moveTime: null,
                activeNode: {}
            }
        },
        computed: {
            dropState: function(){
                return !!this.moveNode;
            }
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
            },
            lang: {
                require: true
            }
        },
        methods: {
            receiveEvent: function(){ //將收到的方法，推送給其他方法執行
                this.$okaTool.receiveEvent(this, arguments);
            },
            startDropStatus: function(obj){
                this.moveType = obj.type;
                this.moveNode = obj.data;
            },
            endDropStatus: function(obj){
                if( this.moveType === 'foot' ){
                    this.$emit('sendEvent', 'dropEvent', this.moveNode, this.moveTime, this.moveType, 'date', true);
                }

                this.moveType = null;
                this.moveNode = null;
                this.moveTime = null;
            },
            changeData: function(obj){
                let $obj = {},
                    _isFinally = null;

                $obj.year = obj.year;
                $obj.month = obj.month;
                $obj.date = obj.date;

                let $event = this.moveNode,
                    $startTime = $event.startTime;

                if( this.moveType === 'head' ){

                    if( $startTime.month === obj.month && $startTime.date === obj.date ){ //同個事件拖到同一天
                        return false;
                    }

                    _isFinally = true;
                }else if( this.moveType === 'foot' ){
                    let $endTime = $event.endTime;

                    let a = $startTime.year > obj.year,
                        b = $startTime.year === obj.year && $startTime.month > obj.month,
                        c = $startTime.year === obj.year && $startTime.month === obj.month && $startTime.date > obj.date;

                    if( a || b || c ){ //如果時間小於開始時間
                        return false;
                    }

                    if( $startTime.hour === 0 && $startTime.minutes === 0 && $endTime.hour === 0 && $endTime.minutes === 0 ){ //如果是一天
                        let $addTime = new Date(obj.year, obj.month - 1, obj.date + 1);

                        $obj.year = $addTime.getFullYear();
                        $obj.month = $addTime.getMonth() + 1;
                        $obj.date = $addTime.getDate();
                    }

                    _isFinally = false;
                }

                this.moveTime = $obj;
                this.$emit('sendEvent', 'dropEvent', this.moveNode, this.moveTime, this.moveType, 'date', _isFinally);
            },
            dropDone: function(obj){
                if( this.moveType === 'head' ){
                    this.changeData(obj);
                    this.removeClass();
                }

                this.endDropStatus();
            },
            dropEnter: function(obj){
                if( this.moveType === 'head' ){
                    this.addClass(obj);
                }else if( this.moveType === 'foot' ){
                    this.changeData(obj);
                }
            },
            addClass: function(obj){ //改變顏色
                let $activeNode = this.activeNode;

                let $date = obj,
                    $event = this.moveNode;

                let $startTime = this.moveNode.startTime,
                    $endTime = this.moveNode.endTime;

                let $cover = new Date($endTime.year, $endTime.month - 1, $endTime.date) - new Date($startTime.year, $startTime.month - 1, $startTime.date),
                    _cover = Math.floor($cover / 86400000) + 1;

                if( $endTime.hour === 0 && $endTime.minutes === 0 ){
                    _cover -= 1;
                }

                let $allDate = this.obj.allDate,
                    _start = 0;

                $allDate.forEach(date => {
                    let a = date.month === obj.month && date.date === obj.date,
                        b = _start !== 0 && _start < _cover;

                    let _key = date.year +'-'+ date.month +'-'+ date.date;

                    if( a || b ){
                        this.$set($activeNode, _key, true);
                        _start += 1;
                    }else {
                        this.$set($activeNode, _key, false);
                    }
                });
            },
            removeClass: function(){
                this.$set(this, 'activeNode', {});
            }
        }
    }
</script>

<style scoped>

</style>
