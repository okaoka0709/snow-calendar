<template>
    <a
        v-if="obj.extend.cover === null"
        class="more"
        :class="['top-'+ obj.extend.top,'left-'+ obj.extend.left]"
        @click.prevent.stop="clickMore"
        @mouseover.stop="hoverMore"
    >{{ obj.sub }}</a>
    <a
        v-else-if="obj.extend.cover < 1"
        class="time"

        :draggable="cal.editable"
        :class="['top-'+ obj.extend.top,'left-'+ obj.extend.left, obj.extend.isOver? 'is-over': '']"

        @click.prevent.stop="clickEvent"
        @mouseover.stop="hoverEvent"
        @dragstart="startDropStatus($event, 'head')"
        @dragend="endDropStatus"
    >
        <i class="circle" :style="'background-color: '+ cal.color +';'"></i>{{ startHours }}:{{ startMinutes }} {{ obj.sub }}
    </a>
    <a
        v-else
        class="date"

        :draggable="cal.editable"
        :class="['top-'+ obj.extend.top,'left-'+ obj.extend.left, 'width-'+ obj.extend.width, obj.extend.isOver? 'is-over': '']"
        :style="'background-color: '+ cal.color +';'"

        @click.prevent.stop="clickEvent"
        @mouseover.stop="hoverEvent"
        @dragstart="startDropStatus($event, 'head')"
        @dragend="endDropStatus"
    >
        全天 {{ obj.sub }}
        <i class="resize"
            draggable="true"
            v-if="cal.editable"
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
            }
        },
        computed: {
            startHours: function(){ //轉為二位數時間
                return this.$okaTool.doubleCount(this.obj.startTime.hour);
            },
            startMinutes: function(){
                return this.$okaTool.doubleCount(this.obj.startTime.minutes);
            },
            cal: function(){
                return this.source[this.obj.cal];
            }
        },
        methods: {
            update: function(){ //推送日期的更新
                this.$emit('sendEvent', 'updateCal', 'main', {
                    year: this.obj.year,
                    month: this.obj.month,
                    date: this.obj.date
                });

                this.$emit('sendEvent', 'updateMode', 'date');
            },
            clickEvent: function(e){
                this.$emit('sendEvent', 'clickEvent', this.obj, e);
            },
            hoverEvent: function(e){
                this.$emit('sendEvent', 'hoverEvent', this.obj, e);
            },
            clickMore: function(e){
                this.$emit('sendEvent', 'clickMore', this.obj, e);
            },
            hoverMore: function(e){
                this.$emit('sendEvent', 'hoverMore', this.obj, e);
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
