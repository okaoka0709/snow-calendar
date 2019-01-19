<template>
    <a
        :draggable="cal.editable"
        :class="['width-'+ obj.extend.col +'-'+ obj.extend.index +'-'+ obj.extend.width, obj.extend.isOver? 'is-over': '']"
        :style="'background-color: '+ cal.color +';height: '+ timeHeight +'px;top: '+ timeTop +'px;'"
        @click.prevent.stop="clickEvent"
        @mouseover.stop="hoverEvent"
        @dragstart="startDropStatus($event, 'head')"
        @dragend="endDropStatus"
    >
        {{ obj.sub }}<br>
        {{ startHours }}:{{ startMinutes }} - {{ endHours }} : {{ endMinutes }}
        <i class="resize"
            v-if="cal.editable"
            draggable="true"
            @dragstart.stop="startDropStatus($event, 'foot')"
            @dragend.stop="endDropStatus"
        ></i>
    </a>
</template>

<script>

    export default {
        props: {
            obj: {
                require: true
            },
            source: {
                require: true
            },
            thisDay: {
                require: true
            }
        },
        computed: {
            startHours: function(){ //轉為二位數時間
                return this.$okaTool.doubleCount(this.obj.startTime.hour);
            },
            startMinutes: function(){
                return this.$okaTool.doubleCount(this.obj.startTime.minutes);
            },
            endHours: function(){
                return this.$okaTool.doubleCount(this.obj.endTime.hour);
            },
            endMinutes: function(){
                return this.$okaTool.doubleCount(this.obj.endTime.minutes);
            },
            cal: function(){
                return this.source[this.obj.cal];
            },
            timeTop: function(){ //算定位，1px 代表1分鐘
                let $startTime = this.obj.startTime,
                    $endTime = this.obj.endTime;

                let $thisDay = this.thisDay;

                let _coverEvent = ($startTime.date !== $endTime.date),
                    _firstDay = ($thisDay.month === $startTime.month && $thisDay.date === $startTime.date);

                if(_coverEvent && !_firstDay){ //如果這是跨天事件，且又是後面那一天
                    return 0;
                }else { //當天事件
                    return $startTime.hour * 60 + $startTime.minutes + 2;
                }
            },
            timeHeight: function(){ //算事件長度，1px 代表1分鐘
                let $startTime = this.obj.startTime,
                    $endTime = this.obj.endTime;

                let _result = 0;

                let $thisDay = this.thisDay;

                let _coverEvent = ($startTime.date !== $endTime.date),
                    _firstDay = ($thisDay.month === $startTime.month && $thisDay.date === $startTime.date),
                    _lastDay = ($thisDay.month === $endTime.month && $thisDay.date === $endTime.date);

                if(_coverEvent && _firstDay){ //如果這是不足 24h 的跨天事件，且又是第一天
                    _result = 24 * 60 - this.timeTop - 4;
                }else { //當天事件

                    if(_lastDay){
                        _result = $endTime.hour * 60 + $endTime.minutes - this.timeTop - 4;
                    }else{
                        _result = 1440 - 4;
                    }
                }

                return Math.max(_result, 20);
            }
        },
        methods: {
            clickEvent: function(e){
                this.$emit('sendEvent', 'clickEvent', this.obj, e);
            },
            hoverEvent: function(e){
                this.$emit('sendEvent', 'hoverEvent', this.obj, e);
            },
            startDropStatus: function(e, type){
                e.dataTransfer.setData('Text', ''); //firefox

                this.$emit('sendEvent', 'startDropStatus', {
                    type: type,
                    data: this.obj
                });
            },
            endDropStatus: function(e){
                this.$emit('sendEvent', 'endDropStatus', this.obj);
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
