<template>
    <div @click="$router.push('/')" class="Prohibit">

    </div>
</template>

<script>
    export default {
        data() {
            return {};
        },
        props: {},
        methods: {},
        created() {
        },
        mounted() {
        }
    };
</script>

<style scoped
       lang="less">
.Prohibit{
position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 10000;
    background-color: #FFFFFF;
    background-image: url("../../assets/images/404.png");
    background-repeat: no-repeat;
    background-size: cover;
    overflow-y: hidden;
    .btn{
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translate(-50%,0);
    }
}
</style>