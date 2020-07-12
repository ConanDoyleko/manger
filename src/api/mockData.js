import Mock from "mockjs";

/**
 * store list
 */
Mock.mock(/web\/store\/list/, {
    code: 200,
    result: {
        "list|100": [
            {
                ProductId: /1\d{8}/, // 商品id
                PictureUrl: function () {
                    let res = "";
                    let color = Mock.Random.rgba();
                    return Mock.Random.image("60×60", color);
                },
                ProductName: function () {
                    return Mock.Random.ctitle(10);
                },
                price: /[1-9]\d{1,3}/,
                PromotionStock: function () {
                    let res = Mock.Random.boolean(9, 1, true);
                    if (res) {
                        return Math.floor(Math.random() * 10000);
                    } else {
                        return 0;
                    }
                },
                ProductCode: /1\d{8}/,
                BarCode: /1\d{8}/,
                mounthSell: /[1-9]\d{0,4}/,
                StroreName: function () {
                    return Mock.Random.cword(5) + "有限公司";
                },
                StroreCode: /1\d{8}/,
                onShelf: function () {
                    return Mock.Random.boolean();
                },
                set: false,
            },
        ],
    },
});
/**
 * platform list
 * */
Mock.mock(/web\/platform\/list/, {
    code: 200,
    result: {
        "list|100": [
            {
                ProductId: /1\d{8}/, // 商品id
                PictureUrl: Mock.Random.image("60×60"),
                ProductName: function () {
                    return Mock.Random.ctitle(10);
                },
                Price: /[1-9]\d{1,3}/,
                mounthSell: /[1-9]\d{0,4}/,
                category: function () {
                    return Mock.Random.ctitle(4) + " | " + Mock.Random.ctitle(4) + " | " + Mock.Random.ctitle(3, 4);
                },
                PromotionStock: function () {
                    let res = Mock.Random.boolean(9, 1, true);
                    if (res) {
                        return Math.floor(Math.random() * 10000);
                    } else {
                        return 0;
                    }
                },
                BarCode: /1\d{8}/,
                ProductCode: /1\d{8}/,
                Enable: function () {
                    return Mock.Random.boolean();
                },
                set: false,
            },
        ],
    },
});
/**
 * home 数据
 * */
Mock.mock(/web\/home/, {
    code: 200,
    result: {
        // 待收货订单
        receivedOrder: function () {
            return Math.abs(Math.floor(Math.random() * 10000 - 1000));
        },
        // 待退款
        receivedRefund: function () {
            return Math.abs(Math.floor(Math.random() * 10000));
        },
        // 待退货 订单
        returnedPurchase: function () {
            return Math.abs(Math.floor(Math.random() * 10000));
        },
        // 待处理退款
        reimburse: function () {
            return Math.abs(Math.floor(Math.random() * 10000));
        },
        /* 销售总览 */
        // 今日订单
        todayOrder: function () {
            return Math.abs(Math.floor(Math.random() * 3000));
        },
        // 今日销售总额
        todayTotalPrice: function () {
            return Math.abs(Math.floor(Math.random() * 80000 - 10000));
        },
        /*活动订单*/
        // 今日活动订单
        todayActivityOrder: function () {
            return Math.abs(Math.floor(Math.random() * 30000 - 10000));
        },
        // 今日活动销售总额
        todaySellTotal: function () {
            return Math.abs(Math.floor(Math.random() * 30000 - 10000));
        },
        /* 商品总览 */
        // 已下架
        removed: function () {
            return Math.abs(Math.floor(Math.random() * 3000));
        },
        // 已上架
        added: function () {
            return Math.abs(Math.floor(Math.random() * 80000 - 10000));
        },
        // 活动商品
        activityGoods: function () {
            return Math.abs(Math.floor(Math.random() * 1000 - 10));
        },
        // 全部商品
        totalGoods: function () {
            return Math.abs(Math.floor(Math.random() * 999999 - 100000));
        },
        /*用户总览*/
        todayIncrement: function () {
            return Math.abs(Math.floor(Math.random() * 1000 - 10));
        },
        // 昨日新增
        yesterdayIncrement: function () {
            return Math.abs(Math.floor(Math.random() * 1000 - 100));
        },
        // 本月新增
        monthIncrement: function () {
            return Math.abs(Math.floor(Math.random() * 10000 - 1000));
        },
        // 用户天数
        userDay: function () {
            return Math.abs(Math.floor(Math.random() * 100 - 10));
        },
    },
});
/**
 * captcha 验证码
 * */
Mock.mock(/web\/captcha/, {
    code: 200,
    result: {
        captcha: /\d{5}/,
    },
});

/**
 * 退款订单
 * */
Mock.mock(/web\/order\/refund/, {
    code: 200,
    result: {
        "list|100": [
            {
                RefundId: /5\d{8}/, // 退款订单id
                ApplyTime: function () {
                    // 下单时间
                    return Mock.Random.datetime("yyyy-MM-dd HH:mm:ss");
                },
                MemberAccount: /7\d{8}/, // 账号
                OrderTotal: function () {
                    return Math.abs(Math.random() * 10000).toFixed(2);
                }, //订单总额
                OwnStore: function () {
                    // 所属门店
                    return Mock.Random.ctitle(4);
                },
                OrderStatus: function () {
                    let num = Math.abs(Math.floor(Math.random() * 3 - 1 + 1));
                    if (num === 0) {
                        return "已拒绝";
                    }
                    if (num === 1) {
                        return "已处理";
                    }
                    if (num === 2) {
                        return "待处理";
                    }
                }, //申请状态
                ProcessingTime: function () {
                    // 处理时间
                    return Mock.Random.datetime("yyyy-MM-dd HH:mm:ss");
                },
                OrderNumber: /3\d{8}/,
                RefundType: function () {
                    let num = Math.floor(Math.random() * 2 - 1);
                    if (num === 1) {
                        return "退货";
                    } else {
                        return "取消订单";
                    }
                },
            },
        ],
    },
});
/*门店列表*/
Mock.mock(/web\/store\/management/, {
    code: 200,
    result: {
        "list|100": [
            {
                StoreId: /5\d{8}/, //
                StoreName: function () {
                    // 店名
                    return Mock.Random.ctitle(4);
                },
                StoreFormat: function () {
                    let num = Math.abs(Math.floor(Math.random() * 8 - 1));
                    if (num === 1) {
                        return "百货店";
                    }
                    if (num === 2) {
                        return "超级市场";
                    }
                    if (num === 3) {
                        return "大卖场";
                    }
                    if (num === 4) {
                        return "便利店";
                    }
                    if (num === 5) {
                        return "专业市场";
                    }
                    if (num === 6) {
                        return "专卖店";
                    }
                    if (num === 7) {
                        return "购物中心";
                    }
                    if (num === 8) {
                        return "仓储式商场";
                    }
                }, // 业态
                Address: function () {
                    return Mock.Random.county(true);
                }, //地址
                StartTime: "8:00" /*开始*/,
                EndTime: "20:00", // 结束时间
                Enable: function () {
                    return Mock.Random.boolean();
                },
            },
        ],
    },
});
// 用户列表
Mock.mock(/web\/user\/list/, {
    code: 200,
    result: {
        "list|100": [
            {
                Id: /\d{9}/, // 退款订单id
                NickName: function () {
                    return Mock.Random.ctitle(4, 6);
                }, // 昵称
                Name: function () {
                    return Mock.Random.cname();
                }, // 真实姓名
                OwnStore: function () {
                    return Mock.Random.ctitle(4, 6);
                }, // 所属门店
                role: function () {
                    let num = Math.abs(Math.floor(Math.random() * 3));
                    if (num === 0) {
                        return "店员";
                    }
                    if (num === 1) {
                        return "运营";
                    }
                    if (num === 2) {
                        return "店长";
                    }
                },
                Status: function () {
                    return Mock.Random.boolean(5, 5, true);
                },
                Tel: /^[1][34578][0-9]{9}$/,
                LastLoginTime: function () {
                    return Mock.Random.datetime("yyyy-MM-dd HH:mm:ss");
                },
                Pwd: /[0-9A-z-_]{6,18}/,
                Email: /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
            },
        ],
    },
});
/*user 门店*/
Mock.mock(/web\/user\/store/, {
    code: 200,
    result: {
        "list|100": [
            {
                Id: /\d{5}/, // 退款订单id
                OwnStore: function () {
                    return Mock.Random.ctitle(4, 6);
                }, // 所属门店
            },
        ],
    },
});
/*发布商品 活动商品*/
Mock.mock(/web\/activity\/list/, {
    code: 200,
    result: {
        "list|100": [
            {
                PromotionId: /\d{9}/, //活动ID
                ProductId: /\d{9}/, // 商品ID
                Sku: /\d{11}/, //SKU码
                PictureUrl: Mock.Random.image("60×60"), //商品图片
                ProductName: "@ctitle", //商品名称
                Price: /[1-9]\d{0,3}/, //正常价
                PromotionPrice: "", //促销价
                FeeRate: "", //佣金比例
                LimitCount: "", //限购数量
                PromotionStock: "", //活动总库存
                PromotionStockNow: "", //当前剩余库存
            },
        ],
    },
});
/*发布商品 门店列表*/
Mock.mock(/web\/activity\/store/, {
    code: 200,
    result: {
        "list|20-100": [
            {
                StoreCode: /\d{9}/, // 门店列表
                StoreName: function () {
                    return Mock.Random.ctitle(3, 6) + "号店";
                }, // 门店名称
                StoreFormat: function () {
                    let num = Math.abs(Math.ceil(Math.random() * 9 - 1));
                    if (num === 1) {
                        return "百货店";
                    } else if (num === 2) {
                        return "超级市场";
                    } else if (num === 3) {
                        return "大卖场";
                    } else if (num === 4) {
                        return "便利店";
                    } else if (num === 5) {
                        return "专业市场";
                    } else if (num === 6) {
                        return "专卖店";
                    } else if (num === 7) {
                        return "购物中心";
                    } else {
                        return "仓储式商场";
                    }
                }, // 业态
            },
        ],
    },
});
/*发布商品 分类商品*/
Mock.mock(/web\/activity\/sort/, {
    code: 200,
    result: {
        "list|5-30": [
            {
                SortNmae: function () {
                    return Mock.Random.ctitle(3, 6); // 分类名
                },
                "SortList|2-15": [
                    {
                        ProductName: function () {
                            return Mock.Random.ctitle(2, 10); //商品名
                        },
                        ProductUrl: function () {
                            return Mock.Random.image("60×60");
                        },
                        Price: /[1-9]\d{1,3}/,
                        ProductCode: /\d{9}/,
                        PromotionId: /\d{9}/, //活动ID
                        ProductId: /\d{9}/, // 商品ID
                        Sku: /\d{11}/, //SKU码
                        PictureUrl: Mock.Random.image("60×60"), //商品图片
                        PromotionPrice: "", //促销价
                        FeeRate: "", //佣金比例
                        LimitCount: "", //限购数量
                        PromotionStock: "", //活动总库存
                        PromotionStockNow: "", //当前剩余库存
                    },
                ],
            },
        ],
    },
});
/*活动列表*/
Mock.mock(/web\/activity\/list/, {
    code: 200,
    result: {
        "list|100-200": [
            {
                ActivityType: function () {
                    let num = Math.floor(Math.random() * 3 + 1);
                    if (num === 1) {
                        return "社群团购";
                    } else if (num === 2) {
                        return "折扣";
                    } else if (num === 3) {
                        return "直降";
                    }
                }, // 活动类型
                ActivityCode: /\d{9}/, // 活动编号
                ActivityName: function () {
                    return Mock.Random.ctitle(4, 6) + "活动";
                }, // 活动名称
                StartTime: function () {
                    return Mock.Random.datetime();
                }, // 开始时间
                EndTime: function () {
                    return Mock.Random.datetime();
                }, // 结束时间
                Status: function () {
                    let num = Math.floor(Math.random() * 3 + 1);
                    if (num === 1) {
                        return "待开始";
                    } else if (num === 2) {
                        return "进行中";
                    } else if (num === 3) {
                        return "已结束";
                    }
                }, // 状态
                Advertising: function () {
                    return Mock.Random.csentence;
                }, // 广告语
                DeliveryMethod: function () {
                    let num = Math.floor(Math.random() * 2 + 1);
                    if (num === 1) {
                        return "仅自提";
                    } else if (num === 2) {
                        return "送货上门";
                    }
                }, // 配送方式
                "ProductList|2-20": [
                    {
                        PromotionId: /\d{9}/, //活动ID
                        ProductId: /\d{9}/, // 商品ID
                        Sku: /\d{11}/, //SKU码
                        PictureUrl: Mock.Random.image("60×60"), //商品图片
                        ProductName: "@ctitle", //商品名称
                        Price: /[1-9]\d{0,3}/, //正常价
                        PromotionPrice: /[1-9]\d{0,3}/, //促销价
                        FeeRate: /[1-9]\d{0,2}/, //佣金比例
                        LimitCount: /[1-9]\d{0,3}/, //限购数量
                        PromotionStock: /[1-9]\d{0,4}/, //活动总库存
                        PromotionStockNow: /[1-9]\d{0,4}/, //当前剩余库存
                    },
                ],
                "StoreList|1-10": [
                    {
                        StoreCode: /\d{9}/, // 门店列表
                        StoreName: function () {
                            return Mock.Random.ctitle(3, 6) + "号店";
                        }, // 门店名称
                        StoreFormat: function () {
                            let num = Math.abs(Math.ceil(Math.random() * 9 - 1));
                            if (num === 1) {
                                return "百货店";
                            } else if (num === 2) {
                                return "超级市场";
                            } else if (num === 3) {
                                return "大卖场";
                            } else if (num === 4) {
                                return "便利店";
                            } else if (num === 5) {
                                return "专业市场";
                            } else if (num === 6) {
                                return "专卖店";
                            } else if (num === 7) {
                                return "购物中心";
                            } else {
                                return "仓储式商场";
                            }
                        }, // 业态
                    },
                ],
                PickupTime: function () {
                    return Mock.Random.datetime();
                },
            },
        ],
    },
});
/**
 * 订单
 * */
Mock.mock(/web\/order\/list/, {
    code: 200,
    result: {
        "list|100": [
            {
                OrderId: /5\d{8}/, // 订单id
                OrderTime: function () {
                    // 下单时间
                    let b = Mock.Random.boolean(5, 5, true);
                    if (b) {
                        return Mock.Random.now("yyyy-MM-dd HH:mm:ss");
                    } else {
                        return Mock.Random.datetime("yyyy-MM-dd HH:mm:ss");
                    }
                }, // 下单时间
                MemberAccount: /7\d{8}/, // 会员账号
                OrderTotal: /[1-9]\d{0,5}/, //订单总额
                OwnStore: function () {
                    // 所属门店
                    return Mock.Random.ctitle(4);
                },
                OrderStatus: function () {
                    let num = Math.floor(Math.random() * 7 + 1);
                    let color = Mock.Random.hex();
                    if (num === 1) {
                        return `<span style="color: #F56C6C">已拒绝</span>`;
                    }
                    if (num === 2) {
                        return `<span style="color: #67C23A">已处理</span>`;
                    }
                    if (num === 3) {
                        return `<span style="color: #7991F4">待付款</span>`;
                    }
                    if (num === 4) {
                        return `<span style="color: #FAECD8">待发货</span>`;
                    }
                    if (num === 5) {
                        return `<span style="color: #E6A23C">待退款</span>`;
                    }
                    if (num === 6) {
                        return `<span style="color: #909399">已退款</span>`;
                    }
                    if (num === 7) {
                        return `<span style="color: #8CC5FF">待收货</span>`;
                    }
                }, //订单状态
                DeliveryMethod: function () {
                    let num = Math.floor(Math.random() * 2 + 1);
                    if (num === 1) {
                        return "自提";
                    } else if (num === 2) {
                        return "配送";
                    }
                }, // 配送方式
                consignee: function () {
                    return Mock.Random.cname();
                },
                PickupDate: function () {
                    return Mock.Random.datetime("yyyy-MM-dd HH");
                }, // 提货时间
                PaymentMethod: function () {
                    let b = Mock.Random.boolean(5, 5, true);
                    if (b) {
                        return "微信支付";
                    } else {
                        return "支付宝";
                    }
                },
                PayId: /\d{9}/,
                "list|1-3": [
                    {
                        ProductId: /\d{9}/, // 商品ID
                        Sku: /\d{11}/, //SKU码
                        PictureUrl: Mock.Random.image("60×60"), //商品图片
                        ProductName: "@ctitle", //商品名称
                        Price: /[1-9]\d{0,3}/, //正常价
                        PromotionPrice: "", //促销价
                        FeeRate: "", //佣金比例
                        LimitCount: "", //限购数量
                        PromotionStock: "", //活动总库存
                        PromotionStockNow: "", //当前剩余库存
                        specification: function () {
                            return Math.random().toFixed(2);
                        },
                        num: /\d{1,10}/,
                    },
                ],
                tel: /^[1][34578][0-9]{9}$/,
                ProductNumber: /\d{9}/, // 商品编号
                address: function () {
                    return Mock.Random.county(true);
                }, // 地址
                userName: function () {
                    return Mock.Random.cname();
                },
            },
        ],
    },
});
Mock.mock(/web\/order\/context/, {
    code: 200,
    result: {
        "list|1-10": [
            {
                context: function () {
                    return Mock.Random.csentence();
                },
                user: "客服小q",
                time: function () {
                    let b = Mock.Random.boolean(5, 5, true);
                    if (b) {
                        return Mock.Random.now("yyyy-MM-dd HH:mm:ss");
                    } else {
                        return Mock.Random.datetime("yyyy-MM-dd HH:mm:ss");
                    }
                },
                look: true,
            },
        ],
    },
});
// 角色管理
Mock.mock(/web\/manager\/role/, {
    code: 200,
    result: {
        "list|100-200": [
            {
                "id|+1": 1,
                code: /1\d{7}/, //编码
                desc: function () {
                    return Mock.Random.ctitle(4, 12);
                },
                name: function () {
                    return Mock.Random.ctitle(2, 6);
                },
            },
        ],
    },
});
// 层级选择
Mock.mock(/web\/product\/level/, {
    code: 200,
    result: {
        "list|2-8": [
            {
                value: function () {
                    return Mock.Random.word();
                },
                label: function () {
                    return Mock.Random.ctitle(3, 6);
                },
                "children|2-8": [
                    {
                        value: function () {
                            return Mock.Random.word();
                        },
                        label: function () {
                            return Mock.Random.ctitle(3, 6);
                        },
                        "children|2-8": [
                            {
                                value: function () {
                                    return Mock.Random.word();
                                },
                                label: function () {
                                    return Mock.Random.ctitle(3, 6);
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    },
});
