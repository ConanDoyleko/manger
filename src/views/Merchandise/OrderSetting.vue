<template>
    <div class="OrderSetting">
        <div class="main">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="订单秒杀超过" prop="minute">
                    <el-input v-model.number="ruleForm.minute">
                        <span slot="suffix">分</span>
                    </el-input>
                    <span class="after">未付款，订单自动关闭</span>
                </el-form-item>
                <el-form-item label="拼团订单开团超过" prop="hours">
                    <el-input v-model.number="ruleForm.hours">
                        <span slot="suffix">时</span>
                    </el-input>
                    <span class="after">未成团，订单自动退款</span>
                </el-form-item>
                <el-form-item label="普通订单超过" prop="defaulthours">
                    <el-input v-model.number="ruleForm.defaulthours">
                        <span slot="suffix">时</span>
                    </el-input>
                    <span class="after">未付款，订单自动关闭</span>
                </el-form-item>
                <el-form-item label="普通订单超过" prop="h1">
                    <el-input v-model.number="ruleForm.h1">
                        <span slot="suffix">天</span>
                    </el-input>
                    <span class="after">未提货，订单自动退款</span>
                </el-form-item>
                <el-form-item label="订单完成超过" prop="h2">
                    <el-input v-model.number="ruleForm.h2">
                        <span slot="suffix">天</span>
                    </el-input>
                    <span class="after">自动结束交易,不能申请售后</span>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" icon="el-icon-check" type="primary" @click="submitForm('ruleForm')"
                        >提交</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            ruleForm: {
                minute: "",
                hours: "",
                defaulthours: "",
                h1: "",
                h2: "",
            },
            rules: {
                minute: [
                    { required: true, message: "不能为空" },
                    { type: "number", message: "必须为数字值" },
                ],
                hours: [
                    { required: true, message: "不能为空" },
                    { type: "number", message: "必须为数字值" },
                ],
                defaulthours: [
                    { required: true, message: "不能为空" },
                    { type: "number", message: "必须为数字值" },
                ],
                h1: [
                    { required: true, message: "不能为空" },
                    { type: "number", message: "必须为数字值" },
                ],
                h2: [
                    { required: true, message: "不能为空" },
                    { type: "number", message: "必须为数字值" },
                ],
            },
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$message.success("设置成功");
                    this.clear()
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        clear() {
            this.ruleForm = {
                minute: "",
                hours: "",
                defaulthours: "",
                h1: "",
                h2: "",
            };
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
    },
};
</script>

<style scoped lang="less">
.OrderSetting {
    .main {
        display: flex;
        align-items: center;
        justify-content: center;
        /*width: 600px;*/
        margin: 100px auto;
        ::v-deep .el-input {
            display: inline-block;
            width: 300px;
        }

        ::v-deep .el-form-item.is-required {
            width: inherit;
            display: flex;
        }
        ::v-deep .el-form-item__label {
            flex-shrink: 0;
            text-align: right;
            white-space: nowrap;
            width: 200px !important;
            margin-right: 10px;
            font-size: 16px;
        }

        ::v-deep .el-form-item__content {
            margin-left: 0 !important;
            .after {
                font-size: 16px;
                margin-left: 10px;
                color: #3f78f6;
            }
        }
        .el-button {
            margin-left: 210px;
        }

        ::v-deep .el-input.el-input--suffix {
            .el-input__suffix-inner {
                padding-right: 10px !important;
            }
        }
    }
}
</style>
