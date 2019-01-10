<template>
    <div class="g article-layout">
        <div class="g article-aside">
            <mdCalendarMini
                :refCal="refCal"
                :mainCal="mainCal"
                :obj="initMonth({year: refCal.year, month: refCal.month})"
                :today="today"
                :monthsn="'ref-'+ refCal.year +'month'+ refCal.month"
                @sendEvent="receiveEvent"
            ></mdCalendarMini>
            <mdCalendarSource
                :source="sources"
                @sendEvent="receiveEvent"
            ></mdCalendarSource>
        </div>
        <div class="g article-content">
            <mdCalendarController
                :mainCal="mainCal"
                :mode="mode"
                :today="today"
                @sendEvent="receiveEvent"
            ></mdCalendarController>
            <mdCalendarYear
                v-if="mode === 'year'"
                :mainCal="mainCal"
                :obj="initYear({year: mainCal.year})"
                :today="today"
                @sendEvent="receiveEvent"
            ></mdCalendarYear>
            <mdCalendarMonth
                v-if="mode === 'month'"
                :obj="getMonth({year: mainCal.year, month: mainCal.month})"
                :today="today"
                :event="eventCompile"
                :source="sourceCompile"
                :monthsn="'Month-'+ mainCal.year +'month'+ mainCal.month"
                @sendEvent="receiveEvent"
            ></mdCalendarMonth>
            <mdCalendarEvent
                v-if="mode === 'event'"
                :obj="getMonth({year: mainCal.year, month: mainCal.month})"
                :today="today"
                :event="eventCompile"
                :source="sourceCompile"
                :monthsn="'Event-'+ mainCal.year +'month'+ mainCal.month"
                @sendEvent="receiveEvent"
            ></mdCalendarEvent>
            <mdCalendarDays
                v-if="mode === 'week'"
                :obj="getDate({year: mainCal.year, month: mainCal.month, date: mainCal.date}, 7)"
                :today="today"
                :event="eventCompile"
                :source="sourceCompile"
                :monthsn="'Week-'+ mainCal.year +'month'+ mainCal.month"
                @sendEvent="receiveEvent"
            ></mdCalendarDays>
            <mdCalendarDays
                v-if="mode === '4days'"
                :obj="getDate({year: mainCal.year, month: mainCal.month, date: mainCal.date}, 4)"
                :today="today"
                :event="eventCompile"
                :source="sourceCompile"
                :monthsn="'4Days-'+ mainCal.year +'month'+ mainCal.month"
                @sendEvent="receiveEvent"
            ></mdCalendarDays>
            <mdCalendarDays
                v-if="mode === 'date'"
                :obj="getDate({year: mainCal.year, month: mainCal.month, date: mainCal.date}, 1)"
                :today="today"
                :event="eventCompile"
                :source="sourceCompile"
                :monthsn="'Date-'+ mainCal.year +'month'+ mainCal.month"
                @sendEvent="receiveEvent"
            ></mdCalendarDays>
        </div>
    </div>
</template>

<script>
    import mdCalendarMini from '@/components/mdCalendarMini'
    import mdCalendarController from '@/components/mdCalendarController'
    import mdCalendarYear from '@/components/mdCalendarYear'
    import mdCalendarMonth from '@/components/mdCalendarMonth'
    import mdCalendarDays from '@/components/mdCalendarDays'
    import mdCalendarEvent from '@/components/mdCalendarEvent'
    import mdCalendarSource from '@/components/mdCalendarSource'

    export default {
        components: {
            mdCalendarMini,
            mdCalendarController,
            mdCalendarYear,
            mdCalendarMonth,
            mdCalendarDays,
            mdCalendarEvent,
            mdCalendarSource
        },
        data: function(){
            return {
                today: {}, //存今日日期
                library: {}, //存所有日曆資料
                mainCal: {},
                refCal: {},
                mode: ''
            }
        },
        props: {
            events: { //存放所有事件
                type: Array,
                require: false,
                default: () => {
                    return []
                }
            },
            sources: { // 存放所有月曆
                type: Array,
                require: false,
                default: () => {
                    return []
                }
            },
            defaultMainCal: { //存主要日曆日期
                type: Object,
                require: false
            },
            defaultRefCal: { //存參考日曆日期
                type: Object,
                require: false
            },
            defaultMode: { //存月曆模式
                type: String,
                require: false
            }
        },
        computed: {
            eventCompile: function(){ //格式化的日曆事件資料
                let $events = this.events,
                    $eventTree = {};

                $events.forEach(item => { //把事件塞進一天一天的 event tree
                    let $startTime = item.startTime,
                        $startYear = $startTime.year,
                        $startMonth = $startTime.month,
                        $startDate = $startTime.date,
                        $startHour = $startTime.hour,
                        $startMinutes = $startTime.minutes,
                        $endTime = item.endTime,
                        $endYear = $endTime.year,
                        $endMonth = $endTime.month,
                        $endDate = $endTime.date,
                        $endHour = $endTime.hour,
                        $endMinutes = $endTime.minutes;

                    let _isOver = new Date($endYear, $endMonth - 1, $endDate, $endHour, $endMinutes) <= new Date(),
                        _size = new Date($endYear, $endMonth - 1, $endDate, $endHour, $endMinutes) - new Date($startYear, $startMonth - 1, $startDate, $startHour, $startMinutes),
                        _cover = Math.floor(_size / 86400000);

                    if( item.extend === undefined ) {
                        item.extend = {};
                    }

                    if( item.extend.cover === undefined ) {
                        item.extend.cover = _cover;
                    }

                    item.extend.size = _size;
                    item.extend.isOver = _isOver;

                    let _monthDuration = ($endYear - $startYear) * 12 + ($endMonth - $startMonth); //計算要跑幾次迴圈(幾個月)

                    for( let i = 0; i <= _monthDuration; i++ ){
                        let _year = $startYear + Math.floor((i + $startMonth) / 12),
                            _month = ($startMonth + i) % 12,
                            _startDate = 1;

                        if( _month === 0 ){
                            _year -= 1;
                            _month = 12;
                        }

                        if(!$eventTree[_year]){ //沒有今年即產生今年
                            $eventTree[_year] = {};
                        }

                        if(!$eventTree[_year][_month]){ //沒有本月即產生本月
                            $eventTree[_year][_month] = {};
                        }

                        if( _year === $startYear && _month === $startMonth ){
                            _startDate = $startDate;
                        }

                        let _lastDate = 0, //最後一天
                            _dayDuration = 0; //計算要跑幾次迴圈(幾天)

                        if( _year === $endYear && _month === $endMonth ){
                            _lastDate = $endDate;
                        }else {
                            _lastDate = new Date(_year, _month, 0).getDate(); //本月有幾天
                        }

                        _dayDuration = _lastDate - _startDate;

                        if( $endTime.year === _year &&  $endTime.month === _month && $endTime.hour === 0 && $endTime.minutes === 0 ){ //如果 12/3 - 12/4，及代表這是 3 號全天事件，與 4 號無關
                            _dayDuration -= 1;
                        }

                        for( let j = 0; j <= _dayDuration; j++ ){ //開始一天一天加入 $eventTree
                            let _date = _startDate + j;

                            if(!$eventTree[_year][_month][_date]){ //沒有本日即產生本日
                                $eventTree[_year][_month][_date] = [];
                            }

                            $eventTree[_year][_month][_date].push(item);
                        }
                    }
                });

                for( let _year in $eventTree ){ //依大到小排序 event tree

                    for( let _month in $eventTree[_year] ){

                        for( let _date in $eventTree[_year][_month] ){

                            $eventTree[_year][_month][_date].sort((a, b) => { //比順序，但不用比天

                                if (a.extend.cover > b.extend.cover){ //比事件長度，長的在上面
                                    return -1;
                                }else if (b.extend.cover > a.extend.cover){
                                    return 1;
                                }else if (a.extend.cover >= 1 && b.extend.cover >= 1 && a.extend.cover === b.extend.cover){

                                    if(a.extend.size > b.extend.size){
                                        return -1;
                                    }else if (b.extend.size > a.extend.size){
                                        return 1;
                                    }
                                }

                                if (a.startTime.hour > b.startTime.hour){ //比開始時間(小時) 少的在上面
                                    return 1;
                                } else if (b.startTime.hour > a.startTime.hour){
                                    return -1;
                                }

                                if (a.startTime.minutes > b.startTime.minutes){ //比開始時間(分) 少的在上面
                                    return 1;
                                } else if (b.startTime.minutes > a.startTime.minutes){
                                    return -1;
                                }

                                if (a.sn > b.sn){ //比SN
                                    return 1;
                                } else if (b.sn > a.sn){
                                    return -1;
                                }
                            });
                        }
                    }
                }

                return $eventTree;
            },
            sourceCompile: function(){ //格式化的日曆本資料
                let $sources = this.sources,
                    $sourcesTree = {};

                $sources.forEach(item => { //把事件塞進一天一天的 event tree
                    $sourcesTree[item.sn] = item
                });

                return $sourcesTree;
            },
        },
        methods: {
            receiveEvent: function(){ //將收到的方法，推送給其他方法執行
                // console.log(arguments)
                this.$okaTool.receiveEvent(this, arguments);
            },
            updateCal: function(opt){
                let _cal = opt.cal,
                    $data = opt.data;

                let _year = $data.year,
                    _month = $data.month,
                    _date = $data.date;

                let _lastDay = new Date(_year, _month, 0).getDate();

                if (_date > _lastDay){
                    _date = _lastDay;
                }

                this[_cal +'Cal'].year = _year;
                this[_cal +'Cal'].month = _month;
                this[_cal +'Cal'].date = _date;

                this.$emit('updateCal', opt);
            },
            updateMode: function(opt){ //改變模式
                this.mode = opt;

                this.$emit('updateMode', opt);
            },
            computedCal: function(opt){
                let _cal = opt.cal,
                    _way = opt.way;

                let _mode = this.mode;

                let _year = this[_cal +'Cal'].year,
                    _month = this[_cal +'Cal'].month,
                    _date = this[_cal +'Cal'].date;

                let $result = {
                        year: _year,
                        month: _month,
                        date: _date
                    }

                if (_mode === 'year' && _cal ==='main'){

                    if (_way === 'prev'){
                        $result.year = _year - 1;
                    } else if (_way === 'next'){
                        $result.year = _year + 1;
                    }
                } else if (_mode === 'month' || _mode === 'event' || _cal === 'ref'){

                    if (_way === 'prev'){

                        if (_month === 1){
                            $result.year = _year - 1;
                            $result.month = 12;
                        } else {
                            $result.month = _month - 1;
                        }
                    } else if (_way === 'next'){

                        if (_month === 12){
                            $result.year = _year + 1;
                            $result.month = 1;
                        } else {
                            $result.month = _month + 1;
                        }
                    }
                } else if (_mode === 'week' && _cal ==='main'){
                    let $lastDate = new Date(_year, _month, 0).getDate();

                    if (_way === 'prev'){
                        let __date = _date - 7;

                        if (__date < 1){

                            if (_month === 1){
                                let $prevLastDate = new Date(_year - 1, 11, 0).getDate();

                                $result.year = _year - 1;
                                $result.month = 12;
                                $result.date = $prevLastDate + __date;
                            } else {
                                let $prevLastDate = new Date(_year, _month - 1, 0).getDate();

                                $result.month = _month - 1;
                                $result.date = $prevLastDate + __date;
                            }

                        } else {
                            $result.date = __date
                        }

                    } else if (_way === 'next'){
                        let __date = _date + 7;

                        if (__date > $lastDate){

                            if (_month === 12){
                                $result.year = _year + 1;
                                $result.month = 1;
                                $result.date = __date - $lastDate;
                            } else {
                                $result.month = _month + 1;
                                $result.date = __date - $lastDate;
                            }

                        } else {
                            $result.date = __date
                        }
                    }

                } else if (_mode === '4days' && _cal ==='main'){
                    let $lastDate = new Date(_year, _month, 0).getDate();

                    if (_way === 'prev'){
                        let __date = _date - 4;

                        if (__date < 1){

                            if (_month === 1){
                                let $prevLastDate = new Date(_year - 1, 11, 0).getDate();

                                $result.year = _year - 1;
                                $result.month = 12;
                                $result.date = $prevLastDate + __date;
                            } else {
                                let $prevLastDate = new Date(_year, _month - 1, 0).getDate();

                                $result.month = _month - 1;
                                $result.date = $prevLastDate + __date;
                            }

                        } else {
                            $result.date = __date
                        }

                    } else if (_way === 'next' && _cal ==='main'){
                        let __date = _date + 4;

                        if (__date > $lastDate){

                            if (_month === 12){
                                $result.year = _year + 1;
                                $result.month = 1;
                                $result.date = __date - $lastDate;
                            } else {
                                $result.month = _month + 1;
                                $result.date = __date - $lastDate;
                            }

                        } else {
                            $result.date = __date
                        }
                    }

                } else if (_mode === 'date' && _cal ==='main'){
                    let $lastDate = new Date(_year, _month, 0).getDate();

                    if (_way === 'prev'){

                        if (_date === 1){

                            if (_month === 1){
                                let $prevLastDate = new Date(_year - 1, 11, 0).getDate();

                                $result.year = _year - 1;
                                $result.month = 12;
                                $result.date = $prevLastDate;
                            } else {
                                let $prevLastDate = new Date(_year, _month - 1, 0).getDate();

                                $result.month = _month - 1;
                                $result.date = $prevLastDate;
                            }

                        } else {
                            $result.date = _date - 1;
                        }

                    } else if (_way === 'next'){

                        if (_date === $lastDate){

                            if (_month === 12){
                                $result.year = _year + 1;
                                $result.month = 1;
                                $result.date = 1;
                            } else {
                                $result.month = _month + 1;
                                $result.date = 1;
                            }

                        } else {
                            $result.date = _date + 1
                        }
                    }
                }

                this.updateCal({
                    cal: _cal,
                    data: $result
                });
            },
            getDate: function(opt, days){ //取天數(含事件)，第二個參數為天，並回覆一個與天相符的陣列
                let $result = [];

                let _days = days;

                if (isNaN(_days)){ //沒有天就給一天
                    _days = 1;
                }

                let $set = this.$okaTool.extend({
                        target: opt,
                        ref: this.today
                    }),
                    _date = $set.date;

                let $month = this.getMonth($set),
                    $days = $month.date,
                    $date = $days[_date - 1]; //取出當天

                if ($date === undefined){ //如果沒有這一天，就給他今天，但出現這個一定有錯
                    _date = this.today.date - 1;
                    $date = $month.date[_date];
                }

                $result.push($date); //推這一天進陣列

                if (_days === 7){ //如果是 7 天，就給符合星期一至星期日的天數
                    let _day = $date.day,
                        _before = (_day + 13) % 7,
                        _after = (7 - _day) % 7;

                    for (let b = 0; b < _before; b++){
                        let __date = _date - 2 - b;

                        if (__date < 0){ //小於零就取上個月結尾
                            let _year = $set.year,
                                _month = $set.month;

                            if (_month === 1){
                                _year -= 1;
                                _month = 12;
                            } else {
                                _month -= 1;
                            }

                            let $prevMonth = this.getMonth({
                                    year: _year,
                                    month: _month
                                });

                            let $prevMonthDays = $prevMonth.date,
                                _prevMonthlength = $prevMonth.count;

                            $result.unshift($prevMonthDays[_prevMonthlength + __date]);
                        } else {
                            $result.unshift($days[__date]);
                        }
                    }

                    for (let a = 0; a < _after; a++){
                        let __date = _date + a;

                        if (__date > $month.count - 1){ //大於陣列就取下個月開頭
                            let _year = $set.year,
                                _month = $set.month;

                            if (_month === 12){
                                _year += 1;
                                _month = 1;
                            } else {
                                _month += 1;
                            }

                            let $nextMonth = this.getMonth({
                                    year: _year,
                                    month: _month
                                });

                            let $nextMonthDays = $nextMonth.date,
                                _nextMonthlength = $nextMonth.count;

                            $result.push($nextMonthDays[__date - $month.count]);
                        } else {
                            $result.push($days[__date]);
                        }
                    }
                } else { //如果是 n 天，就給 n 長度的陣列，並從指定的天數開始算起
                    let _after = _days - 1;

                    for (let i = 0; i < _after; i++){
                        let __date = _date + i;

                        if (__date > $month.count - 1){ //大於陣列就取下個月開頭
                            let _year = $set.year,
                                _month = $set.month;

                            if (_month === 12){
                                _year += 1;
                                _month = 1;
                            } else {
                                _month += 1;
                            }

                            let $nextMonth = this.getMonth({
                                year: _year,
                                month: _month
                            });

                            let $nextMonthDays = $nextMonth.date,
                                _nextMonthlength = $nextMonth.count;

                            $result.push($nextMonthDays[__date - $month.count]);
                        } else {
                            $result.push($days[__date]);
                        }
                    }
                }

                $result.date = days;

                return $result;
            },
            getMonth: function(opt){ //取指定月份(含事件)
                let $set = this.$okaTool.extend({
                        target: opt,
                        ref: this.today
                    }),
                    _year = $set.year,
                    _month = $set.month;

                let $month = this.initMonth($set); //初始化看看

                if( !$month.loaded ){ //如果是第一次取得該月
                    $month.loaded = true;
                    this.$emit('initMonth', $set);
                }

                return $month;
            },
            initYear: function(opt){ //取指定年(不含事件)
                let $set = this.$okaTool.extend({
                        target: opt,
                        ref: this.today
                    }),
                    _year = $set.year;

                this.initMonth(opt); //初始化看看

                for (let i = 1; i <= 12; i++){

                    if (this.library[_year][i] === undefined){

                        this.initMonth({
                            year: _year,
                            month: i
                        });
                    }
                }

                return this.library[_year];
            },
            initMonth: function(opt){ // 取指定月份(不含事件)
                let $set = this.$okaTool.extend({
                        target: opt,
                        ref: this.today
                    }),
                    _year = $set.year,
                    _month = $set.month;

                if (this.library[_year] === undefined){
                    this.library[_year] = {}
                }

                if (this.library[_year][_month] === undefined){
                    let $weeks = [[], [], [], [], [], []],
                        $week = [],
                        $date = [];

                    let $chineseDay = ['日', '一', '二', '三', '四', '五', '六'],
                        $chineseMonth = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

                    let $last = new Date(_year, _month, 0),
                        $lastDate = $last.getDate(),
                        $lastDay = $last.getDay();

                    let _start_Day = ($lastDay - $lastDate + 36) % 7; //算1號是星期幾

                    for (let i = 1; i <= $lastDate; i++){ //推每天進 $date

                        let _day = (_start_Day + i - 1) % 7;

                        let $date_obj = {
                                year: _year,
                                month: _month,
                                date: i,
                                day: _day,
                                thisMonth: true,
                                isActive: false,
                                chineseDay: $chineseDay[_day]
                            };

                        $week.push($date_obj);
                        $date.push($date_obj);
                    }

                    let _before_int = (_start_Day + 6) % 7; //前面要補幾天

                    if (_before_int > 0){
                        let __year = 0,
                            __month = 0;

                        if (_month === 1){
                            __year = _year - 1,
                            __month = 12;
                        } else {
                            __year = _year,
                            __month = _month - 1;
                        }

                        let _lastDay = new Date(__year, __month, 0).getDate();

                        for (let i = 0; i < _before_int; i++){
                            let _day = (_start_Day + 6 - i) % 7;

                            let $date_obj = {
                                    year: __year,
                                    month: __month,
                                    date: _lastDay - i,
                                    day: _day,
                                    thisMonth: false,
                                    isActive: false,
                                    chineseDay: $chineseDay[_day]
                                };

                            $week.unshift($date_obj);
                        }
                    }

                    let _after_int = 42 - _before_int - $lastDate; //前面要補幾天

                    if (_after_int > 0){
                        let __year = 0,
                            __month = 0;

                        if (_month === 12){
                            __year = _year + 1,
                            __month = 1;
                        } else {
                            __year = _year,
                            __month = _month + 1;
                        }

                        let _lastDay = new Date(__year, __month, 0).getDate();

                        for (let i = 0; i < _after_int; i++){
                            let _day = ($lastDay + 8 + i) % 7;

                            let $date_obj = {
                                    year: __year,
                                    month: __month,
                                    date: i + 1,
                                    day: _day,
                                    thisMonth: false,
                                    isActive: false,
                                    chineseDay: $chineseDay[_day]
                                };

                            $week.push($date_obj);
                        }
                    }

                    $week.forEach(($date_obj, index) => { //重新整理七天一陣列
                        $weeks[Math.floor(index / 7)].push($date_obj);
                    });

                    this.library[_year][_month] = {
                        year: _year,
                        month: _month,
                        chineseMonth: $chineseMonth[_month - 1],
                        count: $lastDate,
                        date: $date,
                        allDate: $week,
                        week: $weeks,
                        loaded: false
                    }
                }

                return this.library[_year][_month];
            },
            errorMsg: function(msg){
                this.$emit('errorMsg', msg);
            },
            moveResizeEvent: function(event, time, type, mode, isFinally){ //移動、縮放物件
                this.$emit('moveResizeEvent', event, time, type, mode, isFinally);
            },
            addEvent: function(time, mode){ //新增事件，設定好時間，將其他事情交給 popup
                this.$emit('addEvent', time, mode);
            },
            clickEvent: function(event, mouseEvent){
                this.$emit('clickEvent', event, mouseEvent);
            },
            hoverEvent: function(event, mouseEvent){
                this.$emit('hoverEvent', event, mouseEvent);
            },
            clickMore: function(event, mouseEvent){
                this.$emit('clickMore', event, mouseEvent);
            },
            hoverMore: function(event, mouseEvent){
                this.$emit('hoverMore', event, mouseEvent);
            },
            addSource: function(){ //按下新增行事曆
                this.$emit('addSource');
            },
            importSource: function(){ //按下匯入行事曆
                this.$emit('importSource');
            },
            clickSource: function(source, mouseEvent){ //按下編輯行事曆
                this.$emit('clickSource', source, mouseEvent);
            },
            hoverSource: function(source, mouseEvent){ //滑動到行事曆
                this.$emit('hoverSource', source, mouseEvent);
            }
        },
        created: function(){
            let $today = new Date(),
                _year = $today.getFullYear(),
                _month = $today.getMonth() + 1,
                _date = $today.getDate();

            this.$set(this, 'today', {
                year: _year,
                month: _month,
                date: _date
            });

            if( this.defaultMainCal && this.defaultMainCal.year && this.defaultMainCal.month && this.defaultMainCal.date) {
                this.$set(this, 'mainCal', this.defaultMainCal);
            }else {
                this.$set(this, 'mainCal', {
                    year: _year,
                    month: _month,
                    date: _date
                });
            }

            if( this.defaultRefCal && this.defaultRefCal.year && this.defaultRefCal.month ) {
                this.$set(this, 'refCal', this.defaultRefCal);
            }else {
                this.$set(this, 'refCal', {
                    year: _year,
                    month: _month,
                    date: _date
                });
            }

            if( this.defaultMode === 'year' || this.defaultMode === 'month' || this.defaultMode === 'event' || this.defaultMode === 'week' || this.defaultMode === '4days' ) {
                this.mode = this.defaultMode;
            }else {
                this.mode = 'month';
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
