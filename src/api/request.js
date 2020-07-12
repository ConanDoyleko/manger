import axios from "axios";
import qs from "qs";
const BASEURL = process.env.NODE_ENV === "production" ? "https://www.xxx.com" : ""; // 切换线上线下开发环境的 BASEURL
let request = axios.create({
    baseURL: BASEURL,
    timeout: 5000,
});
// 创建 axios 实例
request.interceptors.request.use(
    (config) => {
        config.headers.token = sessionStorage.getItem("token");
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

// 发送 请求拦截 添加 token 头信息
request.interceptors.response.use(
    (res) => {
        // 加载提示  301,401,403,404,505,
        return res;
    },
    (err) => {
        return Promise.reject(err);
    }
);

request.postURL = function (url, data, options = {}) {
    return new Promise(function (resolve, reject) {
        request({
            url: url,
            data: qs.stringify(data),
            ...options,
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                ...options.headers,
            },
        })
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    });
};

/*
 * jsonp 方法
 * @param {String} url 请求地址
 * @params {Object} option 参数  默认值 callback
 * @returns
 * */
request.jsonp = function jsonp(url, option) {
    let DEFAULT = { jp: "callback", callback: "jp" }; // 默认参数
    option = Object.assign(DEFAULT, option); //参数等于默认参 和option 用户传参合并

    return new Promise((resolve, reject) => {
        // 查看url是否有jp 没有还要加上
        if (url.indexOf(option.jp) === -1) {
            url += "&" + option.jp + "=" + option.callback;
        }
        // 获取callback的值
        let p1 = url.indexOf(option.jp);
        let p2 = url.indexOf("&", p1);
        p2 === -1 ? (p2 = url.length) : ""; //如果查找不到设置p2位url.length;
        let callback = url.slice(p1 + option.jp.length + 1, p2);

        // 动态的创建callback方法
        window[callback] = function (data) {
            document.head.removeChild(script);
            resolve(data);
        };
        // 动态创建script标签
        let script = document.createElement("script");
        script.src = url;
        document.head.append(script);
        // script加载失败
        script.onerror = function (e) {
            document.head.removeChild(script);
            reject(e);
        };
    });
};

export default request;
