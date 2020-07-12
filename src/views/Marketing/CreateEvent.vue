<template>
    <div class="CreateEvent">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
            <!--基本信息-->
            <div class="title">
                <i class="el-icon-warning"></i>
                <span>基本信息</span>
            </div>
            <!--基本信息表单-->
            <el-form-item label="活动名称" prop="Name">
                <el-input placeholder="30个字以内" v-model="ruleForm.Name"></el-input>
            </el-form-item>
            <!--活动时间-->
            <el-form-item label="活动时间" required>
                <el-form-item prop="BeginTime">
                    <el-date-picker v-model="ruleForm.startTime" type="datetime" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <span class="line" :span="2">至</span>
                <el-form-item prop="EndTime">
                    <el-date-picker v-model="ruleForm.EndTime" type="datetime" placeholder="结束时间"> </el-date-picker>
                </el-form-item>
            </el-form-item>
            <!--广告语-->
            <el-form-item label="广告语" prop="Advertising">
                <el-input placeholder="12个字以内" v-model="ruleForm.Advertising"></el-input>
            </el-form-item>
            <!---->
            <el-form-item label="活动类型" prop="Type">
                <el-select v-model="ruleForm.Type" placeholder="请选择">
                    <el-option label="社区团购" value="社区团购"> </el-option>
                </el-select>
            </el-form-item>
            <!--规则设置-->
            <div class="title">
                <i class="el-icon-warning"></i>
                <span>规则设置</span>
            </div>
            <!--活动预告时间-->
            <el-form-item label="活动预告时间" prop="NoticeTime">
                <el-date-picker v-model="ruleForm.NoticeTime" type="datetime" placeholder="请选择时间"></el-date-picker>
            </el-form-item>
            <!--活动对象-->
            <el-form-item prop="ActiveObject" class="radio" label="活动对象">
                <el-radio-group v-model="ruleForm.ActiveObject">
                    <el-radio :label="1">不限</el-radio>
                    <el-radio :label="2">限新用户</el-radio>
                </el-radio-group>
            </el-form-item>
            <!--购买限定-->
            <el-form-item prop="PurchaseLimit" class="radio" label="购买限定">
                <el-radio-group v-model="ruleForm.PurchaseLimit">
                    <el-radio :label="1">不限</el-radio>
                    <el-radio :label="2">每人活动限量</el-radio>
                    <el-radio :label="3">每人每天限量</el-radio>
                </el-radio-group>
            </el-form-item>
            <!--门店限定-->
            <el-form-item prop="StoreLimited" class="radio_btn" label="门店限定">
                <el-radio-group v-model="ruleForm.StoreLimited">
                    <el-radio :label="1">不限</el-radio>
                    <el-radio :label="2">指定门店</el-radio>
                </el-radio-group>
                <el-button @click="showStoreAdd()" type="primary" size="small">选择门店</el-button>
            </el-form-item>
            <!--配送方式-->
            <el-form-item prop="DeliveryMethod" class="radio" label="配送方式">
                <el-radio-group v-model="ruleForm.DeliveryMethod">
                    <el-radio :label="1">不限</el-radio>
                    <el-radio :label="2">仅自提</el-radio>
                    <el-radio :label="3">仅配送</el-radio>
                </el-radio-group>
            </el-form-item>
            <!--提货时间-->
            <el-form-item label="提货时间" prop="PickupTime">
                <el-date-picker v-model="ruleForm.PickupTime" type="datetime" placeholder="请选择时间"></el-date-picker>
            </el-form-item>
            <!--添加商品活动-->
            <div class="title">
                <i class="el-icon-warning"></i>
                <span>添加商品活动</span>
            </div>
            <section class="box">
                <div class="search_while">
                    <div class="left">
                        <label
                            ><span>商品编码</span>
                            <el-input v-model="ProductCode" placeholder="商品编码"></el-input>
                        </label>
                        <label
                            ><span>SKU码</span>
                            <el-input v-model="Sku" placeholder="SKU码"></el-input>
                        </label>
                        <label
                            ><span>商品名称</span>
                            <el-input v-model="ProductName" placeholder="商品名称"></el-input>
                        </label>
                    </div>
                    <div class="right">
                        <el-button @click="resetSearchActivity()" type="text">重置筛选条件</el-button>
                        <el-button @click="searchActivityTab()" icon="el-icon-search" size="mini" type="primary"
                            >查询</el-button
                        >
                    </div>
                </div>
                <div class="edit">
                    <el-button @click="addActivityProduct()" icon="el-icon-plus" size="mini" type="primary"
                        >添加活动商品</el-button
                    >
                    <el-button @click="delTabItem()" icon="el-icon-delete-solid" size="mini" type="danger"
                        >删除所选</el-button
                    >
                </div>
                <div class="activity_table">
                    <el-table
                        height="300px"
                        class="table"
                        border
                        stripe
                        lazy
                        show-header
                        header-row-class-name="tab_header"
                        ref="multipleTable"
                        :data="addedActivityGoods.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
                        tooltip-effect="dark"
                        style="width: 100%;"
                        @selection-change="handleSelectionChange"
                    >
                        <!--选择-->
                        <el-table-column align="center" type="selection" width="55"></el-table-column>
                        <!--商品编码-->
                        <el-table-column label="商品编码" prop="ProductCode" width="110"></el-table-column>
                        <!--SKU码-->
                        <el-table-column label="SKU码" prop="Sku" min-width="120"></el-table-column>
                        <!--商品图片-->
                        <el-table-column label="商品图片" prop="PictureUrl" min-width="82">
                            <template slot-scope="scope">
                                <img :src="scope.row.PictureUrl" alt="" />
                            </template>
                        </el-table-column>
                        <!--商品名称-->
                        <el-table-column label="商品名称" prop="ProductName" min-width="140"></el-table-column>
                        <!--正常价(元)-->
                        <el-table-column label="正常价(元)" prop="Price" min-width="100">
                            <template slot-scope="scope">
                                <span>￥</span>
                                <span>{{ scope.row.Price }}</span>
                            </template>
                        </el-table-column>
                        <!--促销价(元)-->
                        <el-table-column label="促销价(元)" prop="PromotionPrice" min-width="95">
                            <template slot-scope="scope">
                                <span>￥</span>
                                <el-input v-model="scope.row.PromotionPrice"></el-input>
                            </template>
                        </el-table-column>
                        <!--佣金比例-->
                        <el-table-column label="佣金比例%" prop="FeeRate" min-width="95">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.FeeRate"></el-input>
                                <span>%</span>
                            </template>
                        </el-table-column>
                        <!--限购量(件)-->
                        <el-table-column label="限购量(件)" prop="LimitCount" min-width="95">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.LimitCount"></el-input>
                            </template>
                        </el-table-column>
                        <!--活动总库存(件)-->
                        <el-table-column label="活动总库存(件)" prop="PromotionStock" min-width="123">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.PromotionStock"></el-input>
                            </template>
                        </el-table-column>
                        <!--操作-->
                        <el-table-column label="操作" min-width="150">
                            <template slot-scope="scope">
                                <el-button
                                    @click="$message.success('保存成功')"
                                    icon="el-icon-folder-checked"
                                    type="text"
                                    >保存</el-button
                                >
                                <el-button
                                    @click="delTabOwn(scope.row.ProductId)"
                                    style="color: #ff0036;"
                                    icon="el-icon-delete"
                                    type="text"
                                    >停用</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination
                            class="paginationy"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[5, 10, 20, 100]"
                            :page-size="pagesize"
                            :page-count="selAdd / 5"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="selAdd.length"
                        >
                        </el-pagination>
                    </div>
                </div>
            </section>
            <el-form-item class="make_sure">
                <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
            </el-form-item>
        </el-form>
        <!--对话框-->
        <el-dialog
            tooltip-effect="dark"
            class="store_dialog"
            title="选择门店"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose"
        >
            <div class="store">
                <div class="add_store">
                    <div class="top">
                        选择门店
                    </div>
                    <div class="main_store">
                        <div class="search">
                            <label
                                ><span>商品编码</span>
                                <el-input v-model="StoreCode" placeholder="商品编码"></el-input>
                            </label>
                            <label
                                ><span>业态</span>
                                <el-input v-model="StoreFormat" placeholder="业态"></el-input>
                            </label>
                            <label
                                ><span>门店名称</span>
                                <el-input v-model="StoreName" placeholder="门店名称"></el-input>
                            </label>
                            <div class="while">
                                <el-button @click="resetSearchStore()" type="text">重置筛选条件</el-button>
                                <el-button
                                    @click="dialogSearchStoreList()"
                                    size="small"
                                    icon="el-icon-search"
                                    type="primary"
                                    >搜索</el-button
                                >
                            </div>
                        </div>
                        <el-table
                            v-if="storeList"
                            :data="storeList"
                            height="200px"
                            class="table_add"
                            border
                            stripe
                            lazy
                            show-header
                            header-row-class-name="tab_header"
                            @selection-change="addSelectionChange"
                        >
                            <el-table-column align="center" type="selection" width="55"></el-table-column>
                            <el-table-column prop="StoreCode" label="门店编码" min-width="106"></el-table-column>
                            <el-table-column prop="StoreName" label="门店名称" min-width="106"></el-table-column>
                            <el-table-column prop="StoreFormat" label="业态" min-width="106"></el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="add">
                    <el-button @click="addStoreToRight()" size="small" type="primary">添加 ></el-button>
                </div>
                <div class="add_store">
                    <div class="top">
                        选择门店
                    </div>
                    <div class="main_store">
                        <el-table
                            height="200px"
                            :data="addedStore"
                            class="table_add"
                            border
                            stripe
                            lazy
                            show-header
                            header-row-class-name="tab_header"
                        >
                            <el-table-column align="center" type="selection" width="55"></el-table-column>
                            <el-table-column prop="StoreCode" label="门店编码" min-width="106"></el-table-column>
                            <el-table-column prop="StoreName" label="门店名称" min-width="106"></el-table-column>
                            <el-table-column prop="StoreFormat" label="业态" min-width="106"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" icon="el-icon-close" @click="addStoreNo()">取 消</el-button>
                <el-button size="small" icon="el-icon-check" type="primary" @click="addStoreOk()">确 定</el-button>
            </span>
        </el-dialog>
        <!--添加活动对话框-->
        <el-dialog
            tooltip-effect="dark"
            class="store_dialog"
            title="选择活动商品"
            :visible.sync="activityVisible"
            width="30%"
            :before-close="handleClose"
        >
            <div class="store">
                <div class="add_store">
                    <div class="top">
                        选择活动商品
                    </div>
                    <div class="main_store">
                        <div class="search">
                            <label
                                ><span>商品编码</span>
                                <el-input v-model="treeCode" placeholder="商品编码"></el-input>
                            </label>
                            <div class="while">
                                <el-button @click="treeCode = ''" type="text">重置筛选条件</el-button>
                                <el-button @click="dialogSearchTree()" size="small" icon="el-icon-search" type="primary"
                                    >搜索
                                </el-button>
                            </div>
                        </div>
                        <div class="tree">
                            <el-tree
                                :filter-node-method="filterNode"
                                ref="tree"
                                :data="dataTree"
                                show-checkbox
                                accordion
                                node-key="id"
                                :expand-on-click-node="false"
                            >
                                <span class="custom-tree-node" slot-scope="{ node, data }">
                                    <img v-if="data.url" :src="data.url" alt="" />
                                    <div class="info">
                                        <p>{{ node.label }}</p>
                                        <p v-if="data.price" class="price">{{ "￥" + data.price }}</p>
                                    </div>
                                </span>
                            </el-tree>
                        </div>
                    </div>
                </div>
                <div class="add">
                    <el-button @click="addTree()" size="small" type="primary">添加 ></el-button>
                </div>
                <div class="add_store">
                    <div class="top">
                        选择门店
                    </div>
                    <ul class="main_store ul_list">
                        <li v-for="(item, index) in activityGoods">
                            <div class="left">
                                <img :src="item.ProductUrl" alt="" />
                                <div class="info">
                                    <p>{{ item.ProductName }}</p>
                                    <p>{{ item.Price }}</p>
                                </div>
                            </div>
                            <div class="right">
                                <el-button
                                    @click="removeActivityGoods(item.ProductId)"
                                    icon="el-icon-delete"
                                    style="color: #ff0036;"
                                    type="text"
                                    >移除</el-button
                                >
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" icon="el-icon-close" @click="addActivityGoodsNo()">取 消</el-button>
                <el-button size="small" icon="el-icon-check" type="primary" @click="addActivityGoodsOk()"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Mock from "mockjs";

export default {
    data() {
        return {
            ruleForm: {
                Name: "", // 活动名称
                BeginTime: "", // 活动开始时间
                EndTime: "", // 活动结束时间
                Advertising: "", // 广告语
                Type: "", // 类型
                NoticeTime: "", // 预告时间
                ActiveObject: 1, // 活动对象
                PurchaseLimit: 1, // 购买限定
                StoreLimited: 1, // 门店限定
                DeliveryMethod: 1, //配送方式
                PickupTime: "", // 提货时间
            },
            rules: {
                Name: [
                    { required: true, message: "请输入活动名称", trigger: "blur" },
                    { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" },
                ],
                BeginTime: [
                    // {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
                ],
                EndTime: [
                    // { type: "date", required: true, message: "请选择日期", trigger: "change" }
                ],
                Advertising: [
                    { required: true, message: "请输入活动名称", trigger: "blur" },
                    { min: 0, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" },
                ],
                Type: [
                    { required: true, message: "请选择类型", trigger: "change" },
                    { min: 1, max: 12, message: "长度在 3 到 12 个字符", trigger: "change" },
                ],
                ActiveObject: [{ required: true, message: "请选择类型", trigger: "change" }],
                PurchaseLimit: [{ required: true, message: "请选择类型", trigger: "change" }],
                StoreLimited: [{ required: true, message: "请选择门店", trigger: "change" }],
                DeliveryMethod: [{ required: true, message: "请选择门店", trigger: "change" }],
                PickupTime: [{ required: true, message: "请选择门店", trigger: "change" }],
            },
            tableData: [],
            baseData: [],
            selAdd: [], // 已添加表格
            currentPage: 1,
            pagesize: 5,
            dialogVisible: false, // 选择门店对话框
            storeList: [], // 门店列表
            addedStore: [], // 已添加列表
            selStoreList: [], // 已选中列表
            /*门店搜索条件*/
            StoreCode: "", // 门店编码
            StoreName: "", // 门店
            StoreFormat: "", // 业态
            activityVisible: false, // 活动列表对话框
            /*树形*/
            dataTree: [],
            baseDataTree: [],
            newDataTree: [],
            baseStoreList: [],
            treeCode: "",
            activityGoods: [],
            baseActivityGoods: [],
            addedActivityGoods: [],
            ProductCode: "", // 商品编码
            Sku: "",
            ProductName: "",
            selTab: [],
        };
    },
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
            this.selTab = val;
        },
        /**
         * 提交表单
         * @param formName
         */
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$router.push("/createevent/createsuccess");
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        /**
         * 获取数据
         */
        getData() {
            this.$api.getActivity().then((res) => {
                this.tabData = JSON.parse(JSON.stringify(res.data.result.list));
                this.baseData = JSON.parse(JSON.stringify(res.data.result.list));
                console.log(this.tabData);
            });
        },
        /**
         * 关闭对话框
         * @param done
         */
        handleClose(done) {
            this.$confirm("确认关闭？")
                .then((_) => {
                    done();
                })
                .catch((_) => {});
        },
        showStoreAdd() {
            this.$api.getActivityStore().then((res) => {
                this.storeList = JSON.parse(JSON.stringify(res.data.result.list));
                this.baseStoreList = JSON.parse(JSON.stringify(res.data.result.list));
            });
            this.dialogVisible = true;
        },
        /**
         * 门店列表选中
         * @param val
         */
        addSelectionChange(val) {
            this.selStoreList = [];
            this.selStoreList = val;
        },
        /*添加  穿梭框*/
        addStoreToRight() {
            if (this.selStoreList.length > 0) {
                this.selStoreList.forEach((item) => {
                    this.addedStore.unshift(item);
                    this.storeList.forEach((val, key) => {
                        if (item.StoreCode === val.StoreCode) {
                            this.storeList.splice(key, 1);
                        }
                    });
                });
            } else {
                this.$message.error("请勾选需要添加的内容");
            }
        },
        /*门店搜索*/
        dialogSearchStoreList() {
            if (this.StoreName || this.StoreCode || this.StoreFormat) {
                if (this.StoreName) {
                    this.searchStore("StoreName");
                }
                if (this.StoreCode) {
                    this.searchStore("StoreCode");
                }
                if (this.StoreFormat) {
                    this.searchStore("StoreFormat");
                }
            } else {
                this.$message.error("请输入搜索条件");
            }
        },
        /*门店搜*/
        searchStore(name) {
            this.storeList = this.storeList.filter((item, index) => {
                return item[name].includes(this[name]);
            });
        },
        /*确认添加门店*/
        addStoreOk() {
            if (this.addedStore.length !== 0) {
                this.ruleForm.StoreLimited = 2;
            } else {
                this.ruleForm.StoreLimited = 1;
            }
            this.addedStore = [];
            this.dialogVisible = false;
            this.resetSearchStore();
        },
        /*取消添加门店*/
        addStoreNo() {
            this.ruleForm.StoreLimited = 1;
            this.addedStore = [];
        },
        /*重置门店搜索条件*/
        resetSearchStore() {
            this.StoreName = "";
            this.StoreCode = "";
            this.StoreFormat = "";
            this.storeList = this.baseStoreList;
        },
        addActivityProduct() {
            this.activityVisible = true;
            this.$api.getActivityProduct().then((res) => {
                this.baseDataTree = JSON.parse(JSON.stringify(res.data.result.list));
                this.formatTree(this.baseDataTree);
            });
        },
        addTree() {
            let arr = this.$refs.tree.getCheckedNodes();
            if (arr.length !== 0) {
                arr.forEach((item, index) => {
                    if (item.ProductCode) {
                        if (this.activityGoods.length !== 0) {
                            this.activityGoods.forEach((val, key) => {
                                if (item.ProductId !== val.ProductId) {
                                    this.activityGoods.push(item);
                                }
                            });
                        } else {
                            this.activityGoods.push(item);
                        }
                    }
                });
                this.activityGoods = Array.from(new Set(this.activityGoods));
                this.$message.success("添加成功");
            } else {
                this.$message.error("请选择添加项");
            }
        }, // 树添加 穿梭框
        formatTree(arr) {
            this.dataTree = arr.map((item, index) => {
                return {
                    label: item.SortNmae,
                    children: item["SortList"].map((val, key) => {
                        return {
                            label: val.ProductName,
                            url: val.ProductUrl,
                            price: val.Price,
                            ProductCode: val.ProductCode,
                            id: val.ProductCode,
                            ProductName: val.ProductName,
                            ProductUrl: val.ProductUrl,
                            Price: val.Price,
                            PromotionId: val.PromotionId, //活动ID
                            ProductId: val.ProductId, // 商品ID
                            Sku: val.Sku, //SKU码
                            PictureUrl: val.PictureUrl, //商品图片
                            PromotionPrice: "", //促销价
                            FeeRate: "", //佣金比例
                            LimitCount: "", //限购数量
                            PromotionStock: "", //活动总库存
                            PromotionStockNow: "", //当前剩余库存
                        };
                    }),
                };
            });
        },
        dialogSearchTree() {
            if (this.treeCode) {
                this.$refs.tree.filter(this.treeCode);
            } else {
                this.$message.error("请输入搜索条件");
            }
        }, // 树搜索
        filterNode(value, data) {
            if (!value) return true;
            if (data.id) {
                return data.id.indexOf(value) !== -1;
            }
        }, // 树过滤
        removeActivityGoods(id) {
            this.activityGoods.forEach((item, index) => {
                if (item.ProductId === id) {
                    this.activityGoods.splice(index, 1);
                }
            });
        }, // 移除
        addActivityGoodsOk() {
            this.activityVisible = false;
            this.addedActivityGoods = JSON.parse(JSON.stringify(this.activityGoods));
            this.baseActivityGoods = JSON.parse(JSON.stringify(this.activityGoods));
            this.activityGoods = [];
        }, // 确认添加 活动商品
        addActivityGoodsNo() {
            this.activityVisible = false;
            this.activityGoods = [];
        }, // 取消添加 活动商品
        searchActivityTab() {
            if (this.ProductCode || this.Sku || this.ProductName) {
                if (this.ProductCode) {
                    this.searchWhile("ProductCode");
                }
                if (this.Sku) {
                    this.searchWhile("Sku");
                }
                if (this.ProductName) {
                    this.searchWhile("ProductName");
                }
            } else {
                this.$message.error("请输入搜索条件");
            } //表格查询
        }, // 表格 查找
        searchWhile(name) {
            name = name.trim();
            this.addedActivityGoods = this.addedActivityGoods.filter((item, index) => {
                return item[name].includes(this[name]);
            });
        },
        resetSearchActivity() {
            this.ProductCode = this.Sku = this.ProductName = "";
            this.addedActivityGoods = this.baseActivityGoods;
        }, // 表格 重置
        delTabItem() {
            if (this.selTab.length !== 0) {
                this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        this.selTab.forEach((item, index) => {
                            this.addedActivityGoods.forEach((val, key) => {
                                if (item.ProductId === val.ProductId) {
                                    this.addedActivityGoods.splice(key, 1);
                                }
                            });
                            this.baseActivityGoods.forEach((val, key) => {
                                if (item.ProductId === val.ProductId) {
                                    this.addedActivityGoods.splice(key, 1);
                                }
                            });
                        });
                        this.$message({
                            type: "success",
                            message: "删除成功!",
                        });
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除",
                        });
                    });
            } else {
                this.$message.error("请勾选需要删除的内容");
            }
        }, // 表格 删除
        delTabOwn(id) {
            this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.addedActivityGoods.forEach((val, key) => {
                        if (val.ProductId === id) {
                            this.addedActivityGoods.splice(key, 1);
                        }
                    });
                    this.baseActivityGoods.forEach((val, key) => {
                        if (val.ProductId === id) {
                            this.addedActivityGoods.splice(key, 1);
                        }
                    });

                    this.$message({
                        type: "success",
                        message: "删除成功!",
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
    },
    created() {
        this.getData();
    },
    mounted() {},
    watch: {
        dialogVisible: {
            handler() {
                if (!this.dialogVisible) {
                    this.resetSearchStore();
                }
            },
        },
        treeCode(val) {
            this.treeCode = val;
        },
        activityVisible: {
            handler() {
                if (!this.dialogVisible) {
                    this.resetSearchActivity();
                    this.activityGoods = [];
                }
            },
        },
    },
};
</script>

<style scoped lang="less">
.CreateEvent {
    padding: 20px;
    .tree {
        /*overflow-y: scroll;*/
        height: 250px;
    }
    ::v-deep .el-tree-node {
        .custom-tree-node {
            display: flex;
            align-items: center;
            .info {
                margin-left: 5px;
            }
        }
        .el-tree-node__children {
            .el-tree-node {
                .el-tree-node__content {
                    height: 80px;
                    img {
                        width: 60px;
                        height: 60px;
                    }
                    p:nth-of-type(2) {
                        margin-top: 12px;
                        color: #ff0036 !important;
                    }
                    .custom-tree-node {
                        height: 80px !important;
                    }
                }
            }
        }
    }
    ::v-deep .el-tree {
        position: relative;
        overflow-y: scroll;
        height: 100%;
    }

    ::v-deep .el-tree::-webkit-scrollbar {
        display: none;
    }
    ::v-deep .store_dialog {
        .el-dialog {
            width: 1299px !important;
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
                .store {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .add_store {
                        width: 552px;
                        height: 390px;
                        border-radius: 12px;
                        overflow: hidden;
                        border: 1px solid #eeeeee;
                        .top {
                            padding-left: 10px;
                            display: flex;
                            align-items: center;
                            height: 38px;
                            color: #3f78f6;
                            background-color: #eaedf4;
                        }
                        .main_store {
                            padding: 20px 15px;
                        }
                        .ul_list {
                            height: 350px;
                            overflow-y: scroll;
                            li {
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                height: 90px;
                                padding: 10px 0;
                                img {
                                    width: 60px !important;
                                    height: 60px !important;
                                }
                                .left {
                                    display: flex;
                                    align-items: center;
                                    p:nth-child(1) {
                                        font-size: 18px;
                                    }

                                    p:nth-child(2) {
                                        color: #ff0036;
                                    }
                                    .info {
                                        height: 100%;
                                        display: flex;
                                        flex-direction: column;
                                        justify-content: space-around;
                                        p:nth-child(1) {
                                            font-size: 18px;
                                        }

                                        p:nth-child(2) {
                                            color: #ff0036;
                                            margin-top: 20px;
                                        }
                                    }
                                }
                            }
                        }
                        .search {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            flex-wrap: wrap;
                            label {
                                display: flex;
                                align-items: center;
                                margin-bottom: 20px;
                                span {
                                    margin-right: 10px;
                                    white-space: nowrap;
                                }
                            }
                            .while {
                                display: flex;
                                align-items: center;
                                margin-bottom: 20px;
                            }
                        }
                        .table_add {
                            border-radius: 12px;
                        }
                    }
                }
            }
        }
    }
    .title {
        font-size: 16px;
        margin-bottom: 20px;
        i {
            color: #3f78f6;
            margin-right: 12px;
        }
    }
    ::v-deep .el-form-item {
        margin-left: 145px;
        .el-form-item__label {
            padding: 0 20px 0 0;
        }
        .el-input {
            width: 288px;
        }
        .el-form-item__content {
            .el-form-item {
                margin-left: 0 !important;
            }
        }
        .line.el-col.el-col-2 {
            width: 34px !important;
            text-align: center;
        }
        .el-form-item__content {
            display: flex;
            > span {
                margin: 0 12px;
            }
        }
    }

    ::v-deep .radio {
        display: flex !important;
        align-items: center;
        .el-form-item__content {
            margin-left: 0 !important;
        }
    }

    ::v-deep .radio_btn {
        display: flex;
        align-items: center;

        .el-form-item__content {
            display: flex;
            align-items: center;
            margin-left: 0 !important;
            button {
                margin-left: 40px;
            }
        }
    }

    section.box {
        padding: 0;
        margin-left: 170px;
        .search_while {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .left {
                display: flex;
                align-items: center;
                label {
                    display: flex;
                    align-items: center;
                    margin-right: 20px;

                    span {
                        display: inline-block;
                        width: 100px;
                        white-space: nowrap;
                    }
                }
            }
            .right {
                display: flex;
                align-items: center;
            }
        }
        .edit {
            margin: 20px 0;
        }
        .activity_table {
            width: 100%;
            min-height: 200px;
            .el-table {
                width: 100%;
                min-height: 200px !important;
                border-top-right-radius: 12px;
                border-top-left-radius: 12px;
                ::v-deep .cell {
                    display: flex;
                    align-items: center;
                    span:nth-child(1) {
                        margin-right: 5px;
                    }
                    span:nth-child(2) {
                        margin-left: 5px;
                    }
                }
                .el-input {
                    display: inline-block !important;
                }
            }
            .pagination {
                position: static;
                width: 100%;
                display: flex;
                justify-content: flex-end;
                padding: 0 20px;
                .paginationy {
                }
            }
        }
    }
    ::v-deep .el-form-item.make_sure {
        div {
            display: flex;
            justify-content: flex-end;
            button {
                margin-top: 20px;
            }
        }
    }

    ::v-deep .tab_header {
        th {
            background-color: #eaedf4;
        }
    }
}
</style>
