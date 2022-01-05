import Vue from 'vue'
import Vuex from 'vuex'
import account from './account'
import constant from './constant'

Vue.use(Vuex)
const store = new Vuex.Store({
    modules: {
        account,
        constant
    }
})
export default store
