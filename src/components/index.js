import Vue from 'vue'
import { Tabbar, TabbarItem, Button, Image as VanImage, Search, Icon, Form, Field, Toast, Loading} from 'vant' //引入组件

// 直播组件
import StreamPlayer from './streamPlayer'
import RecordPlayer from './recordPlayer'
import ObsPlayer from './obsPlayer'
import SmartPlayer from './smartPlayer'
import LiveChat from './liveChat'

Vue.component('StreamPlayer', StreamPlayer)
Vue.component('RecordPlayer', RecordPlayer)
Vue.component('obsPlayer', ObsPlayer)
Vue.component('smartPlayer', SmartPlayer)
Vue.component('LiveChat', LiveChat)

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
