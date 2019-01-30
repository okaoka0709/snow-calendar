<template>
    <gCalendar
        :sources="sources"
        :events="events"
        :defaultMainCal="mainCal"
        :defaultRefCal="refCal"
        :defaultMode="mode"
        :uiVisible="uiVisible"
        :lang="lang"

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
                sources: [
                    {
                        "sn": 1,
                        "sub": "personal",
                        "color": "#1d88e5",
                        "editable": true,
                        "desc": "test1",
                        "active": true
                    },
                    {
                        "sn": 2,
                        "sub": "share",
                        "color": "#e57a1d",
                        "editable": true,
                        "desc": "test2",
                        "active": true
                    },
                    {
                        "sn": 3,
                        "sub": "holiday",
                        "color": "#e54288",
                        "editable": false,
                        "desc": "test3",
                        "active": false
                    }
                ],
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
                        "sub":"new year",
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
                        "sub":"weekend",
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
                        "sub":"weekend",
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
                        "sub":"weekend",
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
                        "sub":"weekend",
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
                        "sub":"chinese new year",
                        "desc":"",
                        "cal":3,
                        "location":""
                    },
                    {
                        "sn":"15481221368660.41220879862838866",
                        "sub":"multi days 1",
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
                        "sub":"multi days 2",
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
                        "sub":"multi days 3",
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
                        "sub":"over days 1",
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
                        "sub":"one day 1",
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
                        "sub":"one day 2",
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
                        "sub":"multi days 4",
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
                mainCal: {},
                refCal: {},
                mode: 'month',
                uiVisible: {
                    control: true,
                    refCal: true,
                    source: true
                },
                lang: 'en'
            }
        },
        methods: {
            updateCal: function(cal, date){ //切換月曆(ref or main)
                console.log('cal', cal, 'date', date);
            },
            updateMode: function(opt){ //改變模式
                console.log('updateMode', opt);
            },
            initMonth: function(opt){ //第一次造訪該月
                console.log('initMonth', opt);
            },
            errorMsg: function(msg){ //推送錯誤訊息
                console.log('errorMsg', msg);
            },
            clickTime: function(time, mode){
                console.log('clickTime', time, mode);
            },
            dropEvent: function(event){
                console.log('dropEvent', event);
            },
            addEvent: function(time, mode){
                console.log('addEvent', time, mode);
            },
            clickEvent: function(event, mouseEvent){ //popup 顯示 event
                console.log('clickEvent', event, mouseEvent);
            },
            hoverEvent: function(event, mouseEvent){ //tooltip 顯示 event
                console.log('hoverEvent', event, mouseEvent);
            },
            clickMore: function(event, mouseEvent){
                console.log('clickMore', event, mouseEvent);
            },
            hoverMore: function(event, mouseEvent){
                console.log('hoverMore', event, mouseEvent);
            },
            addSource: function(){
                console.log('addSource');
            },
            importSource: function(){
                console.log('importSource');
            },
            clickSource: function(source, mouseEvent){
                console.log('clickSource', source);
            },
            hoverSource: function(source, mouseEvent){
                console.log('hoverSource', source, mouseEvent);
            },
            updateEvent: function(event, isFinally){
                console.log('updateEvent', event, isFinally);
            },
            removeEvent: function(event, isFinally){
                console.log('removeEvent', event, isFinally);
            },
            editEvent: function(event){
                console.log('editEvent', event);
            },
            updateSource: function(source){
                console.log('updateSource', source);
            }
        },
        created: function(){
            alert('open devTool to see logs.')
        }
    }
</script>

<style scoped>

</style>
