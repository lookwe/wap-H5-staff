import Vue from 'vue'
import {
    Tabbar,
    TabbarItem,
    Button,
    Image as VanImage,
    Search,
    Icon,
    Form,
    Field,
    Toast
} from 'vant' //引入组件
import Test from './test'


Vue.component('Test', Test)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Button)
Vue.use(VanImage)
Vue.use(Search)
Vue.use(Icon)
Vue.use(Form)
Vue.use(Field)
Vue.use(Toast)