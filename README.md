<a href="https://www.npmjs.com/package/snow-calendar">
  <img src="https://img.shields.io/npm/v/snow-calendar.svg">
  <img src="https://img.shields.io/npm/l/snow-calendar.svg">
  <img src="https://img.shields.io/npm/dt/snow-calendar.svg">
</a>

# Snow Calendar
Snow Calendar 是一個類似 google calendar 或 FullCalendar 的 **vue** 的前端日曆套件，其特色如下：
* 將事件與資料完全開放，您可自行設計操作介面的邏輯及資料交互的方式。
* 以月為單位初始化資料，您可以在使用者切換到當月再動態取得資料。
* 簡易使用，安裝套件後使用 **&lt;snowCalendar&gt;&lt;/snowCalendar&gt;** 標籤使用即可。
* 提供完整的日曆視圖：年、月、週、4天、天、事件
* 提供多曆本的設計。
* 提供檢視的小日曆、完整的操作功能列。

![image](https://raw.githubusercontent.com/okaoka0709/snow-calendar/master/src/assets/readme-img/snowCalendar_month.png)
![image](https://raw.githubusercontent.com/okaoka0709/snow-calendar/master/src/assets/readme-img/snowCalendar_week.png)


## 操作影片
您可以觀看 [https://youtu.be/1tL3BEmg6Sk](https://youtu.be/1tL3BEmg6Sk)
  
  
## Demo
Snow Calendar 範本，您可以至 Source 取得原始碼：
[Demo](https://snow-calendar-extend.000webhostapp.com)、[Source](https://github.com/okaoka0709/snow-calendar-demo)

基本的 Snow Calendar：
[Demo](https://snow-calendar.000webhostapp.com)

如果您有 Vue Cli，您也可以在本機建立簡易的 Demo。先執行 npm 安裝依賴：
```
npm install
```
接著在本機開啟：
```
npm run serve
```


## 安裝方式
```
$ npm install snow-calendar --save
```


## 使用方式
安裝之後，在您的 main.js 檔案中引用 snow-calendar 並 use：
```
import Vue from 'vue'
import snowCalendar from 'snow-calendar'

Vue.use(snowCalendar)
```
接著在您希望呈現的 .vue 檔案中引用即可：
```
<template>
  <snowCalendar></snowCalendar>
</template>
```

## 提供日曆資料
在 Snow Calendar 中，您可以提供以下幾種資料：
* 行程資料(events)
* 日曆本資料(sources)
* 預設的觀看模式(mode)
* 曆觀看時間(mainCal)
* 小日曆觀看時間(refCal)
* 顯示/隱藏組件(uiVisible)

設定方式如下：
```
<snowCalendar
  :sources="sourceObject"
  :events="eventObject"
  :mode="modeString"
  :mainCal="timeObject"
  :refCal="timeObject"
  :uiVisible="setObject"
></snowCalendar>
```

### 日曆本資料(sources):Array
Snow Calendar 提供多日曆本的功能，日曆本提供事件的編輯權限與顏色。
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
日曆本的 editable 屬性僅供參考，點擊行程時參數還是會回傳該事件，開發者需自行決定如何使用該屬性。

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
您也可以修改 mode 的值，改變使用者的觀看模式。
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
您也可以修改 timeObject 的值，改變使用者的觀看時間，。
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
* 點擊”還有n則“(clickMore)
* 滑入”還有n則“(hoverMore)
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
dropEvent 提供五個參數分別是 event(Object)、time(Object)、type(String)、mode(String) 與 finally(Boolean)。
```
function(event, time, type, mode, finally)
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
time 參數指明使用者目前拖曳到的時間，看起來像以下這樣：
```
{
  year: 2019,
  month: 1,
  date: 1,
  hour: 12,
  minutes: 0
}
```
type 參數指明使用者拖曳的類型，有可能是以下的值：
* head (拖曳行程區塊整體)
* foot (拖曳行程區塊尾端)

![image](https://raw.githubusercontent.com/okaoka0709/snow-calendar/master/src/assets/readme-img/dropArea_days.png)
![image](https://raw.githubusercontent.com/okaoka0709/snow-calendar/master/src/assets/readme-img/dropArea_month.png)

mode 參數指明使用者拖曳的模式是天或是時間，有可能是以下的值：
* date(天)
* time(時間)

finally 參數指明使用者拖曳是否為最後結果，例如 2019/1/1 拖曳至 2019/1/3，dropEvent 事件將被觸發 2 次(2019/1/2、2019/1/3 各一次)，但僅有最後一次的 finally 參數為 true。建議當 finally 參數為 true 時再將修改資料傳送到後端。

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

### 點擊”還有n則“(clickMore)

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

### 滑入”還有n則“(hoverMore)
當使用者滑入”還有n則“文字時觸發。
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
