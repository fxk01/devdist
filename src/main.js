import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import axios from 'axios';
import VeeValidate, { Validator } from 'vee-validate';
import { post, get } from './utils/http';
import './utils/filter.js';
import store from '../src/store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';// 默认主题
// import '../static/css/theme-picker/button.css';
import '../src/components/common/font/iconfont.css';
import "../static/css/main.css";
import 'babel-polyfill';
import 'viewerjs/dist/viewer.css';
Vue.use(ElementUI, { size: 'small' });
Vue.use(Vuex);

const config = {
    fieldsBagName: 'fieldBags',
};
Vue.use(VeeValidate, config);

Validator.locale = 'en' ? 'zh_CN' : 'en';
Validator.localize(Validator.locale, {
    // zh_CN.messages
    messages: {
        required:(field) => `${field}不能爲空！`,
        // numeric:(field) => `${field}只能为数字！`
        // is_not: (field)=> `${field}不一致！`,
    },
    attributes:{
        loginName:'登录名',
        loginPassword:'密码'
    },
});

//公共js文件
import comm from 'static/js/comm.js';
import el from "element-ui/src/locale/lang/el";
Vue.prototype.comm = comm;

Vue.prototype.$axios = axios;
Vue.prototype.$get = get;
Vue.prototype.$post = post;

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app');