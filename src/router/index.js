import Vue from "vue";
import VueRouter from "vue-router";
/**
 * 引入页面
 */
import Home from "../views/Home/Home.vue";
import StoreList from "../views/Commodity/StoreList/StoreList";
import ProductList from "../views/Commodity/ProductList/ProductList";
import Login from "../views/Login/Login";
import Reimburse from "../views/Merchandise/Reimburse";
import UserList from "../views/User/UserList";
import OrderList from "../views/Merchandise/OrderList";
import DefraySetting from "../views/Setting/DefraySetting";
import CreateEvent from "../views/Marketing/CreateEvent";
import CreateSuccess from "../views/Marketing/CreateSuccess";
import ActivityList from "../views/Marketing/ActivityList";
import Prohibit from "../views/Prohibit/Prohibit";
import OrderSetting from "../views/Merchandise/OrderSetting";
import RoleManagement from "../views/Authority/RoleManagement";
/**
 *
 * @type {{(location: RawLocation): Promise<Route>; (location: RawLocation, onComplete?: Function, onAbort?: ErrorHandler): void}}
 */
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        meta: {
            auth: false,
        },
    },
    {
        path: "/storelist",
        name: "StoreList",
        component: StoreList,
        meta: {
            auth: true,
        },
    },
    {
        path: "/productlist",
        name: "ProductList",
        component: ProductList,
        meta: {
            auth: true,
        },
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        meta: {
            auth: false,
        },
    },
    {
        path: "/reimburse",
        name: "Reimburse",
        component: Reimburse,
        meta: {
            auth: false,
        },
    },
    {
        path: "/userlist",
        name: "UserList",
        component: UserList,
        meta: {
            auth: false,
        },
    },
    {
        path: "/orderlist",
        name: "OrderList",
        component: OrderList,
        meta: {
            auth: false,
        },
    },
    {
        path: "/defraysetting",
        name: "DefraySetting",
        component: DefraySetting,
        meta: {
            auth: false,
        },
    },
    {
        path: "/createevent",
        name: "CreateEvent",
        component: CreateEvent,
        meta: {
            auth: false,
        },
    },
    {
        path: "/createevent/createsuccess",
        name: "CreateSuccess",
        component: CreateSuccess,
        meta: {
            auth: false,
        },
    },
    {
        path: "/activitylist",
        name: "ActivityList",
        component: ActivityList,
        meta: {
            auth: false,
        },
    },
    {
        path: "/ordersetting",
        name: "OrderSetting",
        component: OrderSetting,
        meta: {
            auth: false,
        },
    },
    {
        path: "/rolemanagement",
        name: "RoleManagement",
        component: RoleManagement,
        meta: {
            auth: false,
        },
    },
    {
        path: "/*",
        name: "Prohibit",
        component: Prohibit,
    },
];

const router = new VueRouter({
    routes,
});

import jsCookie from "js-cookie";

router.beforeEach((to, from, next) => {
    if (to.meta.auth) {
        if (jsCookie.get("admin_manager")) {
            next();
        } else {
            next("/login?redirect=" + to.path);
        }
    } else {
        next();
    }
});

export default router;
