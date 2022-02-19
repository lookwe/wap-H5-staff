import router from './router'
import store from '@/store'
import LocalStorage from "@/utils/localStorage";
import {
    get
} from './utils/fetch'


//微信环境
const ua = window.navigator.userAgent.toLowerCase()
const isWeiXin = ua.match(/MicroMessenger/i) == 'micromessenger'

/** 判断是否PC端 */
function isWeb () {
    var inBrowser = typeof window !== 'undefined';
    var UA = inBrowser && ua

    var isAndroid = (UA && UA.indexOf('android') > 0);
    var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA));
    return (isAndroid || isIOS) ? false : true
}

// 微信授权
function wechatAuthorize(query, next) {
    let wxQuery = {
        ...query
    }

    // 微信已授权了
    if (wxQuery.state && wxQuery.code) {

        var json = JSON.parse(decodeURIComponent(wxQuery.state))
        delete wxQuery.state
        wxQuery = Object.assign(wxQuery, json)

        //微信环境添加参数
        //history.pushState('', '', 'login/?playback=' + json.playback + '&roomId=' + json.roomId)
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

    // 判断用户是否注册
    if (userData.token) {
        try {
            // 缓存用户信息
            store.commit('account/setUserInfo', userData)
            delete wxQuery.code
            next({
                path: "/live-player",
                query: wxQuery
            })
        } catch (error) {
            console.error('微信登录直播间报错：' + error);
        }
    } else {
        next({
            path: '/login',
            query: {
                urlParams: wxQuery,
                isNewUser: true,
                userData,
            }
        })
    }
}

// 微信重定向
async function weChatRedirect(wxQuery, next) {
    const weChatUrl = await get('user/getRedirectUrl', {
        redirectUrl: window.location.href.split('?')[0],
        state: encodeURIComponent(
            JSON.stringify({
                roomId: wxQuery.roomId || wxQuery.urlParams?.roomId,
                playback: wxQuery.playback || 0
            })
        )
    })
    // 中断当前的导航
    next(false)
    // 请求微信地址，让微信重定向携带参数回来
    window.location.href = weChatUrl
}

router.beforeEach(async (to, from, next) => {
    let cuctomQuery = {}
    let vueIsNotQuery = true;
    try {
        if (Object.keys(to.query).length === 0) {
            vueIsNotQuery = false
            window.location.search.replace(/([^?&=]+)=([^&]+)/g, function(_, k, v) {
                return (cuctomQuery[k] = v)
            })
        }
    } catch (error) {
        console.error("自定义url解参函数报错:" + error);
    }

    
    if (['/login'].includes(to.path)) {
        if (isWeb()) {
            next({
                path: '/web-login',
                query: {
                   
                        ...to.query,
                        ...from.query,
                    
                }
            })
        }

        // 微信授权判断用户是否新用户 - 是则先登录授权注册
        if (to.query.isNewUser) {
            next()
        } else {
            const wecahtParams = vueIsNotQuery ? to.query : cuctomQuery
            isWeiXin ? wechatAuthorize(wecahtParams, next) : next()
        }
    } else {

        // 确定用户是否已登录
        if (LocalStorage.get("userInfo")?.token) {
            next();
        } else {

            if (to.path === '/web-login') {
                next();
                return
            }

            next({
                path: '/login',
                query: {
                    ...to.query,
                    ...from.query,
                }
            })
        }
    }
})

router.afterEach(() => {

})