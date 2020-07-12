<template>
    <div class="create_success">
        <img class="success" src="../../assets/images/success.svg" alt="">
        <p class="text">活动创建成功!</p>
        <p class="seconds">{{seconds}}秒后跳转到活动列表</p>
        <div class="footer">
            <el-button plain type="primary">活动列表</el-button>
            <el-button type="primary">活动详情</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                seconds:5
            };
        },
        props: {},
        methods: {
            timer(){
                setInterval(() => {
                    this.seconds--
                    if (this.seconds === 0) {
                        clearInterval(this.timer)
                        this.$router.push('/activitylist')
                    }
                }, 1000)
            }
        },
        created() {
           this.timer()
        },
        mounted() {
        }
    };
</script>

<style scoped
       lang="less">
.create_success{
    width: 100%;
    text-align: center;
    .success{
        width: 250px;
        margin: 100px auto 0;
    }
    .text{
        font-size: 30px;
        color: #3F78F6;
    }
    .seconds{
        font-size: 24px;
        color: #999999;
        margin-top: 10px;
    }
    .footer{
        margin-top: 42px;
        .el-button:nth-of-type(1){
            margin-right: 20px;
        }
    }
}
</style>