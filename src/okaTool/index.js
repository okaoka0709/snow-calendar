export default {
    install: function(Vue, options) {
        Vue.prototype.$okaTool = this;
    },
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
    },
    siteConfig: {
        url : 'http://10.153.196.78:11609',
        errorMsg: '發生錯誤，請檢查您的網路連線，或聯絡我們以為您服務。'
    }
}
