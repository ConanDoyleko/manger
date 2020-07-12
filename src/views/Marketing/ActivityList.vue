<template>
    <div class="activity" v-if="tableData">
        <div class="status">
            <!--活动编号-->
            <label class="label">
                <span>活动编号</span>
                <el-input v-model="activityCode" placeholder='活动编号'></el-input>
            </label>
            <!--活动名称-->
            <label class="label">
                <span>活动名称</span>
                <el-input v-model="activityName" placeholder='活动名称'></el-input>
            </label>
            <!--活动状态-->
            <label class="label btns" v-if="btnsToBeStarted">
                <span>活动名称</span>
                <el-button @click="changeBtnsActive(1)" :class="selBtnStatus===1?'is_active':''">全部 ({{baseData.length}})</el-button>
                <el-button @click="changeBtnsActive(2)" :class="selBtnStatus===2?'is_active':''">待开始
                    ({{btnsToBeStarted.length}})</el-button>
                <el-button @click="changeBtnsActive(3)" :class="selBtnStatus===3?'is_active':''">进行中
                    ({{btnsProcessing.length}})</el-button>
                <el-button @click="changeBtnsActive(4)" :class="selBtnStatus===4?'is_active':''">已结束
                    ({{btnsOver.length}})</el-button>
            </label>
        </div>
        <div class="type">
            <el-radio-group @change="typeStatusChange()" v-model="type">
                <el-radio :label="1">全部</el-radio>
                <el-radio :label="2">社群团购</el-radio>
                <el-radio :label="3">折扣</el-radio>
                <el-radio :label="4">直降</el-radio>
            </el-radio-group>
            <div class="search">
                <el-button @click="reset()" type="text">重置筛选条件</el-button>
                <el-button @click="goSearch()" icon="el-icon-search"  size="small" type="primary">查询</el-button>
            </div>
        </div>
        <div class="main">
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
                <!--活动类型-->
                <el-table-column min-width="100" label="活动类型" prop="ActivityType"  ></el-table-column>
                <!--活动编号-->
                <el-table-column min-width="120" label="活动编号" prop="ActivityCode"></el-table-column>
                <!--活动名称-->
                <el-table-column min-width="120" label="活动名称" prop="ActivityName"></el-table-column>
                <!--开始时间-->
                <el-table-column min-width="120" label="开始时间" prop="StartTime"></el-table-column>
                <!--结束时间-->
                <el-table-column min-width="120" label="结束时间" prop="EndTime"></el-table-column>
                <!--状态-->
                <el-table-column min-width="100" label="状态" prop="Status">
                    <template slot-scope="scope">
                        <span v-if="scope.row.Status==='待开始'"
                              style="color: #ff0036">{{ scope.row.Status }}</span>
                        <span v-else-if="scope.row.Status==='进行中'"
                              style="color: #67C23A">{{ scope.row.Status }}</span>
                        <span v-else>{{ scope.row.Status }}</span>
                    </template>
                </el-table-column>
                <!--操作-->
                <el-table-column min-width="100" label="操作" prop="Status">
                    <template slot-scope="scope">
                        <el-button @click="lookDetailInfo(scope.row)" icon="el-icon-tickets" type="text">详情</el-button>
                    </template>
                </el-table-column>
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
                title="活动信息"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
                <el-tabs type="border-card">
                    <el-tab-pane label="活动信息">
                        <div class="activity">
                            <div class="title">
                                <i class="el-icon-question"></i>
                                <span>活动信息</span>
                            </div>
                            <div class="text">
                                <p>
                                    <span>活动名称:</span><span>{{selDataInfo.ActivityName}}</span>
                                </p>
                                <p>
                                    <span>活动时间:</span><span>{{selDataInfo.StartTime}} 至 {{selDataInfo.EndTime}}</span>
                                </p>
                                <p>
                                    <span>广告语:</span><span>{{selDataInfo.Advertising}}</span>
                                </p>
                                <p>
                                    <span>促销类型:</span><span>{{selDataInfo.ActivityType}}</span>
                                </p>
                            </div>
                            <div style="margin-top: 30px" class="title">
                                <i class="el-icon-question"></i>
                                <span>活动规则</span>
                            </div>
                            <div class="text">
                                <p>
                                    <span>顾客类型:</span><span>不限</span>
                                </p>
                                <p>
                                    <span>是否限量:</span><span>不限</span>
                                </p>
                                <p>
                                    <span>配送方式:</span><span>{{selDataInfo.DeliveryMethod}}</span>
                                </p>
                                <p>
                                    <span>提货时间:</span><span>{{selDataInfo.PickupTime}}</span>
                                </p>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="商品列表">
                        <el-table
                                width="100%"
                                height="520"
                                class="table"
                                border
                                stripe
                                lazy
                                show-header
                                header-row-class-name="tab_header"
                                ref="multipleTable"
                                :data="selDataInfo.ProductList"
                                tooltip-effect="dark"
                        >
                            <!--商品编码-->
                            <el-table-column min-width="100" label="商品编码" prop="ProductId"></el-table-column>
                            <!--SKU码-->
                            <el-table-column min-width="120" label="SKU码" prop="Sku"></el-table-column>
                            <!--商品图片-->
                            <el-table-column min-width="80" label="商品图片" prop="PictureUrl">
                                <template slot-scope="scope">
                                    <img :src="scope.row.PictureUrl" alt="">
                                </template>
                            </el-table-column>
                            <!--商品名称-->
                            <el-table-column min-width="120" label="商品名称" prop="ProductName"></el-table-column>
                            <!--正常价-->
                            <el-table-column min-width="80" label="正常价" prop="Price"></el-table-column>
                            <!--促销价-->
                            <el-table-column min-width="80" label="促销价" prop="PromotionPrice"></el-table-column>
                             <!--佣金比例-->
                            <el-table-column min-width="80" label="佣金比例" prop="FeeRate"></el-table-column>
                            <!--限购数量-->
                            <el-table-column min-width="80" label="限购数量" prop="LimitCount"></el-table-column>
                            <!--活动总库存-->
                            <el-table-column min-width="100" label="活动总库存" prop="PromotionStock"></el-table-column>
                            <!--当前总库存-->
                            <el-table-column min-width="120" label="当前剩余总库存" prop="PromotionStockNow"></el-table-column>

                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="门店列表">
                        <el-table
                                width="100%"
                                height="500"
                                class="table"
                                border
                                stripe
                                lazy
                                show-header
                                header-row-class-name="tab_header"
                                ref="multipleTable"
                                :data="selDataInfo['StoreList']"
                                tooltip-effect="dark"
                        >
                            <!--门店编码-->
                            <el-table-column min-width="100" label="门店编码" prop="StoreCode"></el-table-column>
                            <!--门店名称-->
                            <el-table-column min-width="120" label="门店名称" prop="StoreName"></el-table-column>
                            <!--业态-->
                            <el-table-column min-width="120" label="业态" prop="StoreFormat"></el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
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
                selBtnStatus:1,  // 按扭活动状态
                btnsToBeStarted:[], // 按扭 待开始
                btnsProcessing:[], // 按扭 进行中
                btnsOver:[], // 按扭  已结束
                type:1,
                status:'',
                typeName:'',
                activityCode:'',
                activityName:'',
                dialogVisible: false,
                selDataInfo:{}
            };
        },
        methods: {
            // 获取页面表格数据
            getData(){
                this.$api.getActivityList().then(res=>{
                    this.baseData = JSON.parse(JSON.stringify(res.data.result.list));
                    this.tableData = JSON.parse(JSON.stringify(res.data.result.list));
                    this.filterStatusNum('btnsToBeStarted','Status','待开始',)
                    this.filterStatusNum('btnsProcessing', 'Status','进行中',)
                    this.filterStatusNum('btnsOver', 'Status','已结束',)
                }).catch(err=>{
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
                this.selTabArr = [];
                this.selTabArr = val;
            },
            // 按扭 选中状态
            changeBtnsActive(type){
                this.selBtnStatus=type
                switch (this.selBtnStatus) {
                    case 1:
                        this.status = ''
                        break;
                    case 2:
                        this.status = '待开始'
                        break;
                    case 3:
                        this.status = '进行中'
                        break;
                    case 4:
                        this.status = '已结束'
                        break;
                }
            },
            // btn 筛选
            filterStatusNum(arr,name,text){
                  this[arr]= this.baseData.filter((item,index)=>{
                      return item[name].includes(text)
                  })
            },
            typeStatusChange(){
                switch (this.type) {
                    case 1:
                        this.typeName = ''
                        break;
                    case 2:
                        this.typeName = '社群团购'
                        break;
                    case 3:
                        this.typeName = '折扣'
                        break;
                    case 4:
                        this.typeName = '直降'
                        break;
                }
            },
            reset(){
                this.activityCode=''
                this.activityName =''
            },
            goSearch(){
                if (this.activityCode|| this.activityName){
                    if (this.activityCode){
                        this.tableData = this.tableData.filter((item, index) => {
                            return item.ActivityCode.includes(this.activityCode)
                        })
                    }
                    if (this.activityName){
                        this.tableData = this.tableData.filter((item, index) => {
                            return item.ActivityName.includes(this.activityName)
                        })
                    }
                }else {
                    this.$message.error('请输入搜索条件')
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
            lookDetailInfo(row){
                this.dialogVisible = true
                this.selDataInfo = row
            }, // 查看详情
        },
        created() {
            this.getData()
        },
        watch:{
            status:{
                handler(){
                    this.reset()
                    if (this.typeName===''){
                        if (this.status===''){
                            this.tableData = this.baseData
                        }else {
                            this.filterStatusNum('tableData', 'Status', this.status,)
                        }
                    }else {
                        if (this.status === ''){
                            this.tableData = this.baseData
                            this.filterStatusNum('tableData', 'ActivityType', this.typeName,)
                        }else {
                            this.tableData = this.baseData.filter((item, index) => {
                                return item.Status === this.status && item.ActivityType === this.typeName
                            })
                        }
                    }
                }
            },
            typeName:{

                handler(){
                    this.reset()
                    if (this.status === '') {
                        if (this.typeName === '') {
                            this.tableData = this.baseData
                        } else {
                            this.filterStatusNum('tableData', 'ActivityType', this.typeName,)
                        }
                    } else {
                        if (this.typeName===''){
                            this.tableData = this.baseData
                            this.filterStatusNum('tableData', 'Status', this.status,)
                        }else {
                            this.tableData = this.baseData.filter((item, index) => {
                                return item.Status === this.status && item.ActivityType === this.typeName
                            })
                        }
                    }
                }
            }
        }
    };
</script>

<style scoped
       lang="less">
.activity{
    height: inherit;
    .status{
        padding: 20px;
        display: flex;
        align-items: center;
        .label{
            display: flex;
            align-items: center;
            margin-right: 20px;
            >span{
                white-space: nowrap;
                margin-right: 10px;
            }

        }

        ::v-deep .btns {
            .el-button {
                span {
                    color: #3F78F6;
                    transition: all .2s;
                }
                border-color: #3F78F6;
                transition: all .2s;
            }

            .el-button.is_active{
                background-color: #3F78F6;
                span{
                    color: #FFFFFF;
                }
            }
        }
    }
    .type{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        .search{
            display: flex;
            align-items: center;
        }
    }
   .main{
       height: 80%;
   }
}

::v-deep .el-dialog {
    width: 1030px !important;
    height: 630px;
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
       padding: 0;
        height: 560px;


    }

    ::v-deep .el-tabs {
        height: 560px;
    }

    .el-tabs__content {
        height: 560px;
        overflow-y: scroll;
        .title{
            display: flex;
            align-items: center;
            font-size: 18px;
            i{
                margin-right: 10px;
                color: #3F78F6;
            }
        }
        .text{
            p{
                margin-top: 16px;
                font-size: 15px;
                span{
                    display: inline-block;
                }
                span:nth-of-type(1){
                    margin-right: 10px;
                    text-align: right;
                    width: 100px;
                }
            }
        }

    }

    .el-tabs__content::-webkit-scrollbar{
        display:none;
    }

}
</style>