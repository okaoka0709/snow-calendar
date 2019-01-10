<template>
    <div class="calendar-day" :class="[dropState? 'is-drop':'']">
        <cpCalendarDaysTimeEvents
            v-for="(item, index) in obj"
            :obj="item"
            :today="today"
            :event="event"
            :source="source"
            :eventsn="item.cal +'-'+ item.sn +'-'+ index"
            :key="sn +'timeevents'+ index"
            @sendEvent="receiveEvent"
        ></cpCalendarDaysTimeEvents> <!-- days-timeeventlist -->
        <div class="sensor"
            @dragleave="dropOver"
            @drop.prevent="dropDone"
            @dragover.prevent="dropEnter"
        ></div>
    </div>
</template>

<script>
    import cpCalendarDaysTimeEvents from '@/components/cpCalendarDaysTimeEvents'
import { POINT_CONVERSION_COMPRESSED } from 'constants';

    export default {
        components: {
            cpCalendarDaysTimeEvents
        },
        data: function(){
            return {
                moveNode: null, //開始拖曳的物件為何
                moveType: null,
                moveTime: null
            }
        },
        props: {
            obj: {
                require: true
            },
            sn: {
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
            dropState: function(){
                return !!this.moveNode;
            }
        },
        methods: {
            receiveEvent: function(){ //將收到的方法，推送給其他方法執行
                this.$okaTool.receiveEvent(this, arguments);
            },
            computedTime: function(num, mode){ //求時間
                let _offsetY = num;

                let _hour = Math.floor(_offsetY / 60), //以高度求時間
                    _minutes = _offsetY % 60;

                if( mode === 'ceil' ){

                    if ( _minutes !== 0 && _minutes < 30){
                        _minutes = 30;
                    } else {
                        _hour += 1;
                        _minutes = 0;
                    }
                }else if( mode === 'floor' ){

                    if ( _minutes !== 0 && _minutes < 30){
                        _minutes = 0;
                    } else {
                        _minutes = 30;
                    }
                }

                if( _hour >= 24 ){
                    _hour = 24
                    _minutes = 0;
                }

                return {
                    hour: _hour,
                    minutes: _minutes
                }
            },
            computedDate: function(node, num){ //求哪一天
                let _offsetX = num;

                let $obj = this.obj,
                    _length = $obj.length;

                let _base = node.offsetWidth / _length, //求一天的寬度
                    _day = Math.floor(_offsetX / _base),
                    $day = $obj[_day];

                return {
                    year: $day.year,
                    month: $day.month,
                    date: $day.date
                }
            },
            dropOver: function(){
                this.$emit('sendEvent', 'errorMsg', '拖曳物件時請勿超過感應區');
                this.dropDone();
            },
            startDropStatus: function(obj){
                this.moveType = obj.type;
                this.moveNode = obj.data;
            },
            endDropStatus: function(obj){
                this.moveType = null;
                this.moveNode = null;
                this.moveTime = null;
            },
            changeData: function(obj){
                let $event = this.moveNode,
                    $startTime = $event.startTime;

                if( this.moveType === 'resize' ){

                    if( $startTime.date !== obj.date ){ //如果是跨天

                        if( obj.hour + obj.minutes <= 0 ){ //如果小於 00:00
                            return false;
                        }

                        let a = $startTime.year > obj.year,
                            b = $startTime.year === obj.year && $startTime.month > obj.month,
                            c = $startTime.year === obj.year && $startTime.month === obj.month && $startTime.date > obj.date;

                        if( a || b || c ){
                            return false;
                        }

                    }else {
                        let a = $startTime.hour > obj.hour,
                            b = $startTime.hour === obj.hour && $startTime.minutes > obj.minutes;

                        if( a || b ){ //如果時間小於開始時間
                            return false;
                        }
                    }
                }

                this.moveTime = obj;

                this.$emit('sendEvent', 'moveResizeEvent', this.moveNode, this.moveTime, this.moveType, 'time', false);
            },
            dropDone: function(){
                this.$emit('sendEvent', 'moveResizeEvent', this.moveNode, this.moveTime, this.moveType, 'time', true);

                this.endDropStatus();
            },
            dropEnter: function(e, obj){

                if( this.moveType === 'move' ){
                    let $time = this.computedTime(e.offsetY, 'floor'),
                        $date = this.computedDate(e.target, e.offsetX);

                    let $set = {
                            year: $date.year,
                            month: $date.month,
                            date: $date.date,
                            hour: $time.hour,
                            minutes: $time.minutes
                        }

                    this.changeData($set);

                }else if( this.moveType === 'resize' ){
                    let $time = this.computedTime(e.offsetY, 'ceil'),
                        $date = this.computedDate(e.target, e.offsetX);

                    let $set = {
                            year: $date.year,
                            month: $date.month,
                            date: $date.date,
                            hour: $time.hour,
                            minutes: $time.minutes
                        }

                    this.changeData($set);
                }
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
