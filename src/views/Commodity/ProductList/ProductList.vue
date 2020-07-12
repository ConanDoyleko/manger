<template>
    <div class="ProductList">
        <!--头-->
        <header v-if="tableData" class="header">
            <ul class="countlist">
                <li @click="changeShelf(1)" :class="selIndex === 1 ? 'active' : ''">
                    已上线(<span>{{ added }}</span
                    >)
                </li>
                <li @click="changeShelf(2)" :class="selIndex === 2 ? 'active' : ''">
                    未上线(<span>{{ noAdd }}</span
                    >)
                </li>
            </ul>
        </header>
        <div class="main">
            <div class="filter">
                <div class="left">
                    <label class="label">
                        <span>商品名称</span>
                        <el-input v-model="ProductName" placeholder="商品名称"></el-input>
                    </label>
                    <label class="label">
                        <span>商品编码</span>
                        <el-input v-model="ProductCode" placeholder="商品编码"></el-input>
                    </label>
                    <label class="label">
                        <span>条形码(SKU)</span>
                        <el-input v-model="BarCode" placeholder="条形码"></el-input>
                    </label>
                    <label class="label">
                        <span>所属分类</span>
                        <el-input v-model="category" placeholder="所属分类"></el-input>
                    </label>
                </div>
                <div class="right">
                    <el-button @click="resetFilter()" class="btn" type="text">重置筛选条件</el-button>
                    <el-button @click="goSearch()" class="search" type="primary" icon="el-icon-search">搜索 </el-button>
                </div>
            </div>
            <div class="putshelf">
                <el-button size="small" @click="changeOnShelf(true)" type="primary" icon="el-icon-upload2"
                    >批量启用</el-button
                >
                <el-button size="small" @click="changeOnShelf(false)" type="primary" icon="el-icon-download"
                    >批量禁用</el-button
                >
                <el-button size="small" @click="changeOnShelf('del')" type="danger" icon="el-icon-delete-solid"
                    >批量删除</el-button
                >
                <el-button size="small" @click="openSetStock" type="primary" icon="el-icon-setting"
                    >统一设置门店库存</el-button
                >
            </div>
            <el-table
                v-if="tableData"
                @selection-change="handleSelectionChange"
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
            >
                <el-table-column align="center" type="selection" width="55"></el-table-column>
                <el-table-column label="商品图片" width="80">
                    <template slot-scope="scope">
                        <img :src="scope.row.PictureUrl" alt="" />
                    </template>
                </el-table-column>
                <el-table-column prop="ProductName" label="商品名称" width="180"></el-table-column>
                <el-table-column class-name="price" prop="price" label="价格" min-width="150">
                    <template class="set" slot-scope="scope">
                        <el-input
                            @blur="onBlur(scope.row.ProductId)"
                            @clear="inputOne(scope.row.ProductId)"
                            @focus="inputOne(scope.row.ProductId)"
                            :style="{ width: scope.row.set ? '' : '70%' }"
                            class="el_input"
                            :clearable="scope.row.set ? true : false"
                            v-model.number="scope.row.Price"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-currency"></i>
                            <template slot="append">
                                <el-button
                                    @click="setOk(scope.row.ProductId, scope.row.Price, 'Price')"
                                    v-if="scope.row.set"
                                    ><i class="el-icon-check"></i
                                ></el-button>
                            </template>
                        </el-input>
                        <i
                            @click.stop="reset(scope.row.ProductId, 'Price')"
                            v-if="scope.row.set"
                            class="el-icon-refresh-left reset"
                        ></i>
                    </template>
                </el-table-column>
                <el-table-column prop="mounthSell" label="月售(份)" width="90"></el-table-column>
                <el-table-column prop="category" label="所属分类" min-width="200"></el-table-column>
                <el-table-column prop="BarCode" label="条形码(SKU)" min-width="120"></el-table-column>
                <el-table-column prop="ProductCode" label="商品编码" min-width="120"></el-table-column>
                <el-table-column align="center" prop="StroreCode" label="是否启用">
                    <template slot-scope="scope">
                        <el-switch
                            @change="changeState(scope.row.ProductId, scope.row.Enable)"
                            v-model="scope.row.Enable"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column min-width="164" label="操作">
                    <template slot-scope="scope">
                        <span @click="edit(scope.row.ProductCode)" class="edit"><i class="el-icon-edit-outline"></i>编辑</span>
                        <span @click="delItem(scope.row.ProductId)" class="del"
                            ><i class="el-icon-delete"></i>删除</span
                        >
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
        <!--修改库存-->
        <el-dialog
            v-if="tableData"
            class="stock"
            title="批量设置库存"
            :visible.sync="stockDialogVisible"
            width="30%"
            :before-close="handleClose"
        >
            <div class="stock_body">
                <div class="item">
                    <span>已选商品</span>
                    <span>{{ selLength }}个</span>
                </div>
                <div class="item">
                    <span>商品库存</span>
                    <el-radio-group v-model="stockRadio">
                        <ul>
                            <li>
                                <el-radio :label="0">库存清零:&emsp;&emsp;0</el-radio>
                            </li>
                            <li>
                                <el-radio :label="99999">库存置满:&emsp;&emsp;99999</el-radio>
                            </li>
                            <li>
                                <el-radio :label="'customize'">自定义数量</el-radio>
                            </li>
                            <li>
                                <div :class="inputFocus ? 'active' : ''" class="counter">
                                    <button :disabled="stockNum <= 0 ? 'disabled' : false" @click="stockNum--">
                                        -
                                    </button>
                                    <input
                                        @blur="inputFocus = false"
                                        @input="stockInput()"
                                        @focus="inputFocus = true"
                                        v-model.number="stockNum"
                                        type="number"
                                    />
                                    <button :disabled="stockNum >= 999999 ? 'disabled' : false" @click="stockNum++">
                                        +
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </el-radio-group>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="stockDialogVisible = false" icon="el-icon-close">取 消</el-button>
                <el-button type="primary" @click="setStock()" icon="el-icon-check">确 定</el-button>
            </span>
        </el-dialog>
        <!--删除-->
        <el-dialog class="del" title="提示" :visible.sync="delVisable" width="30%">
            <img src="../../../assets/images/del.png" alt="" />
            <p>您是否要删除该商品</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delCancle()">取 消</el-button>
                <el-button type="primary" @click="confirmOk()">确 定</el-button>
            </span>
        </el-dialog>
        <!--添加所属分类-->
        <el-dialog
            class="stock edit"
            title="添加所属分类"
            :visible.sync="editVisible"
            width="30%"
            :before-close="handleClose"
        >
            <el-cascader clearable filterable ref="level" @change="levelChange()" v-model="level" :options="options"></el-cascader>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false" icon="el-icon-close">取 消</el-button>
                <el-button type="primary" @click="setEdit()" icon="el-icon-check">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            /**
             * 顶部上架
             * selIndex 选中 added 已上架数量 noAdd 未上架数量 sold 已售空
             * */
            selIndex: 1,
            added: [],
            noAdd: [],
            /**
             * 表格数据    选中multipleSelection
             * */
            tableData: [],
            baseData: [],
            multipleSelection: [],
            currentPage: 1,
            pagesize: 5,
            /**
             * ProductName 商品名  code 商品编码  BarCode 条形码  sort 所属分类
             * */
            ProductName: "",
            ProductCode: "",
            BarCode: "",
            category: "",
            /**
             * stockDialogVisible 批量库存
             * */
            stockDialogVisible: false,
            stockRadio: 0,
            stockNum: 1,
            inputFocus: false,
            selTabArr: [],
            selLength: "",
            selJson: "",
            /*
             * 删除对话框
             * */
            delVisable: false,
            delItemId: "",
            editVisible: false,
            options: [],
            level:'',
            selLevel:'',
            Code:'',
            sort:"",
        };
    },
    methods: {
        /**
         * 获取表格数据
         * @returns {Promise<void>}
         */
        async getData() {
            let res = (await this.$api.getPlatformList()).data.result;
            // this.tableData = await JSON.parse(JSON.stringify(res.list));
            this.baseData = await JSON.parse(JSON.stringify(res.list));
            this.tableData = this.baseData.filter((item) => {
                return item.Enable;
            });
            this.calc();
        },
        /**
         * 切换 展示数据
         * @param index
         */
        changeShelf(index) {
            this.selIndex = index;
            this.tableData = [];
            switch (this.selIndex) {
                case 1:
                    this.tableData = this.baseData.filter((item) => {
                        return item.Enable === true;
                    });
                    break;
                case 2:
                    this.tableData = this.baseData.filter((item) => {
                        return item.Enable === false;
                    });
                    break;
            }
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
            // this.selLength= JSON.parse(JSON.stringify(val))
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
         * 计算 上线 未上线
         */
        calc() {
            this.added = this.baseData.filter((item) => {
                return item.Enable;
            }).length;
            this.noAdd = this.baseData.filter((item) => {
                return !item.Enable;
            }).length;
        },
        goSearch() {
            if (this.ProductName || this.ProductCode || this.BarCode || this.category) {
                if (this.ProductName) {
                    this.search("ProductName");
                }
                if (this.ProductCode) {
                    this.search("ProductCode");
                }
                if (this.BarCode) {
                    this.search("BarCode");
                }
                if (this.category) {
                    this.search("category");
                }
            } else {
                this.$message({
                    type: "error",
                    message: "请输入搜索条件",
                });
            }
        },
        /**
         * 条件搜索 辅助函数
         * @param name
         * @param arr
         */
        search(name, arr) {
            this.tableData = this.tableData.filter((item, index) => {
                return item[name].includes(this[name]);
            });
        },
        clear() {
            this.ProductName = "";
            this.ProductCode = "";
            this.BarCode = "";
            this.category = "";
            this.tableData = this.baseData.filter((item) => {
                return item.Enable;
            });
        },
        changeOnShelf(boolean) {
            let str = "";
            if (boolean === true) {
                str = "上线";
            } else if (boolean === false) {
                str = "下线";
            } else {
                str = "删除";
            }
            if (this.selTabArr.length !== 0) {
                this.$confirm(`确认${str}选中商品`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "error",
                })
                    .then(() => {
                        if (boolean === "del") {
                            this.selTabArr.forEach((item, index) => {
                                this.tableData.forEach((val, key) => {
                                    if (item.ProductId === val.ProductId) {
                                        this.tableData.splice(key, 1);
                                    }
                                });
                                this.baseData.forEach((val, key) => {
                                    if (item.ProductId === val.ProductId) {
                                        this.baseData.splice(key, 1);
                                    }
                                });
                            });
                        } else {
                            this.selTabArr.forEach((item, index) => {
                                this.tableData.forEach((val, key) => {
                                    if (item.ProductId === val.ProductId) {
                                        this.tableData[key].Enable = boolean;
                                    }
                                });
                                this.baseData.forEach((val, key) => {
                                    if (item.ProductId === val.ProductId) {
                                        this.baseData[key].Enable = boolean;
                                    }
                                });
                            });
                        }
                        this.calc();
                        this.$message({
                            type: "success",
                            message: `${str}成功`,
                        });
                    })
                    .catch(() => {
                        this.$refs.multipleTable.clearSelection();
                        this.$message({
                            type: "info",
                            message: "已取消" + str,
                        });
                    });
            } else {
                this.$alert("请先选择需要" + str + "的商品", `${str}商品`, {
                    confirmButtonText: "确定",
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
                .catch((_) => {});
        },
        /**
         *
         * @param value
         */
        handleChange(value) {
            console.log(value);
        },
        /**
         * 监听 stockInput 输入值
         */
        stockInput() {
            if (this.stockNum <= 0) {
                this.stockNum = 0;
            } else if (this.stockNum >= 999999) {
                this.stockNum = 999999;
            }
        },
        /**
         * 设置库存
         */
        setStock() {
            if (/\d+/.test(this.stockRadio)) {
                this.changeStockNum(this.stockRadio);
            } else {
                //    stockNum
                this.changeStockNum(this.stockNum);
            }

            this.stockDialogVisible = false;
            this.$message({
                message: "恭喜你，修改成功",
                type: "success",
            });
        },
        /**
         * 打开库存对话框
         */
        openSetStock() {
            this.multipleSelection = this.selTabArr;
            this.selLength = this.selTabArr.length;
            if (this.selTabArr.length !== 0) {
                this.stockDialogVisible = true;
            } else {
                this.$alert("请选择需要修改的项");
            }
        },
        /**
         *
         * @param num
         */
        changeStockNum(num) {
            this.multipleSelection.forEach((item, index) => {
                this.tableData.forEach((val, key) => {
                    if (item.ProductId === val.ProductId) {
                        this.tableData[key].PromotionStock = num;
                    }
                });
                this.baseData.forEach((val, key) => {
                    if (item.ProductId === val.ProductId) {
                        this.baseData[key].PromotionStock = num;
                    }
                });
            });
        },
        /**
         * 设置删除id 并打开对话框
         * @param id
         */
        delItem(id) {
            this.delVisable = true;
            this.delItemId = id;
        },
        /**
         * 确认删除
         */
        confirmOk() {
            this.tableData.forEach((item, index) => {
                if (item.ProductId === this.delItemId) {
                    this.tableData.splice(index, 1);
                }
            });
            this.baseData.forEach((item, index) => {
                if (item.ProductId === this.delItemId) {
                    this.baseData.splice(index, 1);
                }
            });
            this.delVisable = false;
            this.calc();
            this.$message({
                message: "恭喜你，删除成功",
                type: "success",
            });
        },
        /**
         * 取消删除
         */
        delCancle() {
            this.delVisable = false;
            this.$message({
                message: "已取消",
                type: "info",
            });
        },
        /**
         *
         * @param id
         * @param val
         */
        changeState(id, val) {
            console.log(id, val);
            this.$confirm("确认?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.baseData.forEach((item, index) => {
                        if (item.ProductId === id) {
                            item.Enable = val;
                        }
                    });
                    this.$message({
                        type: "success",
                        message: "修改成功!",
                    });
                })
                .catch(() => {
                    this.tableData.forEach((item, index) => {
                        if (item.ProductId === id) {
                            item.Enable = !val;
                        }
                    });
                    this.$message({
                        type: "info",
                        message: "已取消",
                    });
                });
        },
        reset(id, data) {
            this.tableData.forEach((val, key) => {
                if (id === val.ProductId) {
                    this.baseData.forEach((item, index) => {
                        if (id === item.ProductId) {
                            this.tableData[key][data] = this.baseData[index][data];
                        }
                    });
                }
            });
            this.$message({
                type: "success",
                message: `撤回成功`,
            });
        },
        inputOne(id) {
            this.tableData.forEach((item, index) => {
                if (id === item.ProductId) {
                    item.set = true;
                }
            });
        },
        /**
         *
         * @param id
         * @param price
         */
        setOk(id, num, name) {
            if (num === "") {
                num = 0;
            }
            this.tableData.forEach((item, index) => {
                if (item.ProductId === id) {
                    item[name] === num;
                    this.baseData.forEach((val, key) => {
                        if (val.ProductId === id) {
                            this.baseData[key][name] = num;
                            this.tableData[index].set = false;
                            this.baseData[key].set = false;
                        }
                    });
                }
            });
            this.$message({
                type: "success",
                message: `修改成功`,
            });
        },
        resetFilter() {
            this.selIndex = 1;
            this.clear();
        },
        edit(ProductCode) {
            this.$api.getLevel().then(res=>{
                this.options = res.data.result.list
            })
            this.editVisible = true;
            this.Code =ProductCode
        },
        levelChange(){
            this.selLevel = ''
            this.$refs.level.getCheckedNodes()[0].pathLabels.forEach((item,index)=>{
                this.selLevel += item+' |'
            })
            this.selLevel = this.selLevel.substr(0, this.selLevel.length-1)
        },
        setEdit(){
            this.tableData.forEach((item,index)=>{
                if (item.ProductCode === this.Code){
                    this.tableData[index].category = this.selLevel
                }
            })
            this.selLevel= ''
            this.editVisible=false
        }
    },
    created() {
        this.getData();
    },
    mounted() {},
};
</script>

<style scoped lang="less">
.ProductList {
    height: inherit;
    @deep: ~">>>";
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

            .label {
                display: flex;
                align-items: center;
                margin-right: 20px;

                span {
                    white-space: nowrap;
                    margin-right: 10px;
                }

                @{deep} input {
                    width: 200px;
                }
            }
        }

        .putshelf {
            margin-bottom: 20px;
        }

        @{deep} .table {
            width: 100%;
            height: 90%;
            min-width: 1200px;
            border-top-left-radius: 12px;
            border-bottom-right-radius: 12px;
            th:nth-of-type(1) {
                .cell {
                    text-align: center;
                }
            }

            .el-table__body-wrapper {
                min-width: 1000px;
            }

            .edit,
            .del {
                cursor: pointer;
                i {
                    font-size: 16px;
                    font-weight: 700;
                    margin-right: 2px;
                }
                font-size: 16px;
                font-weight: 700;
            }

            .edit {
                color: #3f78f6;
                margin-right: 27px;
            }
            .del {
                color: #ff5756;
            }
        }
        .el-table {
            overflow-y: scroll;
        }

        .el-table::-webkit-scrollbar {
            display: none;
        }

        ::v-deep .table .has-gutter .tab_header th {
            background-color: #eaedf4 !important;
            border: 0;
            color: #000000;
        }

        ::v-deep .table .has-gutter .tab_header th {
            background-color: #eaedf4 !important;
            border: 0;
            color: #000000;
        }

        ::v-deep .table .price .cell {
            display: flex;
            align-items: center;

            .reset {
                font-size: 20px;
                color: #3f78f6;
                font-weight: 900;
                margin-left: 10px;
            }
        }

        ::v-deep .table .price .cell {
            .reset:hover {
                color: #ff0036;
            }
        }

        ::v-deep .table .price .el_input {
            width: 123px;

            input {
                width: 99px !important;
                padding-right: 0;
            }
        }

        ::v-deep .table .price .el-input-group__append {
            /*padding: 0;*/
            border-left: 0;
            background-color: #3f78f6;
            width: 30px !important;
            height: 100%;
            color: #ffffff;
            transition: all 0.2s linear;
            padding: 0;
            button {
                padding: 0;
                margin: 0 0 0 3px;
                transition: all 0.2s linear;
            }
        }

        ::v-deep .table .price .el-input-group__append:hover {
            color: #ffffff;
            background-color: #ff0036;
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
                overflow: hidden;
            }

            @{deep} .el-pager li {
                background-color: #eaedf4 !important;
            }

            @{deep} .btn-next,
            @{deep} .btn-prev {
                padding: 0;
                color: #ffffff;
                background-color: #3f78f6;
                border-radius: 50%;
            }

            @{deep} input {
                border-radius: 12px;
            }
        }
    }
    ::v-deep .el-dialog__wrapper .el-dialog {
        width: 350px !important;
        border-radius: 12px;
        overflow: hidden;
        .el-dialog__header {
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: space-between;
            padding: 0 15px;
            height: 30px;
            background-color: #3f78f6;
            span,
            button i {
                font-size: 14px;
                color: #ffffff;
            }
            button {
                position: static;
                width: 30px;
                height: 30px;
            }

            button:hover {
                background-color: #546ce9;
            }
        }
        .el-dialog__body {
            padding: 0 29px;
            .stock_body {
                div.item {
                    display: flex;
                    align-items: flex-start;
                    margin-top: 29px;
                    > span:nth-of-type(1) {
                        width: 90px;
                    }
                    label {
                        margin-bottom: 16px;
                    }
                    ul li .counter {
                        display: flex;
                        width: 128px;
                        height: 30px;
                        border-radius: 5px;
                        overflow: hidden;
                        font-size: 14px;
                        button {
                            width: 30px;
                            border: 2px solid #eeeeee;
                            overflow: hidden;
                            transition: all 0.3s;
                            background-color: #ffffff;
                        }
                        button:nth-of-type(1) {
                            border-top-left-radius: 5px;
                            border-bottom-left-radius: 5px;
                        }
                        button:nth-of-type(2) {
                            border-top-right-radius: 5px;
                            border-bottom-right-radius: 5px;
                        }
                        input {
                            padding-left: 10px;
                            width: 70px;
                            border: 0;
                            border-top: 2px solid #eeeeee;
                            border-bottom: 2px solid #eeeeee;
                            transition: all 0.3s;
                        }
                        button:hover {
                            border-color: #3f78f6;
                            color: #3f78f6;
                        }
                    }

                    .counter.active {
                        input {
                            border-color: #3f78f6;
                        }
                        button:nth-of-type(1) {
                            border-right-color: #3f78f6;
                        }

                        button:nth-of-type(2) {
                            border-left-color: #3f78f6;
                        }
                    }
                }
            }
        }

        .dialog-footer .el-button {
            width: 90px;
            height: 30px;
            padding: 0;
        }
    }
    ::v-deep .el-dialog__wrapper.del {
        .el-dialog {
            width: 300px !important;
            .el-dialog__body {
                padding: 26px 0 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                p {
                    margin-top: 10px;
                }
            }
        }
    }

    ::v-deep .edit {
        .el-dialog {
            width: 630px !important;
            .el-cascader{
                margin-top: 20px;
                width: 100%;
            }
            .el-dialog__body{
                height: 200px;
            }
        }
    }
}
</style>
