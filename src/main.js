import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import '@/assets/style/global.less'
import instructions from '@/utils/instructions'
import filters from '@/utils/filters'
import utils from '@/utils'
import '@/components'

import 'vant/lib/index.css';
import 'vant/lib/icon/local.css';
import './assets/icon/iconfont.css'

Object.keys(utils).forEach((k) => {
    Vue.prototype[`$${k}`] = utils[k]
})
Object.keys(instructions).forEach((k) => Vue.directive(k, instructions[k]))
Object.keys(filters).forEach((k) => Vue.filter(k, filters[k]))

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: (h) => h(App)
}).$mount('#app')