import router from './router'
import store from '@/store'
import LocalStorage from "@/utils/localStorage";
import {
    get
} from './utils/fetch'


//微信环境
const ua = window.navigator.userAgent.toLowerCase()
const wx = ua.match(/MicroMessenger/i) == 'micromessenger'

// 微信授权
function wechatAuthorize(router, next) {
    console.log('wechatAuthorize参数：', router);

    let wxQuery = {
        ...router.query
    }

    // 微信已授权了
    if (wxQuery.state && wxQuery.code) {
        alert(JSON.stringify(wxQuery))
        var json = JSON.parse(decodeURIComponent(wxQuery.state))
        wxQuery = Object.assign(wxQuery, json)

        //微信环境添加参数
        history.pushState('', '', 'login/?playback=' + json.playback + '&roomId=' + json.roomId)

        // 登录
        weChatLogin(wxQuery, next)
    } else {
        // 还没有得到微信授权，需求请求微信
        weChatRedirect(wxQuery, next)
    }

}

// 根据code 获取用户信息 并登录直播
async function weChatLogin(wxQuery, next) {
    const userData = await get('user/getSnsUserByCode', {
        code: wxQuery.code
    })
    console.log('根据Code获取的用户信息：', userData);
    // 缓存用户信息
    store.commit('account/setUserInfo', userData)
    delete wxQuery.code
    next({
        path: "/live-player",
        query: wxQuery
    })
}

// 微信重定向
async function weChatRedirect(wxQuery, next) {
    const red = await get('user/getRedirectUrl', {
        redirectUrl: window.location.href.split('?')[0],
        state: encodeURIComponent(
            JSON.stringify({
                roomId: wxQuery.roomId,
                playback: wxQuery.playback || 0
            })
        )
    })
    console.log('获取微信重定向URL:', red);
    // 中断当前的导航
    next(false)
    // 请求微信地址，让微信重定向携带参数回来
    window.location.href = red.data
}

router.beforeEach(async (to, from, next) => {

    console.log('to:', to);
    console.log('from:', from);
    alert(JSON.stringify(to))
    alert(JSON.stringify(from))


    // 确定用户是否已登录
    const {
        token
    } = (LocalStorage.get("userInfo") || {})
    if (token) {

        if (to.path === '/login') {
            wx ? wechatAuthorize(to, next) : next()
        } else {
            next()
        }
    } else {
        /* 没有token */
        if (to.path === '/login') {
            next();
            return
        }
        next({
            path: '/login',
            query: from.query
        })
    }
})

router.afterEach(() => {

})