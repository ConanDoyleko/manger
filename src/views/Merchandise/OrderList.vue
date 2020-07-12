<template>
    <div class="OrderList">
        <!--头-->
        <header
                v-if="tableData"
                class="header"
        >
            <ul class="countlist">
                <li @click="changeSelIndex(1)" :class="selIndex === 1 ? 'active' : ''">
                    当日订单(<span>{{todayOrder.length}}</span>)
                </li>
                <li @click="changeSelIndex(2)" :class="selIndex === 2 ? 'active' : ''">
                    待付款(<span>{{PendingPayment.length}}</span>)
                </li>
                <li @click="changeSelIndex(3)" :class="selIndex === 3 ? 'active' : ''">
                    待发货(<span>{{toBeDelivered.length}}</span>)
                </li>
                <li @click="changeSelIndex(4)" :class="selIndex === 4 ? 'active' : ''">
                    待收货(<span>{{ToBeReceived.length}}</span>)
                </li>
                <li @click="changeSelIndex(5)" :class="selIndex === 5 ? 'active' : ''">
                    已完成(<span>{{completed.length}}</span>)
                </li>
                <li @click="changeSelIndex(6)" :class="selIndex === 6 ? 'active' : ''">
                    待退款(<span>{{PendingRefund.length}}</span>)
                </li>
                <li @click="changeSelIndex(7)" :class="selIndex === 7 ? 'active' : ''">
                    已退款(<span>{{refunded.length}}</span>)
                </li>
            </ul>
        </header>
        <div class="main">
            <p class="DeliveryMethod">
                <span>配送方式</span>
                <el-radio-group @change="deliveryMethodChange()" v-model="DeliveryMethod">
                    <el-radio label="全部">全部</el-radio>
                    <el-radio label="自提">自提</el-radio>
                    <el-radio label="配送">配送</el-radio>
                </el-radio-group>
            </p>
            <div class="filter">
                <div class="left">
                    <label class="label">
                        <span>订单编号</span>
                        <el-input
                                v-model="OrderId"
                                placeholder="订单编号"
                        ></el-input>
                    </label>
                    <label class="label">
                        <span>商品编号</span>
                        <el-input
                                v-model="ProductNumber"
                                placeholder="商品编号"
                        ></el-input>
                    </label>
                    <label class="label">
                        <span>所属门店</span>
                        <el-input
                                v-model="OwnStore"
                                placeholder="所属门店"
                        ></el-input>
                    </label>
                </div>
                <div class="right">
                    <el-button
                            @click="resetFilter()"
                            class="btn"
                            type="text"
                    >重置筛选条件
                    </el-button>
                    <el-button
                            @click="goSearch()"
                            class="search"
                            type="primary"
                            icon="el-icon-search"
                    >搜索
                    </el-button>
                </div>
            </div>
            <div class="filter">
                <div class="left">
                    <label class="label">
                        <span>会员账号</span>
                        <el-input
                                v-model="MemberAccount"
                                placeholder="会员账号"
                        ></el-input>
                    </label>
                    <label class="label">
                        <span>收货人</span>
                        <el-input
                                v-model="consignee"
                                placeholder="收货人姓名/手机号码"
                        ></el-input>
                    </label>
                    <label class="label">
                        <span>下单时间</span>
                        <el-date-picker
                                @change="timeChange(1)"
                                v-model="startTime"
                                type="datetime"
                                placeholder="选择开始时间">
                        </el-date-picker>
                        <el-date-picker
                                @change="timeChange(2)"
                                v-model="endTime"
                                type="datetime"
                                placeholder="选择截止时间">
                        </el-date-picker>
                    </label>
                </div>
                <div class="right"></div>
            </div>
            <!--导出订单-->
            <p class="export">
                <el-button @click="exportExcel()" icon="el-icon-folder" size="mini" type="primary">导出选中订单</el-button>
            </p>
            <!--页面表格-->
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
                <!--订单编号-->
                <el-table-column min-width="100" label="订单编号" prop="OrderId"></el-table-column>
                <!--下单时间-->
                <el-table-column min-width="100" label="下单时间" prop="OrderTime"></el-table-column>
                <!--会员账号-->
                <el-table-column min-width="100" label="会员账号" prop="MemberAccount"></el-table-column>
                <!--订单总额-->
                <el-table-column min-width="100" label="订单总额" prop="OrderTotal">
                    <template class="set" slot-scope="scope">
                        <span>￥ {{scope.row.OrderTotal}}</span>
                    </template>
                </el-table-column>
                <!--所属门店-->
                <el-table-column min-width="100" label="所属门店" prop="OwnStore"></el-table-column>
                <!--订单状态-->
                <el-table-column label="订单状态" min-width="100px">
                    <template class="set" slot-scope="scope">
                        <span v-html="scope.row.OrderStatus"></span>
                    </template>
                </el-table-column>
                <!--查看订单-->
                <el-table-column label="查看订单" min-width="100px">
                    <template slot-scope="scope">
                        <p @click="findDetail(scope.row)">
                            <i class="el-icon-search look"></i>
                            <span class="look"
                                  style="margin-left: 5px;cursor: pointer">查看订单</span>
                        </p>
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
            <!--导出Excel表格 默认不显示-->
            <el-table
                    id="el-table"
                    height="100%"
                    class="table"
                    border
                    stripe
                    lazy
                    show-header
                    header-row-class-name="tab_header"
                    ref="multipleTable"
                    :data="excelData"
                    tooltip-effect="dark"
                    style="width: 100%;"
                    @selection-change="handleSelectionChange"
            >
                <!--勾选框-->
                <el-table-column align="center" type="selection" width="55"></el-table-column>
                <!--订单编号-->
                <el-table-column min-width="100" label="订单编号" prop="OrderId"></el-table-column>
                <!--下单时间-->
                <el-table-column min-width="100" label="下单时间" prop="OrderTime"></el-table-column>
                <!--会员账号-->
                <el-table-column min-width="100" label="会员账号" prop="MemberAccount"></el-table-column>
                <!--订单总额-->
                <el-table-column min-width="100" label="订单总额" prop="OrderTotal">
                    <template class="set" slot-scope="scope">
                        <span>￥ {{scope.row.OrderTotal}}</span>
                    </template>
                </el-table-column>
                <!--所属门店-->
                <el-table-column min-width="100" label="所属门店" prop="OwnStore"></el-table-column>
                <!--订单状态-->
                <el-table-column label="订单状态" min-width="100px">
                    <template class="set" slot-scope="scope">
                        <span v-html="scope.row.OrderStatus"></span>
                    </template>
                </el-table-column>
                <!--查看订单-->
                <el-table-column label="查看订单" min-width="100px">
                    <template slot-scope="scope">
                        <p @click="findDetail(scope.row)">
                            <i class="el-icon-search look"></i>
                            <span class="look"
                                  style="margin-left: 5px;cursor: pointer">查看订单</span>
                        </p>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--订单详情弹框-->
        <el-dialog
                class="detail_dialog"
                title="订单详情"
                :visible.sync="dialogVisible"
                :before-close="handleClose"
                width="30%">
            <div class="step">
                <el-steps :active="active">
                    <el-step title="提交订单" icon="el-icon-success"></el-step>
                    <el-step title="支付订单" icon="el-icon-info"></el-step>
                    <el-step title="待发货" icon="el-icon-info"></el-step>
                    <el-step title="待收货" icon="el-icon-info"></el-step>
                    <el-step title="已收货" icon="el-icon-info"></el-step>
                </el-steps>
            </div>
            <div class="now">
                <div class="status">
                    <span>当前状态:</span>
                    <span v-html="info.OrderStatus"></span>
                </div>
                <el-button @click="getContext()" size="small" type="primary" plain>备注详情</el-button>
                <el-button @click="getContext()" size="small" type="primary">添加备注</el-button>
            </div>
            <div class="title">
                <i class="el-icon-warning"></i><span>基本信息</span>
            </div>
            <el-table
                    :data="baseInfo"
                    height="120"
                    class="table_add"
                    border
                    stripe
                    lazy
                    show-header
                    header-row-class-name="tab_header"
            >
                <el-table-column prop="OrderId" label="订单编号" min-width="106"></el-table-column>
                <el-table-column prop="MemberAccount" label="会员账号" min-width="106"></el-table-column>
                <el-table-column prop="PaymentMethod" label="支付方式" min-width="106"></el-table-column>
                <el-table-column prop="PayId" label="支付单号" min-width="106"></el-table-column>
                <el-table-column prop="PickupDate" label="提货日期" min-width="106"></el-table-column>
                <el-table-column prop="OwnStore" label="提货门店" min-width="106"></el-table-column>
            </el-table>
            <div class="title">
                <i class="el-icon-warning"></i><span>收货人信息</span>
            </div>
            <el-table
                    :data="baseInfo"
                    height="120"
                    class="table_add"
                    border
                    stripe
                    lazy
                    show-header
                    header-row-class-name="tab_header"
            >
                <el-table-column prop="userName" label="收货人" min-width="106"></el-table-column>
                <el-table-column prop="tel" label="联系电话" min-width="106"></el-table-column>
                <el-table-column prop="address" label="收货地址" min-width="106"></el-table-column>
            </el-table>
            <div class="title">
                <i class="el-icon-warning"></i><span>商品信息</span>
            </div>
            <el-table
                    v-if=""
                    :data="info.list"
                    height="180"
                    class="table_add"
                    border
                    stripe
                    lazy
                    show-header
                    header-row-class-name="tab_header"
            >
                <el-table-column prop="StoreCode" label="商品图片" min-width="106">
                    <template slot-scope="scope">
                        <img :src="scope.row.PictureUrl" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="ProductName" label="商品名称" min-width="106"></el-table-column>
                <el-table-column prop="Price" label="价格" min-width="106"></el-table-column>
                <el-table-column prop="specification" label="规格" min-width="106"></el-table-column>
                <el-table-column prop="num" label="数量" min-width="106"></el-table-column>
                <el-table-column  label="小计" min-width="106">
                    <template slot-scope="scope">
                        <span>{{scope.row.Price*scope.row.num}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="title">
                <i class="el-icon-warning"></i><span>费用信息</span>
            </div>
            <el-table
                    :data="fee"
                    height="120"
                    class="table_add"
                    border
                    stripe
                    lazy
                    show-header
                    header-row-class-name="tab_header"
            >
                <el-table-column prop="total" label="商品合计" min-width="106"></el-table-column>
                <el-table-column prop="preferential" label="活动优惠" min-width="106"></el-table-column>
                <el-table-column prop="total" label="订单总金额" min-width="106"></el-table-column>
                <el-table-column prop="total" label="应付款总金额" min-width="106"></el-table-column>
            </el-table>
        </el-dialog>
        <!--备注-->
        <el-dialog
                class="detail_dialog d2"
                title="备注详情"
                :visible.sync="remarkVisible"
                width="30%">
            <p style="font-size: 16px;margin-bottom: 20px">订单编号: <span>{{info.OrderId}}</span></p>
            <el-table
                    :data="context"
                    height="500"
                    class="table_add"
                    border
                    stripe
                    lazy
                    show-header
                    :before-close="handleClose"
                    header-row-class-name="tab_header"
            >
                <el-table-column prop="total" label="序号" min-width="106">
                    <template class="set" slot-scope="scope">
                        <span v-html="scope.$index+1"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="context" label="备注内容" min-width="106"></el-table-column>
                <el-table-column prop="user" label="创建人" min-width="106"></el-table-column>
                <el-table-column prop="time" label="创建时间" min-width="106"></el-table-column>
                <el-table-column prop="total" label="客户可见" min-width="50">
                    <template class="set" slot-scope="scope">
                        <el-switch
                                v-model="scope.row.look"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="total" label="操作" min-width="50">
                    <template class="set" slot-scope="scope">
                        <el-button @click="edit(scope.$index)"  icon="el-icon-tickets" type="text">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!--edit-->
        <el-dialog
                class="detail_dialog edit"
                title="备注详情"
                :visible.sync="editVisible"
                width="30%">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="活动形式" prop="desc">
                    <el-input resize="none"  autosize type="textarea" v-model="ruleForm.desc"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-check" size="small" type="primary" @click="submitForm('ruleForm')">确定</el-button>
                    <el-button icon="el-icon-close" plain size="small">取消</el-button>
                </el-form-item>
            </el-form>

        </el-dialog>
    </div>
</template>

<script>
    /*导出表格需要*/
    import FileSaver from 'file-saver';
    import XLSX from 'xlsx';

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
                selIndex:1, // 顶部选中
                DeliveryMethod:'全部',// 配送方式
                startTime:'',// 收货时间 开始时间
                endTime:'',// 收货时间 开始时间
                PendingPayment:0, //待付款
                todayOrder:[], // 当日订单
                toBeDelivered:0, // 待发货
                ToBeReceived:0, // 待收货
                completed:0, // 已完成
                PendingRefund:0, // 待退款
                refunded:0,// 已退款
                selText:'', // 相对index的文字
                OrderId:'', // 订单编号
                ProductNumber:'',// 商品编号
                OwnStore:'', // 所属门店
                MemberAccount:'',// 会员账号
                consignee:'',// 收货人
                startTimeMs:'',
                endTimeMs:'',
                dialogVisible: false,
                active:0,// 步骤条
                baseInfo:[],//基本信息
                info:{},
                fee:[],
                remarkVisible: false,
                context:[],
                editVisible:false,
                ruleForm: {
                    desc: ''
                },
                rules: {
                    desc: [
                        {
                            required: true, message: '请填写', trigger: 'blur'
                        }
                    ]
                },
                editIndex:'',
                selTabArr:'',
                excelData:[]
            };
        },
        methods: {
            getData(){
                this.$api.getOrderList().then(res=>{
                    this.baseData = JSON.parse(JSON.stringify(res.data.result.list));
                    // this.tableData = JSON.parse(JSON.stringify(res.data.result.list));
                    this.todayOrder = this.baseData.filter((item,index)=>{
                        return item.OrderTime.includes(this.dateFormat("YYYY-mm-dd", new Date()))
                    })
                    // 待付款
                    this.getSortLength('PendingPayment', '待付款')
                    this.getSortLength('toBeDelivered', '待发货')
                    this.getSortLength('ToBeReceived', '待收货')
                    this.getSortLength('completed', '已')
                    this.getSortLength('PendingRefund', '待退款')
                    this.getSortLength('refunded', '已退款')
                    this.tableData = this.todayOrder
                })
            }, // 获取数据
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
                this.selTabArr = val;
            },
            changeSelIndex(index){
                this.selIndex = index
                switch (index) {
                    case 1:
                        this.selText = ''
                        break;
                        case 2:
                            this.selText = '待付款'
                            break;
                    case 3:
                        this.selText = '待发货'
                        break;
                    case 4:
                        this.selText = '待收货'
                        break;
                    case 5:
                        this.selText = '已'
                        break;
                        case 6:
                        this.selText = '待退款'
                        break;case 7:
                        this.selText = '已退款'
                        break;
                }
                if (this.DeliveryMethod==='全部'){
                    if (this.selIndex === 1){
                        this.tableData = this.todayOrder
                    }else {
                        this.getSortLength('tableData', this.selText )
                    }
                }else {
                    if (this.selIndex === 1){
                        this.tableData = this.todayOrder.filter((item,index)=>{
                            return item.DeliveryMethod.includes(this.DeliveryMethod)
                        })
                    }else {
                        this.multiCondition('OrderStatus', this.selText,'DeliveryMethod',this.DeliveryMethod)
                    }
                }
            }, // 切换选中
            dateFormat(fmt, date) {
                let ret;
                const opt = {
                    "Y+": date.getFullYear().toString(),        // 年
                    "m+": (date.getMonth() + 1).toString(),     // 月
                    "d+": date.getDate().toString(),            // 日
                    "H+": date.getHours().toString(),           // 时
                    "M+": date.getMinutes().toString(),         // 分
                    "S+": date.getSeconds().toString()          // 秒
                    // 有其他格式化字符需求可以继续添加，必须转化成字符串
                };
                for (let k in opt) {
                    ret = new RegExp("(" + k + ")").exec(fmt);
                    if (ret) {
                        fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
                    }
                }
                return fmt;
            }, // 格式化时间
            getSortLength(arr,str,name='',when='OrderStatus'){
                 if (name.length===0){
                     this[arr] = this.baseData.filter((item, index) => {
                         return item[when].includes(str)
                     })
                 }else {
                     this[arr] = this.baseData.filter((item, index) => {
                         return item[name].includes(str)
                     })
                 }
            }, // 获取长度
            deliveryMethodChange(){
                if (this.selIndex===1){
                    if (this.DeliveryMethod==='全部'){
                        this.getSortLength('tableData', this.selText)
                    }else {
                        this.getSortLength('tableData', this.DeliveryMethod,'DeliveryMethod')
                    }
                }else {
                    if (this.DeliveryMethod === '全部') {
                        this.getSortLength('tableData', this.selText)
                    } else {
                        this.multiCondition('OrderStatus', this.selText, 'DeliveryMethod', this.DeliveryMethod)
                    }
                }
            },
            multiCondition(name1, while1, name2, while2){
                this.tableData = this.baseData.filter((item,index)=>{
                    return item[name1].includes(while1) && item[name2].includes(while2)
                })
            }, // 多条件搜索
            resetFilter(){
                this.OrderId='' // 订单编号
                this.ProductNumber=''// 商品编号
                this.OwnStore='' // 所属门店
                this.MemberAccount=''
                this.consignee=''// 收货人
                this.endTime = ''
                this.startTime = ''
                this.startTimeMs = ''
                this.endTimeMs = ''
            },// 重置
            goSearch(){
                if (this.OrderId|| this.ProductNumber|| this.OwnStore|| this.MemberAccount|| this.consignee|| this.startTime|| this.endTime){
                    if (this.OrderId){
                        this.searchWhile('OrderId', this.OrderId )
                    }
                    if (this.ProductNumber){
                        this.searchWhile('ProductNumber', this.ProductNumber)
                    }
                    if (this.OwnStore){
                        this.searchWhile('OwnStore', this.OwnStore)
                    }
                    if (this.MemberAccount){
                        this.searchWhile('MemberAccount', this.MemberAccount)
                    }
                     if (this.consignee){
                        this.searchWhile('consignee', this.consignee)
                    }
                     if (this.endTime&&!this.startTime){
                         this.tableData = this.tableData.filter((item,index)=>{
                             return this.getMs(item.OrderTime) < this.getMs(this.endTime)
                         })
                     }
                     if (!this.endTime && this.startTime){
                         this.tableData = this.tableData.filter((item, index) => {
                             return this.getMs(item.OrderTime) > this.getMs(this.startTime)
                         })
                     }
                     if (this.endTime && this.startTime){
                         this.tableData = this.tableData.filter((item, index) => {
                             return this.getMs(item.OrderTime) < this.getMs(this.startTime)&& this.getMs(item.OrderTime) > this.getMs(this.endTime)
                         })
                     }
                }
            },
            searchWhile(name,wheen){
                this.tableData = this.tableData.filter((item,index)=>{
                    return item[name].includes(wheen)
                })
            },// 搜索条件
            timeChange(type){
                if (type===1){
                    this.startTimeMs = this.getMs(this.startTime)
                }
                if (type===2){
                    this.endTimeMs = this.getMs(this.endTime)
                    if (this.startTimeMs> this.endTimeMs){
                        this.$message.error('截止时间不能大于开始时间')
                        this.endTime=''
                    }
                }

            },
            getMs(date){
                return new Date(date).getTime()
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                        .then(_ => {
                            done();
                        })
                        .catch(_ => {
                        });
            },
            findDetail(data){
                this.dialogVisible = true
                if (data.OrderStatus.includes('已')){
                    this.active=0
                }
                if (data.OrderStatus.includes('待发货')) {
                    this.active = 2
                }
                if (data.OrderStatus.includes('待收货')) {
                    this.active = 3
                }
                this.baseInfo.push(data)
                this.info=data
                let total = 0
                this.info.list.forEach((item,index)=>{
                    total += item.Price*item.num
                })
                this.fee = [
                    {
                        total: total,
                        preferential:0
                    }
                ]
            },
            getContext(){
                this.remarkVisible = true;
                this.$api.getOrderContext().then(res=>{
                    this.context = JSON.parse(JSON.stringify(res.data.result.list));
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.context[this.editIndex].context = this.ruleForm.desc
                        this.$message.success('修改成功')
                        this.editVisible = false
                        this.ruleForm.desc = ''
                    } else {
                        return false;
                    }
                });
            },
            edit(index){
                this.editVisible = true
                this.editIndex = index
            },
            // 导出表格
            exportExcel() {
               this.excelData = this.selTabArr
                this.$nextTick(()=>{

                    let wb = XLSX.utils.table_to_book(document.querySelector('#el-table'));
                    let wbout = XLSX.write(wb, {
                        bookType: 'xlsx',
                        bookSST: true,
                        type: 'array'
                    });

                    try {
                        FileSaver.saveAs(
                                new Blob([wbout], {type: 'application/octet-stream'}),
                                `order ${this.dateFormat("YYYY-mm-dd HH:MM:ss", new Date())}.xlsx` // 文件名
                        );
                    } catch (e) {
                        if (typeof console !== 'undefined') {
                            this.$message.error('导出失败');
                            console.log(e, wbout);
                        }
                    }
                    return wbout;
                })
            }
        },
        created() {
            this.getData()
        },
        mounted() {
        }
    };
</script>

<style scoped  lang="less">
    @deep: ~">>>";
.OrderList{
    height: inherit;

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
                height: 3px;
                background-color: #80a0f8;
                transition: all 0.2s linear;
            }
        }
    }
    .main{
        height: 90%;
        .DeliveryMethod{
            margin-bottom: 20px;
            span{
                margin-right: 10px;
            }
        }

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

            .label {
                display: flex;
                align-items: center;
                margin-right: 20px;

                span {
                    flex-shrink: 0;
                    width: 64px;
                    text-align: right;
                    white-space: nowrap;
                    margin-right: 10px;
                    margin-left: 0 !important;
                }

                @{deep} input {
                    width: 200px;
                }
            }
        }
        .putshelf {
            margin-bottom: 20px;
        }
        p.export{
            margin-bottom: 20px;
        }
    }
    .look{
        color: #3F78F6;
    }

    ::v-deep .detail_dialog {
        .el-dialog {
            width: 1183px !important;
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
                padding: 20px 120px;

                .step{
                    .el-step__head.is-process, .el-step__title.is-process{
                        color: #3f78f6;
                    }
                }
                .now{
                    margin-top: 40px;
                    display: flex;
                    align-items: center;
                    .status{
                        color: #FFFFFF;
                        font-size: 16px;
                        background-color: #3f78f6;
                        padding: 10px;
                        border-top-right-radius: 20px;
                        border-bottom-right-radius: 20px;
                        span{
                            margin-right: 5px;
                        }

                    }
                    .el-button{
                        margin-left: 20px;
                    }
                }
                .title{
                    margin: 20px 0 10px 0;
                    font-size: 16px;
                    i{
                        color: #3f78f6;
                        margin-right: 10px;
                    }
                }

                .table_add {
                    width: 100%;
                    border-radius: 12px;
                    overflow:hidden;
                    .has-gutter th{
                        background-color: #EAEDF4;
                    }
                }
            }
        }
    }

    ::v-deep  .d2{
        height: inherit;
    }

    ::v-deep .detail_dialog.edit{
        .el-dialog{
            width: 670px !important;
            height: 325px;
            .el-textarea__inner{
                display: inline-block;
                height:150px !important;
            }
        }

    }
    #el-table{
        display: none;
    }
}
</style>