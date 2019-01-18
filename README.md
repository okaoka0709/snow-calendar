# Snow Calendar
Snow Calendar 是一個類似 google calendar 或 FullCalendar 的 **vue** 的前端月曆套件，其特色如下：
* 將事件與資料完全開放，您可自行設計操作介面的邏輯及資料交互的方式。
* 以月為單位 init 資料，您可以在使用者切換到當月再動態取得資料。
* 簡易使用，安裝套件後使用 **snowCalendar** 標籤即可。
* 提供完整的月曆視圖：月曆、週曆、日曆、事件曆。
* 包含了日曆本的設計。
* 提供檢視的小日曆。
  
  
## Demo
Demo 的範例在 [https://github.com/okaoka0709/snow-calendar-demo](https://github.com/okaoka0709/snow-calendar-demo)


## 安裝方式
```
$ npm install snow-calendar --save
```


## 使用方式
安裝之後，在您的檔案中引用 snow-calendar：
```
import snowCalendar from 'snow-calendar'
```
接著在 .vue 檔案中引用即可：
```
<template>
  <snowCalendar></snowCalendar>
</template>
```

## 提供月曆資料
在 Snow Calendar 中，您可以提供以下幾種資料：
* 事件資料 (events)
* 日曆本資料 (sources)
* 預設的預覽模式 (defaultMode)
* 預設的月曆時間 (defaultMainCal)
* 預設的小月曆時間 (defaultRefCal)

設定方式如下：
```
<snowCalendar
  :events="eventObject"
  :sources="sourceObject"
  :defaultMode="modeString"
  :defaultMainCal="timeObject"
  :defaultRefCal="timeObject"
></snowCalendar>
```

### 事件資料 (events)
事件資料提供介面可顯示、操作的事件。事件資料為一陣列，陣列中囊括一個一個的事件物件，每個事件物件需有以下資料：
* 起始日期 (startTime)
* 結束日期 (endTime)
* 唯一值 (sn)
* 標題 (sub)
* 敘述 (desc)
* 日曆本歸屬 (cal)
* 地點 (location)

格式如下：
```
let eventObject = [
    {
      "startTime": {
        "year": 2019,
        "month": 10,
        "date": 8,
        "hour": 10,
        "minutes": 0
      },
        "endTime":{
        "year": 2019,
        "month": 10,
        "date": 8,
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
請注意日曆本歸屬的值，必須對應日曆本的 sn。由於呈現事件的顏色是從月曆本提供的，因此 Snow Calendar **不會呈現**找不到日曆歸屬的事件。

### 日曆本資料 (sources)
Snow Calendar 提供多日曆本的功能，日曆本資料提供事件的編輯權限與顏色設定。日曆本資料為一陣列，陣列中囊括一個一個的日曆本，每個日曆本物件需有以下資料：
* 唯一值 (sn)
* 標題 (sub)
* 敘述 (desc)
* 編輯權限 (editable)
* 顏色 (color)

格式如下：
```
let sourceObject = [
      "sn": 1,
      "sub": "日曆本標題",
      "desc": "日曆本敘述",
      "editable": true,
      "color": "#e54288"
    }
  ]
```
請注意日曆本的 editable 屬性僅供參考，點擊行程還是會回傳該事件，開發者必須自行決定如何使用屬性。

### 預設的預覽模式 (defaultMode)
提供預設的預覽模式，您將可以決定使用者第一時間所使用的預覽模式，Snow Calendar 提供的預覽模式有：
* 年 (year)
* 月 (month)
* 週 (week)
* 4天 (4days)
* 日 (date)
* 事件 (event)

提供 Snow Calendar 字串格式即可。
```
let defaultMode = 'week'
```
使用者在操作介面中，仍然可以透過介面切換預覽模式，您也可以使用 cookie 等方法紀錄使用者上次的預覽模式。
請注意若沒有設定這個值，將會自動呈現為 month 月曆模式。

### 預設的月曆時間 (defaultMainCal) 及小月曆時間 (defaultRefCal)
提供預設的月曆時間，您將可以決定使用者第一時間所觀看的月曆、小月曆時間，格式如下：
```
let timeObject = {
    "year": 2019,
    "month": 10,
    "date": 8
  }
```
使用者在操作介面中，仍然可以透過介面切換時間，您也可以使用 cookie 等方法紀錄使用者上次的時間。
請注意若沒有設定這個值，時間將會自動設定為今日。
