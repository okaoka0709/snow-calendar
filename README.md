<a href="https://www.npmjs.com/package/snow-calendar">
  <img src="https://img.shields.io/npm/v/snow-calendar.svg">
  <img src="https://img.shields.io/npm/l/snow-calendar.svg">
  <img src="https://img.shields.io/npm/dt/snow-calendar.svg">
</a>

# Snow Calendar
Snow Calendar 是一個類似 google calendar 或 FullCalendar 的 **vue** 的前端日曆套件，其特色如下：
* 將事件與資料完全開放，您可自行設計操作介面的邏輯及資料交互的方式。
* 以月為單位 init 資料，您可以在使用者切換到當月再動態取得資料。
* 簡易使用，安裝套件後使用 **&lt;snowCalendar&gt;&lt;/snowCalendar&gt;** 標籤使用即可。
* 提供完整的日曆視圖：年、月、週、4天、天、事件
* 提供多曆本的設計。
* 提供檢視的小日曆、完整的操作功能列。

![image](https://raw.githubusercontent.com/okaoka0709/snow-calendar/master/src/assets/readme-img/snowCalendar_month.png)
![image](https://raw.githubusercontent.com/okaoka0709/snow-calendar/master/src/assets/readme-img/snowCalendar_week.png)


## 操作影片
您可以觀看 [https://youtu.be/1tL3BEmg6Sk](https://youtu.be/1tL3BEmg6Sk)
  
  
## Demo
簡易的 Demo 只要在本專案執行即可。
先執行 npm 安裝依賴：
```
npm install
```
接著在本機開啟：
```
npm run serve
```
包含額外的 popup、tooltip 等完整的演示範例請至另一個專案： [https://github.com/okaoka0709/snow-calendar-demo](https://github.com/okaoka0709/snow-calendar-demo)


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
* 預設的觀看模式(defaultMode)
* 曆觀看時間(mainCal)
* 小日曆觀看時間(refCal)

設定方式如下：
```
<snowCalendar
  v-bind:events="eventObject"
  v-bind:sources="sourceObject"
  v-bind:defaultMode="modeString"
  v-bind:mainCal="timeObject"
  v-bind:refCal="timeObject"
></snowCalendar>
```

### 行程資料 (events)
行程資料提供介面可顯示、操作的事件。
行程資料為一陣列，陣列中囊括一個一個的行程物件，每個行程物件需有以下資料：
* 起始日期(startTime)
* 結束日期(endTime)
* 唯一值(sn)
* 標題(sub)
* 敘述(desc)
* 日曆本歸屬(cal)
* 地點(location)

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
請注意日曆本歸屬的值，必須對應日曆本的 sn。
由於行程的顏色是日曆本提供的，因此 Snow Calendar **不會呈現**找不到日曆歸屬的事件，建議在**匯入行程資料之前，先匯入日曆本資料**。
修改行程資料後，其結果會直接更新在介面上。

### 日曆本資料(sources)
Snow Calendar 提供多日曆本的功能，日曆本資料提供事件的編輯權限與顏色設定。日曆本資料為一陣列，陣列中囊括一個一個的日曆本，每個日曆本物件需有以下資料：
* 唯一值(sn)
* 標題(sub)
* 敘述(desc)
* 編輯權限(editable)
* 顏色(color)
* 是否顯示(active)

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
請注意日曆本的 editable 屬性僅供參考，點擊行程還是會回傳該事件，開發者必須自行決定如何使用屬性。
修改日曆本資料後，其結果會直接更新在介面上。

### 觀看模式(mode)
您可以指定使用者所使用的觀看模式，Snow Calendar 提供的觀看模式有：
* 年(year)
* 月(month)
* 週(week)
* 4天(4days)
* 天(date)
* 事件(event)

字串格式即可。
```
let modeString = 'week'
```
使用者在操作介面中，仍然可以透過預設介面切換觀看模式，您也可以使用 cookie 等方法紀錄使用者上次的觀看模式。
您也可以藉由修改 mode 的值，立即改變使用者的觀看模式，或實作自己的切換介面。
若沒有設定這個值，或設定了錯的值，將會自動呈現為 month 月曆模式。
請注意，當使用者透過預設介面更改觀看模式時，**並不會**跟著更新 mode，因為子組件無權修改的父組件屬性，但您可以在 **切換觀看模式(updateMode)** 的方法中，取得目前的觀看模式。

### 日曆觀看時間(mainCal) 及小日曆觀看時間(refCal)
您可以決定使用者所觀看的日曆、小日曆時間，格式如下：
```
let timeObject = {
    "year": 2019,
    "month": 10,
    "date": 8
  }
```
使用者在操作介面中，仍然可以透過介面切換觀看時間，您也可以使用 cookie 等方法紀錄使用者上次的時間。
您也可以藉由修改 timeObject 的值，立即改變使用者的觀看時間，或實作自己的切換介面。
若沒有設定這個值，或設定了錯的值，觀看時間將會自動設定為今日。


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
  v-on:updateCal="someFunction"
  v-on:updateMode="someFunction"
  v-on:initMonth="someFunction"
  v-on:errorMsg="someFunction"
  v-on:clickTime="someFunction"
  v-on:dropEvent="someFunction"
  v-on:addEvent="someFunction"
  v-on:clickEvent="someFunction"
  v-on:hoverEvent="someFunction"
  v-on:clickMore="someFunction"
  v-on:hoverMore="someFunction"
  v-on:addSource="someFunction"
  v-on:importSource="someFunction"
  v-on:clickSource="someFunction"
  v-on:hoverSource="someFunction"
></snowCalendar>
```
Snow Calendar 沒有提供修改、移除的事件，是因為您可以在任何時機、使用任何方法操作**行程資料**及**日曆本資料**來更新介面。

### 切換觀看時間(updateCal)
當使用者切換日曆及小日曆的觀看時間時，觸發該事件。
updateCal 提供兩個參數分別是 cal(String) 與 date(Object)。
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
建議可以在此事件觸發時取得本月的行程並加入至行程資料(events)。

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

請注意，當使用者選取整天時，hour 與 minutes 都會為 0。
通常日曆的選時間行為都被定義為新增行程功能，因此 clickTime 提供與 addEvent 一致的參數，以方便您直接串連兩個功能。

### 拖曳行程(dropEvent)
當使用者在天、4天、週、月觀看模式時，使用者以游標拖曳行程時觸發。
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

finally 參數指明使用者拖曳是否為最後結果，例如一個 2019/1/1(二) 的行程在介面上拖曳至 2019/1/4(五)，dropEvent 事件將被觸發 3 次(2019/1/2(三)、2019/1/3(四)、2019/1/4(五) 各觸發一次)，但僅有最後一次 2019/1/4(五) 的 finally 參數為 true。建議當 finally 參數為 true 時再將修改資料傳送到後端。

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

請注意，當使用者選取整天時，hour 與 minutes 都會為 0。

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
  
## 未來功能
預計未來提供功能與修改：
* 可指定要顯示的控制項
* 可指定要顯示的日曆類型
* 可指定要顯示的組件
* 可傳入 solt 至工具列與右側列表
