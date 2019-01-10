<template>
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
    </div>
</template>

<script>
    import cpCalendarDaysCaption from '@/components/cpCalendarDaysCaption'
    import cpCalendarDaysTimeEventsList from '@/components/cpCalendarDaysTimeEventsList'

    export default {
        components: {
            cpCalendarDaysCaption,
            cpCalendarDaysTimeEventsList
        },
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
    }
</script>

<style scoped lang="scss">

</style>
