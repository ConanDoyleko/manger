<template>
    <div class="Reimburse">
        <header class="header">
            <ul class="countlist">
                <li @click="changeShelf(1)" :class="selIndex === 1 ? 'active' : ''">
                    全部申请(<span>{{ total }}</span
                    >)
                </li>
                <li @click="changeShelf(2)" :class="selIndex === 2 ? 'active' : ''">
                    待处理(<span>{{ pending }}</span
                    >)
                </li>
                <li @click="changeShelf(3)" :class="selIndex === 3 ? 'active' : ''">
                    已处理(<span>{{ processed }}</span
                    >)
                </li>
                <li @click="changeShelf(4)" :class="selIndex === 4 ? 'active' : ''">
                    已拒绝(<span>{{ rejected }}</span
                    >)
                </li>
            </ul>
        </header>
        <div class="main">
            <div class="filter">
                <div class="left">
                    <label>
                        <span>输入搜索</span>
                        <el-input v-model="condition"></el-input>
                    </label>
                    <label>
                        <div class="block">
                            <span class="demonstration">申请时间</span>
                                <el-date-picker
                                        v-model="appplyTime"
                                        type="date"
                                        placeholder="选择日期">
                                </el-date-picker>
                        </div>
                    </label>
                    <label>
                        <span>处理状态</span>
                        <el-select @change="selChange()" v-model="select">
                            <el-option value="全部"></el-option>
                            <el-option value="待处理"></el-option>
                            <el-option value="已处理"></el-option>
                            <el-option value="已拒绝"></el-option>
                        </el-select>
                    </label>
                </div>
                <div class="right">
                    <el-button class="btn" type="text">重置筛选条件</el-button>
                    <el-button @click="goSearch()" class="search" type="primary" icon="el-icon-search">搜索 </el-button>
                </div>
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
                <el-table-column label="退款单号" prop="RefundId" min-width="100px"></el-table-column>

                <el-table-column label="申请时间" prop="ApplyTime" min-width="100px"></el-table-column>

                <el-table-column label="用户账号" prop="MemberAccount" min-width="100px"></el-table-column>
                <el-table-column label="退款金额" prop="OrderTotal" min-width="100px"></el-table-column>

                <el-table-column label="申请状态" min-width="100px">
                    <template class="set" slot-scope="scope">
                        <span v-if="scope.row.OrderStatus==='待处理'" style="color: #ff0036">{{ scope.row.OrderStatus }}</span>
                        <span v-else-if="scope.row.OrderStatus==='已处理'"
                              style="color: #67C23A">{{ scope.row.OrderStatus }}</span>
                        <span v-else>{{ scope.row.OrderStatus }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="处理时间" prop="ProcessingTime" min-width="100px"></el-table-column>
                <el-table-column label="操作" min-width="100px" >
                    <template slot-scope="scope">
                        <i @click="lookDetail(scope.row)" class="el-icon-search look"></i>
                        <span @click="lookDetail(scope.row,scope.row.RefundId)" class="look" style="margin-left: 5px;cursor: pointer">查看订单</span>
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
            <el-dialog
                class="order_detail"
                title="服务单详情"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose"
            >
                <ul class="orderInfo">
                    <li>
                        <div class="name">
                            退款单号:
                        </div>
                        <div class="value">
                            {{ orderDetail.RefundId }}
                        </div>
                    </li>
                    <li>
                        <div class="name">
                            申请状态:
                        </div>
                        <div class="value">
                            <span v-if="orderDetail.OrderStatus==='待处理'" style="color: #ff0036">{{ orderDetail.OrderStatus }}</span>
                            <span v-else-if="orderDetail.OrderStatus==='已处理'"
                                  style="color: #67C23A">{{ orderDetail.OrderStatus }}</span>
                            <span v-else>{{ orderDetail.OrderStatus }}</span>
                        </div>
                    </li>
                    <li>
                        <div class="name">
                            订单编号:
                        </div>
                        <div class="value">
                            {{ orderDetail.OrderNumber }}
                        </div>
                    </li>
                    <li>
                        <div class="name">
                            申请时间:
                        </div>
                        <div class="value">
                            {{ orderDetail.ApplyTime }}
                        </div>
                    </li>
                    <li>
                        <div class="name">
                            用户帐号:
                        </div>
                        <div class="value">
                            {{ orderDetail.MemberAccount }}
                        </div>
                    </li>
                </ul>
                <ul class="money">
                    <li>
                        <div class="name">
                            订单金额:
                        </div>
                        <div class="value">
                            {{ orderDetail.OrderTotal }}
                        </div>
                    </li>
                    <li>
                        <div class="name">
                            确认退款金额:
                        </div>
                        <div class="value">
                            {{ orderDetail.OrderTotal }}
                        </div>
                    </li>
                    <li>
                        <div class="name">
                            退款方式:
                        </div>
                        <div class="value">
                            返回到原支付频道
                        </div>
                    </li>
                    <li>
                        <div class="name">
                            退款类型:
                        </div>
                        <div class="value">
                            {{ orderDetail.RefundType }}
                        </div>
                    </li>
                    <li>
                        <div class="name">
                            退款原因:
                        </div>
                        <div class="value">
                            原因描述
                        </div>
                    </li>
                    <li>
                        <div class="name">
                            处理备注:
                        </div>
                        <div class="value">
                            <el-input v-model="orderDetail.detail" placeholder="请输入内容"></el-input>
                        </div>
                    </li>
                </ul>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="orderOk()">确认退款</el-button>
                    <el-button  @click="orderNo()">拒绝退款</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import Mock from 'mockjs'
export default {
    data() {
        return {
            /**
             * 顶部选中状态 处理未处理
             * */
            selIndex: 1,
            total: 0,
            pending: 0,
            processed: 0,
            rejected: 0,
            /**
             * 表格数据 分页条件
             * */
            tableData: [],
            baseData: [],
            currentPage: 1,
            pagesize: 5,
            /**
             * 搜索条件
             * */
            select: "全部",
            condition: "",
            appplyTime: null,
            dialogVisible: false,
            orderDetail: {
                RefundId: "",
                OrderStatus: "",
                OrderNumber: "",
                ApplyTime: "",
                MemberAccount: "",
                OwnStore: "",
                ProcessingNotes: "",
                RefundType: "",
                OrderTotal: "",
                detail: "",
            },
        };
    },
    props: {},
    methods: {
        /**
         * 切换显示状态 num:1 全部申请 :2待处理 :3已处理 :4已拒绝
         * @param num
         */
        changeShelf(num) {
            this.selIndex = num;
            switch (num) {
                case 1:
                    this.tableData = this.baseData;
                    break;
                case 2:
                    this.tableData = this.stateFun("待处理", true);
                    break;
                case 3:
                    this.tableData = this.stateFun("已处理", true);
                    break;
                case 4:
                    this.tableData = this.stateFun("已拒绝", true);
                    break;
            }
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
        /**
         * 处理状态
         */
        orderState() {
            this.total = this.tableData.length;
            this.pending = this.stateFun("待处理").length;
            this.processed = this.stateFun("已处理").length;
            this.rejected = this.stateFun("已拒绝").length;
        },
        /***
         * 处理状态辅助函数
         * @param name
         * @param arr
         * @returns {*[]}
         */
        stateFun(name, arr) {
            if (arr) {
                return this.baseData.filter((item, index) => {
                    return item.OrderStatus === name;
                });
            } else {
                return this.tableData.filter((item, index) => {
                    return item.OrderStatus === name;
                });
            }
        },
        /**
         * 下拉选择
         */
        selChange() {
            this.condition= ''
            switch (this.select) {
                case "全部":
                    this.tableData = this.baseData;
                    break;
                case "待处理":
                    this.tableData = this.stateFun("待处理", true);
                    break;
                case "已处理":
                    this.tableData = this.stateFun("已处理", true);
                    break;
                case "已拒绝":
                    this.tableData = this.stateFun("已拒绝", true);
                    break;
            }
        },
        goSearch() {
            if (this.condition) {
                this.tableData = this.baseData.filter((item, index) => {
                   return  JSON.stringify(item).includes(this.condition)
                });
            }
            if (this.appplyTime) {
              let time =  new Date(this.appplyTime).getTime()
                this.tableData = this.baseData.filter((item,index)=>{
                    return new Date(item.ApplyTime).getTime()<=time
                })
            }
        },
        handleClose(done) {
            this.$confirm("确认关闭？")
                .then((_) => {
                    done();
                })
                .catch((_) => {});
        },
        /**
         *
         * @param obj
         * @param id
         */
        lookDetail(obj,id){
            Object.assign(this.orderDetail,obj)
            this.dialogVisible =true
        },
        /**
         *
         */
        orderOk(){
            this.serve(this.tableData,'已处理')
            this.serve(this.baseData, '已处理')
            this.dialogVisible = false
        },
        /**
         *
         * @param arr
         * @param type
         */
        serve(arr,type='已拒绝'){
            arr.forEach((item, index) => {
                if (item.RefundId === this.orderDetail.RefundId) {
                    console.log(index)
                    arr[index] = this.orderDetail
                    arr[index].OrderStatus = type
                    arr[index].ProcessingTime = this.dateFormat("YYYY-mm-dd HH:MM:SS", new Date())
                    // Ranndom.now(format)
                }
            })
            this.orderDetail={}
        },
        orderNo(){
            this.serve(this.tableData, '已拒绝')
            this.serve(this.baseData, '已拒绝')
            this.dialogVisible = false
        },
       dateFormat(fmt, date){
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
    }
    },
    created() {
        this.$api.getOrderRefused().then((res) => {
            console.log(res.data.result.list);
            this.baseData = JSON.parse(JSON.stringify(res.data.result.list));
            this.tableData = JSON.parse(JSON.stringify(res.data.result.list));
            this.orderState();
        });
    },
    mounted() {},
};
</script>

<style scoped lang="less">
.Reimburse {
    height: inherit;
    .look {
        color: #3f78f6;
    }
    ::v-deep.el-table__body-wrapper::-webkit-scrollbar {
        display: none;
    }

    ::v-deep .order_detail {
        .el-dialog {
            width: 580px !important;
            border-radius: 12px;
            overflow: hidden;
            .el-dialog__header {
                position: relative;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 18px;
                width: 100%;
                background-color: #3f78f6;
                span {
                    color: #ffffff;
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
                padding: 25px 50px;
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
}
</style>
