<template>
    <div class="UserList">
        <div class="main">
            <div class="filter">
                <div class="left">
                    <label>
                        <span>账号</span>
                        <el-input v-model="Id"></el-input>
                    </label>
                    <label>
                        <span>真实姓名</span>
                        <el-input v-model="Name"></el-input>
                    </label>
                    <label>
                        <span>所属门店</span>
                        <el-input v-model="OwnStore"></el-input>
                    </label>
                    <label>
                        <span>角色</span>
                        <el-input v-model="role"></el-input>
                    </label>
                    <label>
                        <span>状态</span>
                        <el-select @change="selChange()" v-model="select">
                            <el-option value="有效"></el-option>
                            <el-option value="无效"></el-option>
                        </el-select>
                    </label>
                </div>
                <div class="right">
                    <el-button @click="reset()" class="btn" type="text">重置筛选条件</el-button>
                    <el-button @click="goSearch()" class="search" type="primary" icon="el-icon-search">搜索</el-button>
                </div>
            </div>
            <div class="putshelf">
                <el-button
                        @click="addUser()"
                        type="primary"
                        icon="el-icon-plus"
                >新增
                </el-button>
                <el-button
                        @click="editUser()"
                        type="primary"
                        icon="el-icon-edit-outline"
                >编辑
                </el-button>
                <el-button
                        @click="del()"
                        type="danger"
                        icon="el-icon-delete-solid"
                >批量删除
                </el-button>
            </div>
            <el-table
                height="100%"
                class="table"
                border
                stripe
                lazy
                show-header
                header-row-class-name="tab_header"
                ref="multipleTable"
                :data="tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
                tooltip-effect="dark"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
            >
                <el-table-column align="center" type="selection" width="55"></el-table-column>
                <el-table-column label="账号" prop="Id" min-width="55"></el-table-column>
                <el-table-column label="昵称" prop="NickName" min-width="55"></el-table-column>
                <el-table-column label="真实姓名" prop="Name" min-width="55"></el-table-column>
                <el-table-column label="所属门店" prop="OwnStore" min-width="50"></el-table-column>
                <el-table-column label="角色" prop="role" min-width="50"></el-table-column>
                <el-table-column label="状态" min-width="50">
                    <template slot-scope="scope">
                        <span class="status ok" v-if="scope.row.Status === true">有效</span>
                        <span class="status no" v-else>无效</span>
                    </template>
                </el-table-column>
                <el-table-column label="手机号" prop="Tel" min-width="80"></el-table-column>
                <el-table-column label="最后登录时间" prop="LastLoginTime" min-width="80"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    class="paginationx"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 20, 100]"
                    :page-size="pagesize"
                    :page-count="tableData / 5"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableData.length"
                >
                </el-pagination>
            </div>
        </div>
        <el-dialog
                class="user"
                :title="type"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose"
        >

            <el-form ref="add" :rules="rules" :label-position="labelPosition" label-width="80px" :model="ruleForm" class="demo-ruleForm">
                <el-form-item prop="Id"  label="账号">
                    <el-input :disabled="type==='新增用户'?false:'disabled'" v-model="ruleForm.Id"></el-input>
                </el-form-item>
                <el-form-item prop="Pwd" label="密码">
                    <el-input show-password :disabled="type==='新增用户'?false:'disabled'" v-model="ruleForm.Pwd"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="ruleForm.Pwd='000000'" type="primary" plain>重置密码</el-button>
                </el-form-item>
                <el-form-item prop="Name" label="真实姓名">
                    <el-input v-model="ruleForm.Name"></el-input>
                </el-form-item>
                <el-form-item prop="Tel" label="联系方式">
                    <el-input v-model="ruleForm.Tel"></el-input>
                </el-form-item>
                <el-form-item prop="Email" label="邮箱">
                    <el-input v-model="ruleForm.Email"></el-input>
                </el-form-item>
                <el-form-item prop="role" label="角色">
                    <el-select v-model="ruleForm.role" placeholder="请选择">
                        <el-option label="店员" value="店员"></el-option>
                        <el-option label="运营" value="运营"></el-option>
                        <el-option label="店长" value="店长"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="OwnStore" label="所属门店">
                    <el-input v-model="ruleForm.OwnStore"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click='storeVisable = true' type="primary">选择门店</el-button>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio v-model="ruleForm.Status" :label="true">有效</el-radio>
                    <el-radio v-model="ruleForm.Status" :label="false">无效</el-radio>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                    <el-button @click="addSave('add')" icon="el-icon-finished" type="primary" >保存</el-button>
                </span>
        </el-dialog>
        <!--门店-->
        <el-dialog
                class="user store"
                title="选择门店"
                :visible.sync="storeVisable"
                width="30%"
                :before-close="handleClose">
            <div class="while_search">
                <label>
                    <span>门店编码</span>
                    <el-input v-model="storeCode" placeholder="门店编码"></el-input>
                </label>
                <label>
                    <span>门店名称</span>
                    <el-input v-model="storeName" placeholder="门店名称"></el-input>
                </label>
                <label>
                    <el-button @click="storeName='',storeCode=''" style='text-decoration: underline' type="text">重置筛选条件</el-button>
                </label>
                <label>
                    <el-button @click="searchStore()" type="primary">查询</el-button>
                </label>
            </div>
            <el-table
                    height="100%"
                    class="store_table"
                    border
                    stripe
                    lazy
                    show-header
                    header-row-class-name="tab_header"
                    ref="storeTable"
                    :data="storeData.slice((currentStorePage - 1) *storePagesize, currentStorePage * storePagesize)"
                    tooltip-effect="dark"
                    style="width: 100%;"
                    @selection-change="handleStoreSelectionChange"
            >
                <el-table-column align="center"  width="55">
                    <template scope="scope">
                        <el-radio :label="scope.$index"  v-model="storeSel"  @change.native="getCurrentRow(scope.row)"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column label="门店编码" prop="Id" width="100"></el-table-column>
                <el-table-column label="门店名称" prop="OwnStore" min-width="55"></el-table-column>
            </el-table>
            <div class="pagination_store">
                <el-pagination
                        small
                        class="store_pagination"
                        @size-change="handleSizeChangeStore"
                        @current-change="handleCurrentChangeStore"
                        :current-page="currentStorePage"
                        :page-sizes="[5, 10, 20, 100]"
                        :page-size="storePagesize"
                        :page-count="storeData / 5"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="storeData.length"
                >
                </el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="storeVisable = false">取 消</el-button>
                <el-button type="primary" @click="saveStore()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        let checkTel = (rule, value, callback) => {
            if (!/^[1][34578][0-9]{9}$/.test(value)) {
                callback(new Error('手机号格式不正确!'));
            } else {
                callback();
            }

        };
        let checkPwd=(rule, value, callback)=>{
            if (!/[0-9A-z-_]{6,18}/.test(value)) {
                callback(new Error('密码格式不正确!'));
            } else {
                callback();
            }
        }
        let checkEmail = (rule, value, callback) => {
            if (!/[0-9A-z-_]{6,18}/.test(value)) {
                callback(new Error('邮箱格式不正确!'));
            } else {
                callback();
            }
        }
        return {
            /**
             * 表格数据 分页条件
             * */
            tableData: [],
            baseData: [],
            currentPage: 1,
            pagesize: 5,
            select: "",
            /**/
            currentStorePage:1,
            storePagesize:5,

            /**
             * 搜索条件
             * */
            Id: "",
            Name: "",
            OwnStore: "",
            role: "",
            // 选中表格
            selTabArr:[],
            dialogVisible:false,
            ruleForm: {
                Id:'',
                Pwd:'',
                Name: '',
                Tel:'',
                Email:'',
                role:'',
                OwnStore:'',
                Status:true
            },
            labelPosition: 'right',
            radio:true,
            type:'新增用户',
            /*表单验证*/
            rules: {
                Id: [
                    {required: true, message: '账号不能为空', trigger: 'blur'},
                    {min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'}
                ],
                Pwd:[
                    {required: true, message: '密码不能为空', trigger: 'blur'},
                    {validator: checkPwd, trigger: 'blur'}
                ],
                Name:[
                    {required: true, message: '姓名不能为空', trigger: 'blur'},
                    {min: 2, max: 8, message: '长度在 2 到 8 位', trigger: 'blur'}
                ],
                Tel:[
                    {required: true, message: '手机号不能为空', trigger: 'blur'},
                    {validator: checkTel, trigger: 'blur'}
                ],
                Email:[
                    {required: true, message: '邮箱不能为空', trigger: 'blur'},
                    {validator: checkEmail, trigger: 'blur'}
                ],
                role:[
                    {required: true, message: '请选择角色', trigger: 'change'},
                ],
                OwnStore:[

                ]
            },
            /*store对话框*/
            storeVisable:false,
            /**
             * store table 表格
             * */
            storeData:[],
            storeBase:[],
            storeSel:{},
            storeCode:'',
            storeName:''
        };
    },
    methods: {
        /**
         * 分页器
         * */
        handleSizeChange(val) {
            this.pagesize = val;
        },
        handleCurrentChange(val) {
            this.currentPage = val;
        },
        handleSizeChangeStore(val){
            this.storePagesize = val;
        },
        handleCurrentChangeStore(val){
            this.currentStorePage = val;
        },
        /**
         * 表格
         * @param rows
         */
        toggleSelection(rows) {
            if (rows) {
                rows.forEach((row) => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        /**
         * 表中表格触发
         * @param val
         */
        handleSelectionChange(val) {
            this.selTabArr = [];
            this.selTabArr = val;
        },
        handleStoreSelectionChange(){

        },
        /**
         * 获取数据
         */
        getData() {
            this.$api.getUser().then((res) => {
                this.tableData = JSON.parse(JSON.stringify(res.data.result.list));
                this.baseData = JSON.parse(JSON.stringify(res.data.result.list));
            });
        },
        selChange() {
            if (this.select === "有效") {
                this.tableData = this.baseData.filter((item, index) => {
                    return item.Status === true;
                });
            } else {
                this.tableData = this.baseData.filter((item, index) => {
                    return item.Status === false;
                });
            }
        },
        goSearch() {
            if (this.Id) {
                this.searchWhile("Id");
            }
            if (this.Name) {
                this.searchWhile("Name");
            }
            if (this.OwnStore) {
                this.searchWhile("OwnStore");
            }
            if (this.role) {
                this.searchWhile("role");
            }
        },
        searchWhile(name) {
            this.tableData = this.tableData.filter((item, index) => {
                return item[name].includes(this[name]);
            });
        },
        reset() {
            this.Id = "";
            this.Name = "";
            this.OwnStore = "";
            this.role = "";
            this.select = "";
            this.tableData =this.baseData
        },
        /**
         * 删除
         */
        del(){
            if (this.selTabArr.length!==0){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.tableData.forEach((item, index) => {
                        this.selTabArr.forEach((val, key) => {
                            if (item.Id === val.Id) {
                                this.tableData.splice(index, 1)
                            }
                        })
                    })
                    this.baseData = this.tableData
                    this.selTabArr=[]
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }else {
                this.$message({
                    type: 'error',
                    message: '请先选择需要删除的项'
                });
            }
        },
        /**
         *
         * @param done
         */
        handleClose(done) {
            this.$confirm("确认关闭？")
                    .then((_) => {
                        done();
                    })
                    .catch((_) => {
                    });
        },
        // 新增用户确认保存
        addSave(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                   if (this.type==='新增用户'){
                       this.tableData.unshift(this.ruleForm)
                   }else {
                       this.tableData.forEach((item,index)=>{
                           if(item.Id === this.ruleForm.Id){
                               this.tableData[index] = this.ruleForm
                           }
                       })
                   }
                    this.$message({
                        message: '恭喜你，添加成功',
                        type: 'success'
                    });
                    this.dialogVisible=false
                    this.ruleForm= {
                        Id: '',
                        Pwd: '',
                        Name: '',
                        Tel: '',
                        Email: '',
                        role: '',
                        OwnStore: '',
                        Status: true
                    }
                } else {
                    return false;
                }
            });
            // this.dialogVisible = false
        },
        addUser(){
            this.type ='新增用户'
            this.dialogVisible = true
        },
        editUser(){
            this.type = '编辑用户'
            if (this.selTabArr&&this.selTabArr.length===1){
                this.dialogVisible = true
                 this.tableData.forEach((item,index)=>{
                    if (item.Id === this.selTabArr[0].Id){
                        this.ruleForm  = JSON.parse(JSON.stringify(this.tableData[index]))
                    }
                })

            }else if (this.selTabArr.length > 1){
                this.$message({
                    message: '请误同时编辑多条内容',
                    type: 'warning'
                });
            }else {
                this.$message({
                    message: '请选择需要编辑的内容',
                    type: 'warning'
                });
            }
        },
        getCurrentRow(row){
            this.ruleForm.OwnStore =this.storeData[this.storeSel].OwnStore
          // this.storeSel =   JSON.stringify(row)
        },
        /**
         * store 搜索
         */
        searchStore(){
            if (this.storeCode||this.storeName){
                if (this.storeCode){
                    this.storeData = this.storeData.filter((item => {
                        return item.Id.includes(this.storeCode)
                    }))
                }
                if (this.storeName) {
                    this.storeData = this.storeData.filter((item => {
                        return item.OwnStore.includes(this.storeName)
                    }))
                }
            }else {
                this.$message({
                    message: '请输入搜索内容',
                    type: 'warning'
                });
            }
        },
        saveStore(){
            this.storeVisable = false
            // this.ruleForm.OwnStore = JSON.parse(JSON.stringify(this.storeSel.OwnStore))
        }
    },
    created() {
        this.getData();
        this.$api.getUserStore().then(res => {
            this.storeData = JSON.parse(JSON.stringify(res.data.result.list))
            this.storeBase = JSON.parse(JSON.stringify(res.data.result.list))
        })
    },
    mounted() {},
};
</script>

<style scoped lang="less">
.UserList {
    height: inherit;

    ::v-deep .user {
        .el-dialog {
            width: 700px !important;
            border-radius: 12px;
            overflow: hidden;

            .el-dialog__header {
                position: relative;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 18px;
                height: 30px;
                width: 100%;
                background-color: #3f78f6;

                span {
                    color: #ffffff;
                    font-size: 15px;
                }

                button {
                    position: absolute;
                    height: 100%;
                    right: 0;
                    top: 0;
                    width: 40px;
                    transition: all 0.3s;

                    i {
                        color: #ffffff;
                    }
                }

                button:hover {
                    background-color: #ff0036;
                    color: #ffffff;
                }
            }

            .el-dialog__body {
                padding:40px 185px;

                ul li .name {
                    width: 100px;
                    text-align: right;
                    margin-right: 18px;
                }

                ul li {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .orderInfo {
                    margin-bottom: 50px;
                }
            }
        }
    }

    .status {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 20px;
        border-radius: 5px;
    }
    .ok {
        background-color: #f0f9eb;
        color: #7dc95a;
        border: 1px solid #7dc95a;
    }
    .no {
        background-color: #f4f4f4;
        color: #b2b2b2;
        border: 1px solid #b2b2b2;
    }
    ::v-deep.el-dialog{
        padding: 0;
        margin: 0 !important;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }

    ::v-deep .store{
        position: fixed;
        left: 0;
        top:0;
        right: 0;
        bottom: 0;
        margin: auto;
        /*transform: translate(-50%,-50%);*/
        width: 736px;
        height: inherit;
        .el-dialog__body{
            padding: 20px 50px !important;
            .while_search{
                display: flex;
                align-items: center;
                justify-content: space-between;
                label{
                    display: flex;
                    align-items: center;
                    margin-right: 20px;
                    >span{
                        margin-right: 10px;
                        white-space: nowrap;
                    }
                }
            }
        }
    }

    ::v-deep .el-table.store_table {
        margin: 20px 0;
        height: 280px !important;
    }
    ::v-deep .pagination_store{
        width: 100%;
        background-color: #EAEDF4;
        .store_pagination.el-pagination{
            width: 100%;
            height: 40px;
            display: flex;
            align-items: center;
            .el-pager{
                display: flex;
                align-items: center;
                li{
                    margin: 0;
                    background-color: #EAEDF4;
                }
            }
            .el-select.el-select--mini{
                height: 100% !important;
                .el-input {
                    height: 100% !important;
                    input{
                        height: 100% !important;
                    }
                }
            }
        }
    }
   ::v-deep .el-radio__label{
        display: none;
    }
}
</style>
