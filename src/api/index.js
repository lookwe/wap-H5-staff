var baseUrl = 'https://su.sxmaps.com/services/hwlive'
var wsVideoUrl = 'wss://su.sxmaps.com:7074/im/guest'
var suUrl = 'https://su.sxmaps.com'

var ApiUrl = {
    // 登录模块
    login: baseUrl + '/api/user/registOrBindingCellPhone', //绑定手机号或手机号注册登陆
    sendSMSCode: baseUrl + '/api/user/sendSMSCode', //发送短信

    // 直播模块
    getRoomInfo: baseUrl + '/api/user/getRoomInfo', //获取房间信息
    getRedirectUrl: baseUrl + '/api/user/getRedirectUrl', //获取微信授权登录url
    getSnsUserByCode: baseUrl + '/api/user/getSnsUserByCode', //用户点击授权回传code获取微信用户信息
    suUrl: suUrl,
    getSignature: baseUrl + '/api/hwRtc/student/getSignature', //获取rtc签名
    getBackRoomInfo: baseUrl + '/api/hwRtc/get/student/playUrl', //获取房间回放信息
    getMsgListByApp: baseUrl + '/api/liveRecord/detail/msgListByApp', //获取房间聊天信息

    assistant_RoomInfo: baseUrl + '/api/user/getAssistantRoomInfo', //老师获取房间信息
    assistant_playUrl: baseUrl + '/api/hwRtc/get/playUrl', // 老师回去回放地址
    liveRecord_msgList: baseUrl + '/api/liveRecord/detail/msgList', //老师获取消息列表

    liveRecord_detailByApp: baseUrl + '/api/liveRecord/detailByApp/', //获取回放详情
    liveRecord_detail: baseUrl + '/api/liveRecord/detail/' //老师获取回放
}