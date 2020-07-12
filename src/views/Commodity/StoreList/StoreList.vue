<template>
    <div class="StoreList">
        <header class="header">
            <ul class="countlist">
                <li @click="changeShelf(1)" :class="selIndex === 1 ? 'active' : ''">
                    已上架(<span>{{ added }}</span
                    >)
                </li>
                <li @click="changeShelf(2)" :class="selIndex === 2 ? 'active' : ''">
                    未上架(<span>{{ noAdd }}</span
                    >)
                </li>
                <li @click="changeShelf(3)" :class="selIndex === 3 ? 'active' : ''">
                    已售空(<span>{{ sold }}</span
                    >)
                </li>
            </ul>
        </header>
        <div class="main">
            <div class="filter">
                <div class="left">
                    <label>
                        <span>门店名称</span>
                        <el-input v-model="StroreName" placeholder="门店名称"> </el-input>
                    </label>
                    <label>
                        <span>门店编码</span>
                        <el-input v-model="StroreCode" placeholder="门店编码"> </el-input>
                    </label>
                    <label>
                        <span>商品码</span>
                        <el-input v-model="ProductCode" placeholder="商品码"> </el-input>
                    </label>
                </div>
                <div class="right">
                    <el-button @click="clear()" class="btn" type="text">重置筛选条件</el-button>
                    <el-button @click="ConditionalSearch()" class="search" type="primary" icon="el-icon-search"
                        >搜索</el-button
                    >
                </div>
            </div>
            <div class="putshelf">
                <el-button size="small"  @click="changeOnShelf(true)" type="primary" icon="el-icon-upload2">批量上架</el-button>
                <el-button size="small" @click="changeOnShelf(false)" type="primary" icon="el-icon-download">批量下架</el-button>
                <el-button size="small" @click="changeOnShelf('del')" type="danger" icon="el-icon-delete-solid">批量删除</el-button>
                <el-button size="small" @click="setStock()" type="primary" icon="el-icon-setting">设置门店库存</el-button>
            </div>
            <el-table
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

                <el-table-column align="center" label="商品图片" width="80">
                    <template slot-scope="scope">
                        <img :src="scope.row.PictureUrl" alt="" />
                    </template>
                </el-table-column>

                <el-table-column align="center" prop="ProductName" label="商品名称" min-width="180"></el-table-column>

                <el-table-column class-name="price" align="center" prop="price" label="价格" min-width="175">
                    <template class="set" slot-scope="scope">
                        <el-input
                            @clear="inputOne(scope.row.ProductId)"
                            @focus="inputOne(scope.row.ProductId)"
                            :style="{ width: scope.row.set ? '' : '60%' }"
                            class="el_input"
                            :clearable="scope.row.set?true:false"
                            v-model.number="scope.row.price"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-currency"></i>
                            <template slot="append">
                                <el-button
                                    @click="setOk(scope.row.ProductId, scope.row.price, 'price')"
                                    v-if="scope.row.set"
                                    ><i class="el-icon-check"></i
                                ></el-button>
                            </template>
                        </el-input>
                        <i
                            @click.stop="reset(scope.row.ProductId, 'price')"
                            v-if="scope.row.set"
                            class="el-icon-refresh-left reset"
                        ></i>
                    </template>
                </el-table-column>

                <el-table-column class-name="price" align="center"  label="库存" min-width="175">
                    <template class="set" slot-scope="scope">
                        <el-input
                            @clear="inputOne(scope.row.ProductId)"
                            @focus="inputOne(scope.row.ProductId)"
                            :style="{ width: scope.row.set ? '' : '60%' }"
                            class="el_input"
                            :clearable="scope.row.set?true:false"
                            v-model.number="scope.row.PromotionStock"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-currency"></i>
                            <template slot="append">
                                <el-button
                                    @click="setOk(scope.row.ProductId, scope.row.PromotionStock, 'PromotionStock')"
                                    v-if="scope.row.set"
                                    ><i class="el-icon-check"></i
                                ></el-button>
                            </template>
                        </el-input>
                        <i
                            @click.stop="reset(scope.row.ProductId, 'PromotionStock')"
                            v-if="scope.row.set"
                            class="el-icon-refresh-left reset"
                        ></i>
                    </template>
                </el-table-column>

                <el-table-column align="center" prop="mounthSell" label="月售(份)" width="90"></el-table-column>

                <el-table-column align="center" prop="BarCode" label="条形码(SKU)" min-width="120"></el-table-column>
                <el-table-column align="center" prop="ProductCode" label="商品编码" min-width="120"></el-table-column>

                <el-table-column align="center" prop="StroreName" label="门店名称" min-width="150"></el-table-column>

                <el-table-column align="center" prop="StroreCode" label="门店编码" min-width="135"></el-table-column>

                <el-table-column align="center" prop="StroreCode" label="是否上架">
                    <template slot-scope="scope">
                        <el-switch
                                @change="changeState(scope.row.ProductId,scope.row.onShelf)"
                            v-model="scope.row.onShelf"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                        ></el-switch>
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
            added: 0,
            noAdd: 0,
            sold: 0,
            /** baseData 原始数据
             * tableData 表格展示数据 currentPage 第几页 pagesize 每页数据
             *
             * */
            tableData: [],
            baseData: [],
            currentPage: 1,
            pagesize: 5,
            /**
             * StroreName 门店名称
             * StroreCode 门店编码
             * ProductCode 商品码
             * */
            StroreName: "",
            StroreCode: "",
            ProductCode: "",
            /**
             * 选中表格  selTabArr
             * @type Array
             * */
            selTabArr: [],
            selTabId: [],
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
        /**
         * 获取数据
         * @returns {Promise<void>}
         */
        async getData() {
            let res = (await this.$api.getStoreList()).data.result;

            this.tableData = await JSON.parse(JSON.stringify(res.list));
            this.tableData = this.tableData.filter((item, index) => {
                return item.onShelf;
            });
            this.baseData = await JSON.parse(JSON.stringify(res.list));
            this.calc();
        },
        /**
         * 计算 上架数量
         */
        calc() {
            this.added = this.baseData.filter((item, index) => {
                return item.onShelf;
            }).length;
            this.noAdd = this.baseData.filter((item, index) => {
                return !item.onShelf;
            }).length;
            this.sold = this.baseData.filter((item, index) => {
                return item.PromotionStock === 0;
            }).length;
        },
        /**
         * 切换 展示数据
         * @param index
         */
        changeShelf(index) {
            this.selIndex = index;
            switch (this.selIndex) {
                case 1:
                    this.tableData = this.baseData.filter((item, index) => {
                        return item.onShelf;
                    });
                    break;
                case 2:
                    this.tableData = this.baseData.filter((item, index) => {
                        return !item.onShelf;
                    });
                    break;
                case 3:
                    this.tableData = this.baseData.filter((item, index) => {
                        return item.PromotionStock === 0;
                    });
            }
        },
        /**
         *  条件搜索
         */
        ConditionalSearch() {
            if (this.StroreName || this.StroreCode || this.ProductCode) {
                if (
                    (this.StroreName && this.StroreCode) ||
                    (this.StroreCode && this.ProductCode) ||
                    (this.StroreName && this.StroreCode) ||
                    (this.StroreName && this.StroreCode && this.ProductCode)
                ) {
                    if (this.StroreName && this.StroreCode) {
                        this.search("StroreName");
                        this.search("StroreCode", "arr");
                    }
                    if (this.StroreCode && this.ProductCode) {
                        this.search("StroreCode");
                        this.search("ProductCode", "arr");
                    }
                    if (this.StroreName && this.StroreCode) {
                        this.search("StroreName");
                        this.search("StroreCode", "arr");
                    }
                    if (this.StroreName && this.StroreCode && this.ProductCode) {
                        this.search("StroreName");
                        this.search("StroreCode", "arr");
                        this.search("ProductCode", "arr");
                    }
                } else {
                    // 门店名称搜索
                    if (this.StroreName) {
                        this.search("StroreName");
                    }
                    // 门店编码搜索
                    if (this.StroreCode) {
                        this.search("StroreCode");
                    }
                    // 商品码搜索
                    if (this.ProductCode) {
                        this.search("ProductCode");
                    }
                }
            } else {
                this.tableData = this.baseData;
            }
        },
        /**
         * 条件搜索 辅助函数
         * @param name
         * @param arr
         */
        search(name, arr) {
            if (arr) {
                this.tableData = this.tableData.filter((item, index) => {
                    return item[name].includes(this[name]);
                });
            } else {
                this.tableData = this.baseData.filter((item, index) => {
                    return item[name].includes(this[name]);
                });
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
        },
        /**
         * 批量上架/下架/删除
         * @constructor
         */
        changeOnShelf(boolean) {
            let str = "";
            if (boolean === true) {
                str = "上架";
            } else if (boolean === false) {
                str = "下架";
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
                        this.clear()
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
                                        this.tableData[key].onShelf = boolean;
                                    }
                                });
                                this.baseData.forEach((val, key) => {
                                    if (item.ProductId === val.ProductId) {
                                        this.baseData[key].onShelf = boolean;
                                    }
                                });
                            });
                        }
            this.calc()
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
         * 设置门店库存
         * */
        setStock() {
            this.selTabArr.forEach((item, index) => {
                this.tableData.forEach((val, key) => {
                    if (item.ProductId === val.ProductId) {
                        this.tableData[key].set = true;
                        // this.baseData.forEach(())
                    }
                });
            });
        },
        /**
         *
         * @param id
         * @param price
         */
        setOk(id, num, name) {
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
        /**
         *
         * @param id
         * @param price
         */
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
        clear() {
            this.StroreName = "";
            this.StroreCode = "";
            this.ProductCode = "";
            this.tableData=this.baseData;
            this.selIndex=1
            this.tableData = this.baseData.filter((item, index) => {
                return item.onShelf;
            });
        },
        changeState(id, val) {
            this.$confirm('确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.baseData.forEach((item, index) => {
                    if (item.ProductId === id) {
                        item.onShelf = val
                    }
                })
                this.$message({
                    type: 'success',
                    message: '修改成功!'
                });
            }).catch(() => {
                this.tableData.forEach((item, index) => {
                    if (item.ProductId === id) {
                        item.onShelf = !val
                    }
                })
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        }
    },
    created() {
        this.getData();
    },
    mounted() {},
};
</script>

<style scoped lang="less">
@deep: ~">>>";
.StoreList {
    height: inherit;
}

.el-icon-currency::before {
    font-weight: 700;
    content: "\ffe5" !important;
}

.el-icon-arrow-down:before {
    content: "\e78f" !important;
}
</style>
