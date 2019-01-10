<template>
    <div class="day" :class="[isToday? 'is-today': '', isActive? 'is-active': '']" >
        <div class="sensor"
            @drop.prevent="dropDone"
            @dragenter.prevent="dropEnter"
            @dragover.prevent
        ></div>
    </div>
</template>

<script>
    export default {
        props: {
            obj: {
                require: true
            },
            activeNode: {
                require: true
            },
            today: {
                require: true
            }
        },
        computed: {
            isToday: function(){
                return (this.obj.year === this.today.year && this.obj.month === this.today.month && this.obj.date === this.today.date);
            },
            isActive: function(){
                let $obj = this.obj;

                if( this.activeNode[$obj.year +'-'+ $obj.month +'-'+ $obj.date] ){
                    return true;
                }else {
                    return false;
                }
            }
        },
        methods: {
            dropDone: function(){
                this.$emit('sendEvent', 'dropDone', this.obj);
            },
            dropEnter: function(){
                this.$emit('sendEvent', 'dropEnter', this.obj);
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
