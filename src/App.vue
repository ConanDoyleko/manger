<template>
    <div id="app">
        <el-container>
            <el-aside :style="{ width: isCollapsed ? '54px' : '270px' }">
                <el-col :span="24">
                    <div @click="close()" class="logo">
                        <img src="./assets/images/Forma.png" alt="" />
                        <img v-if="!isCollapsed" src="./assets/images/megastack.png" alt="" />
                    </div>
                    <div class="close" @click="close()">
                        <i
                            :style="{ marginLeft: !isCollapsed ? '23px' : '16px' }"
                            :class="!isCollapsed ? 'el-icon-s-fold' : 'el-icon-s-unfold'"
                        ></i>
                    </div>
                    <el-menu
                        unique-opened
                        style="width: 100%;"
                        :collapse="isCollapsed"
                        background-color="#fff"
                        :default-active="activerouter"
                        class="el-menu-vertical-demo close_active"
                        @open="handleOpen"
                        @close="handleClose"
                        :collapse-transition="true"
                        router
                    >
                        <el-menu-item index="/">
                            <i class="el-icon-s-home"></i>
                            <span slot="title">首页</span>
                        </el-menu-item>
                        <el-submenu index="2">
                            <template style="padding: 0;" slot="title">
                                <i class="el-icon-shopping-bag-2"></i>
                                <span>商品</span>
                            </template>
                            <el-submenu index="2-1">
                                <template slot="title">商品管理</template>
                                <el-menu-item @click="addTab('门店商品列表', '/storelist')" index="/storelist"
                                    >门店商品列表</el-menu-item
                                >
                                <el-menu-item @click="addTab('平台商品列表', '/productlist')" index="/productlist"
                                    >平台商品列表</el-menu-item
                                >
                                <el-menu-item index="2-1-3">发布商品</el-menu-item>
                            </el-submenu>
                            <el-submenu index="2-2">
                                <template slot="title">商品配置</template>
                                <el-menu-item index="1-4-1">商品后台分类</el-menu-item>
                                <el-menu-item index="2-2-1">图片库管理</el-menu-item>
                            </el-submenu>
                        </el-submenu>
                        <el-submenu index="3">
                            <template style="padding: 0;" slot="title">
                                <i class="el-icon-s-order"></i>
                                <span>交易</span>
                            </template>
                            <!--reimburse-->
                            <el-submenu index="3-1">
                                <template slot="title">订单</template>
                                <el-menu-item @click="addTab('退款申请处理', '/reimburse')"  index="/reimburse">退款申请处理</el-menu-item>
                                <el-menu-item @click="addTab('订单列表', '/orderlist')" index="/orderlist">订单列表</el-menu-item>
                                <el-menu-item @click="addTab('订单设置', '/ordersetting')" index="/ordersetting">订单设置</el-menu-item>
                            </el-submenu>
                        </el-submenu>
                        <el-submenu index="4">
                            <template slot="title">
                                <i class="el-icon-user"></i>
                                <span>用户</span>
                            </template>
                            <el-menu-item @click="addTab('用户管理', '/userlist')" index="/userlist">用户管理</el-menu-item>
                        </el-submenu>
                        <el-submenu index="5">
                            <template slot="title">
                                <i class="el-icon-s-shop"></i>
                                <span>门店</span>
                            </template>
                        </el-submenu>
                        <el-submenu index="6">
                            <template slot="title">
                                <i style="transform: rotate(30deg);" class="el-icon-price-tag"></i>
                                <span>营销</span>
                            </template>
                            <el-menu-item @click="addTab('发布商品', '/createevent')" index="/createevent">发布商品</el-menu-item>
                            <el-menu-item @click="addTab('活动列表', '/activitylist')" index="/activitylist">活动列表</el-menu-item>
                        </el-submenu>
                        <el-submenu index="7">
                            <template slot="title">
                                <i class="el-icon-setting"></i>
                                <span>设置</span>
                            </template>
                            <el-menu-item @click="addTab('支付设置', '/defraysetting')" index="/defraysetting">支付设置</el-menu-item>
                            <el-menu-item @click="addTab('角色管理', '/rolemanagement')" index="/rolemanagement">角色管理</el-menu-item>
                        </el-submenu>
                        <el-submenu index="8">
                            <template slot="title">
                                <i class="el-icon-s-promotion"></i>
                                <span>服务</span>
                            </template>
                            <el-menu-item index="8-1">选项1</el-menu-item>
                        </el-submenu>
                        <el-submenu index="9">
                            <template slot="title">
                                <i class="el-icon-data-line"></i>
                                <span>数据</span>
                            </template>
                            <el-menu-item index="9-1">选项1</el-menu-item>
                        </el-submenu>
                        <el-submenu index="10">
                            <template slot="title">
                                <i class="el-icon-postcard"></i>
                                <span>结算</span>
                            </template>
                            <el-menu-item index="10-1">选项1</el-menu-item>
                        </el-submenu>
                        <el-submenu index="11">
                            <template slot="title">
                                <i class="el-icon-document"></i>
                                <span>内容</span>
                            </template>
                            <el-menu-item index="11-1">选项1</el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-col>
            </el-aside>
            <el-container>
                <el-header>
                    <div class="userinfo" v-if="isLogined">
                        <div class="bell">
                            <i class="el-icon-message-solid"></i>
                        </div>
                        <div class="img">
                            <img src="./assets/images/4.jpg" alt="" />
                        </div>
                        <div class="user">
                            <p>管理员</p>
                            <i class="el-icon-arrow-down"></i>
                            <el-button @click="exitLogin()" class="exit" type="text"
                                >退出登录<i class="icon_font_exit el-icon--right">&#xe600; </i></el-button
                            >
                        </div>
                    </div>
                    <div v-else class="userinfo">
                        <div class="user">
                            请
                            <router-link to="/login">登录</router-link>
                        </div>
                    </div>
                </el-header>
                <ul class="tabs">
                    <li
                        :class="selTab === index ? 'active' : ''"
                        @click="changePath(index, item)"
                        v-for="(item, index) in tabList"
                        :key="index + item"
                    >
                        {{ item.name }}
                        <i @click.stop="removeTab(index)" v-if="index !== 0" class="el-icon-error"></i>
                    </li>
                </ul>
                <el-main>
                    <router-view v-if="$route.name !== 'Login'"></router-view>
                </el-main>
            </el-container>
        </el-container>
        <router-view v-if="$route.name === 'Login'"></router-view>
    </div>
</template>
<script>
import "./assets/css/icon_font_exit.css";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
export default {
    data() {
        return {
            isCollapsed: true,
            activerouter: "",
            isLogined: false,
            tabList: [
                {
                    name: "首页",
                    path: "/",
                },
            ],
            selTab: 0,
            cartLength: 0,
        };
    },
    methods: {
        handleOpen(key, keyPath) {
            // console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            // console.log(key, keyPath);
        },
        /**
         * 折叠菜单栏
         */
        close() {
            this.isCollapsed = !this.isCollapsed;
        },
        /**
         * @param index
         * @param item
         */
        changePath(index, item) {
            this.selTab = index;
            this.$router.push(item.path);
            this.saveTabList();
            this.activerouter = this.$route.path;
        },
        /**
         * @param index
         */
        removeTab(index) {
            this.tabList.splice(index, 1);
            this.selTab = 0;
            this.$router.push("/");
            this.activerouter = "/";
            this.saveTabList();
        },
        /**
         * @param name
         * @param path
         */
        addTab(name, path) {
            let res = this.tabList.every((item, index) => {
                return item.name !== name;
            });
            if (res) {
                this.tabList.push({
                    name: name,
                    path: path,
                });
                this.tabList.forEach((item, index) => {
                    if (item.name === name) {
                        this.selTab = index;
                    }
                });
            }
            this.saveTabList();
        },
        saveTabList() {
            localStorage.setItem("tabList", JSON.stringify(this.tabList));
            localStorage.setItem("selTab", this.selTab);
        },
        getTabList() {
            this.tabList = JSON.parse(localStorage.getItem("tabList")) || this.tabList;
            this.selTab = localStorage.getItem("selTab") * 1 || 0;
        },
        exitLogin() {
            this.$confirm("确认退出吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "error",
            })
                .then(() => {
                    this.$jsCookie.remove("admin_manager");
                    localStorage.removeItem("tabList");
                    localStorage.removeItem("selTab");
                    this.isLogined = false;
                    this.$router.go(0);
                    this.$message({
                        type: "success",
                        message: "退出成功!",
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消",
                    });
                });
        },
    },
    mounted() {},
    created() {
        // 页面手动刷新指定路由
        //获取地址栏中的路由，设置elementui中的导航栏选中状态
        this.activerouter = this.$route.path;
        this.getTabList();
        let res = JSON.parse(this.$jsCookie.get("admin_manager"));
        this.isLogined = !!res;
    },
    watch: {
        activerouter: {
            handler() {},
        },
    },
    computed: {},
};
</script>
<style lang="less">
@deep: ~">>>";
#app {
    height: 100%;
    .el-container {
        width: 100%;
        height: inherit;
    }
    .el-header {
        min-width: 1200px;
        display: flex;
        flex-direction: row-reverse;
        margin: 0 0 20px 20px;
        height: 60px;
        background-color: #ffffff;
        border-bottom-left-radius: 12px;
        box-shadow: 5px 5px 5px #ecebf0;
        .userinfo {
            display: flex;
            height: 100%;
            align-items: center;
            .bell {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 77px;
                height: 100%;
                transition: all 0.3s;
                i {
                    font-size: 25px;
                    transition: all 0.3s;
                }
            }

            .bell:hover {
                background-color: #ebf1fe;
                i {
                    color: #3f78f6;
                }
            }
            .img {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                overflow: hidden;
                img {
                    width: 40px;
                    height: 40px;
                }
            }
            .user {
                display: flex;
                align-items: center;
                p {
                    margin: 0 10px;
                }
                .exit {
                    margin-left: 10px;
                    display: flex;
                    align-items: center;
                    padding: 0 !important;
                    font-size: 18px;
                    button {
                        display: flex;
                        align-items: center;
                        padding: 0;
                    }
                    span {
                        display: flex;
                        align-items: center;
                        padding: 0;
                    }
                    i {
                        font-size: 22px;
                        font-weight: 600;
                    }
                }
            }
        }
    }

    .el-aside::-webkit-scrollbar {
        display: none;
    }
    .el-aside {
        width: 270px;
        height: inherit;
        background-color: #ffffff;
        box-shadow: 5px 5px 5px #ecebf0;
        transition: all 0.2s linear;

        .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px 0;
            width: 100%;
            text-align: center;
            transition: all 0.2s linear;
            img:nth-of-type(2) {
                margin-left: 10px;
                transition: all 0.2s linear;
            }
        }
        .close {
            .el-icon-s-fold,
            .el-icon-s-unfold {
                font-size: 20px !important;
                transition: all 0.2s linear;
            }
        }

        .el-menu--collapse {
            width: 100%;
            .el-submenu,
            .el-menu-item {
                .el-submenu__title {
                    text-align: center;
                    padding: 0 0 !important;
                }
                .el-tooltip {
                    text-align: center;
                    padding: 0 0 !important;
                }
            }

            .el-menu-item:hover {
                color: #ffffff;
                background-color: #3f78f6 !important;
            }
        }
    }

    .el-menu {
        border: 0;

        .el-menu-item.is-active {
            color: #ffffff;
            background-color: #3f78f6 !important;
        }
    }

    .tabs {
        display: flex;
        /*width: 100%;*/
        background-color: #f7f6fb;
        margin-left: 20px;
        white-space: nowrap;
        li {
            padding: 12px 15px;
            background-color: #eaedf4;
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
            margin-right: 10px;
            font-size: 18px;
            box-shadow: 0 0 5px #ecebf0;
            transition: all 0.2s linear;
            color: #666666;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            i {
                color: #999999;
                transition: all 0.2s linear;
            }
            i:nth-child(2) {
                margin-left: 5px;
            }
            span:nth-child(2) {
                margin-left: 5px;
            }
        }
        li.active {
            background-color: #ffffff;
            color: #409eff;

            i {
                color: #409eff;
            }
        }
        li:hover {
            color: #409eff;
            i {
                color: #409eff;
            }
        }
    }
    .el-main {
        min-width: 1400px;
        height: inherit;
        padding: 0;
        margin-left: 20px;
        background-color: #ffffff;
        box-shadow: 2px 2px 5px #ecebf0;
    }

    .el-main::-webkit-scrollbar {
        display: none;
    }

    /* Logo 字体 */
    @font-face {
        font-family: "iconfont logo";
        src: url("https://at.alicdn.com/t/font_985780_km7mi63cihi.eot?t=1545807318834");
        src: url("https://at.alicdn.com/t/font_985780_km7mi63cihi.eot?t=1545807318834#iefix")
                format("embedded-opentype"),
            url("https://at.alicdn.com/t/font_985780_km7mi63cihi.woff?t=1545807318834") format("woff"),
            url("https://at.alicdn.com/t/font_985780_km7mi63cihi.ttf?t=1545807318834") format("truetype"),
            url("https://at.alicdn.com/t/font_985780_km7mi63cihi.svg?t=1545807318834#iconfont") format("svg");
    }

    .icon_font_exit {
        font-family: "iconfont", serif !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
}

header.header {
    border-bottom: 1px solid #f7f6fb;

    .countlist {
        display: flex;

        li {
            position: relative;
            padding: 20px 18px;
            font-size: 16px;
            transition: all 0.2s linear;
            cursor: pointer;

            span {
                color: #ff5756;
            }
        }

        li.active {
            color: #80a0f8;

            span {
                color: #80a0f8;
            }
        }

        li.active::after {
            position: absolute;
            left: 50%;
            bottom: 0;
            transform: translateX(-50%);
            content: "";
            width: 60px;
            display: block;
            height: 2px;
            background-color: #80a0f8;
            transition: all 0.2s linear;
        }
    }
}

.main {
    position: relative;
    width: 100%;
    min-width: 1500px;
    height: 85%;
    padding: 20px 20px 40px;
    overflow: hidden;
    .filter {
        display: flex;
        justify-content: space-between;
        padding: 3px 0 23px;

        .left {
            display: flex;
            align-items: center;
        }

        .right {
            display: flex;
            align-items: center;

            .btn {
                text-decoration: underline;
            }

            .search {
                padding: 0 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 30px;
            }
        }

        label {
            display: flex;
            align-items: center;
            margin-right: 20px;

            span {
                white-space: nowrap;
                margin-right: 10px;
            }

            input {
                width: 200px !important;
            }
        }
    }

    .el-table {
        overflow-y: scroll;
    }

    .putshelf {
        margin-bottom: 20px;
    }

    .el-table::-webkit-scrollbar {
        display: none;
    }

    .table {
        width: 100%;
        height: 90%;
        min-width: 1200px;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        th:nth-of-type(1) {
            .cell {
                text-align: center;
            }
        }
        .el-table__body-wrapper {
            min-width: 1000px;
        }
    }

     .table .has-gutter .tab_header th {
        background-color: #eaedf4 !important;
        border: 0;
        color: #000000;
    }

    .table .price .cell {
        display: flex;
        align-items: center;

        .reset {
            font-size: 20px;
            color: #3f78f6;
            font-weight: 900;
            margin-left: 10px;
        }
    }

     .table .price .cell {
        .reset:hover {
            color: #ff0036;
        }
    }

     .table .price .el_input {
        width: 123px;

        input {
            width: 99px !important;
            padding-right: 0;
        }
    }

     .table .price .el-input-group__append {
        /*padding: 0;*/
        border-left: 0;
        background-color: #3f78f6;
        width: 30px !important;
        height: 100%;
        color: #ffffff;
        transition: all 0.2s linear;

        button {
            padding: 0;
            transition: all 0.2s linear;
        }
    }

     .table .price .el-input-group__append:hover {
        color: #ffffff;
        background-color: #ff0036;
    }

}

.pagination {
    position: absolute;
    left: 20px;
    right: 20px;
    bottom: 0;
    display: flex;
    align-items: center;
    height: 40px;
    background-color: #eaedf4;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    z-index: 1000;
    overflow: hidden;
    .paginationx {
        position: absolute;
        right: 20px;
    }

    .el-pager li {
        background-color: #eaedf4 !important;
    }

    .btn-next,
    .btn-prev {
        padding: 0 !important;
        color: #ffffff !important;
        background-color: #3f78f6 !important;
        border-radius: 50%;
    }
    input {
        border-radius: 12px;
    }
}
</style>
