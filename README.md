<a href="https://www.npmjs.com/package/snow-calendar">
  <img src="https://img.shields.io/npm/v/snow-calendar.svg">
  <img src="https://img.shields.io/npm/l/snow-calendar.svg">
  <img src="https://img.shields.io/npm/dt/snow-calendar.svg">
</a>

## english version on the below
# Snow Calendar
Snow Calendar 是一個類似 google calendar 或 FullCalendar 的 **vue** 的前端日曆套件，其特色如下：
* 不包含 jquery
* 您可自行設計操作介面及資料交互方式, 因為事件與資料完全開放。
* 以月為單位初始化資料，使用者切換到當月再動態取得資料。
* 簡易使用，安裝套件後使用 **&lt;snowCalendar&gt;&lt;/snowCalendar&gt;** 標籤使用即可。
* 提供多語系：繁體中文、簡體中文、英文、日文
* 提供完整的日曆視圖：年、月、週、4天、天、事件
* 提供多曆本的設計。
* 提供檢視的小日曆、完整的操作功能列。

![image](https://raw.githubusercontent.com/okaoka0709/snow-calendar/master/src/assets/readme-img/snowCalendar_month.png)
![image](https://raw.githubusercontent.com/okaoka0709/snow-calendar/master/src/assets/readme-img/snowCalendar_week.png)


## 操作影片
您可以觀看 [https://youtu.be/1tL3BEmg6Sk](https://youtu.be/1tL3BEmg6Sk)
  
  
## Demo
Snow Calendar 範本，您可以至 Source 取得原始碼：
<a href="https://snow-calendar-extend.000webhostapp.com" target="_blank">Demo</a>、<a href="https://github.com/okaoka0709/snow-calendar-demo" target="_blank">Source</a>

基本的 Snow Calendar：
<a href="https://snow-calendar.000webhostapp.com" target="_blank">Demo</a>

如果您有 Vue Cli，您也可以使用本專案建立簡易的本機 Demo。先執行 npm 安裝依賴：
```
$ npm install
$ npm run serve
```


## 安裝方式
```
$ npm install snow-calendar --save
```


## 使用方式
安裝之後，在您的 main.js 檔案中引用 snow-calendar 並 use，再引入 css 檔案：
```
import Vue from 'vue'
import snowCalendar from 'snow-calendar'
import 'snow-calendar/src/css/snowCalendar.css'

Vue.use(snowCalendar)
```
接著在您希望呈現的 .vue 檔案中引用：
```
<template>
  <snowCalendar></snowCalendar>
</template>
```


## 使用傳統開發方式(不使用 Vue-cli)
下載本套件後，您可以在 cdn/index.html 中看到範例。
在 **&lt;head&gt;&lt;/head&gt;** 標籤中引入樣式、語系檔與主程式。
```
<link rel="stylesheet" href="./script/style/snowCalendar.css">
<script src="./script/lang/tw.js"></script>
<script src="./script/snowCalendar.js"></script>
```
在 **&lt;body&gt;&lt;/body&gt;** 標籤中使用 **&lt;snowCalendar&gt;&lt;/snowCalendar&gt;** ：
```
<div id="my-app">
    <snow-calendar></snow-calendar>
</div>
```


## 提供日曆資料
在 Snow Calendar 中，您可以提供以下幾種資料：
* 日曆本資料(sources)
* 行程資料(events)
* 觀看模式(mode)
* 曆觀看時間(mainCal)
* 小日曆觀看時間(refCal)
* 顯示/隱藏組件(uiVisible)
* 語系(lang)

設定方式如下：
```
<snowCalendar
  :sources="sourceObject"
  :events="eventObject"
  :mode="modeString"
  :main-cal="timeObject"
  :ref-cal="timeObject"
  :ui-visible="setObject"
  :lang="langString"
></snowCalendar>
```

### 日曆本資料(sources):Array
Snow Calendar 提供多日曆本的功能，日曆本提供編輯權限與顏色。
日曆本資料為一陣列，陣列中包含日曆本物件，資料有：
* 唯一值(sn):String or Number
* 標題(sub):String
* 敘述(desc):String
* 編輯權限(editable):Boolean
* 顏色(color):String hex
* 是否顯示(active):Boolean

格式如下：
```
let sourceObject = [
    {
      "sn": 1,
      "sub": "日曆本標題",
      "desc": "日曆本敘述",
      "editable": true,
      "color": "#e54288",
      "active": true
    }
  ]
```
當 editable 屬性為 false，會自動關閉拖曳事件。

### 行程資料 (events):Array
行程資料提供介面可顯示、操作的事件。
行程資料為一陣列，陣列中包含行程物件，資料有：
* 起始日期(startTime):Object
* 結束日期(endTime):Object
* 唯一值(sn):String or Number
* 標題(sub):String
* 敘述(desc):String
* 日曆本歸屬(cal):String or Number
* 地點(location):String

格式如下：
```
let eventObject = [
    {
      "startTime": {
        "year": 2019,
        "month": 1,
        "date": 1,
        "hour": 12,
        "minutes": 0
      },
        "endTime":{
        "year": 2019,
        "month": 1,
        "date": 1,
        "hour": 20,
        "minutes": 30
      },
      "sn": 1,
      "sub": "事件標題",
      "desc": "事件敘述",
      "cal": 1,
      "location": "地點"
    }
  ]
```
請注意日曆歸屬(cal) 屬性的值，必須對應日曆本的 sn 屬性。
Snow Calendar **不呈現**找不到日曆歸屬的事件，因此**建立行程資料之前，一定要先建立日曆本資料**。

### 觀看模式(mode):String
您可以指定使用者所使用的觀看模式，Snow Calendar 提供的觀看模式有：
* 年(year)
* 月(month)
* 週(week)
* 4天(4days)
* 天(date)
* 事件(event)

```
let modeString = 'week'
```
使用者在操作介面中，仍然可以切換觀看模式。
您也可以動態修改 mode 的值，改變使用者的觀看模式。
若沒有設定這個值，或設定了錯的值，將會預設呈現 month 月曆模式。

請注意，當使用者透過預設介面切換觀看模式時，**並不會**跟著更動 mode 的值，因為子組件無權修改的父組件屬性，但您可以藉由 **切換觀看模式(updateMode)** 方法，取得切換的觀看模式。

### 日曆觀看時間(mainCal) 及小日曆觀看時間(refCal):Object
您可以決定使用者所觀看的日曆、小日曆時間，資料有：
* 年(year):Number
* 月(month):Number
* 日(date):Number

格式如下：
```
let timeObject = {
    "year": 2019,
    "month": 10,
    "date": 8
  }
```
使用者在操作介面中，仍然可以切換觀看時間。
您也可以動態修改 timeObject 的值，改變使用者的觀看時間。
若沒有設定這個物件，或設定了錯的值，觀看時間將會自動設定為今日。

### 顯示/隱藏組件(uiVisible):Object
您可以決定哪些組件該隱藏、顯示，資料有：
* 控制列(control):Boolean
* 小日曆(refCal):Boolean
* 日曆本區塊(source):Boolean

格式如下：
```
let setObject = {
    control: true,
    refCal: true,
    source: true
  }
```
若沒有設定這個物件，或設定了錯的值，組件將會自動設定為顯示。
若您隱藏了預設的控制列，您可以透過操控修改**觀看模式(mode)** 及**日曆觀看時間(mainCal)** 實作自定義的控制列。

![image](https://raw.githubusercontent.com/okaoka0709/snow-calendar/master/src/assets/readme-img/visible.png)

### 語系(lang):String
您可以指定使用者所使用的語系，目前提供的觀看模式有：
* 繁體中文(tw)
* 簡體中文(cn)
* 英文(en)
* 日文(jp)

```
let langString = 'jp'
```
若沒有設定這個值，或設定了錯的值，語系將會自動設定為英文。
不同語言會得到不同的月曆配置，例如 en 將以週日做為一週的起始，tw 將以週一做為一週的起始。
徵求志願人員幫忙翻譯語言，請來信 [okaoka0709@gmail.com](mailto:okaoka0709@gmail.com)。


## 日曆事件
Snow Calendar 提供以下幾種事件：
* 切換觀看時間(updateCal)
* 切換觀看模式(updateMode)
* 第一次檢視該月(initMonth)
* 顯示錯誤的訊息(errorMsg)
* 點擊時間(clickTime)
* 拖曳行程(dropEvent)
* 新增行程(addEvent)
* 點擊行程(clickEvent)
* 滑入行程(hoverEvent)
* 點擊更多(clickMore)
* 滑入更多(hoverMore)
* 新增日曆本(addSource)
* 匯入日曆本(importSource)
* 點擊日曆本(clickSource)
* 滑入日曆本(hoverSource)

設定方式如下：
```
<snowCalendar
  @updateCal="someFunction"
  @updateMode="someFunction"
  @initMonth="someFunction"
  @errorMsg="someFunction"
  @clickTime="someFunction"
  @dropEvent="someFunction"
  @addEvent="someFunction"
  @clickEvent="someFunction"
  @hoverEvent="someFunction"
  @clickMore="someFunction"
  @hoverMore="someFunction"
  @addSource="someFunction"
  @importSource="someFunction"
  @clickSource="someFunction"
  @hoverSource="someFunction"
></snowCalendar>
```
Snow Calendar 沒有提供修改、移除的事件，您完全可以自定義操作**行程資料**及**日曆本資料**的邏輯及方法。

### 切換觀看時間(updateCal)
當使用者切換日曆及小日曆的觀看時間時，觸發該事件。
updateCal 提供兩個參數分別是 cal(String) 與 date(Object)。
```
function(cal, date)
```
cal 參數指明使用者切換的是日曆或是小日曆，有可能是以下的值：
* main(日曆)
* ref(小日曆)

date 參數指明使用者點選的時間，看起來像以下這樣：
```
{
  year: 2019,
  month: 1,
  date: 1
}
```

### 切換觀看模式(updateMode)
當使用者切換日曆觀看模式時，觸發該事件。

![image](https://raw.githubusercontent.com/okaoka0709/snow-calendar/master/src/assets/readme-img/snowCalendar_viewMode.png)

updateMode 提供一個參數 mode(String)，指明使用者選取的觀看模式。
```
function(mode)
```
有可能是以下的值：
* year(年)
* month(月)
* week(週)
* 4days(4天)
* date(天)
* event(事件)

### 第一次檢視該月(initMonth)
當使用者第一次需要取得該月的資訊時，觸發該事件。
建議在此事件觸發時，取得本月的行程並加入至行程資料(events)。

updateMode 提供一個參數 date(Object)。
```
function(date)
```
看起來像以下這樣：
```
{
  year: 2019,
  month: 1,
  date: 1
}
```

### 顯示錯誤的訊息(errorMsg)
當使用者操作錯誤，系統需提示使用者訊息時觸發。
errorMsg 提供一個參數 error(String)。
```
function(error)
```

### 點擊時間(clickTime)
在天、4天、週、月觀看模式時，使用者以游標點選時間方格時觸發。
點選時間通常被定義為新增行程功能，因此 clickTime 提供與 addEvent 一致的參數，以方便您直接串接。
clickTime 提供兩個參數分別是 time(Object) 與 mode(String)。
```
function(time, mode)
```
time 參數指明使用者點選的時間，看起來像以下這樣：
```
{
  year: 2019,
  month: 1,
  date: 1,
  hour: 12,
  minutes: 0
}
```
mode 參數指明使用者選取的是天或是時間，有可能是以下的值：
* date(天)
* time(時間)

當使用者選取整天時，hour 與 minutes 都會為 0。

### 拖曳行程(dropEvent)
當使用者在天、4天、週、月觀看模式時，使用者以拖曳行程時觸發。
dropEvent 只提供一個參數 event(Object)。
```
function(event)
```
event 參數回傳使用者操作的行程資訊，看起來像以下這樣：
```
{
  "startTime": {
    "year": 2019,
    "month": 1,
    "date": 1,
    "hour": 12,
    "minutes": 0
  },
  "endTime":{
    "year": 2019,
    "month": 1,
    "date": 1,
    "hour": 20,
    "minutes": 30
  },
  "sn": 1,
  "sub": "事件標題",
  "desc": "事件敘述",
  "cal": 1,
  "location": "地點"
}
```
dropEvent 將回傳一個已修改結果的 event，您只要將事件更新至 server 即可。

### 新增行程(addEvent)
當使用者點選**新增行程**按鈕時觸發。
addEvent 提供的的參數與 clickTime 一致。

addEvent 提供兩個參數分別是 time(Object) 與 mode(String)。
```
function(time, mode)
```
time 參數指明使用者點選的時間，看起來像以下這樣：
```
{
  year: 2019,
  month: 1,
  date: 1,
  hour: 12,
  minutes: 0
}
```
mode 參數指明使用者選取的是天或是時間，有可能是以下的值：
* date(天)
* time(時間)

當使用者選取整天時，hour 與 minutes 都會為 0。

### 點擊行程(clickEvent)
當使用者點選行程時觸發。clickEvent 提供兩個參數分別是 event(Object) 與 MouseEvent(MouseEvent)。
```
function(event, MouseEvent)
```
event 參數回傳使用者操作的行程資訊，看起來像以下這樣：
```
{
  "startTime": {
    "year": 2019,
    "month": 1,
    "date": 1,
    "hour": 12,
    "minutes": 0
  },
  "endTime":{
    "year": 2019,
    "month": 1,
    "date": 1,
    "hour": 20,
    "minutes": 30
  },
  "sn": 1,
  "sub": "事件標題",
  "desc": "事件敘述",
  "cal": 1,
  "location": "地點"
}
```
MouseEvent 參數回傳原生事件。

### 滑入行程(hoverEvent)
當使用者滑入行程時觸發。
hoverEvent 提供的的參數與 clickEvent 一致。

### 點擊更多(clickMore)
當使用者點擊”還有n則“文字時觸發。
hoverEvent 提供兩個參數分別是 event(Object) 與 MouseEvent(MouseEvent)。
```
function(event, MouseEvent)
```
event 參數回傳使的行程資訊與一般行程資訊相似，但該資訊額外提供 extend.moreEvent 陣列，以收納額外的行程資訊
看起來像以下這樣：
```
{
  "sn": 1,
  "sub": "還有2則",
  "year": 2019,
  "month": 1,
  "date": 1,
  "extend": {
    "moreEvent": [
      {
        "startTime": {
          "year": 2019,
          "month": 1,
          "date": 1,
          "hour": 12,
          "minutes": 0
        },
        "endTime":{
          "year": 2019,
          "month": 1,
          "date": 1,
          "hour": 20,
          "minutes": 30
        },
        "sn": 1,
        "sub": "更多事件1",
        "desc": "事件敘述",
        "cal": 1,
        "location": "地點"
      },
      {
        "startTime": {
          "year": 2019,
          "month": 1,
          "date": 1,
          "hour": 12,
          "minutes": 0
        },
        "endTime":{
          "year": 2019,
          "month": 1,
          "date": 1,
          "hour": 20,
          "minutes": 30
        },
        "sn": 1,
        "sub": "更多事件2",
        "desc": "事件敘述",
        "cal": 1,
        "location": "地點"
      }
    ]
  }
}
```
MouseEvent 參數回傳原生事件。

### 滑入更多(hoverMore)
當使用者滑入更多文字時觸發。
hoverMore 提供的的參數與 clickMore 一致。

### 新增日曆本(addSource)
當使用者點選**新增日曆**按鈕時觸發。

### 匯入日曆本(importSource)
當使用者點選**匯入日曆**按鈕時觸發。

### 點擊日曆本(clickSource)
當使用者點選日曆本右方設定圖示時觸發。

![image](https://raw.githubusercontent.com/okaoka0709/snow-calendar/master/src/assets/readme-img/source.png)

clickSource 提供兩個參數分別是 source(Object) 與 MouseEvent(MouseEvent)。
```
function(source, MouseEvent)
```
source 參數回傳使用者操作的日曆資訊，看起來像以下這樣：
```
{
  "sn": 1,
  "sub": "日曆本標題",
  "desc": "日曆本敘述",
  "editable": true,
  "color": "#e54288",
  "active": true
}
```
MouseEvent 參數回傳原生事件。

### 滑入日曆本(hoverSource)
當使用者滑入日曆標題文字時觸發。
hoverSource 提供的的參數與 clickSource 一致。


## 聯絡我
<a href="mailto:okaoka0709@gmail.com" target="_blank">okaoka0709@gmail.com</a>



# Snow Calendar
Snow Calendar is a front-end calendar plugin for **vue** like google calendar or FullCalendar:
* no jquery
* You can make your own UI, because the event and data is opened.
* Initialize data by month, you can get your data when user change calendar time.
* Easy to use, just install it and use **&lt;snowCalendar&gt;&lt;/snowCalendar&gt;** tag.
* Provide Traditional Chinese, Simplified Chinese, English and Japanese
* Provide year view, month view, week view, 4 days view, day view and list view
* Provide multi Calendar.
* Provides a mini calendar and a complete control bar.

![image](https://raw.githubusercontent.com/okaoka0709/snow-calendar/master/src/assets/readme-img/snowCalendar_month.png)
![image](https://raw.githubusercontent.com/okaoka0709/snow-calendar/master/src/assets/readme-img/snowCalendar_week.png)


## Operating video
You can watch [https://youtu.be/1tL3BEmg6Sk](https://youtu.be/1tL3BEmg6Sk)


## Demo
Snow Calendar sample, you can also get the source:
<a href="https://snow-calendar-extend.000webhostapp.com" target="_blank">Demo</a>、<a href="https://github.com/okaoka0709/snow-calendar-demo" target="_blank">Source</a>

Basic Snow Calendar:
<a href="https://snow-calendar.000webhostapp.com" target="_blank">Demo</a>

If you have Vue Cli, you can also use this project to build a basic Demo on your computer.
```
$ npm install
$ npm run serve
```


## Install
```
$ npm install snow-calendar --save
```


## How to use
After install, import snow-calendar and use it in your main.js, and then import the css file:
```
Import Vue from 'vue'
Import snowCalendar from 'snow-calendar'
Import 'snow-calendar/src/css/snowCalendar.css'

Vue.use(snowCalendar)
```
Then use snowCalendar tag in the .vue file:
```
<template>
  <snowCalendar></snowCalendar>
</template>
```


## If you don't use vue cli
Download this case. you can see how do add this to your page by cdn/index.html.
import it in **&lt;head&gt;&lt;/head&gt;** :
```
<link rel="stylesheet" href="./script/style/snowCalendar.css">
<script src="./script/lang/tw.js"></script>
<script src="./script/snowCalendar.js"></script>
```
and use **&lt;snowCalendar&gt;&lt;/snowCalendar&gt;** :
```
<div id="my-app">
    <snow-calendar></snow-calendar>
</div>
```


## Calendar information
you can bind those information on Snow Calendar:
* Calendar information (sources)
* Event data (events)
* View mode (mode)
* Main calendar time (mainCal)
* Mini calendar time (refCal)
* Show/Hide component (uiVisible)
* Language (lang)

like this:
```
<snowCalendar
  :sources="sourceObject"
  :events="eventObject"
  :mode="modeString"
  :mainCal="timeObject"
  :refCal="timeObject"
  :uiVisible="setObject"
  :lang="langString"
></snowCalendar>
```

### Calendar information (sources): Array
Snow Calendar provide multi calendar, which provides event color and user editable.
The calendar data is an array containing calendar items. The data includes:
* Unique value (sn): String or Number
* Title (sub): String
* Discriptyion (desc): String
* Editable (editable): Boolean
* Color (color): String hex
* display (active): Boolean

like this:
```
let sourceObject = [
    {
      "sn": 1,
      "sub": "calendar title",
      "desc": "calendar discriptyion",
      "editable": true,
      "color": "#e54288",
      "active": true
    }
  ]
```
when editable is false. the event can't trigger drop event.

### Event data (events): Array
The event data is an array, and the array contains the event items. The data includes:
* Start date (startTime): Object
* End date (endTime): Object
* Unique value (sn): String or Number
* Title (sub): String
* Discription (desc): String
* Calendar (cal): String or Number
* Location (location): String

The format is as follows:
```
let eventObject = [
    {
      "startTime": {
        "year": 2019,
        "month": 1,
        "date": 1,
        "hour": 12,
        "minutes": 0
      },
        "endTime": {
        "year": 2019,
        "month": 1,
        "date": 1,
        "hour": 20,
        "minutes": 30
      },
      "sn": 1,
      "sub": "event title",
      "desc": "event discription",
      "cal": 1,
      "location": "location"
    }
  ]
```
the value of the calendar(cal) attribute, which must correspond to the sn attribute of the calendar.
Snow Calendar ** does not render ** events that cannot be found by calendar, so **Before creating events,you have to create calendar information first.**.

### View mode (mode): String
You can set view mode for your users:
* year (year)
* month (month)
* week (week)
* 4 days (4days)
* days (date)
* list (event)

```
let modeString = 'week'
```
The user can still switch the viewing mode in the operation interface.
You can also dynamically change the value of mode to change the user's viewing mode.
If this value is not set, or if the wrong value is set, it will be month mode.

when user switches the viewing mode through the preset interface, **the mode value will not change**, because the child component can't replace the parent component value, but you can get mode value by **updateMode** method.

### Main calendar time (mainCal) / mini calendar time (refCal): Object
You can set the main calendar and small calendar time for user:
* Year(year): Number
* Month(month): Number
* Date(date): Number

like this:
```
let timeObject = {
    "year": 2019,
    "month": 10,
    "date": 8
  }
```
The user can still switch the viewing time in the operation interface.
You can also dynamically change the value of timeObject to change the user's viewing time.
If this object is not set, or if the wrong value is set, it will be today.

### Show/Hide component (uiVisible): Object
You can decide which components will be show or hidden:
* Control bar (control): Boolean
* Mini calendar (refCal): Boolean
* Calendar (source): Boolean

like this:
```
let setObject = {
    Control: true,
    refCal: true,
    Source: true
  }
```
If this object is not set, or if the wrong value is set, any component will be show.
If you hide the default control bar, you can use **view mode (mode)** and **calendar time (mainCal)** to create a new custom control bar.

![image](https://raw.githubusercontent.com/okaoka0709/snow-calendar/master/src/assets/readme-img/visible.png)

### Language (lang): String
You can set the UI language:
* Traditional Chinese (tw)
* Simplified Chinese (cn)
* English (en)
* Japanese (jp)

```
let langString = 'jp'
```
If this value is not set, or if the wrong value is set, it will be English.
languge setting will change layput. for example. when you use 'en', sunday will be first day. but if you use 'jp'. monday will be first day.
For volunteers to help translate, please contact me [okaoka0709@gmail.com] (mailto:okaoka0709@gmail.com).

## Calendar event
Snow Calendar provides those events:
* Change calendar time (updateCal)
* Switch mode (updateMode)
* Initialize month (initMonth)
* Show error message (errorMsg)
* Click time (clickTime)
* Drop event (dropEvent)
* Add event (addEvent)
* Click event (clickEvent)
* Hover event (hoverEvent)
* Click more (clickMore)
* Hover more (hoverMore)
* Add calendar (addSource)
* Import calendar (importSource)
* Click calendar (clickSource)
* Hover calendar (hoverSource)

like this:
```
<snowCalendar
  @updateCal="someFunction"
  @updateMode="someFunction"
  @initMonth="someFunction"
  @errorMsg="someFunction"
  @clickTime="someFunction"
  @dropEvent="someFunction"
  @addEvent="someFunction"
  @clickEvent="someFunction"
  @hoverEvent="someFunction"
  @clickMore="someFunction"
  @hoverMore="someFunction"
  @addSource="someFunction"
  @importSource="someFunction"
  @clickSource="someFunction"
  @hoverSource="someFunction"
></snowCalendar>
```
Snow Calendar don't provide edit or remove event(calendar) function, you have to do it yourself.

### Change calendar time (updateCal)
This event is triggered when the user change the calendar time(main calendar or mini calendar).
updateCal provides two parameters, cal(String) and date(Object).
```
Function(cal, date)
```
The cal parameter show which calendar will change:
* main (calendar)
* ref (mini calendar)

The date parameter show what time it is, which looks like this:
```
{
  Year: 2019,
  Month: 1,
  Date: 1
}
```

### Switch mode (updateMode)
This event is triggered when the user switches the calendar viewing mode.

![image](https://raw.githubusercontent.com/okaoka0709/snow-calendar/master/src/assets/readme-img/snowCalendar_viewMode.png)

updateMode provides a parameter mode(String) show which mode selected.
```
Function(mode)
```
There may be the following values:
* year (year)
* month (month)
* week (week)
* 4days (4 days)
* date (days)
* list (event)

### Initialize month (initMonth)
This event is triggered when the user first time watch the month.
It is recommended that when this event is triggered, you can get your event data and add them to event data.

updateMode provides a parameter date(Object).
```
Function(date)
```
It looks like this:
```
{
  Year: 2019,
  Month: 1,
  Date: 1
}
```

### Show error message (errorMsg)
This event is triggered when snow calendar need send some error message to user.
errorMsg provides a parameter error(String).
```
Function(error)
```

### Click time (clickTime)
In the day mode, 4 days mode, week mode, and month mode, user can pick a time.
The click time is usually defined as the new trip function, so clickTime provides parameters that are consistent with addEvent so that you can connect directly.
The two parameters provided by clickTime are time(Object) and mode(String).
```
Function(time, mode)
```
The time parameter indicates when the user clicked, which looks like this:
```
{
  Year: 2019,
  Month: 1,
  Date: 1,
  Hour: 12,
  Minutes: 0
}
```
The mode parameter indicates whether the user selected the day or time, which may be the following values:
* date (days)
* time (time)

When the user picks up all day, both hour and minutes will be 0.

### Drop event (dropEvent)
In the day mode, 4 days mode, week mode, and month mode, the user triggers when dragging the event.
Only one parameters provided by dropEvent is event(Object).
```
Function(event)
```
The event parameter returns the trip information for the user action, which looks like this:
```
{
  "startTime": {
    "year": 2019,
    "month": 1,
    "date": 1,
    "hour": 12,
    "minutes": 0
  },
  "endTime": {
    "year": 2019,
    "month": 1,
    "date": 1,
    "hour": 20,
    "minutes": 30
  },
  "sn": 1,
  "sub": "event title",
  "desc": "event discription",
  "cal": 1,
  "location": "location"
}
```
the dropEvent will return a complite event. you only need to update the event to your server.

The mode parameter indicates whether the mode dragged by the user is day or time, and may be the following values:
* date (days)
* time (time)

The finally parameter indicates whether the user drag is the last result, for example, 2019/1/1 is dragged to 2019/1/3, and the dropEvent event will be triggered twice (2019/1/2, 2019/1/3 each), but only The last finally parameter is true. It is recommended to pass the modified data to the backend when the finally parameter is true.

### Add event (addEvent)
Triggered when the user clicks the **Add event** button.
The parameters provided by addEvent are consistent with clickTime.

addEvent provides two parameters: time(Object) and mode(String).
```
Function(time, mode)
```
The time parameter indicates when the user clicked, which looks like this:
```
{
  Year: 2019,
  Month: 1,
  Date: 1,
  Hour: 12,
  Minutes: 0
}
```
The mode parameter indicates whether the user selected the day or time, which may be the following values:
* date (days)
* time (time)

When the user picks up all day, both hour and minutes will be 0.

### Click event (clickEvent)
Triggered when the user clicks on the event. The clickEvent provides two parameters: event(Object) and MouseEvent(MouseEvent).
```
Function(event, MouseEvent)
```
The event parameter returns the event information for the user action, which looks like this:
```
{
  "startTime": {
    "year": 2019,
    "month": 1,
    "date": 1,
    "hour": 12,
    "minutes": 0
  },
  "endTime": {
    "year": 2019,
    "month": 1,
    "date": 1,
    "hour": 20,
    "minutes": 30
  },
  "sn": 1,
  "sub": "event title",
  "desc": "event discription",
  "cal": 1,
  "location": "location"
}
```
The MouseEvent parameter returns a native event.

### Hover event (hoverEvent)
Triggered when the user hover the event.
The parameters provided by hoverEvent are consistent with clickEvent.

### Click more (clickMore)
Triggered when the user clicks "more".
hoverEvent provides two parameters: event(Object) and MouseEvent(MouseEvent).
```
Function(event, MouseEvent)
```
The event parameter is looks like normal event information, but it provided extend.moreEvent array to content more event information.
It looks like this:
```
{
  "sn": 1,
  "sub": "+2 more",
  "year": 2019,
  "month": 1,
  "date": 1,
  "extend": {
    "moreEvent": [
      {
        "startTime": {
          "year": 2019,
          "month": 1,
          "date": 1,
          "hour": 12,
          "minutes": 0
        },
        "endTime": {
          "year": 2019,
          "month": 1,
          "date": 1,
          "hour": 20,
          "minutes": 30
        },
        "sn": 1,
        "sub": "More Events 1",
        "desc": "event discription",
        "cal": 1,
        "location": "location"
      },
      {
        "startTime": {
          "year": 2019,
          "month": 1,
          "date": 1,
          "hour": 12,
          "minutes": 0
        },
        "endTime": {
          "year": 2019,
          "month": 1,
          "date": 1,
          "hour": 20,
          "minutes": 30
        },
        "sn": 1,
        "sub": "More Events 2",
        "desc": "event discription",
        "cal": 1,
        "location": "location"
      }
    ]
  }
}
```
The MouseEvent parameter returns a native event.

### Hover more (hoverMore)
Triggered when the user hover "more".
The parameters provided by hoverMore are consistent with clickMore.

### Add calendar (addSource)
Triggered when the user clicks the **Add Calendar** button.

### Import calendar (importSource)
Triggered when the user clicks the **Import Calendar** button.

### Click calendar (clickSource)
Triggered when the user clicks the setting icon on the right side of the calendar.

![image](https://raw.githubusercontent.com/okaoka0709/snow-calendar/master/src/assets/readme-img/source.png)

The clickSource provides two parameters: source(Object) and MouseEvent(MouseEvent).
```
Function(source, MouseEvent)
```
The source parameter returns the calendar information, which looks like this:
```
{
  "sn": 1,
  "sub": "calendar title",
  "desc": "calendar Discription",
  "editable": true,
  "color": "#e54288",
  "active": true
}
```
The MouseEvent parameter returns a native event.

### Hover calendar (hoverSource)
Triggered when the user hover the calendar title text.
The parameters provided by hoverSource are consistent with clickSource.


## contact me
<a href="mailto:okaoka0709@gmail.com" target="_blank">okaoka0709@gmail.com</a>
