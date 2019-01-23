<template>
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
    }
</script>

<style scoped>

</style>
