import Vue from 'vue'
import Vuex from 'vuex'
import account from './modules/account'
import constant from './modules/constant'
import live from '@/store/modules/live'
import socket from '@/store/modules/socket'
import getters from '@/store/getters'

Vue.use(Vuex)
const store = new Vuex.Store({
    modules: {
        account,
        constant,
        live,
        socket
    },
    getters
})
export default store