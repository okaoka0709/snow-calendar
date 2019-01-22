<template>
    <div class="md calendar-source">
        <ul class="func">
            <li><button @click.prevent.stop="addSource">新增日曆</button></li>
            <li><button @click.prevent.stop="importSource">匯入日曆</button></li>
        </ul>
        <ul class="list">
            <li
                is="cpCalendarSource"
                v-for="cal in source"
                :cal="cal"
                :key="'source'+ cal.sn"
                @sendEvent="receiveEvent"
            ></li>
        </ul>
    </div>
</template>

<script>
    import cpCalendarSource from './cpCalendarSource'

    export default {
        components: {
            cpCalendarSource
        },
        props: {
            source: {
                require: true
            }
        },
        methods: {
            receiveEvent: function(){ //將收到的方法，推送給其他方法執行
                this.$okaTool.receiveEvent(this, arguments);
            },
            addSource: function(){
                this.$emit('sendEvent', 'addSource');
            },
            importSource: function(type){
                this.$emit('sendEvent', 'importSource');
            }
        }
    }
</script>

<style scoped>

</style>
