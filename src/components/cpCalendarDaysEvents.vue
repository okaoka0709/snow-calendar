<template>
    <div class="day-event">
        <div class="days" :class="['height-'+ dayevent.maxLength]">
            <cpCalendarDaysEventDay
                v-for="item in obj"
                :obj="item"
                :today="today"
                :activeNode="activeNode"
                :key="sn +'date'+ item.date"
                @sendEvent="receiveEvent"
            ></cpCalendarDaysEventDay> <!-- days-dayeventdays -->
        </div>
        <div class="events" @click="addEvt">
            <cpCalendarDaysEventItem
                v-for="item in events"
                :obj="item"
                :source="source"
                :key="item.cal +'-'+ item.sn"
                @sendEvent="receiveEvent"
            ></cpCalendarDaysEventItem> <!-- days-dayevent -->
        </div>
    </div>
</template>

<script>
    import cpCalendarDaysEventDay from '@/components/cpCalendarDaysEventDay'
    import cpCalendarDaysEventItem from '@/components/cpCalendarDaysEventItem'

    export default {
        components: {
            cpCalendarDaysEventDay,
            cpCalendarDaysEventItem
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
            activeNode: {
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
            dayevent: function(){ //拿大於一天的事件，並回傳最多會有多少事件，拿來建高度
                let $result = [],
                    _height = 0; //高度

                this.obj.forEach((date) => {
                    let $events = [];

                    if( this.event && this.event[date.year] && this.event[date.year][date.month] && this.event[date.year][date.month][date.date] ){
                        $events = $events.concat(this.event[date.year][date.month][date.date]);
                    }

                    let $event = $events.filter((event) => { //過濾大於一天的事件，
                        return event.extend.cover >= 1 && this.source[event.cal].active;
                    });

                    _height = Math.max(_height, $event.length); //比大小
                    $result.push($event);
                });

                return {
                    events: $result,
                    maxLength: _height
                }
            },
            events: function(){
                let $events = [],  //事件陣列
                    $results = [];

                this.dayevent.events.forEach((evt, date_i) => {
                    let $event = evt,
                        $eventCopy = this.$okaTool.copy(evt),
                        _left = date_i + 1;

                    let $dayEvents = []; //新的排序

                    $eventCopy.forEach(event => {
                        event.extend.left = _left;
                        event.extend.width = 1;
                    });

                    if (date_i > 0){ //如果不是第一天的陣列，就來做該死的排序吧
                        let $prevEvent = $events[date_i - 1], //前一天的事件
                            _length = Math.max($eventCopy.length, $prevEvent.length);

                        for (let i = 0; i < _length; i++){
                            $dayEvents.push(null);
                        }

                        let $NRE = []; //no repeat events array

                        $eventCopy.forEach((item, event_i) => { //照前一天的順序加入有重複的事件

                            if (item){
                                let _sn = item.sn,
                                    _targetIndex = 0;

                                let $searchResult = $prevEvent.find(search_item => { //靠 SN 確認前一天有沒有同一個事件

                                    if (search_item){
                                        return search_item.sn === _sn;
                                    }
                                });

                                if ($searchResult !== undefined){ //有的話就開始調整位置，並加長第一次發生這個事件的寬度

                                    let _targetIndex = $prevEvent.indexOf($searchResult), //找出前一天這個事件的排序
                                        $copy = $searchResult //第一次發生這個事件的物件

                                    if ($searchResult.original === undefined){ //如果沒有 original 這個屬性的話，代表這是第一次的複製物件，把第一次發生這個事件的物件加入參照
                                        $copy = this.$okaTool.copy($searchResult);
                                        $copy.original = $searchResult;
                                    }

                                    $copy.original.extend.width += 1; //加長第一次發生這個事件的物件
                                    $dayEvents.splice(_targetIndex, 1, $copy); //在複製物件中加入與上一天一樣的位置

                                } else {
                                    $NRE.push(this.$okaTool.copy(item)); //沒重複的話就 copy 到 $NRE 裡面
                                }
                            }
                        });

                        $NRE.forEach((item, event_i) => { //加入沒重複的事件
                            let _targetIndex = $dayEvents.indexOf(null); //找出第一個 Null

                            $dayEvents.splice(_targetIndex, 1, item); //放進 Null 的位置
                        });
                    } else {

                        $eventCopy.forEach((item, event_i) => {
                            $dayEvents.push(item);
                        });
                    }

                    $dayEvents.forEach((event, event_i) => { //排序完成，依序加入 top 定位

                        if (event){
                            event.extend.top = event_i + 1;
                        }
                    });

                    $events.push($dayEvents); //塞到事件陣列
                });

                $events.forEach(days => { //陣列扁平化，不加入複製的事件，只加入第一次發生的事件

                    days.forEach(item => { //事件

                        if (item && item.original === undefined){ //事件
                            $results.push(item);
                        }
                    });
                });

                return $results;
            }
        },
        methods: {
            addEvt: function(evt){ //先用寬度算點擊的是哪一天
                let _days = this.obj.date;

                let $date = null;

                if (_days === 1){
                    $date = this.obj[0];
                } else {

                    let $week = this.obj,
                        $target = evt.target,
                        $target_w = $target.clientWidth,
                        _base = $target_w / _days;

                    let _offsetX = evt.offsetX;

                    let _index = Math.floor(_offsetX / _base);

                    $date = $week[_index];
                }

                this.$emit('sendEvent', 'addEvent', {
                    year: $date.year,
                    month: $date.month,
                    date: $date.date,
                    hour: 0,
                    minutes: 0
                }, 'date');
            },
            receiveEvent: function(){ //將收到的方法，推送給其他方法執行
                this.$okaTool.receiveEvent(this, arguments);
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
