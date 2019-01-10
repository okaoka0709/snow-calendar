<template>
    <div
        class="day"
        :class="[isToday ? 'is-today': '']"
        @click="addEvt"
    >
        <div
            v-if="isToday"
            class="is-now"
            :style="'top:'+ now +'px'"
        ></div>
        <cpCalendarDaysTimeEvent
            v-for="item in events"
            :obj="item"
            :source="source"
            :key="eventsn +'timeevent'+ item.sn"
            :thisDay="obj"
            @sendEvent="receiveEvent"
        ></cpCalendarDaysTimeEvent> <!-- days-timeevent -->
    </div>

</template>

<script>
    import cpCalendarDaysTimeEvent from '@/components/cpCalendarDaysTimeEvent'

    export default {
        components: {
            cpCalendarDaysTimeEvent
        },
        data: function(){
            return {
                now: 0
            }
        },
        props: {
            obj: {
                require: true
            },
            eventsn: {
                require: true
            },
            today: {
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
            isToday: function (){
                return (this.obj.year === this.today.year && this.obj.month === this.today.month && this.obj.date === this.today.date);
            },
            timeevent: function (){ //小於一天的事件
                let $event = [];

                if( this.event && this.event[this.obj.year] && this.event[this.obj.year][this.obj.month] && this.event[this.obj.year][this.obj.month][this.obj.date] ){
                    $event = $event.concat(this.event[this.obj.year][this.obj.month][this.obj.date]);
                }

                $event = $event.filter(item => {
                    return item.extend.cover < 1 && this.source[item.cal].active;
                });

                return $event;
            },
            events: function (){
                let $events = [],  //事件陣列
                    $results = [];

                function findcol(self, that){ //尋找碰撞的方法
                    let $thisStart = self.startTime,
                        $thisEnd = self.endTime,
                        $thatStart = that.startTime,
                        $thatEnd = that.endTime

                    let _endBefore = false, //對方結束在自己開頭之前
                        _startAfter = false; //對方開始在自己結束之後

                    let a = $thatEnd.year < $thisStart.year,
                        b = ( $thatEnd.year === $thisStart.year ) && ( $thatEnd.month < $thisStart.month ),
                        c = ( $thatEnd.year === $thisStart.year ) && ( $thatEnd.month === $thisStart.month ) && ( $thatEnd.date < $thisStart.date ),
                        d = ( $thatEnd.year === $thisStart.year ) && ( $thatEnd.month === $thisStart.month ) && ( $thatEnd.date === $thisStart.date ) && ( $thatEnd.hour < $thisStart.hour ),
                        e = ( $thatEnd.year === $thisStart.year ) && ( $thatEnd.month === $thisStart.month ) && ( $thatEnd.date === $thisStart.date ) && ( $thatEnd.hour === $thisStart.hour ) && ( $thatEnd.minutes <= $thisStart.minutes );

                    if( a || b || c || d || e ){
                        _endBefore = true;
                    }

                    let f = $thatStart.year > $thisEnd.year,
                        g = ( $thatStart.year === $thisEnd.year ) && ( $thatStart.month > $thisEnd.month ),
                        h = ( $thatStart.year === $thisEnd.year ) && ( $thatStart.month === $thisEnd.month ) && ( $thatStart.date > $thisEnd.date ),
                        i = ( $thatStart.year === $thisEnd.year ) && ( $thatStart.month === $thisEnd.month ) && ( $thatStart.date === $thisEnd.date ) && ( $thatStart.hour > $thisEnd.hour ),
                        j = ( $thatStart.year === $thisEnd.year ) && ( $thatStart.month === $thisEnd.month ) && ( $thatStart.date === $thisEnd.date ) && ( $thatStart.hour === $thisEnd.hour ) && ( $thatStart.minutes >= $thisEnd.minutes );

                    if( f || g || h || i || j ){
                        _startAfter = true;
                    }

                    //符合其中一項，即代表沒有碰撞
                    return !_endBefore && !_startAfter;
                }

                this.timeevent.forEach((evt, index) => {
                    let $event = this.$okaTool.copy(evt); //複製一份資料內容

                    if (index === 0){ //如果是第一次跑迴圈，增加第一個列
                        let $first_col = [];

                        $first_col.push($event);
                        $events.push($first_col);

                    } else { //如果不是，就檢查目前現有的列，有沒有發生碰撞
                        let _noColli_index = null;

                        for (let i = 0; i < $events.length; i++){
                            let $col_arrays = $events[i];

                            let $searchResult = $col_arrays.find((col_evt) => { //尋找該列中是不是沒有跟自己發生碰撞的事件
                                    return findcol($event, col_evt);
                                });

                            if ($searchResult === undefined){ //沒找到該事件，代表沒有發生碰撞
                                _noColli_index = i;
                                break;
                            }
                        }

                        if (_noColli_index === null){ //如果全部都沒有回傳，代表全部都碰撞
                            let $last_col = [];

                            $last_col.push($event);
                            $events.push($last_col); //推送新物件到新陣列
                        } else {
                            $events[_noColli_index].push($event); //推送到比對出沒碰撞的陣列
                        }
                    }
                });

                $events.forEach((cols, col_i) => { //陣列扁平化，加入寬度與定位資訊

                    cols.forEach(item => { //事件
                        item.extend.col = $events.length; // 寬度定位 2-1 的 2
                        item.extend.index = col_i + 1; // 寬度定位 2-1 的 1
                        item.extend.width = 1; // 寬度定位 2-1 的 1

                        for (let i = col_i + 1; i < $events.length; i++){ //找之後的物件有沒有與自己相撞的
                            let $next_col = $events[i];

                            let $searchResult = $next_col.find((col_evt) => { //尋找是不是有跟自己發生碰撞的該列中事件
                                return findcol(item, col_evt);
                            });

                            if ($searchResult === undefined){ //沒找到該事件，代表沒有發生碰撞
                                item.extend.width += 1;
                            } else {
                                break;
                            }
                        }

                        $results.push(item);
                    });
                });

                return $results;
            }
        },
        methods: {
            receiveEvent: function (func, opt){ //將收到的方法，推送給其他方法執行
                this.$okaTool.receiveEvent(this, arguments);
            },
            addEvt: function (evt){ //用高度算新增時間
                let _offsetY = evt.offsetY;

                let _startHour = Math.floor(_offsetY / 60),
                    _startMinutes = _offsetY % 60;

                if (_startMinutes < 30){
                    _startMinutes = 0;
                } else {
                    _startMinutes = 30;
                }

                this.$emit('sendEvent', 'addEvent', {
                    year: this.obj.year,
                    month: this.obj.month,
                    date: this.obj.date,
                    hour: _startHour,
                    minutes: _startMinutes
                }, 'hour');
            },
            getNow: function(){
                let $now = new Date(),
                    _date = $now.getDate(),
                    _hour = $now.getHours(),
                    _minutes = $now.getMinutes();

                let $today = this.today;

                if( _date !== $today.date ){
                    $today.year = $now.getFullYear();
                    $today.date = $now.getMonth() + 1;
                    $today.date = _date;
                }

                this.now = _hour * 60 + _minutes;

                setTimeout(() => {
                    this.getNow();
                }, 60000);
            }
        },
        created: function(){

            if( this.isToday ){
                this.getNow();
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
