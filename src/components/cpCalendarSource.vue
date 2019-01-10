<template>
    <li>
        <div class="cp input checkbox">
            <input type="checkbox" v-model="cal.active" :id="'cal-'+ cal.sn">
            <label :for="'cal-'+ cal.sn" :style="'color:'+ cal.color">
                <span @mouseover.stop="hoverSource">{{ cal.sub }}</span>
            </label>
        </div>
        <a class="set icon-font more_vert icon-font-only" @click.prevent.stop="clickSource"></a>
    </li>
</template>

<script>
    export default {
        props: {
            cal: {
                require: true
            }
        },
        methods: {
            clickSource: function(e){
                this.$emit('sendEvent', 'clickSource', this.cal, e);
            },
            hoverSource: function(e){
                this.$emit('sendEvent', 'hoverSource', this.cal, e);
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
