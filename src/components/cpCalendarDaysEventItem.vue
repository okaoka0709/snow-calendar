<template>
    <a
        class="date"

        :draggable="cal.editable"
        :class="['top-'+ obj.extend.top,'left-'+ obj.extend.left, 'width-'+ obj.extend.width, obj.extend.isOver? 'is-over': '']"
        :title="obj.desc"
        :style="'background-color: '+ cal.color +';'"

        @click.prevent.stop="clickEvent"
        @mouseover.stop="hoverEvent"
        @dragstart="startDropStatus($event, 'head')"
        @dragend="endDropStatus"
    >
        全天 {{ obj.sub }}
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
            }
        },
        computed: { //轉為二位數時間
            startHours: function(){
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
