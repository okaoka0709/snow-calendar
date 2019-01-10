<template>
    <div
        v-if="obj"
        class="day"
        :class="[isToday && obj.thisMonth ? 'is-today': '', isActive && obj.thisMonth ? 'is-active': '', obj.thisMonth? '': 'not-thisMonth']"
    >
        <a
            class="date"
            @click.prevent="update"
        >{{ obj.date }}</a>
    </div>
</template>

<script>
    export default {
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

                this.$emit('sendEvent', 'updateCal', {
                    cal: 'main',
                    data : {
                        year: this.obj.year,
                        month: this.obj.month,
                        date: this.obj.date,
                    }
                });
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
