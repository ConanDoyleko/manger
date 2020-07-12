<template>
    <div class="DefraySetting">
        <el-form
            :model="ruleForm"
            label-position="right"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
        >
            <!--支付名称-->
            <el-form-item label="支付名称" prop="Payname">
                <el-input v-model="ruleForm.Payname"></el-input>
            </el-form-item>
            <!--支付类型-->
            <el-form-item label="支付类型" prop="PaySort">
                <el-radio v-model="radio" :label="0">有条码</el-radio>
                <el-radio v-model="radio" :label="1">无条码</el-radio>
            </el-form-item>
            <!--MerchantName-->
            <el-form-item label="商户名称" prop="MerchantName">
                <el-input v-model="ruleForm.MerchantName"></el-input>
            </el-form-item>
            <!--BusinessNumber-->
            <el-form-item label="商户号" prop="BusinessNumber">
                <el-input v-model="ruleForm.BusinessNumber"></el-input>
            </el-form-item>
            <!--公众账号-->
            <el-form-item label="公众账号( Appid )" prop="AccountNumber">
                <el-input v-model="ruleForm.AccountNumber"></el-input>
            </el-form-item>
            <!--Api密钥-->
            <el-form-item label="Api密钥" prop="ApiKey">
                <el-input v-model="ruleForm.ApiKey"></el-input>
            </el-form-item>
            <!--Secret 接口-->
            <el-form-item label="接口Secret" prop="Secret">
                <el-input v-model="ruleForm.Secret"></el-input>
            </el-form-item>
            <!--商户证书-->
            <el-form-item label="商户证书" prop="certificate">
                <el-upload
                    class="upload-demo"
                    action="../../a"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :file-list="fileList"
                >
                    <el-button icon="el-icon-upload" size="small" type="primary">选择上传文件</el-button>
                </el-upload>
            </el-form-item>
            <!--商户key证书-->
            <el-form-item label="商户key证书" prop="FileKey">
                <!--v-if="ruleForm.certificate"-->
                <div class="del">
                    <span>{{ "商户证书.pem" }}</span>
                    <el-button size="small" type="danger" icon="el-icon-delete-solid">删除</el-button>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            ruleForm: {
                Payname: "", // 支付名称
                PaySort: "", // 支付方式
                MerchantName: "", // 商户名
                BusinessNumber: "", // 商户号
                AccountNumber: "", //公众账号
                ApiKey: "", // ApiKey
                Secret: "", //Secret 接口
                File: "",
                FileKey: "",
            },
            rules: {
                Payname: [
                    { required: true, message: "请输入活动名称", trigger: "blur" },
                    { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
                ],
                MerchantName: [
                    { required: true, message: "请输入商户名", trigger: "blur" },
                    { min: 2, max: 12, message: "长度在 2 到 12 个字符", trigger: "blur" },
                ],
                BusinessNumber: [
                    { required: true, message: "请输入商户名", trigger: "blur" },
                    { min: 9, max: 18, message: "长度在 9 到 18 个字符", trigger: "blur" },
                ],
                AccountNumber: [
                    { required: true, message: "请输入公众账号(Appid)", trigger: "blur" },
                    { min: 6, max: 18, message: "长度在 6 到 18 个字符", trigger: "blur" },
                ],
                ApiKey: [
                    { required: true, message: "请输入Api密钥", trigger: "blur" },
                    { min: 6, max: 18, message: "长度在 6 到 18 个字符", trigger: "blur" },
                ],
                Secret: [
                    { required: true, message: "请输入接口Secret", trigger: "blur" },
                    { min: 6, max: 18, message: "长度在 6 到 18 个字符", trigger: "blur" },
                ],
                Certificate: [{ required: true, message: "请选择证书", trigger: "blur" }],
                FileKey: [{ required: true, message: "请选择商户证书key", trigger: "blur" }],
            },
            radio: 0,
            fileList: [],
        };
    },
    props: {},
    methods: {
        /**
         *
         * @param formName
         */
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert("submit!");
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        /**
         *
         * @param file
         * @param fileList
         */
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
    },
    created() {},
    mounted() {},
};
</script>

<style scoped lang="less">
.DefraySetting {
    display: flex;
    justify-content: center;
    align-items: center;
    .demo-ruleForm {
        width: 460px;
        margin-top: 60px;
    }
}

.el-input {
    width: 290px;
}
::v-deep .el-form-item__label {
    width: 142px !important;
    white-space: nowrap;
    /*margin-right: 22px;*/
}
.del {
    span {
        color: #3f78f6;
    }
    .el-button {
        margin-left: 20px;
    }
}
</style>
