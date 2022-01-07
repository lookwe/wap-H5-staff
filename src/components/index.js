import Vue from 'vue'
import { Tabbar, TabbarItem, Button, Image as VanImage, Search, Icon, Form, Field, Toast, Loading } from 'vant' //引入组件
import StreamPlayer from './streamPlayer'
import RecordPlayer from './recordPlayer'

Vue.component('StreamPlayer', StreamPlayer)
Vue.component('RecordPlayer', RecordPlayer)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Button)
Vue.use(VanImage)
Vue.use(Search)
Vue.use(Icon)
Vue.use(Form)
Vue.use(Field)
Vue.use(Toast)
Vue.use(Loading)
