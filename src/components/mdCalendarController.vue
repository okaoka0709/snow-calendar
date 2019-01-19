<template>
    <div class="md calendar-controller">
        <div class="date-selector">
            <button title="上一則" @click.prevent="getAway('prev')">&lt;</button>
            <span v-if="mode === 'year'" class="thisMonth">{{ mainCal.year }}</span>
            <span v-else class="thisMonth">{{ mainCal.year }}/{{ mainCal.month }}</span>
            <button title="下一則" @click.prevent="getAway('next')">&gt;</button>
            <select :value="mode" @change="changeMode">
                <option value="date">天</option>
                <option value="week">週</option>
                <option value="month">月</option>
                <option value="year">年</option>
                <option value="event">事件</option>
                <option value="4days">4天</option>
            </select>
        </div>
        <div class="calendar-btns">
            <ul>
                <li class="change-toToday"><button @click.prevent="backToToday">今天</button></li>
                <li class="add-event"><button @click.prevent="addEvt">新增行程</button></li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            mainCal: {
                require: true
            },
            mode: {
                require: true
            },
            today: {
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
                this.$emit('sendEvent', 'updateCal', {
                    cal: 'main',
                    data: this.today
                });
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
    }
</script>

<style scoped lang="scss">

</style>
