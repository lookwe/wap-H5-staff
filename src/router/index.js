/*
 * @Author: daihanqiao@126.com
 * @Date: 2020-12-25 18:14:31
 * @LastEditTime: 2021-03-24 14:44:38
 * @LastEditors: daihanqiao@126.com
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
const livePlayer = () => import(/* webpackChunkName: 'livePlayer' */ '@/views/live-player/index.vue')
const login = () => import(/* webpackChunkName: 'login' */ '@/views/login/index.vue')
const webLogin = () => import(/* webpackChunkName: 'webLogin' */ '@/views/WEB/login/index.vue')
const webPlayer = () => import(/* webpackChunkName: 'webLogin' */ '@/views/WEB/live-player/index.vue')

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: login
    },
    {
        path: '/live-player',
        name: 'live-player',
        component: livePlayer
    },

    // WEB版本
    {
        path: '/web-login',
        name: 'webLogin',
        component: webLogin
    },
    {
        path: '/web-player',
        name: 'webPlayer',
        component: webPlayer
    }
]

const router = new VueRouter({
    routes
})

export default router
