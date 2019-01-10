<template>
    <li>
        <a @click.prevent.stop="clickEvent" @mouseover.stop="hoverEvent" :class="[obj.extend.isOver? 'is-over': '']">
            <span class="mark" v-if="obj.extend.cover >= 1">
                <i :style="'background-color: '+ cal.color +';'"></i>
                <em>整日</em>
            </span>
            <span class="mark" v-else>
                <i :style="'background-color: '+ cal.color +';'"></i>
                <em class="start">{{ startHours }}:{{ startMinutes }}</em>
                <em class="end">{{ endHours }}:{{ endMinutes }}</em>
            </span>
            <span class="name">
                {{ obj.sub }}
            </span>
        </a>
    </li>
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
            endHours: function(){
                return this.$okaTool.doubleCount(this.obj.endTime.hour);
            },
            endMinutes: function(){
                return this.$okaTool.doubleCount(this.obj.endTime.minutes);
            },
            cal: function(){
                return  this.source[this.obj.cal];
            }
        },
        methods: {
            clickEvent: function(e){
                this.$emit('sendEvent', 'clickEvent', this.obj, e);
            },
            hoverEvent: function(e){
                this.$emit('sendEvent', 'hoverEvent', this.obj, e);
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
