<template>
    <div class="week">
        <div class="days">
            <cpCalendarMonthDate
                v-for="n in 7"
                :obj="obj[n - 1]"
                :today="today"
                :activeNode="activeNode"
                :key="weeksn +'date'+ n"
                @sendEvent="receiveEvent"
            ></cpCalendarMonthDate>
        </div>
        <div
            class="events"
            @click.prevent="addEvt"
        >
            <cpCalendarMonthEvent
                v-for="event in events"
                :obj="event"
                :source="source"
                :key="event.cal +'-'+ event.sn"
                @sendEvent="receiveEvent"
            ></cpCalendarMonthEvent>
        </div>
    </div>

</template>

<script>
    import cpCalendarMonthDate from '@/components/cpCalendarMonthDate'
    import cpCalendarMonthEvent from '@/components/cpCalendarMonthEvent'

    export default {
        components: {
            cpCalendarMonthDate,
            cpCalendarMonthEvent
        },
        props: {
            obj: {
                require: true
            },
            today: {
                require: true
            },
            event: {
                require: true
            },
            activeNode: {
                require: true
            },
            source: {
                require: true
            },
            weeksn: {
                require: true
            }
        },
        computed: {
            events: function(){ //返回具有定位、並且無重複事件的事件陣列
                let $events = [],  //事件陣列
                    $results = [];

                this.obj.forEach((date, date_i) => { //每周，把週一到週日拿出來跑陣列
                    let $event = [];

                    if( this.event && this.event[date.year] && this.event[date.year][date.month] && this.event[date.year][date.month][date.date] ){ //先把一天一天的事件通通放入一個陣列
                        let $target = this.$okaTool.copy(this.event[date.year][date.month][date.date]);

                        $target.forEach((item, index) => { //過濾 cover 為 0 的跨天方法的第二天事件 && 沒有勾選顯示的物件
                            let a = item.extend.cover === 0 && item.startTime.date !== date.date, //跨天方法的第二天事件
                                b = !this.source[item.cal].active; //沒有勾選顯示的物件

                            if( !a && !b ){
                                $event.push(item);
                            }
                        });
                    }

                    let $eventCopy = this.$okaTool.copy($event), //複製原生物件陣列，避免修改到
                        _left = date_i + 1;

                    $eventCopy.forEach(event => { //加入左側定位，寬度，預設為該天的位置以及 1 寬度，含有今天所有的事件
                        event.extend.left = _left;
                        event.extend.width = 1;
                    });

                    let $dayEvents = []; //新的排序

                    if (date_i > 0){ //如果不是第一天的陣列，就來做排序吧
                        let $prevEvent = $events[date_i - 1], //前一天的事件
                            _length = Math.max($eventCopy.length, $prevEvent.length); //先推 null 到這個陣列應有的長度

                        for (let i = 0; i < _length; i++){
                            $dayEvents.push(null);
                        }

                        let $NRE = []; //no repeat events array 沒有重複的事件都加進來

                        $eventCopy.forEach((item, event_i) => { //有的話就開始調整位置，並加長第一次發生這個事件的寬度

                            if (item){
                                let _sn = item.sn,
                                    _targetIndex = 0;

                                let $searchResult = $prevEvent.find((search_item) => { //靠 SN 確認前一天有沒有同一個事件
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

                    let $eventLength = $event.length;

                    if ($eventLength > 4){ //大於四個就截掉，塞入"更多"

                        let $more = $dayEvents.splice(3, $eventLength - 3);

                        $dayEvents.push({
                            sn: this.$okaTool.getUUID(),
                            year: date.year,
                            month: date.month,
                            date: date.date,
                            sub: '還有' + ($more.length) + '則',
                            extend: {
                                cover: null,
                                moreEvent: $more,
                                left: date_i + 1,
                                top: 4
                            }
                        });
                    }

                    $events.push($dayEvents); //塞到事件陣列
                });

                $events.forEach(days => { //陣列扁平化為一維，不加入複製的事件

                    days.forEach(item => { //事件
                        if (item && item.original === undefined){ //只加入第一次發生的事件
                            $results.push(item);
                        }
                    });
                });

                return $results;
            }
        },
        methods: {
            receiveEvent: function(){ //將收到的方法，推送給其他方法執行
                this.$okaTool.receiveEvent(this, arguments);
            },
            addEvt: function(evt){ //用寬度算點擊的是哪一天
                let $self = this;

                let $week = $self.obj,
                    $target = evt.target,
                    $target_w = $target.clientWidth,
                    _base = $target_w / 7;

                let _offsetX = evt.offsetX;

                let _index = Math.floor(_offsetX / _base);

                let $date = $week[_index],
                    _year = $date.year,
                    _month = $date.month,
                    _date = $date.date;

                let _mode = 'date';

                this.$emit('sendEvent', 'addEvent', {
                    year: _year,
                    month: _month,
                    date: _date,
                    hour: 0,
                    minutes: 0
                }, 'date');
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
