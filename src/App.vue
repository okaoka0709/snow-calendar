<template>
    <gCalendar
        :events="events"
        :sources="sources"
        :defaultMainCal="mainCal"
        :defaultRefCal="refCal"
        :defaultMode="mode"
        :uiVisible="uiVisible"

        @updateCal="updateCal"
        @updateMode="updateMode"

        @initMonth="initMonth"
        @errorMsg="errorMsg"

        @clickTime="clickTime"

        @dropEvent="dropEvent"
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
    import gCalendar from './components/gCalendar'

    export default {
        components: {
            gCalendar
        },
        data: function(){
            return {
                events: [
    {
        "startTime":{
            "year":2019,
            "month":1,
            "date":1,
            "hour":0,
            "minutes":0
        },
        "endTime":{
            "year":2019,
            "month":1,
            "date":2,
            "hour":0,
            "minutes":0
        },
        "sn":"1",
        "sub":"元旦",
        "desc":"",
        "cal":3,
        "location":""
    },
    {
        "startTime":{
            "year":2019,
            "month":1,
            "date":5,
            "hour":0,
            "minutes":0
        },
        "endTime":{
            "year":2019,
            "month":1,
            "date":7,
            "hour":0,
            "minutes":0
        },
        "sn":"2",
        "sub":"週末",
        "desc":"",
        "cal":3,
        "location":""
    },
    {
        "startTime":{
            "year":2019,
            "month":1,
            "date":12,
            "hour":0,
            "minutes":0
        },
        "endTime":{
            "year":2019,
            "month":1,
            "date":14,
            "hour":0,
            "minutes":0
        },
        "sn":"3",
        "sub":"週末",
        "desc":"",
        "cal":3,
        "location":""
    },
    {
        "startTime":{
            "year":2019,
            "month":1,
            "date":20,
            "hour":0,
            "minutes":0
        },
        "endTime":{
            "year":2019,
            "month":1,
            "date":21,
            "hour":0,
            "minutes":0
        },
        "sn":"4",
        "sub":"週末",
        "desc":"",
        "cal":3,
        "location":""
    },
    {
        "startTime":{
            "year":2019,
            "month":1,
            "date":26,
            "hour":0,
            "minutes":0
        },
        "endTime":{
            "year":2019,
            "month":1,
            "date":28,
            "hour":0,
            "minutes":0
        },
        "sn":"5",
        "sub":"週末",
        "desc":"",
        "cal":3,
        "location":""
    },
    {
        "startTime":{
            "year":2019,
            "month":2,
            "date":2,
            "hour":0,
            "minutes":0
        },
        "endTime":{
            "year":2019,
            "month":2,
            "date":10,
            "hour":0,
            "minutes":0
        },
        "sn":"6",
        "sub":"過年",
        "desc":"",
        "cal":3,
        "location":""
    },
    {
        "sn":"15481221368660.41220879862838866",
        "sub":"多日行程1",
        "desc":"",
        "cal":1,
        "location":"",
        "startTime":{
            "year":2018,
            "month":12,
            "date":25,
            "hour":0,
            "minutes":0
        },
        "endTime":{
            "year":2019,
            "month":1,
            "date":18,
            "hour":0,
            "minutes":0
        }
    },
    {
        "sn":"15481221650990.44713779233230055",
        "sub":"多日行程2",
        "desc":"",
        "cal":2,
        "location":"",
        "startTime":{
            "year":2019,
            "month":1,
            "date":15,
            "hour":0,
            "minutes":0
        },
        "endTime":{
            "year":2019,
            "month":2,
            "date":1,
            "hour":0,
            "minutes":0
        }
    },
    {
        "sn":"15481222011690.03933619529261567",
        "sub":"單日行程3",
        "desc":"",
        "cal":1,
        "location":"",
        "startTime":{
            "year":2019,
            "month":1,
            "date":17,
            "hour":7,
            "minutes":0
        },
        "endTime":{
            "year":2019,
            "month":1,
            "date":17,
            "hour":11,
            "minutes":0
        }
    },
    {
        "sn":"15481222192250.760487592672817",
        "sub":"跨日行程1",
        "desc":"",
        "cal":2,
        "location":"",
        "startTime":{
            "year":2019,
            "month":1,
            "date":17,
            "hour":8,
            "minutes":0
        },
        "endTime":{
            "year":2019,
            "month":1,
            "date":18,
            "hour":7,
            "minutes":0
        }
    },
    {
        "sn":"15481222380220.6967396095320946",
        "sub":"單日行程1",
        "desc":"",
        "cal":1,
        "location":"",
        "startTime":{
            "year":2019,
            "month":1,
            "date":17,
            "hour":2,
            "minutes":30
        },
        "endTime":{
            "year":2019,
            "month":1,
            "date":17,
            "hour":14,
            "minutes":30
        }
    },
    {
        "sn":"15481222664620.009442966902011074",
        "sub":"單日行程2",
        "desc":"",
        "cal":2,
        "location":"",
        "startTime":{
            "year":2019,
            "month":1,
            "date":17,
            "hour":4,
            "minutes":0
        },
        "endTime":{
            "year":2019,
            "month":1,
            "date":17,
            "hour":5,
            "minutes":0
        }
    },
    {
        "sn":"15481223193260.1601370668143176",
        "sub":"多日行程",
        "desc":"",
        "cal":1,
        "location":"",
        "startTime":{
            "year":2019,
            "month":1,
            "date":19,
            "hour":0,
            "minutes":0
        },
        "endTime":{
            "year":2019,
            "month":1,
            "date":21,
            "hour":0,
            "minutes":0
        }
    }
],
                sources: [
    {
        "sn": 1,
        "sub": "個人行事曆",
        "color": "#1d88e5",
        "editable": true,
        "desc": "測試一",
        "active": true
    },
    {
        "sn": 2,
        "sub": "分享行事曆",
        "color": "#e57a1d",
        "editable": true,
        "desc": "測試二",
        "active": true
    },
    {
        "sn": 3,
        "sub": "假日",
        "color": "#e54288",
        "editable": false,
        "desc": "行政院人事行政總處公佈",
        "active": false
    }
],
                mainCal: {},
                refCal: {},
                mode: 'month',
                uiVisible: {
                    control: true,
                    refCal: true,
                    source: true
                }
            }
        },
        methods: {
            updateCal: function(cal, date){ //切換月曆(ref or main)
                console.log('切換行事曆', cal, '切換時間', date);
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
            clickTime: function(time, mode){
                console.log('點選時間', time, mode);
            },
            dropEvent: function(event, time, type, mode, isFinally){
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

<style scoped>

</style>
