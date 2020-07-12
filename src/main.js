import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

/**
 * api
 */
import * as api from "./api/api";
Vue.prototype.$api = api;
/**
 * ElementUI 组件及样式
 */
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

/**
 * 格式化样式
 */
import "./assets/css/reset.css";
import "./assets/css/public.css";
Vue.use(ElementUI);

/**
 * js cookie
 *
 * */
import jsCookie from "js-cookie";
Vue.prototype.$jsCookie = jsCookie;

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");
