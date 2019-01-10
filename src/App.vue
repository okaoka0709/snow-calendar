<template>
    <gCalendar
        :events="events"
        :sources="sources"
        :defaultMainCal="mainCal"
        :defaultRefCal="refCal"
        :defaultMode="mode"

        @updateCal="updateCal"
        @updateMode="updateMode"

        @initMonth="initMonth"
        @errorMsg="errorMsg"

        @moveResizeEvent="moveResizeEvent"
        @addEvent="addEvent"
        @clickEvent="clickEvent"
        @hoverEvent="hoverEvent"

        @clickMore="clickMore"
        @hoverMore="hoverMore"

        @addSource="addSource"
        @importSource="importSource"
        @clickSource="clickSource"
        @hoverSource="hoverSource"
    ></gCalendar>
</template>

<script>
    import gCalendar from '@/components/gCalendar'

    export default {
        components: {
            gCalendar
        },
        data: function(){
            return {
                events: [],
                sources: [],
                mainCal: {},
                refCal: {},
                mode: 'month'
            }
        },
        methods: {
            updateCal: function(opt){ //切換月曆(ref or main)
                console.log('切換行事曆', opt.cal, '切換時間', opt.data);
            },
            updateMode: function(opt){ //改變模式
                console.log('切換模式', opt);
            },
            initMonth: function(opt){ //第一次造訪該月
                console.log('第一次取得該月', opt);
            },
            errorMsg: function(msg){ //推送錯誤訊息
                console.log('推送錯誤訊息', msg);
            },
            moveResizeEvent: function(event, time, type, mode, isFinally){
                console.log('移動或增減事件長度', event, time, type, mode, isFinally);
            },
            addEvent: function(time, mode){
                console.log('新增事件', time, mode);
            },
            clickEvent: function(event, mouseEvent){ //popup 顯示 event
                console.log('點擊事件', event, mouseEvent);
            },
            hoverEvent: function(event, mouseEvent){ //tooltip 顯示 event
                console.log('滑入事件', event, mouseEvent);
            },
            clickMore: function(event, mouseEvent){
                console.log('點擊更多', event, mouseEvent);
            },
            hoverMore: function(event, mouseEvent){
                console.log('滑入更多', event, mouseEvent);
            },
            addSource: function(){
                console.log('新增月曆');
            },
            importSource: function(){
                console.log('匯入月曆');
            },
            clickSource: function(source, mouseEvent){
                console.log('編輯行事曆', source);
            },
            hoverSource: function(source, mouseEvent){
                console.log('編輯行事曆', source, mouseEvent);
            },
            updateEvent: function(event, isFinally){
                console.log('更新事件', event, isFinally);
            },
            removeEvent: function(event, isFinally){
                console.log('移除事件', event, isFinally);
            },
            editEvent: function(event){
                console.log('編輯事件', event);
            },
            updateSource: function(source){
                console.log('更新行事曆', source);
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
