# Snow Calendar
Snow Calendar 是一個類似 google calendar 或 FullCalendar 的 **vue** 的前端日曆套件，其特色如下：
* 將事件與資料完全開放，您可自行設計操作介面的邏輯及資料交互的方式。
* 以月為單位 init 資料，您可以在使用者切換到當月再動態取得資料。
* 簡易使用，安裝套件後使用 **&lt;snowCalendar&gt;&lt;/snowCalendar&gt;** 標籤使用即可。
* 提供完整的視圖：月曆、週曆、日曆、事件曆。
* 包含了日曆本的設計。
* 提供檢視的小日曆。
  
  
## Demo
Demo 的範例在 [https://github.com/okaoka0709/snow-calendar-demo](https://github.com/okaoka0709/snow-calendar-demo)


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
* 行程資料 (events)
* 日曆本資料 (sources)
* 預設的預覽模式 (defaultMode)
* 預設的日曆觀看時間 (defaultMainCal)
* 預設的小日曆觀看時間 (defaultRefCal)

設定方式如下：
```
<snowCalendar
  v-bind:events="eventObject"
  v-bind:sources="sourceObject"
  v-bind:defaultMode="modeString"
  v-bind:defaultMainCal="timeObject"
  v-bind:defaultRefCal="timeObject"
></snowCalendar>
```

### 行程資料 (events)
行程資料提供介面可顯示、操作的事件。
行程資料為一陣列，陣列中囊括一個一個的行程物件，每個行程物件需有以下資料：
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
請注意日曆本歸屬的值，必須對應日曆本的 sn。
由於行程的顏色是日曆本提供的，因此 Snow Calendar **不會呈現**找不到日曆歸屬的事件，建議在**匯入行程資料之前，先匯入日曆本資料**。
修改行程資料後，其結果會直接更新在介面上。

### 日曆本資料 (sources)
Snow Calendar 提供多日曆本的功能，日曆本資料提供事件的編輯權限與顏色設定。日曆本資料為一陣列，陣列中囊括一個一個的日曆本，每個日曆本物件需有以下資料：
* 唯一值 (sn)
* 標題 (sub)
* 敘述 (desc)
* 編輯權限 (editable)
* 顏色 (color)
* 是否顯示 (active)

格式如下：
```
let sourceObject = [
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

### 預設的日曆觀看時間 (defaultMainCal) 及小日曆觀看時間 (defaultRefCal)
提供預設的日曆觀看時間，您將可以決定使用者第一時間所觀看的日曆、小日曆時間，格式如下：
```
let timeObject = {
    "year": 2019,
    "month": 10,
    "date": 8
  }
```
使用者在操作介面中，仍然可以透過介面切換觀看時間，您也可以使用 cookie 等方法紀錄使用者上次的時間。
請注意若沒有設定這個值，觀看時間將會自動設定為今日。


## 日曆事件
Snow Calendar 提供以下幾種事件：
* 切換觀看時間(updateCal)
* 切換預覽模式 (updateMode)
* 第一次檢視該月 (initMonth)
* 顯示錯誤的訊息 (errorMsg)
* 移動及縮放行程 (moveResizeEvent)
* 新增行程 (addEvent)
* 游標點擊行程 (clickEvent)
* 游標滑入行程 (hoverEvent)
* 游標點擊 'more' (clickMore)
* 游標滑入 'more' (hoverMore)
* 增加日曆本 (addSource)
* 匯入日曆本 (importSource)
* 游標點擊日曆本 (clickSource)
* 游標滑入日曆本 (hoverSource)

設定方式如下：
```
<snowCalendar
  v-on:updateCal="someFunction"
  v-on:updateMode="someFunction"
  v-on:initMonth="someFunction"
  v-on:errorMsg="someFunction"
  v-on:moveResizeEvent="someFunction"
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
當使用者切換日曆及小日曆時，觸發該事件。
updateCal 提供一個參數 option (Object)，包含以下兩個資訊：
* option.cal (String) => 指明切換的是日曆(main) 或是 小日曆(ref)
* option.data (Object) => 切換的時間

### 切換預覽模式 (updateMode)

### 第一次檢視該月 (initMonth)

### 顯示錯誤的訊息 (errorMsg)

### 移動及縮放行程 (moveResizeEvent)

### 新增行程 (addEvent)

### 游標點擊行程 (clickEvent)

### 游標滑入行程 (hoverEvent)

### 游標點擊 'more' (clickMore)

### 游標滑入 'more' (hoverMore)

### 增加日曆本 (addSource)

### 匯入日曆本 (importSource)

### 游標點擊日曆本 (clickSource)

### 游標滑入日曆本 (hoverSource)
