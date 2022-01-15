import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import '@/assets/style/global.less'
import instructions from '@/utils/instructions'
import filters from '@/utils/filters'
import utils from '@/utils'
import '@/components'
import './assets/icon/iconfont.css'
import './permission.js'

Object.keys(utils).forEach((k) => {
    Vue.prototype[`$${k}`] = utils[k]
})
Object.keys(instructions).forEach((k) => Vue.directive(k, instructions[k]))
Object.keys(filters).forEach((k) => Vue.filter(k, filters[k]))

Vue.config.productionTip = false

var inBrowser = typeof window !== 'undefined';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();

var isAndroid = (UA && UA.indexOf('android') > 0);
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA));

// 判断是否非手机端
Vue.prototype.$isWeb = (isAndroid || isIOS) ? false : true


new Vue({
    router,
    store,
    render: (h) => h(App)
}).$mount('#app')