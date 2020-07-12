<template>
    <div class="RoleManagement">
        <div class="main">
            <div class="putshelf">
                <el-button @click="add()" size="small"  type="primary" icon="el-icon-plus">新增</el-button>
                <el-button @click="edit()" size="small" type="primary" icon="el-icon-edit-outline">编辑</el-button>
                <el-button @click="del()" size="small" type="danger" icon="el-icon-delete">批量删除</el-button>
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
                <!--勾选框-->
                <el-table-column align="center" type="selection" width="55"></el-table-column>
                <!--数据列-->
                <el-table-column min-width="100" label="数据列">
                    <template slot-scope="scope">
                        <span>{{scope.$index+1}}</span>
                    </template>
                </el-table-column>
                <!--编码-->
                <el-table-column min-width="120" label="编码" prop="code"></el-table-column>
                <!--名称-->
                <el-table-column min-width="120" label="名称" prop="name"></el-table-column>
                <!--描述-->
                <el-table-column min-width="120" label="描述" prop="desc"></el-table-column>
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
        <!--编辑-->
        <el-dialog
                class="dialog"
                title="提示"
                :visible.sync="editVisible"
                width="30%"
                :before-close="handleClose">
            <label>
                <span>编码</span>
                <el-input v-model="editInfo.code" placeholder="编码"></el-input>
            </label>
            <label>
                <span>名称</span>
                <el-input v-model="editInfo.name" placeholder="名称"></el-input>
            </label>
            <label>
                <span>描述</span>
                <el-input v-model="editInfo.desc" placeholder="描述"></el-input>
            </label>
            <p class="bottom">
                <el-button @click="editCancel()" size="small" plain>取消</el-button>
                <el-button @click="editSure()" size="small" type="primary">确定</el-button>
            </p>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                /**
                 * 表格数据 分页条件
                 * */
                tableData: [],
                baseData: [],
                currentPage: 1,
                pagesize: 5,
                selTab:[],
                editVisible: false,
                editInfo:{
                    name:'',
                    code:'',
                    desc:'',
                },
                selCode:'',
                type:'edit'
            };
        },
        methods: {
            // 获取页面表格数据
            getData() {
                this.$api.getRole().then(res => {
                    this.baseData = JSON.parse(JSON.stringify(res.data.result.list));
                    this.tableData = JSON.parse(JSON.stringify(res.data.result.list));
                }).catch(err => {
                    this.$message.error('错误')
                })
            },
            /**
             * 分页器
             * */
            handleSizeChange(val) {
                this.pagesize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
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
                if (val.length===1){
                    this.selCode = val[0].code
                }
                this.selTab= val;
            },
            del(){
                if (this.selTab.length!==0){
                    this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                            this.selTab.forEach((val,key)=>{
                                this.tableData.forEach((item, index) => {
                                    if (item.code === val.code){
                                        this.tableData.splice(index,1)
                                    }
                                })
                                this.baseData.forEach((item, index) => {
                                    if (item.code === val.code) {
                                        this.baseData.splice(index, 1)
                                    }
                                })
                            })
                        this.selTab = []
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
                    this.$message.error('请选择需要删除的项')
                }
            },
            edit(){
                if (this.selTab.length===0){
                    this.$message.error('请选择需要修改的项')
                }
                if (this.selTab.length>1){
                    this.$message.error('请不要同时修改多项')
                }
                if (this.selTab.length===1){
                    this.editVisible = true
                    this.type = 'edit'
                }
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                        .then(_ => {
                            done();
                        })
                        .catch(_ => {
                        });
            },
            editCancel(){
                this.editVisible = false
                this.editInfo = {
                    name: '',
                    code: '',
                    desc: '',
                }
            },
            editSure(){
                if (this.type === 'edit'){
                    if (this.editInfo.name && this.editInfo.code && this.editInfo.desc) {
                        this.editVisible = false
                        this.tableData.forEach((item, index) => {
                            if (item.code === this.selCode) {
                                this.tableData[index] = this.editInfo
                            }
                        })
                        this.editInfo = {
                            name: '',
                            code: '',
                            desc: '',
                        }
                    } else {
                        this.$message.error('请不要留空')
                    }
                }else {
                    if (this.editInfo.name && this.editInfo.code && this.editInfo.desc) {
                        this.editVisible = false
                        let can = false
                            this.tableData.forEach((item,index)=>{
                                if (this.editInfo.code !== item.code) {
                                    can = true
                                }
                            })
                        if (can){
                            this.tableData.unshift(this.editInfo)
                            this.$message.success('添加成功')
                        }
                        this.editInfo = {
                            name: '',
                            code: '',
                            desc: '',
                        }
                    } else {
                        this.$message.error('请不要留空')
                    }
                }
            },
            add(){
                this.editVisible = true
                this.type = 'add'
            }
        },
        created() {
            this.getData()
        },
        mounted() {
        }
    };
</script>

<style scoped
       lang="less">
.RoleManagement{
    height: inherit;

    ::v-deep .dialog {
        .el-dialog {
            width: 650px !important;
            border-radius: 12px;
            overflow: hidden;

            .el-dialog__header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 20px;
                height: 30px;
                background-color: #3f78f6;

                span {
                    color: #ffffff;
                    font-size: 16px;
                    line-height: 30px;
                }

                .el-dialog__headerbtn {
                    position: static;

                    i {
                        color: #ffffff;
                    }
                }
            }

            .el-dialog__body {
                padding: 20px 30px;
                label{
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                    span{
                        width: 42px;
                    }
                    .el-input{
                        width: 100%;
                    }
                }
                .bottom{
                    display: flex;
                    flex-direction: row-reverse;
                    .el-button{
                        margin-left: 20px;
                    }
                }
            }
        }
    }
}
</style>