import request from "./request";
import "./mockData";
// import
const getStoreList = (data) => {
    return request.get("/web/store/list", data);
};
const getPlatformList = (data) => {
    return request.get("/web/platform/list", data);
};
const getHomeData = (data) => {
    return request.get("/web/home", data);
};
const getCaptcha = () => {
    return request.get("/web/captcha");
};
// 退款列表
const getOrderRefused = () => {
    return request.get("/web/order/refund");
};

// 用户列表
const getUser = () => {
    return request.get("/web/user/list");
};

// 用户列表 > 门店列表

const getUserStore = () => {
    return request.get("/web/user/store");
};
// 创建活动列表
const getActivity = () => {
    return request.get("/web/activity/list");
};
// 创建活动列表 门店列表
const getActivityStore = () => {
    return request.get("/web/activity/store");
};
// 获取活动商品
const getActivityProduct = () => {
    return request.get("/web/activity/sort");
};
// 获取活动列表
const getActivityList = () => {
    return request.get("/web/activity/list");
};

// 订单列表
const getOrderList = () => {
    return request.get("/web/order/list");
};
const getOrderContext = () => {
    return request.get("/web/order/context");
};
const getRole = () => {
    return request.get("/web/manager/role");
}; // 角色管理
const getLevel = () => {
    return request.get("/web/product/level");
}; // 角色管理
export {
    getStoreList,
    getPlatformList,
    getHomeData,
    getCaptcha,
    getOrderRefused,
    getUser,
    getUserStore,
    getActivity,
    getActivityStore,
    getActivityProduct,
    getActivityList,
    getOrderList,
    getOrderContext,
    getRole,
    getLevel,
};
