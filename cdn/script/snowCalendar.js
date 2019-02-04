
let okaTool = {
    checkMobile: function(){ //檢查是不是手機
        let _userAgent = window.navigator.userAgent;

        return /(Android|iPhone|iPad|iPod|Windows Phone)/i.test(_userAgent);
    },
    getUUID: function(){ //取得 UUID
        return new Date().getTime() +''+ Math.random();
    },
    doubleCount: function(num){ //補兩位數

        if(typeof num === 'number') {

            if( num < 10 ) {
                return '0'+ num;
            }else {
                return num;
            }
        }else if(typeof num === 'string'){

            if( num.length === 0 ) {
                return '00';
            }else if( num.length === 1 ){
                return '0'+ num;
            }else {
                return num;
            }
        }else {
            console.log('$doubleCount: 參數必須為數字或字串');
            return '00';
        }
    },
    randomColor: function(type){ //取得隨機顏色
        let $colors = getColor();

        function getColor(){ //生成 rgb 顏色
            let $color = [0, 0, 0]; //r, g, b

            $color.forEach((value, index) => {
                let _newColor = Math.floor(Math.random() * 255);

                $color[index] = _newColor;
            });

            return $color;
        }

        function addAll(color){
            let _all = 0;

            color.forEach(value => {
                _all += value;
            });

            return _all;
        }

        function judgeColor(color , type) { //判斷顏色
            let _condition = 255 * 3 / 2,
                _all = addAll(color); //平均色

            if( (type === 'light' && _all > _condition) || (type === 'deep' && _all < _condition) ) {
                return true;
            }else {
                return false;
            }
        }

        function rgbToHex($colors) { //轉換成 hex color
            let _hex = '#';

            $colors.forEach(color => {
                _hex += (('0' + color).toString(16)).slice(-2);
            });

            return _hex;
        }

        if( type ) { //light, deep or undefined

            while(!judgeColor($colors, type)) {
                $colors = getColor();
            }
        }

        return rgbToHex($colors);
    },
    extend: function(opt){ //合併、補上預設值，可以補特殊前輟
        let $target = opt.target || {},
            $ref = opt.ref || {},
            _key = opt.key,
            _prefix = opt.prefix, //前輟
            _copy = opt.copy, //true 返回 copy 擴展後的結果，false 則直接擴展本身
            _hard = opt.hard; //是否要硬覆蓋

        let $obj = null;

        if (typeof $target === 'object') {

            if( _copy !== false ) {
                $obj = this.copy($target);
            }else {
                $obj = $target;
            }
        }

        if( _key ) { //如果要指定在某個 key 下

            if( $obj[_key] === undefined ) {
                $obj[_key] = {};
            }

            $obj = $obj[_key];
        }

        for (let key in $ref) {
            let _key = key;

            if( _prefix && typeof _prefix === 'string' ) { //如果有傳入 String 就在 key 前面補前輟字串
                _key = _prefix + _key;
            }

            if( _hard === true ) {
                $obj[_key] = $ref[key];
            }else {
                if ($obj[_key] === undefined) {
                    $obj[_key] = $ref[key];
                }
            }
        }

        return $obj;
    },
    copy: function(target){ //copy object

        if (typeof target === 'object') {
            return JSON.parse(JSON.stringify(target));
        } else {
            return target;
        }
    },
    receiveEvent: function(env, arg){ //將收到的方法，推送給其他方法執行
        let _func = arg[0]; //方法

        if( env[_func] ) { //如果自己有這個方法
            Array.prototype.shift.call(arg, 1); //原本要送的參數

            env[_func].apply(env, arg); //送進去執行
        }else {
            Array.prototype.unshift.call(arg, 'sendEvent'); //把 'sendEvent' 送去第 0 個參數

            env.$emit.apply(env, arg); //送到上面的 'sendEvent'
        }
    }
}

Vue.prototype.$okaTool = okaTool;

Vue.component('snowCalendar', { // gCalendar
    template: `
    <div class="g article-layout">
        <div class="g article-aside" v-if="uiVisible.refCal !== false || uiVisible.source !== false">
            <mdCalendarMini
                v-if="uiVisible.refCal !== false"
                :refCal="refCal"
                :mainCal="mainCal"
                :obj="initMonth({year: refCal.year, month: refCal.month})"
                :today="today"
                :monthsn="'ref-'+ refCal.year +'month'+ refCal.month"
                @sendEvent="receiveEvent"
            ></mdCalendarMini>
            <mdCalendarSource
                v-if="uiVisible.source !== false"
                :source="sources"
                :lang="langType"
                @sendEvent="receiveEvent"
            ></mdCalendarSource>
        </div>
        <div class="g article-content">
            <mdCalendarController
                v-if="uiVisible.control !== false"
                :mainCal="mainCal"
                :mode="modeType"
                :today="today"
                :lang="langType"
                @sendEvent="receiveEvent"
            ></mdCalendarController>
            <mdCalendarYear
                v-if="modeType === 'year'"
                :mainCal="mainCal"
                :obj="initYear({year: mainCal.year})"
                :today="today"
                @sendEvent="receiveEvent"
            ></mdCalendarYear>
            <mdCalendarMonth
                v-if="modeType === 'month'"
                :obj="getMonth({year: mainCal.year, month: mainCal.month})"
                :today="today"
                :event="eventCompile"
                :source="sourceCompile"
                :monthsn="'Month-'+ mainCal.year +'month'+ mainCal.month"
                :lang="langType"
                @sendEvent="receiveEvent"
            ></mdCalendarMonth>
            <mdCalendarEvent
                v-if="modeType === 'event'"
                :obj="getMonth({year: mainCal.year, month: mainCal.month})"
                :today="today"
                :event="eventCompile"
                :source="sourceCompile"
                :lang="langType"
                :monthsn="'Event-'+ mainCal.year +'month'+ mainCal.month"
                @sendEvent="receiveEvent"
            ></mdCalendarEvent>
            <mdCalendarDays
                v-if="modeType === 'week'"
                :obj="getDate({year: mainCal.year, month: mainCal.month, date: mainCal.date}, 7)"
                :today="today"
                :event="eventCompile"
                :source="sourceCompile"
                :monthsn="'Week-'+ mainCal.year +'month'+ mainCal.month"
                @sendEvent="receiveEvent"
            ></mdCalendarDays>
            <mdCalendarDays
                v-if="modeType === '4days'"
                :obj="getDate({year: mainCal.year, month: mainCal.month, date: mainCal.date}, 4)"
                :today="today"
                :event="eventCompile"
                :source="sourceCompile"
                :monthsn="'4Days-'+ mainCal.year +'month'+ mainCal.month"
                @sendEvent="receiveEvent"
            ></mdCalendarDays>
            <mdCalendarDays
                v-if="modeType === 'date'"
                :obj="getDate({year: mainCal.year, month: mainCal.month, date: mainCal.date}, 1)"
                :today="today"
                :event="eventCompile"
                :source="sourceCompile"
                :monthsn="'Date-'+ mainCal.year +'month'+ mainCal.month"
                @sendEvent="receiveEvent"
            ></mdCalendarDays>
        </div>
    </div>`,
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
        mainCal: { //存主要日曆日期
            type: Object,
            require: false,
            default: function(){
                let $today = new Date(),
                    _year = $today.getFullYear(),
                    _month = $today.getMonth() + 1,
                    _date = $today.getDate();

                return { //存今日日期
                    year: _year,
                    month: _month,
                    date: _date
                }
            }
        },
        refCal: { //存參考日曆日期
            type: Object,
            require: false,
            default: function(){
                let $today = new Date(),
                    _year = $today.getFullYear(),
                    _month = $today.getMonth() + 1,
                    _date = $today.getDate();

                return { //存今日日期
                    year: _year,
                    month: _month,
                    date: _date
                }
            }
        },
        mode: { //存月曆模式
            type: String,
            require: false
        },
        uiVisible: { //是否顯示組件
            type: Object,
            require: false,
            default: function(){
                return {
                    control: true,
                    refCal: true,
                    source: true
                }
            }
        },
        lang: {
            type: String,
            require: false,
            default: 'en'
        }
    },
    data: function () {
        let $today = new Date(),
            _year = $today.getFullYear(),
            _month = $today.getMonth() + 1,
            _date = $today.getDate();

        return {
            today: { //存今日日期
                year: _year,
                month: _month,
                date: _date
            },
            library: {}, //存所有日曆資料
            modeType: 'month'
        }
    },
    computed: {
        langType: function(){
            return window.snowCalendar.lang;
        },
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
        }
    },
    watch: {
        mode: function(mode) {
            if(mode === 'year' || mode === 'month' || mode === 'event' || mode === 'week' || mode === '4days' || mode === 'date') {
                this.modeType = mode;
            } else {
                console.error('month 字串錯誤');
                this.modeType = 'month';
            }
        }
    },
    methods: {
        receiveEvent: function(){ //將收到的方法，推送給其他方法執行
            this.$okaTool.receiveEvent(this, arguments);
        },
        getRealEvent: function(event){
            let $events = this.events,
                _sn = event.sn;

            return $events.find($event => { return $event.sn === _sn });
        },
        computedTime: function(time1, time2){ //計算時間
            let $newTime = null,
                $time = this.$okaTool.copy(time1);

            if( typeof time2 === 'object' ){ //可傳入月曆定義時間物件
                for( let unit in time2 ){
                    $time[unit] = $time[unit] + time2[unit];
                }

                $newTime = new Date($time.year, $time.month - 1, $time.date, $time.hour, $time.minutes);
            }else if( typeof time2 === 'number' ){ //也可以傳入毫秒
                let _time = new Date($time.year, $time.month - 1, $time.date, $time.hour, $time.minutes).getTime();

                _time += time2;

                $newTime = new Date(_time);
            }

            return {
                year: $newTime.getFullYear(),
                month: $newTime.getMonth() + 1,
                date: $newTime.getDate(),
                hour: $newTime.getHours(),
                minutes: $newTime.getMinutes()
            }
        },
        differenceTime: function(time1, time2, mode){ //計算兩時間之差
            return this.returnTime(time1, mode) - this.returnTime(time2, mode);
        },
        returnTime: function(time, mode){
            let _year = time.year || 0,
                _month = time.month || 0,
                _date = time.date || 0,
                _hour = time.hour || 0,
                _minutes = time.minutes || 0;

            if( mode === 'date' ){
                return new Date(_year, _month -1, _date);
            }else if( mode === 'time' ){
                return new Date(_year, _month -1, _date, _hour, _minutes);
            }
        },
        updateCal: function(cal, date){
            let _year = date.year,
                _month = date.month,
                _date = date.date;

            let _lastDay = new Date(_year, _month, 0).getDate();

            if (_date > _lastDay){
                _date = _lastDay;
            }

            this[cal +'Cal'].year = _year;
            this[cal +'Cal'].month = _month;
            this[cal +'Cal'].date = _date;

            this.$emit('updateCal', cal, {
                year: _year,
                month: _month,
                date: _date
            });
        },
        updateMode: function(opt){ //改變模式
            this.modeType = opt;

            this.$emit('updateMode', opt);
        },
        computedCal: function(opt){
            let _cal = opt.cal,
                _way = opt.way;

            let _mode = this.modeType;

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

            this.updateCal(_cal, $result);
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
                let _format = this.langType.firstDatSet; //台灣從星期一開始(0)、美國從星期日開始(1)

                let _day = $date.day,
                    _before = ((_day + 13) % 7) + _format,
                    _after = ((7 - _day) % 7) - _format;

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

                let $language_day = this.langType.day,
                    $language_shortDay = this.langType.shortDay,
                    $language_month = this.langType.month,
                    $language_shortMonth = this.langType.shortMonth;

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
                            language_day: $language_day[_day],
                            language_shortDay: $language_shortDay[_day]
                        };

                    $week.push($date_obj);
                    $date.push($date_obj);
                }

                let _format = this.langType.firstDatSet; //台灣從星期一開始(0)、美國從星期日開始(1)

                let _before_int = ((_start_Day + 6) % 7) + _format; //前面要補幾天

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
                                language_day: $language_day[_day],
                                language_shortDay: $language_shortDay[_day]
                            };

                        $week.unshift($date_obj);
                    }
                }

                let _after_int = 42 - _before_int - $lastDate; //後面要補幾天

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
                                language_day: $language_day[_day],
                                language_shortDay: $language_shortDay[_day]
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
                    language_month: $language_month[_month - 1],
                    language_shortMonth: $language_shortMonth[_month - 1],
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
        dropEvent: function(event, time, type, mode, isFinally){ //移動、縮放物件
            let $event = this.$okaTool.copy(event);

            if( mode === 'date' && type === 'head' ){
                let _difference = this.differenceTime(time, $event.startTime, mode);

                $event.startTime = this.computedTime($event.startTime, _difference);
                $event.endTime = this.computedTime($event.endTime, _difference);
            }else if( mode === 'date' && type === 'foot' ){
                $event.endTime.year = time.year;
                $event.endTime.month = time.month;
                $event.endTime.date = time.date;

                if( !$event.extend ) {
                    $event.extend = {};
                }

                if(isFinally) {
                    delete $event.extend;
                }else {
                    $event.extend.cover = Math.max(Math.floor($event.extend.size / 86400000), 1);
                }
            }else if( mode === 'time' && type === 'head' ){
                let _difference = this.differenceTime(time, $event.startTime, mode);

                $event.startTime = this.computedTime($event.startTime, _difference);
                $event.endTime = this.computedTime($event.endTime, _difference);
            }else if( mode === 'time' && type === 'foot' ){
                $event.endTime.year = time.year;
                $event.endTime.month = time.month;
                $event.endTime.date = time.date;
                $event.endTime.hour = time.hour;
                $event.endTime.minutes = time.minutes;

                if( !$event.extend ) {
                    $event.extend = {};
                }

                if(isFinally) {
                    delete $event.extend;
                }else {
                    $event.extend.cover = 0;
                }
            }

            let $realEvent = this.getRealEvent($event),
                _index = this.events.indexOf($realEvent);

            this.events.splice(_index, 1, $event);

            if(isFinally) {
                this.$emit('dropEvent', $event);
            }
        },
        clickTime: function(time, mode){ //點選時間
            this.$emit('clickTime', time, mode);
        },
        addEvent: function(time, mode){ //新增事件，設定好時間，將其他事情交給 popup
            this.$emit('addEvent', time, mode);
        },
        clickEvent: function(event, mouseEvent){
            let $event = this.getRealEvent(event);

            this.$emit('clickEvent', $event, mouseEvent);
        },
        hoverEvent: function(event, mouseEvent){
            let $event = this.getRealEvent(event);

            this.$emit('hoverEvent', $event, mouseEvent);
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

        if( this.mainCal.year && this.mainCal.month && this.mainCal.date) {

        }else {
            console.error('mainCal 時間資料錯誤');

            this.$set(this, 'mainCal', {
                year: _year,
                month: _month,
                date: _date
            });
        }

        if( this.refCal.year && this.refCal.month && this.refCal.date ) {

        }else {
            console.error('refCal 時間資料錯誤');

            this.$set(this, 'refCal', {
                year: _year,
                month: _month,
                date: _date
            });
        }

        if( this.mode === 'year' || this.mode === 'month' || this.mode === 'event' || this.mode === 'week' || this.mode === '4days' || this.mode === 'date' ) {
            this.modeType = this.mode;
        }else if( this.mode !== undefined ){
            console.error('month 字串錯誤');
        }
    }
});

Vue.component('mdCalendarMini', {
    template: `
    <div class="md calendar-mini">
        <div class="calendar-selector">
            <button @click.prevent="getAway('prev')">&lt;</button>
            <span class="thisMonth">{{ refCal.year }}/{{ refCal.month }}</span>
            <button @click.prevent="getAway('next')">&gt;</button>
        </div>
        <div class="calendar-day">
            <div class="week">
                <div class="title">
                    <div v-for="day in obj.week[0]" :key="'dayTag-'+ day.language_day">{{ day.language_shortDay }}</div>
                </div>
            </div>
            <cpCalendarMiniWeek
                v-for="n in 6"

                :mainCal="mainCal"
                :obj="obj.week[n - 1]"
                :today="today"
                :weeksn="monthsn +'week'+ n"
                :key="monthsn +'week'+ n"

                @sendEvent="receiveEvent"
            ></cpCalendarMiniWeek>
        </div>
    </div>`,
    props: {
        refCal: {
            require: true
        },
        mainCal: {
            require: true
        },
        obj: {
            require: true
        },
        today: {
            require: true
        },
        monthsn: {
            require: true
        }
    },
    methods: {
        getAway: function(way){ //判斷方向並取回設定的時間
            this.$emit('sendEvent', 'computedCal', {
                cal: 'ref',
                way: way
            });
        },
        receiveEvent: function(){ //將收到的方法，推送給其他方法執行
            this.$okaTool.receiveEvent(this, arguments);
        }
    }
});

Vue.component('cpCalendarMiniWeek', {
    template: `
    <div class="week">
        <div class="days">
            <cpCalendarMiniDate
                v-for="n in 7"

                :mainCal="mainCal"
                :obj="obj[n - 1]"
                :today="today"
                :key="weeksn +'date'+ n"

                @sendEvent="receiveEvent"
            ></cpCalendarMiniDate>
        </div>
    </div>`,
    props: {
        mainCal: {
            require: true
        },
        obj: {
            require: true
        },
        today: {
            require: true
        },
        weeksn: {
            require: true
        }
    },
    methods: {
        receiveEvent: function(){ //將收到的方法，推送給其他方法執行
            this.$okaTool.receiveEvent(this, arguments);
        }
    }
});

Vue.component('cpCalendarMiniDate', {
    template: `
    <div
        v-if="obj"
        class="day"
        :class="[isToday && obj.thisMonth ? 'is-today': '', isActive && obj.thisMonth ? 'is-active': '', obj.thisMonth? '': 'not-thisMonth']"
    >
        <a
            class="date"
            @click.prevent="update"
        >{{ obj.date }}</a>
    </div>`,
    props: {
        mainCal: {
            require: true
        },
        obj: {
            require: true
        },
        today: {
            require: true
        }
    },
    computed: {
        isToday: function(){

            if( this.obj.year === this.today.year && this.obj.month === this.today.month && this.obj.date === this.today.date ){
                return true;
            }
        },
        isActive: function(){

            if (this.obj.year === this.mainCal.year && this.obj.month === this.mainCal.month && this.obj.date === this.mainCal.date){
                return true;
            }
        }
    },
    methods: {
        update: function(){ //推送日期的更新
            if( this.isActive ){
                this.$emit('sendEvent', 'updateMode', 'date');
            }

            this.$emit('sendEvent', 'updateCal', 'main',{
                year: this.obj.year,
                month: this.obj.month,
                date: this.obj.date
            });
        }
    }
});

Vue.component('mdCalendarSource', {
    template: `
    <div class="md calendar-source">
        <ul class="func">
            <li><button @click.prevent.stop="addSource">{{ lang.addCalendar }}</button></li>
            <li><button @click.prevent.stop="importSource">{{ lang.importCalendar }}</button></li>
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
    </div>`,
    props: {
        source: {
            require: true
        },
        lang: {
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
});

Vue.component('cpCalendarSource', {
    template: `
    <li>
        <div class="cp input checkbox">
            <input type="checkbox" v-model="cal.active" :id="'cal-'+ cal.sn">
            <label :for="'cal-'+ cal.sn" :style="'color:'+ cal.color">
                <span @mouseover.stop="hoverSource">{{ cal.sub }}</span>
            </label>
        </div>
        <a class="set" @click.prevent.stop="clickSource">⋯</a>
    </li>`,
    props: {
        cal: {
            require: true
        }
    },
    methods: {
        clickSource: function(e){
            this.$emit('sendEvent', 'clickSource', this.cal, e);
        },
        hoverSource: function(e){
            this.$emit('sendEvent', 'hoverSource', this.cal, e);
        }
    }
});

Vue.component('mdCalendarController', {
    template: `
    <div class="md calendar-controller">
        <div class="date-selector">
            <button @click.prevent="getAway('prev')">&lt;</button>
            <span v-if="mode === 'year'" class="thisMonth">{{ mainCal.year }}</span>
            <span v-else class="thisMonth">{{ mainCal.year }}/{{ mainCal.month }}</span>
            <button @click.prevent="getAway('next')">&gt;</button>
            <select :value="mode" @change="changeMode">
                <option value="date">{{ lang.mode1Day }}</option>
                <option value="week">{{ lang.modeWeek }}</option>
                <option value="month">{{ lang.modeMonth }}</option>
                <option value="year">{{ lang.modeYear }}</option>
                <option value="event">{{ lang.modeEvents }}</option>
                <option value="4days">{{ lang.mode4Days }}</option>
            </select>
        </div>
        <div class="calendar-btns">
            <ul>
                <li class="change-toToday"><button @click.prevent="backToToday">{{ lang.today }}</button></li>
                <li class="add-event"><button @click.prevent="addEvt">{{ lang.addEvent }}</button></li>
            </ul>
        </div>
    </div>`,
    props: {
        mainCal: {
            require: true
        },
        mode: {
            require: true
        },
        today: {
            require: true
        },
        lang: {
            require: true
        }
    },
    methods: {
        getAway: function(way){ //判斷方向並取回設定的時間
            this.$emit('sendEvent', 'computedCal', {
                cal: 'main',
                way: way
            });
        },
        changeMode: function(evt){
            this.$emit('sendEvent', 'updateMode', evt.target.value);
        },
        backToToday: function(){
            this.$emit('sendEvent', 'updateCal', 'main', this.today);
        },
        addEvt: function(){
            let $time = new Date(),
                _year = $time.getFullYear(),
                _month = $time.getMonth() + 1,
                _date = $time.getDate(),
                _hour = $time.getHours(),
                _minutes = $time.getMinutes();

            this.$emit('sendEvent', 'addEvent', {
                year: _year,
                month: _month,
                date: _date,
                hour: _hour,
                minutes: _minutes
            }, 'time');
        }
    }
});

Vue.component('mdCalendarYear', {
    template: `
    <div class="md calendar-year">
        <ul>
            <li
                is="cpCalendarYearMonth"

                v-for="n in 12"

                :mainCal="mainCal"
                :obj="obj[n]"
                :month="n"
                :today="today"
                :monthsn="obj.year +'month'+ n"
                :key="obj.year +'month'+ n"

                @sendEvent="receiveEvent"
            ></li>
        </ul>
    </div>`,
    props: {
        mainCal: {
            require: true
        },
        obj: {
            require: true
        },
        today: {
            require: true
        }
    },
    methods: {
        receiveEvent: function(){ //將收到的方法，推送給其他方法執行
            this.$okaTool.receiveEvent(this, arguments);
        }
    }
});

Vue.component('cpCalendarYearMonth', {
    template: `
    <li>
        <div class="caption">{{ obj.language_month }}</div>
        <div class="calendar-day">
            <div class="week">
                <div class="title">
                    <div v-for="day in obj.week[0]" :key="'dayTag-'+ day.language_day">{{ day.language_shortDay }}</div>
                </div>
            </div>
            <cpCalendarYearWeek
                v-for="n in 6"

                :mainCal="mainCal"
                :obj="obj.week[n - 1]"
                :today="today"
                :weeksn="monthsn +'week'+ n"
                :key="monthsn +'week'+ n"

                @sendEvent="receiveEvent"
            ></cpCalendarYearWeek>
        </div>
    </li>`,
    props: {
        mainCal: {
            require: true
        },
        obj: {
            require: true
        },
        month: {
            require: true
        },
        today: {
            require: true
        },
        monthsn: {
            require: true
        }
    },
    methods: {
        receiveEvent: function(){ //將收到的方法，推送給其他方法執行
            this.$okaTool.receiveEvent(this, arguments);
        }
    }
});

Vue.component('cpCalendarYearWeek', {
    template: `
    <div class="week">
        <div class="days">
            <cpCalendarYearDate
                v-for="n in 7"
                :mainCal="mainCal"
                :obj="obj[n - 1]"
                :today="today"
                :key="weeksn +'date'+ n"
                @sendEvent="receiveEvent"
            ></cpCalendarYearDate>
        </div>
    </div>`,
    props: {
        mainCal: {
            require: true
        },
        obj: {
            require: true
        },
        today: {
            require: true
        },
        weeksn: {
            require: true
        }
    },
    methods: {
        receiveEvent: function(){ //將收到的方法，推送給其他方法執行
            this.$okaTool.receiveEvent(this, arguments);
        }
    }
});

Vue.component('cpCalendarYearDate', {
    template: `
    <div
        v-if="obj"
        class="day"
        :class="[isToday && obj.thisMonth ? 'is-today': '', isActive && obj.thisMonth ? 'is-active': '', obj.thisMonth? '': 'not-thisMonth']"
    >
        <a
            class="date"
            @click.prevent.stop="update"
        >{{ obj.date }}</a>
    </div>`,
    props: {
        mainCal: {
            require: true
        },
        obj: {
            require: true
        },
        today: {
            require: true
        }
    },
    computed: {
        isToday: function(){
            if( this.obj.year === this.today.year && this.obj.month === this.today.month && this.obj.date === this.today.date ){
                return true;
            }
        },
        isActive: function(){
            if (this.obj.year === this.mainCal.year && this.obj.month === this.mainCal.month && this.obj.date === this.mainCal.date){
                return true;
            }
        }
    },
    methods: {
        update: function(){
            this.$emit('sendEvent', 'updateCal', 'main', {
                year: this.obj.year,
                month: this.obj.month,
                date: this.obj.date
            });

            this.$emit('sendEvent', 'updateMode', 'date');
        }
    }
});

Vue.component('mdCalendarMonth', {
    template: `
    <div class="md calendar-month" :class="[dropState? 'is-drop':'']">
        <div class="calendar-caption">
            <div v-for="day in obj.week[0]" :key="'dayTag-'+ day.language_day">{{ day.language_day }}</div>
        </div>
        <div class="calendar-day">
            <cpCalendarMonthWeek
                v-for="n in 6"
                :obj="obj.week[n - 1]"
                :today="today"
                :event="event"
                :source="source"
                :activeNode="activeNode"
                :weeksn="monthsn +'week'+ n"
                :lang="lang"
                :key="'week'+ n"
                @sendEvent="receiveEvent"
            ></cpCalendarMonthWeek>
        </div>
    </div>`,
    props: {
        obj: {
            require: true
        },
        monthsn: {
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
        },
        lang: {
            require: true
        }
    },
    data: function () {
        return {
            moveNode: null, //開始拖曳的物件為何
            moveType: null,
            moveTime: null,
            activeNode: {}
        }
    },
    computed: {
        dropState: function(){
            return !!this.moveNode;
        }
    },
    methods: {
        receiveEvent: function(){ //將收到的方法，推送給其他方法執行
            this.$okaTool.receiveEvent(this, arguments);
        },
        startDropStatus: function(obj){
            this.moveType = obj.type;
            this.moveNode = obj.data;
        },
        endDropStatus: function(obj){
            if( this.moveType === 'foot' ){
                this.$emit('sendEvent', 'dropEvent', this.moveNode, this.moveTime, this.moveType, 'date', true);
            }

            this.moveType = null;
            this.moveNode = null;
            this.moveTime = null;
        },
        changeData: function(obj){
            let $obj = {},
                _isFinally = null;

            $obj.year = obj.year;
            $obj.month = obj.month;
            $obj.date = obj.date;

            let $event = this.moveNode,
                $startTime = $event.startTime;

            if( this.moveType === 'head' ){

                if( $startTime.month === obj.month && $startTime.date === obj.date ){ //同個事件拖到同一天
                    return false;
                }

                _isFinally = true;
            }else if( this.moveType === 'foot' ){
                let $endTime = $event.endTime;

                let a = $startTime.year > obj.year,
                    b = $startTime.year === obj.year && $startTime.month > obj.month,
                    c = $startTime.year === obj.year && $startTime.month === obj.month && $startTime.date > obj.date;

                if( a || b || c ){ //如果時間小於開始時間
                    return false;
                }

                if( $startTime.hour === 0 && $startTime.minutes === 0 && $endTime.hour === 0 && $endTime.minutes === 0 ){ //如果是一天
                    let $addTime = new Date(obj.year, obj.month - 1, obj.date + 1);

                    $obj.year = $addTime.getFullYear();
                    $obj.month = $addTime.getMonth() + 1;
                    $obj.date = $addTime.getDate();
                }

                _isFinally = false;
            }

            this.moveTime = $obj;
            this.$emit('sendEvent', 'dropEvent', this.moveNode, this.moveTime, this.moveType, 'date', _isFinally);
        },
        dropDone: function(obj){
            if( this.moveType === 'head' ){
                this.changeData(obj);
                this.removeClass();
            }

            this.endDropStatus();
        },
        dropEnter: function(obj){
            if( this.moveType === 'head' ){
                this.addClass(obj);
            }else if( this.moveType === 'foot' ){
                this.changeData(obj);
            }
        },
        addClass: function(obj){ //改變顏色
            let $activeNode = this.activeNode;

            let $date = obj,
                $event = this.moveNode;

            let $startTime = this.moveNode.startTime,
                $endTime = this.moveNode.endTime;

            let $cover = new Date($endTime.year, $endTime.month - 1, $endTime.date) - new Date($startTime.year, $startTime.month - 1, $startTime.date),
                _cover = Math.floor($cover / 86400000) + 1;

            if( $endTime.hour === 0 && $endTime.minutes === 0 ){
                _cover -= 1;
            }

            let $allDate = this.obj.allDate,
                _start = 0;

            $allDate.forEach(date => {
                let a = date.month === obj.month && date.date === obj.date,
                    b = _start !== 0 && _start < _cover;

                let _key = date.year +'-'+ date.month +'-'+ date.date;

                if( a || b ){
                    this.$set($activeNode, _key, true);
                    _start += 1;
                }else {
                    this.$set($activeNode, _key, false);
                }
            });
        },
        removeClass: function(){
            this.$set(this, 'activeNode', {});
        }
    }
});

Vue.component('cpCalendarMonthWeek', {
    template: `
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
            @click.prevent="computedclickTime"
        >
            <cpCalendarMonthEvent
                v-for="event in events"
                :obj="event"
                :source="source"
                :key="event.cal +'-'+ event.sn"
                @sendEvent="receiveEvent"
            ></cpCalendarMonthEvent>
        </div>
    </div>`,
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
        lang: {
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
                        sub: '+' + ($more.length) + ' '+ this.lang.more,
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
        computedclickTime: function(evt){ //用寬度算點擊的是哪一天
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

            this.$emit('sendEvent', 'clickTime', {
                year: _year,
                month: _month,
                date: _date,
                hour: 0,
                minutes: 0
            }, 'date');
        }
    }
});

Vue.component('cpCalendarMonthDate', {
    template: `
    <div
        class="day"
        :class="[isToday? 'is-today': '', obj.thisMonth? '': 'not-thisMonth', isActive? 'is-active': '']"
        @click="clickTime"
    >
        <a
            class="date"
            @click.prevent.stop="update"
        >{{ obj.month }}/{{ obj.date }}</a>
        <div class="sensor"
            @drop.prevent="dropDone"
            @dragenter.prevent="dropEnter"
            @dragover.prevent
        ></div>
    </div>`,
    props: {
        obj: {
            require: true
        },
        today: {
            require: true
        },
        activeNode: {
            require: true
        }
    },
    computed: {
        isToday: function(){
            return (this.obj.year === this.today.year && this.obj.month === this.today.month && this.obj.date === this.today.date);
        },
        isActive: function(){
            let $obj = this.obj;

            if( this.activeNode[$obj.year +'-'+ $obj.month +'-'+ $obj.date] ){
                return true;
            }else {
                return false;
            }
        }
    },
    methods: {
        update: function(){ //推送日期的更新
            this.$emit('sendEvent', 'updateCal', 'main', {
                year: this.obj.year,
                month: this.obj.month,
                date: this.obj.date
            });

            this.$emit('sendEvent', 'updateMode', 'date');
        },
        clickTime: function(evt){
            this.$emit('sendEvent', 'clickTime', {
                year: this.obj.year,
                month: this.obj.month,
                date: this.obj.date,
                hour: 0,
                minutes: 0
            }, 'date');
        },
        dropDone: function(){
            this.$emit('sendEvent', 'dropDone', this.obj);
        },
        dropEnter: function(){
            this.$emit('sendEvent', 'dropEnter', this.obj);
        }
    }
});

Vue.component('cpCalendarMonthEvent', {
    template: `
    <a
        v-if="obj.extend.cover === null"
        class="more"
        :class="['top-'+ obj.extend.top,'left-'+ obj.extend.left]"
        @click.prevent.stop="clickMore"
        @mouseover.stop="hoverMore"
    >{{ obj.sub }}</a>
    <a
        v-else-if="obj.extend.cover < 1"
        class="time"

        :draggable="cal.editable"
        :class="['top-'+ obj.extend.top,'left-'+ obj.extend.left, obj.extend.isOver? 'is-over': '']"

        @click.prevent.stop="clickEvent"
        @mouseover.stop="hoverEvent"
        @dragstart="startDropStatus($event, 'head')"
        @dragend="endDropStatus"
    >
        <i class="circle" :style="'background-color: '+ cal.color +';'"></i>{{ startHours }}:{{ startMinutes }} {{ obj.sub }}
    </a>
    <a
        v-else
        class="date"

        :draggable="cal.editable"
        :class="['top-'+ obj.extend.top,'left-'+ obj.extend.left, 'width-'+ obj.extend.width, obj.extend.isOver? 'is-over': '']"
        :style="'background-color: '+ cal.color +';'"

        @click.prevent.stop="clickEvent"
        @mouseover.stop="hoverEvent"
        @dragstart="startDropStatus($event, 'head')"
        @dragend="endDropStatus"
    >
        {{ obj.sub }}
        <i class="resize"
            draggable="true"
            v-if="cal.editable"
            @dragstart.stop="startDropStatus($event, 'foot')"
            @dragend.stop="endDropStatus"
        ></i>
    </a>`,
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
        cal: function(){
            return this.source[this.obj.cal];
        }
    },
    methods: {
        update: function(){ //推送日期的更新
            this.$emit('sendEvent', 'updateCal', 'main', {
                year: this.obj.year,
                month: this.obj.month,
                date: this.obj.date
            });

            this.$emit('sendEvent', 'updateMode', 'date');
        },
        clickEvent: function(e){
            this.$emit('sendEvent', 'clickEvent', this.obj, e);
        },
        hoverEvent: function(e){
            this.$emit('sendEvent', 'hoverEvent', this.obj, e);
        },
        clickMore: function(e){
            this.$emit('sendEvent', 'clickMore', this.obj, e);
        },
        hoverMore: function(e){
            this.$emit('sendEvent', 'hoverMore', this.obj, e);
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
});

Vue.component('mdCalendarEvent', {
    template: `
    <div class="md calendar-events" :class="[isFuture? 'is-future': '']">
        <ul>
            <li
                is="cpCalendarEventDays"
                v-for="(item, index) in obj.date"
                :obj="item"
                :today="today"
                :event="event"
                :source="source"
                :lang="lang"
                :key="monthsn +'date'+ index"
                @sendEvent="receiveEvent"
            ></li>
        </ul>
    </div>`,
    props: {
        obj: {
            require: true
        },
        monthsn: {
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
        },
        lang: {
            require: true
        }
    },
    computed: {
        isFuture: function(){
            return ((this.obj.year > this.today.year) || (this.obj.year === this.today.year && this.obj.month > this.today.month));
        }
    },
    methods: {
        receiveEvent: function(){ //將收到的方法，推送給其他方法執行
            this.$okaTool.receiveEvent(this, arguments);
        }
    }
});

Vue.component('cpCalendarEventDays', {
    template: `
    <li
        v-if="events.length > 0"
        :class="[isToday ? 'is-today': '']"
    >
        <div class="time">
            <a class="inner" @click.prevent="update">
                <div class="date">{{ obj.month }}/{{ obj.date }}</div>
                <div class="day">({{ obj.language_day }})</div>
            </a>
        </div>
        <div class="event">
            <ul>
                <li
                    is="cpCalendarEventEvents"
                    v-for="item in events"
                    :obj="item"
                    :source="source"
                    :lang="lang"
                    :key="item.cal +'-'+ item.sn"
                    @sendEvent="receiveEvent"
                ></li>
            </ul>
        </div>
    </li>`,
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
        source: {
            require: true
        },
        lang: {
            require: true
        }
    },
    computed: {
        isToday: function(){
            return (this.obj.year === this.today.year && this.obj.month === this.today.month && this.obj.date === this.today.date);
        },
        events: function(){
            let $evts = [];

            if( this.event && this.event[this.obj.year] && this.event[this.obj.year][this.obj.month] && this.event[this.obj.year][this.obj.month][this.obj.date] ){
                let $target = this.event[this.obj.year][this.obj.month][this.obj.date];

                $target.forEach((item, index) => { //過濾沒有勾選顯示的物件
                    if( this.source[item.cal].active ){
                        $evts.push(item);
                    }
                });
            }

            $evts.sort((a, b) => {
                return (a.startTime.hour - b.startTime.hour) || (a.startTime.minutes - b.startTime.minutes);
            });

            return $evts;
        }
    },
    methods: {
        update: function(){ //推送日期的更新
            this.$emit('sendEvent', 'updateCal', 'main', {
                year: this.obj.year,
                month: this.obj.month,
                date: this.obj.date
            });

            this.$emit('sendEvent', 'updateMode', 'date');
        },
        receiveEvent: function(){ //將收到的方法，推送給其他方法執行
            this.$okaTool.receiveEvent(this, arguments);
        }
    }
});

Vue.component('cpCalendarEventEvents', {
    template: `
    <li>
        <a @click.prevent.stop="clickEvent" @mouseover.stop="hoverEvent" :class="[obj.extend.isOver? 'is-over': '']">
            <span class="mark" v-if="obj.extend.cover >= 1">
                <i :style="'background-color: '+ cal.color +';'"></i>
                <em>{{ lang.allDay }}</em>
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
    </li>`,
    props: {
        obj: {
            require: true
        },
        source: {
            require: true
        },
        lang: {
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
});

Vue.component('cpCalendarMiniDate', {
    template: `
    <div
        v-if="obj"
        class="day"
        :class="[isToday && obj.thisMonth ? 'is-today': '', isActive && obj.thisMonth ? 'is-active': '', obj.thisMonth? '': 'not-thisMonth']"
    >
        <a
            class="date"
            @click.prevent="update"
        >{{ obj.date }}</a>
    </div>`,
    props: {
        mainCal: {
            require: true
        },
        obj: {
            require: true
        },
        today: {
            require: true
        }
    },
    computed: {
        isToday: function(){

            if( this.obj.year === this.today.year && this.obj.month === this.today.month && this.obj.date === this.today.date ){
                return true;
            }
        },
        isActive: function(){

            if (this.obj.year === this.mainCal.year && this.obj.month === this.mainCal.month && this.obj.date === this.mainCal.date){
                return true;
            }
        }
    },
    methods: {
        update: function(){ //推送日期的更新
            if( this.isActive ){
                this.$emit('sendEvent', 'updateMode', 'date');
            }

            this.$emit('sendEvent', 'updateCal', 'main',{
                year: this.obj.year,
                month: this.obj.month,
                date: this.obj.date
            });
        }
    }
});

Vue.component('mdCalendarDays', {
    template: `
    <div class="md calendar-days" :class="['days-'+ obj.date]">
        <cpCalendarDaysCaption
            :obj="obj"
            :today="today"
            :event="event"
            :source="source"
            :sn="monthsn"
            @sendEvent="receiveEvent"
        ></cpCalendarDaysCaption>
        <div class="day-area">
            <div class="time-line">
                <ul>
                    <li class="t-0000">0000</li>
                    <li class="t-0030">0030</li>
                    <li class="t-0100">0100</li>
                    <li class="t-0130">0130</li>
                    <li class="t-0200">0200</li>
                    <li class="t-0230">0230</li>
                    <li class="t-0300">0300</li>
                    <li class="t-0330">0330</li>
                    <li class="t-0400">0400</li>
                    <li class="t-0430">0430</li>
                    <li class="t-0500">0500</li>
                    <li class="t-0530">0530</li>
                    <li class="t-0600">0600</li>
                    <li class="t-0630">0630</li>
                    <li class="t-0700">0700</li>
                    <li class="t-0730">0730</li>
                    <li class="t-0800">0800</li>
                    <li class="t-0830">0830</li>
                    <li class="t-0900">0900</li>
                    <li class="t-0930">0930</li>
                    <li class="t-1000">1000</li>
                    <li class="t-1030">1030</li>
                    <li class="t-1100">1100</li>
                    <li class="t-1130">1130</li>
                    <li class="t-1200">1200</li>
                    <li class="t-1230">1230</li>
                    <li class="t-1300">1300</li>
                    <li class="t-1330">1330</li>
                    <li class="t-1400">1400</li>
                    <li class="t-1430">1430</li>
                    <li class="t-1500">1500</li>
                    <li class="t-1530">1530</li>
                    <li class="t-1600">1600</li>
                    <li class="t-1630">1630</li>
                    <li class="t-1700">1700</li>
                    <li class="t-1730">1730</li>
                    <li class="t-1800">1800</li>
                    <li class="t-1830">1830</li>
                    <li class="t-1900">1900</li>
                    <li class="t-1930">1930</li>
                    <li class="t-2000">2000</li>
                    <li class="t-2030">2030</li>
                    <li class="t-2100">2100</li>
                    <li class="t-2130">2130</li>
                    <li class="t-2200">2200</li>
                    <li class="t-2230">2230</li>
                    <li class="t-2300">2300</li>
                    <li class="t-2330">2330</li>
                </ul>
            </div>
            <div class="day-line">
                <div class="time-target">
                    <ul>
                        <li class="t-0000">00:00</li>
                        <li class="t-0100">01:00</li>
                        <li class="t-0200">02:00</li>
                        <li class="t-0300">03:00</li>
                        <li class="t-0400">04:00</li>
                        <li class="t-0500">05:00</li>
                        <li class="t-0600">06:00</li>
                        <li class="t-0700">07:00</li>
                        <li class="t-0800">08:00</li>
                        <li class="t-0900">09:00</li>
                        <li class="t-1000">10:00</li>
                        <li class="t-1100">11:00</li>
                        <li class="t-1200">12:00</li>
                        <li class="t-1300">13:00</li>
                        <li class="t-1400">14:00</li>
                        <li class="t-1500">15:00</li>
                        <li class="t-1600">16:00</li>
                        <li class="t-1700">17:00</li>
                        <li class="t-1800">18:00</li>
                        <li class="t-1900">19:00</li>
                        <li class="t-2000">20:00</li>
                        <li class="t-2100">21:00</li>
                        <li class="t-2200">22:00</li>
                        <li class="t-2300">23:00</li>
                    </ul>
                </div>
                <cpCalendarDaysTimeEventsList
                    :obj="obj"
                    :today="today"
                    :event="event"
                    :source="source"
                    :sn="monthsn"
                    @sendEvent="receiveEvent"
                ></cpCalendarDaysTimeEventsList> <!-- days-timeevents -->
            </div>
        </div>
    </div>`,
    props: {
        obj: {
            require: true
        },
        monthsn: {
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
    methods: {
        receiveEvent: function(){ //將收到的方法，推送給其他方法執行
            this.$okaTool.receiveEvent(this, arguments);
        }
    }
});

Vue.component('cpCalendarDaysCaption', {
    template: `
    <div class="caption-area" :class="[dropState? 'is-drop':'']">
        <cpCalendarDaysTimeTargets
            :obj="obj"
            :today="today"
            :activeNode="activeNode"
            :sn="sn"
            @sendEvent="receiveEvent"
        ></cpCalendarDaysTimeTargets> <!-- days-timetarget -->
        <cpCalendarDaysEvents
            :obj="obj"
            :today="today"
            :event="event"
            :activeNode="activeNode"
            :source="source"
            :sn="sn"
            @sendEvent="receiveEvent"
        ></cpCalendarDaysEvents> <!-- days-dayevents -->
    </div>`,
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
        event: {
            require: true
        },
        source: {
            require: true
        }
    },
    data: function(){
        return {
            moveNode: null, //開始拖曳的物件為何
            moveType: null,
            moveTime: null,
            activeNode: {}
        }
    },
    computed: {
        dropState: function(){
            return !!this.moveNode;
        }
    },
    methods: {
        receiveEvent: function(){ //將收到的方法，推送給其他方法執行
            this.$okaTool.receiveEvent(this, arguments);
        },
        startDropStatus: function(obj){
            this.moveType = obj.type;
            this.moveNode = obj.data;
        },
        endDropStatus: function(obj){
            if( this.moveType === 'foot' ){
                this.$emit('sendEvent', 'dropEvent', this.moveNode, this.moveTime, this.moveType, 'date', true);
            }

            this.moveType = null;
            this.moveNode = null;
            this.moveTime = null;
        },
        changeData: function(obj){
            let $obj = {},
                _isFinally = null;

            $obj.year = obj.year;
            $obj.month = obj.month;
            $obj.date = obj.date;

            let $event = this.moveNode,
                $startTime = $event.startTime,
                $endTime = $event.endTime;

            if( this.moveType === 'head' ){

                if( $startTime.month === obj.month && $startTime.date === obj.date ){ //同個事件拖到同一天
                    return false;
                }

                _isFinally = true;
            }else if( this.moveType === 'foot' ){
                let $endTime = $event.endTime;

                let a = $startTime.year > obj.year,
                    b = $startTime.year === obj.year && $startTime.month > obj.month,
                    c = $startTime.year === obj.year && $startTime.month === obj.month && $startTime.date > obj.date,
                    d = $startTime.year === obj.year && $startTime.month === obj.month && $startTime.date === obj.date && $startTime.hour > $endTime.hour,
                    e = $startTime.year === obj.year && $startTime.month === obj.month && $startTime.date === obj.date && $startTime.hour === $endTime.hour && $startTime.minutes > $endTime.minutes;

                if( a || b || c || d || e ){ //如果時間小於開始時間
                    return false;
                }

                if( $startTime.hour === 0 && $startTime.minutes === 0 && $endTime.hour === 0 && $endTime.minutes === 0 ){ //如果是一天

                    let $addTime = new Date(obj.year, obj.month - 1, obj.date + 1);

                    $obj.year = $addTime.getFullYear();
                    $obj.month = $addTime.getMonth() + 1;
                    $obj.date = $addTime.getDate();
                }

                _isFinally = false;
            }

            this.moveTime = $obj;
            this.$emit('sendEvent', 'dropEvent', this.moveNode, this.moveTime, this.moveType, 'date', _isFinally);
        },
        dropDone: function(obj){
            if( this.moveType === 'head' ){
                this.changeData(obj);
                this.removeClass();
            }

            this.endDropStatus();
        },
        dropEnter: function(obj){
            if( this.moveType === 'head' ){
                this.addClass(obj);
            }else if( this.moveType === 'foot' ){
                this.changeData(obj);
            }
        },
        addClass: function(obj){ //改變顏色
            let $activeNode = this.activeNode;

            let $date = obj,
                $event = this.moveNode;

            let $startTime = this.moveNode.startTime,
                $endTime = this.moveNode.endTime;

            let $cover = new Date($endTime.year, $endTime.month - 1, $endTime.date) - new Date($startTime.year, $startTime.month - 1, $startTime.date),
                _cover = Math.floor($cover / 86400000) + 1;

            if( $endTime.hour === 0 && $endTime.minutes === 0 ){
                _cover -= 1;
            }

            let $allDate = this.obj,
                _start = 0;

            $allDate.forEach(date => {
                let a = date.month === obj.month && date.date === obj.date,
                    b = _start !== 0 && _start < _cover;

                let _key = date.year +'-'+ date.month +'-'+ date.date;

                if( a || b ){
                    this.$set($activeNode, _key, true);
                    _start += 1;
                }else {
                    this.$set($activeNode, _key, false);
                }
            });
        },
        removeClass: function(){
            this.$set(this, 'activeNode', {});
        }
    }
});

Vue.component('cpCalendarDaysTimeTargets', {
    template: `
    <div class="calendar-caption">
        <cpCalendarDaysTimeTarget
            v-for="(item, index) in obj"
            :obj="item"
            :today="today"
            :activeNode="activeNode"
            :key="sn +'timetarget'+ index"
            @sendEvent="receiveEvent"
        ></cpCalendarDaysTimeTarget> <!-- timetarget-day -->
    </div>`,
    props: {
        obj: {
            require: true
        },
        activeNode: {
            require: true
        },
        sn: {
            require: true
        },
        today: {
            require: true
        }
    },
    methods: {
        receiveEvent: function(){ //將收到的方法，推送給其他方法執行
            this.$okaTool.receiveEvent(this, arguments);
        }
    }
});

Vue.component('cpCalendarDaysTimeTarget', {
    template: `
    <div class="time" :class="[isToday ? 'is-today': '', isActive? 'is-active': '']" @click="clickTime">
        <a class="inner" @click.prevent.stop="update">
            <div class="date">{{ obj.month }}/{{ obj.date }}</div>
            <div class="day">({{ obj.language_shortDay }})</div>
        </a>
        <div class="sensor"
            @drop.prevent="dropDone"
            @dragenter.prevent="dropEnter"
            @dragover.prevent
        ></div>
    </div>`,
    props: {
        obj: {
            require: true
        },
        today: {
            require: true
        },
        activeNode: {
            require: true
        }
    },
    computed: {
        isToday: function(){
            return (this.obj.year === this.today.year && this.obj.month === this.today.month && this.obj.date === this.today.date);
        },
        isActive: function(){
            let $obj = this.obj;

            if( this.activeNode[$obj.year +'-'+ $obj.month +'-'+ $obj.date] ){
                return true;
            }else {
                return false;
            }
        }
    },
    methods: {
        update: function(){
            this.$emit('sendEvent', 'updateCal', 'main', {
                year: this.obj.year,
                month: this.obj.month,
                date: this.obj.date
            });

            this.$emit('sendEvent', 'updateMode', 'date');
        },
        clickTime: function(evt){
            this.$emit('sendEvent', 'clickTime', {
                year: this.obj.year,
                month: this.obj.month,
                date: this.obj.date,
                hour: 0,
                minutes: 0
            }, 'date');
        },
        dropDone: function(){
            this.$emit('sendEvent', 'dropDone', this.obj);
        },
        dropEnter: function(){
            this.$emit('sendEvent', 'dropEnter', this.obj);
        }
    }
});

Vue.component('cpCalendarDaysEvents', {
    template: `
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
        <div class="events" @click="clickTime">
            <cpCalendarDaysEventItem
                v-for="item in events"
                :obj="item"
                :source="source"
                :key="item.cal +'-'+ item.sn"
                @sendEvent="receiveEvent"
            ></cpCalendarDaysEventItem> <!-- days-dayevent -->
        </div>
    </div>`,
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
        clickTime: function(evt){ //先用寬度算點擊的是哪一天
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

            this.$emit('sendEvent', 'clickTime', {
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
});

Vue.component('cpCalendarDaysEventDay', {
    template: `
    <div class="day" :class="[isToday? 'is-today': '', isActive? 'is-active': '']" >
        <div class="sensor"
            @drop.prevent="dropDone"
            @dragenter.prevent="dropEnter"
            @dragover.prevent
        ></div>
    </div>`,
    props: {
        obj: {
            require: true
        },
        activeNode: {
            require: true
        },
        today: {
            require: true
        }
    },
    computed: {
        isToday: function(){
            return (this.obj.year === this.today.year && this.obj.month === this.today.month && this.obj.date === this.today.date);
        },
        isActive: function(){
            let $obj = this.obj;

            if( this.activeNode[$obj.year +'-'+ $obj.month +'-'+ $obj.date] ){
                return true;
            }else {
                return false;
            }
        }
    },
    methods: {
        dropDone: function(){
            this.$emit('sendEvent', 'dropDone', this.obj);
        },
        dropEnter: function(){
            this.$emit('sendEvent', 'dropEnter', this.obj);
        }
    }
});

Vue.component('cpCalendarDaysEventItem', {
    template: `
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
        {{ obj.sub }}
        <i class="resize"
            v-if="cal.editable"
            draggable="true"
            @dragstart.stop="startDropStatus($event, 'foot')"
            @dragend.stop="endDropStatus"
        ></i>
    </a>`,
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
});

Vue.component('cpCalendarDaysTimeEventsList', {
    template: `
    <div class="calendar-day" :class="[dropState? 'is-drop':'']">
        <cpCalendarDaysTimeEvents
            v-for="(item, index) in obj"
            :obj="item"
            :today="today"
            :event="event"
            :source="source"
            :eventsn="item.cal +'-'+ item.sn +'-'+ index"
            :key="sn +'timeevents'+ index"
            @sendEvent="receiveEvent"
        ></cpCalendarDaysTimeEvents> <!-- days-timeeventlist -->
        <div class="sensor"
            @dragleave="dropOver"
            @drop.prevent="dropDone"
            @dragover.prevent="dropEnter"
        ></div>
    </div>`,
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
        event: {
            require: true
        },
        source: {
            require: true
        }
    },
    data: function () {
        return {
            moveNode: null, //開始拖曳的物件為何
            moveType: null,
            moveTime: null
        }
    },
    computed: {
        dropState: function(){
            return !!this.moveNode;
        }
    },
    methods: {
        receiveEvent: function(){ //將收到的方法，推送給其他方法執行
            this.$okaTool.receiveEvent(this, arguments);
        },
        computedTime: function(num, mode){ //求時間
            let _offsetY = num;

            let _hour = Math.floor(_offsetY / 60), //以高度求時間
                _minutes = _offsetY % 60;

            if( mode === 'ceil' ){

                if ( _minutes !== 0 && _minutes < 30){
                    _minutes = 30;
                } else {
                    _hour += 1;
                    _minutes = 0;
                }
            }else if( mode === 'floor' ){

                if ( _minutes !== 0 && _minutes < 30){
                    _minutes = 0;
                } else {
                    _minutes = 30;
                }
            }

            if( _hour >= 24 ){
                _hour = 24
                _minutes = 0;
            }

            return {
                hour: _hour,
                minutes: _minutes
            }
        },
        computedDate: function(node, num){ //求哪一天
            let _offsetX = num;

            let $obj = this.obj,
                _length = $obj.length;

            let _base = node.offsetWidth / _length, //求一天的寬度
                _day = Math.floor(_offsetX / _base),
                $day = $obj[_day];

            return {
                year: $day.year,
                month: $day.month,
                date: $day.date
            }
        },
        dropOver: function(){
            this.$emit('sendEvent', 'errorMsg', '拖曳物件時請勿超過感應區');
            this.dropDone();
        },
        startDropStatus: function(obj){
            this.moveType = obj.type;
            this.moveNode = obj.data;
        },
        endDropStatus: function(obj){
            this.moveType = null;
            this.moveNode = null;
            this.moveTime = null;
        },
        changeData: function(obj){
            let $event = this.moveNode,
                $startTime = $event.startTime;

            if( this.moveType === 'foot' ){

                if( $startTime.date !== obj.date ){ //如果是跨天

                    if( obj.hour + obj.minutes <= 0 ){ //如果小於 00:00
                        return false;
                    }

                    let a = $startTime.year > obj.year,
                        b = $startTime.year === obj.year && $startTime.month > obj.month,
                        c = $startTime.year === obj.year && $startTime.month === obj.month && $startTime.date > obj.date;

                    if( a || b || c ){
                        return false;
                    }

                }else {
                    let a = $startTime.hour > obj.hour,
                        b = $startTime.hour === obj.hour && $startTime.minutes > obj.minutes;

                    if( a || b ){ //如果時間小於開始時間
                        return false;
                    }
                }
            }

            this.moveTime = obj;

            this.$emit('sendEvent', 'dropEvent', this.moveNode, this.moveTime, this.moveType, 'time', false);
        },
        dropDone: function(){
            this.$emit('sendEvent', 'dropEvent', this.moveNode, this.moveTime, this.moveType, 'time', true);

            this.endDropStatus();
        },
        dropEnter: function(e, obj){

            if( this.moveType === 'head' ){
                let $time = this.computedTime(e.offsetY, 'floor'),
                    $date = this.computedDate(e.target, e.offsetX);

                let $set = {
                        year: $date.year,
                        month: $date.month,
                        date: $date.date,
                        hour: $time.hour,
                        minutes: $time.minutes
                    }

                this.changeData($set);

            }else if( this.moveType === 'foot' ){
                let $time = this.computedTime(e.offsetY, 'ceil'),
                    $date = this.computedDate(e.target, e.offsetX);

                let $set = {
                        year: $date.year,
                        month: $date.month,
                        date: $date.date,
                        hour: $time.hour,
                        minutes: $time.minutes
                    }

                this.changeData($set);
            }
        }
    }
});

Vue.component('cpCalendarDaysTimeEvents', {
    template: `
    <div
        class="day"
        :class="[isToday ? 'is-today': '']"
        @click="clickTime"
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
    </div>`,
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
    data: function () {
        return {
            now: 0
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
        clickTime: function (evt){ //用高度算新增時間
            let _offsetY = evt.offsetY;

            let _startHour = Math.floor(_offsetY / 60),
                _startMinutes = _offsetY % 60;

            if (_startMinutes < 30){
                _startMinutes = 0;
            } else {
                _startMinutes = 30;
            }

            this.$emit('sendEvent', 'clickTime', {
                year: this.obj.year,
                month: this.obj.month,
                date: this.obj.date,
                hour: _startHour,
                minutes: _startMinutes
            }, 'time');
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
});

Vue.component('cpCalendarDaysTimeEvent', {
    template: `
    <a
        :draggable="cal.editable"
        :class="['width-'+ obj.extend.col +'-'+ obj.extend.index +'-'+ obj.extend.width, obj.extend.isOver? 'is-over': '']"
        :style="'background-color: '+ cal.color +';height: '+ timeHeight +'px;top: '+ timeTop +'px;'"
        @click.prevent.stop="clickEvent"
        @mouseover.stop="hoverEvent"
        @dragstart="startDropStatus($event, 'head')"
        @dragend="endDropStatus"
    >
        {{ obj.sub }}<br>
        {{ startHours }}:{{ startMinutes }} - {{ endHours }} : {{ endMinutes }}
        <i class="resize"
            v-if="cal.editable"
            draggable="true"
            @dragstart.stop="startDropStatus($event, 'foot')"
            @dragend.stop="endDropStatus"
        ></i>
    </a>`,
    props: {
        obj: {
            require: true
        },
        source: {
            require: true
        },
        thisDay: {
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
            return this.source[this.obj.cal];
        },
        timeTop: function(){ //算定位，1px 代表1分鐘
            let $startTime = this.obj.startTime,
                $endTime = this.obj.endTime;

            let $thisDay = this.thisDay;

            let _coverEvent = ($startTime.date !== $endTime.date),
                _firstDay = ($thisDay.month === $startTime.month && $thisDay.date === $startTime.date);

            if(_coverEvent && !_firstDay){ //如果這是跨天事件，且又是後面那一天
                return 0;
            }else { //當天事件
                return $startTime.hour * 60 + $startTime.minutes + 2;
            }
        },
        timeHeight: function(){ //算事件長度，1px 代表1分鐘
            let $startTime = this.obj.startTime,
                $endTime = this.obj.endTime;

            let _result = 0;

            let $thisDay = this.thisDay;

            let _coverEvent = ($startTime.date !== $endTime.date),
                _firstDay = ($thisDay.month === $startTime.month && $thisDay.date === $startTime.date),
                _lastDay = ($thisDay.month === $endTime.month && $thisDay.date === $endTime.date);

            if(_coverEvent && _firstDay){ //如果這是不足 24h 的跨天事件，且又是第一天
                _result = 24 * 60 - this.timeTop - 4;
            }else { //當天事件

                if(_lastDay){
                    _result = $endTime.hour * 60 + $endTime.minutes - this.timeTop - 4;
                }else{
                    _result = 1440 - 4;
                }
            }

            return Math.max(_result, 20);
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
});
