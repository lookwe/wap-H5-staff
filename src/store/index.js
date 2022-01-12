import Vue from 'vue'
import Vuex from 'vuex'
import account from './modules/account'
import constant from './modules/constant'
import getters from '@/store/getters'

Vue.use(Vuex)
const store = new Vuex.Store({
    modules: {
        account,
        constant
    },
    getters
})
export default store
