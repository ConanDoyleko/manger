<template>
    <div class="Login">
        <div class="login_box">
            <div class="title">
                <span>登录</span>
                <span>欢迎使用本软件</span>
            </div>
            <el-input v-model="username" placeholder="请输入用户名">
                <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
            </el-input>
            <el-input v-model="password" show-password placeholder="请输入密码">
                <i slot="prefix" class="el-input__icon iconfont icon-mima"></i>
            </el-input>
            <div class="check">
                <el-input v-model="checkNum" placeholder="请输入验证码"> </el-input>
                <div class="captcha" @click="getCaptcha()">
                    {{ captcha }}
                </div>
            </div>
            <div class="bottom">
                <div class="register">立即注册</div>
                <div class="forgot">忘记密码</div>
            </div>
            <el-button class="login_now" @click="login()">登录</el-button>
        </div>
    </div>
</template>

<script>
import "../../assets/font/font_1923481_pmtje8nskf/iconfont.css";
export default {
    data() {
        return {
            username: "",
            password: "",
            checkNum: "",
            captcha: "",
        };
    },
    methods: {
        getCaptcha() {
            this.$api
                .getCaptcha()
                .then((res) => {
                    this.captcha = res.data.result.captcha;
                })
                .catch((err) => {
                    this.$message(err);
                });
        },
        login() {
            if (this.username && this.password && this.captcha) {
                if (/\w+/.test(this.username)) {
                    if (/[0-9A-z_-]{6,18}/.test(this.password)) {
                        if (this.checkNum === this.captcha) {
                            this.$message({
                                message: "恭喜你，登录成功",
                                type: "success",
                            });
                            this.$jsCookie.set('admin_manager',{
                                username:this.username,
                            }, {expires: 10})
                            if (this.$route.query.redirect){
                                this.$router.push(this.$route.query.redirect);
                                this.$router.go(0)
                            }else {
                                this.$router.push("/");
                                this.$router.go(0)
                            }
                        } else {
                            this.$alert("验证码错误");
                        }
                    } else {
                        this.$alert("请输入6-18位密码");
                    }
                } else {
                    this.$alert("请输入正确用户名");
                }
            } else {
                this.$alert("请输入用户名和密码");
            }
        },
    },
    created() {
        this.getCaptcha();
    },
    mounted() {},
};
</script>

<style scoped lang="less">
.Login {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("../../assets/images/Background.png");
    background-repeat: no-repeat;
    background-size: cover;
    .login_box {
        padding: 68px 62px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 435px;
        height: 480px;
        box-shadow: 0 6px 40px 0 rgba(0, 0, 0, 0.05);
        background-color: #ffffff;
        border-radius: 16px;
        .title {
            margin-bottom: 40px;
            span:nth-of-type(1) {
                letter-spacing: 2px;
                color: #2f82fe;
                font-size: 34px;
                font-weight: 900;
                margin-right: 5px;
                margin-bottom: 45px;
            }
            span {
                letter-spacing: 2px;
                font-size: 24px;
            }
        }
        ::v-deep .el-input.el-input--prefix {
            display: flex;
            height: 40px;
            font-size: 16px;
            margin-bottom: 20px;
            span {
                display: flex;
                width: 14px;
                margin-left: 5px;
                i {
                    font-size: 16px;
                }
                /*margin-left: 14px;*/
            }
        }
        .check {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 40px;
            margin-bottom: 20px;
            .el-input,
            .captcha {
                width: 140px;
                height: 40px;
            }
            .captcha {
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #eeeeee;
                color: #2f82fe;
                font-weight: 900;
                letter-spacing: 2px;
                font-size: 20px;
                cursor: pointer;
            }
        }
        .bottom {
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            margin-bottom: 40px;
            div {
                cursor: pointer;
            }
        }
        .login_now {
            width: 100%;
            height: 40px;
            border-radius: 20px;
            color: #ffffff;
            background-image: linear-gradient(to right, #3193f1, #2978eb, #215ce4);
            letter-spacing: 2px;
        }
    }
}
</style>
