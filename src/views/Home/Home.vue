<template>
    <div class="home" v-if="isLogined">
        <!--待处理-->
        <div class="ceil">
            <div class="top">
                <span></span>
                <span>待处理</span>
            </div>
            <ul class="list">
                <li class="icon_img">
                    <div class="img">
                        <img src="../../assets/images/receive.png" alt="">
                    </div>
                    <div class="text">
                        <p>待收货订单</p>
                        <p>{{baseData.receivedOrder}}</p>
                    </div>
                </li>
                <li class="icon_img">
                    <div class="img">
                        <img src="../../assets/images/get.png" alt="">
                    </div>
                    <div class="text">
                        <p>待处理退款</p>
                        <p>{{baseData.receivedRefund}}</p>
                    </div>
                </li>
                <li class="icon_img">
                    <div class="img">
                        <img src="../../assets/images/exit.png" alt="">
                    </div>
                    <div class="text">
                        <p>待退货订单</p>
                        <p>{{baseData.returnedPurchase}}</p>
                    </div>
                </li>
                <li class="icon_img">
                    <div class="img">
                        <img src="../../assets/images/exitprice.png" alt="">
                    </div>
                    <div class="text">
                        <p>待处理退款</p>
                        <p>{{baseData.reimburse}}</p>
                    </div>
                </li>
            </ul>
        </div>
        <div class="second">
            <div class="ceil">
                <div class="top">
                    <span></span>
                    <span>销售总览</span>
                </div>
                <ul class="card">
                    <li>
                        <p>
                            <img src="../../assets/images/order.png" alt="">
                            <span>{{baseData.todayOrder}}</span>
                        </p>
                        <p>
                            <img src="" alt="">
                            <span>今日订单</span>
                        </p>
                        <div class="icon">
                            <img src="../../assets/images/order_big.png" alt="">
                        </div>
                    </li>
                    <li>
                        <p>
                            <img src="../../assets/images/total.png" alt="">
                            <span>{{baseData.todayTotalPrice}}</span>
                        </p>
                        <p>
                            <img src="" alt="">
                            <span>今日销售总额</span>
                        </p>
                        <div class="icon">
                            <img src="../../assets/images/total_big.png" alt="">
                        </div>
                    </li>
                </ul>
            </div>
            <div class="ceil">
                <div class="top">
                    <span></span>
                    <span>活动总览</span>
                </div>
                <ul class="card">
                    <li>
                        <p>
                            <img src="../../assets/images/all.png" alt="">
                            <span>{{baseData.todayActivityOrder}}</span>
                        </p>
                        <p>
                            <img src="" alt="">
                            <span>今日订单</span>
                        </p>
                        <div class="icon">
                            <img src="../../assets/images/all_big.png" alt="">
                        </div>
                    </li>
                    <li>
                        <p>
                            <img src="../../assets/images/ceil.png" alt="">
                            <span>{{baseData.todaySellTotal}}</span>
                        </p>
                        <p>
                            <img src="" alt="">
                            <span>今日销售总额</span>
                        </p>
                        <div class="icon">
                            <img src="../../assets/images/ceil_big.png" alt="">
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="third">
            <div class="left">
                <div class="top">
                    <span></span>
                    <span>商品总览</span>
                </div>
                <ul class="all">
                    <li>
                        <p>{{baseData.removed}}</p>
                        <p>已下架</p>
                    </li>
                    <li>
                        <p>{{baseData.added}}</p>
                        <p>已上架</p>
                    </li>
                    <li>
                        <p>{{baseData.activityGoods}}</p>
                        <p>活动商品</p>
                    </li>
                    <li>
                        <p>{{baseData.totalGoods}}</p>
                        <p>全部商品</p>
                    </li>
                </ul>
            </div>
            <div class="left">
                <div class="top">
                    <span></span>
                    <span>用户总览</span>
                </div>
                <ul class="all">
                    <li>
                        <p>{{baseData.removed}}</p>
                        <p>已下架</p>
                    </li>
                    <li>
                        <p>{{baseData.added}}</p>
                        <p>已上架</p>
                    </li>
                    <li>
                        <p>{{baseData.activityGoods}}</p>
                        <p>活动商品</p>
                    </li>
                    <li>
                        <p>{{baseData.totalGoods}}</p>
                        <p>全部商品</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Home",
    data() {
        return {
            baseData: {},
            isLogined:false
        };
    },
    methods: {
        /**
         * 获取数据
         * @returns {Promise<void>}
         */
        async getData() {
            this.baseData = (await this.$api.getHomeData()).data.result;
            // console.log(res);
        },
    },
    created() {
        this.getData();
        let res = JSON.parse(this.$jsCookie.get("admin_manager"));
        this.isLogined = !!res;
    },
};
</script>
<style lang="less" scoped>
.home {
    padding: 40px 20px;
    .ceil {
        .icon_img{
            display: flex;
            align-items: center;
            margin-right: 210px;
            margin-top: 20px;
            .img{
                margin-right: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background-color: #EAEDF4;
                img{
                    width: 50%;
                }
            }
            .text{
                text-align: center;
                p:nth-of-type(1){
                    font-size: 16px;
                    white-space: nowrap;
                }
                p:nth-of-type(2){
                    font-size: 30px;
                    font-weight: 900;
                }
            }
        }
        ul.list{
            display: flex;
        }
    }
    .second{
        display: flex;

        .ceil {
            margin-top: 38px;

            ul.card {
                display: flex;
                align-items: center;

                li {
                    margin-right: 20px;
                    position: relative;
                    padding: 23px 40px;
                    margin-top: 20px;
                    width: 382px;
                    height: 120px;
                    border-radius: 12px;
                    overflow: hidden;
                    color: #ffffff;

                    p {
                        display: flex;
                        align-items: flex-end;

                        img {
                            width: 35px;
                        }

                        span {
                            font-size: 20px;
                            margin-left: 21px;
                        }
                    }

                    p:nth-of-type(1) {
                        margin-bottom: 10px;

                        span {
                            font-size: 30px;
                            font-weight: 900;
                        }
                    }

                    div {
                        position: absolute;
                        right: 0;
                        top: 10px;

                        img {
                            width: 150px;
                        }
                    }
                }

                li:nth-of-type(1) {
                    background-image: linear-gradient(to right, #6EA7F5, #6899F0, #638CEC) !important;
                }

                li:nth-of-type(2) {
                    background-image: linear-gradient(to right, #FC98B4, #F984A8, #F6739D) !important;
                }
            }
        }
        .ceil:nth-of-type(2){
            ul{
                li:nth-of-type(1){
                    background-image: linear-gradient(to right, #58BBDD, #2FA8B2, #1B9E9C) !important;
                }
                li:nth-of-type(2){
                    background-image: linear-gradient(to right,#FDA753,#FD9D67,#FD9971) !important;
                }
            }
        }
    }
    .third{
        display: flex;
        align-items: center;
        margin-top: 20px;
        .left{
            margin-right: 20px;
            ul{
                margin-top: 15px;
                padding: 42px 55px;
                width: 783px;
                height: 155px;
                border-radius: 12px;
                background-color: #EAEDF4;
                display: flex;
                justify-content: space-between;
                align-items: center;
                li{
                    text-align: center;
                    p:nth-of-type(1){
                        font-size: 30px;
                    }
                }
            }
        }
    }
    .top {
        display: flex;
        align-items: center;
        font-size: 20px;

        span:nth-of-type(1) {
            margin-right: 10px;
            width: 4px;
            height: 20px;
            background-color: #3f78f6;
            border-radius: 3px;
        }
    }
}
</style>
