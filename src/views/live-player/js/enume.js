const MSGTYPE = {
    // 老师拖拽视频
    USER_MOVE_VIDEO: 'USER_MOVE_VIDEO',
    // 开播
    LIVE_START_EVENT: 'LIVE_START_EVENT',
    // 停播
    LIVE_END_EVENT: 'LIVE_END_EVENT',
    // 获取当前人员 更新房间人数
    LIVE_GUEST_COUNT: 'LIVE_GUEST_COUNT',
    // 访客加入房间-访客 访客连接成功后, 提示有人进入
    GUEST_JOIN_ROOM: 'GUEST_JOIN_ROOM',

    // [老师消息]
    GUEST_SEND_MSG: 'GUEST_SEND_MSG',
    // 访客退出
    GUEST_EXIT: 'GUEST_EXIT',
    //  客服发送消息
    USER_SEND_MSG: 'USER_SEND_MSG',
    // 接收公告
    USER_SEND_ANNOUNCEMENT: 'USER_SEND_ANNOUNCEMENT',
    // 接收置顶图片
    USER_TOP_IMG: 'USER_TOP_IMG',
    // 禁言
    GUEST_FORBID_CHAT: 'GUEST_FORBID_CHAT',
    // 解除禁言
    GUEST_RESUME_CHAT: 'GUEST_RESUME_CHAT',
    // 拉黑，自己被拉黑
    GUEST_BLACK_LIST: 'GUEST_BLACK_LIST',
    // 图片消息 接受图片信息
    USER_SEND_IMG: 'USER_SEND_IMG',
}