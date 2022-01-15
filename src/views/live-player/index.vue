<template>
    <div class="live-player">
        <!-- 上半部 -->
        <div class="live-upper-half">
            <!-- 头部信息 -->
            <div class="live-header flex jsb ac u-box">
                <div class="live-user flex">
                    <div>
                        <van-image
                            round
                            width="35"
                            height="35"
                            src="https://avatars.githubusercontent.com/u/37289564?v=1"
                        />
                    </div>
                    <div class="live-user-rigth">
                        <div class="live-user-name u-line-1">升学教育</div>
                        <div class="fz-12">点赞: {{ liveData.cacheUpvote }}</div>
                    </div>
                </div>

                <!-- 观看-前榜六大哥 -->
                <div class="watch-user flex" v-if="!playback">
                    <div class="temp-position"></div>
                    <div v-for="(item, index) in getUserNo6" :key="index" class="watch-user-image">
                        <van-image round width="30" height="30" :src="item.avatarUrl || ''" />
                    </div>
                    <div class="watch-user-sum fz-12 fw-b">
                        {{ getUserTotalNum }}
                    </div>
                </div>
            </div>

            <!-- 直播题目 -->
            <div class="fz-16 u-line-2 u-box">
                {{ liveData.courseName }}
            </div>

            <!-- 直播屏幕 -->
            <div class="live-main">
                <component
                    v-if="currentVideoComponent"
                    v-bind:is="currentVideoComponent"
                    ref="videoPlayer"
                    :liveState="liveData.liveState"
                    :position="liveData.recordJobGetRespVO"
                    @getCurrentTime="onCurrentTime"
                ></component>
            </div>
        </div>
        <!-- 下半部 -->
        <LiveChat ref="liveChat" :playback="playback" :announcement="liveData.announcement" @socketSend="socketSend" />
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { socket } from '@/utils/socket'

import { tranNumber } from './js/tool'

export default {
    name: 'live-player',
    data() {
        return {
            playback: false, // 是否录播课
            liveData: {}, //直播房间信息
            guestSession: '', // 访客Session

            userList: [], // 观看用户
            totalNum: 0 // 总人数
        }
    },
    computed: {
        ...mapGetters({
            userInfo: 'getUserInfo' // 用户信息
        }),

        // 根据房间信息,获取播放器组件
        currentVideoComponent() {
            let type = this.playback ? 4 : this.liveData.type
            if (!type) {
                return null
            }

            return ['streamPlayer', 'smartPlayer', 'obsPlayer', 'recordPlayer'][type - 1]
        },

        // 获取前榜6大哥
        getUserNo6() {
            if (!Array.isArray(this.userList)) {
                return []
            }
            return this.userList.filter((item, index) => {
                return index <= 6
            })
        },

        // 获取总人数
        getUserTotalNum() {
            const base = this.liveData.userJoinNum || this.getUserNo6.length
            return tranNumber(this.totalNum + base, 1)
        }
    },
    mounted() {
        this.getByIdRoomInfo()
    },
    methods: {
        ...mapMutations('account', ['setUserInfo']),
        // 处理消息回调
        onMsgSessinCallback(val) {
            console.log('会话信息：', val)
            const { message, sendTo, sessionTo } = val
            switch (val.messageType) {
                // 老师拖拽视频
                case 'USER_MOVE_VIDEO':
                    if (this.currentVideoComponent === 'streamPlayer') {
                        this.liveData.recordJobGetRespVO = {
                            ...this.liveData.recordJobGetRespVO,
                            ...JSON.parse(message)
                        }
                    }

                    break

                // 开播
                case 'LIVE_START_EVENT':
                    this.liveData.liveState = 1
                    break

                // 停播
                case 'LIVE_END_EVENT':
                    this.liveData.liveState = 0
                    break

                // 获取当前人员 更新房间人数
                // case "LIVE_GUEST_COUNT":
                //     this.totalNum = parseInt(message) || 0;
                //     break;

                // 访客加入房间-访客 访客连接成功后, 提示有人加入
                case 'GUEST_JOIN_ROOM':
                    this.$refs.liveChat.setMsg({
                        ...message,
                        isMsgTitle: true
                    })
                    if (sendTo === this.userInfo.id) {
                        this.guestSession = sessionTo
                    }
                    this.totalNum = parseInt(message.onlineCount) || 0

                    this.userList.push(message)
                    break

                // [老师发消息] 访客发送消息。接受游客发的消息
                case 'GUEST_SEND_MSG':
                    // flag 1=讲师。2=助教 。其他=学生
                    this.$refs.liveChat.setMsg({
                        ...message,
                        flag: val.flag
                    })
                    break

                // 访客退出
                case 'GUEST_EXIT':
                    this.$refs.liveChat.setMsg({
                        ...message,
                        isMsgTitle: true
                    })
                    this.totalNum = parseInt(message.onlineCount) || 0
                    break

                // 客服发送消息
                case 'USER_SEND_MSG':
                    // todo
                    console.log('客服发送消息')
                    break

                // 接收公告 或 人数设置
                case 'USER_SEND_ANNOUNCEMENT':
                    this.liveData.announcement = message
                    this.liveData.userJoinNum = val.userJoinNum
                    break

                // 接收置顶图片
                case 'USER_TOP_IMG':
                    this.$refs.liveChat.setTopInfo(JSON.parse(message))
                    break

                // 禁言
                case 'GUEST_FORBID_CHAT':
                    break

                // 解除禁言
                case 'GUEST_RESUME_CHAT':
                    break

                // 拉黑，自己被拉黑
                case 'GUEST_BLACK_LIST':
                    break

                // 图片消息 接受图片信息
                case 'USER_SEND_IMG':
                    this.$refs.liveChat.setMsg({
                        ...message,
                        flag: val.flag
                    })
                    break

                // [点赞]
                case 'UPVOTE':
                    this.$refs.liveChat.upvoteAni()
                    this.liveData.cacheUpvote = message
                    break

                // 人数数量设置 或 当前用户设置别名
                case 'LIVE_GUEST_LIST':
                    if (!Array.isArray(message)) return

                    this.userList = message
                    message.find((item) => {
                        if (item.id == this.userInfo.id) {
                            // 修改当前登录用户名字
                            let user = { ...this.userInfo }
                            user.remarkName = item.remarkName
                            this.setUserInfo(user)
                            return item
                        }
                    })
                    break
                default:
                    break
            }
        },

        // 回放获取
        async getAllMsgList() {
            const getMsgListByApp = 'liveRecord/detail/msgListByApp'

            this.recordStartTime = this.liveData?.recordJobGetRespVO?.fileStartTime
                ? new Date(this.$formatTime(this.liveData?.recordJobGetRespVO?.fileStartTime || '')).getTime() / 1000
                : 0

            const params = JSON.stringify({
                roomNumber: this.liveData.lecturerLivingSecretKey,
                pageNum: 1,
                pageSize: 1000
            })
            const { content = [] } = await this.$post(getMsgListByApp, params)

            const chatList = content.map((element) => {
                // 发送时间，格式化
                element.time = new Date(this.$formatTime(element.sendTime)).getTime() / 1000
                return element
            })
            this.chatList = chatList
        },

        // 视频进度 返回秒
        onCurrentTime(second) {
            if (this.recordStartTime) {
                const msgList = this.chatList
                    .filter((e) => {
                        return second + this.recordStartTime >= e.time
                    })
                    .map((item) => {
                        return {
                            content: item.message,
                            nickName: item.nameFrom,
                            messageType: item.messageType,
                            flag: item.flag,
                            isMsgTitle: ['GUEST_EXIT', 'GUEST_JOIN_ROOM'].includes(item.messageType)
                        }
                    })

                this.$nextTick(() => {
                    this.$refs.liveChat.setMsgAll(msgList)
                })
            }
        },

        /* 根据直播房间ID 获取对应直播信息 **/
        async getByIdRoomInfo() {
            // 判断是否录播回放
            const { roomId, playback } = this.$route.query

            this.playback = parseInt(playback) === 1
            const data = await this.$get('user/getRoomInfo', {
                roomId
            })
            console.log('直播间信息：', data)
            this.setLiveData(data || {})

            this.$nextTick(() => {
                this.initPlayer()

                if (this.playback) {
                    // 回放聊天记
                    this.getAllMsgList()
                } else {
                    this.initSocket()
                    // 计算内屏位置
                    // this.setPos(data.recordJobGetRespVO);
                }
            })
        },

        // 设置房间信息
        setLiveData(data) {
            this.liveData = { ...data }
        },

        // 初始化播放器
        initPlayer() {
            if (!this.$refs.videoPlayer) return
            const {
                lecturerLivingSecretKey,
                recordJobGetRespVO,
                coverUrl,
                obsLiveUrl,
                type,
                dutyStartTime,
                fileRecordDuration
            } = this.liveData

            const flay = this.playback || parseInt(type) === 2
            const url = flay ? recordJobGetRespVO.playUrl : obsLiveUrl

            console.log('直播初始化参数：', {
                roomNumber: lecturerLivingSecretKey,
                url,
                coverUrl,
                dutyStartTime,
                fileRecordDuration
            })
            this.$refs.videoPlayer.init({
                roomNumber: lecturerLivingSecretKey,
                url,
                coverUrl,
                dutyStartTime,
                fileRecordDuration
            })
        },

        // 连接直播间聊天
        initSocket() {
            const { lecturerLivingSecretKey } = this.liveData
            const query = {
                roomNumber: lecturerLivingSecretKey, // 站点编号
                remarkName: this.userInfo.remarkName || '',
                guestId: this.userInfo.id, // 游客 ID
                timeStamp: new Date().getTime(), // 请求时间
                nickName: this.userInfo.nickName,
                cellphone: this.userInfo.cellphone,
                avatarUrl: this.userInfo.avatarUrl || ''
            }

            // 开始连接房间聊天
            socket.connect(query, this.onMsgSessinCallback)
        },

        // 发送socket消息
        socketSend({ type, data }) {
            const json = {
                messageType: type,
                data: {
                    msgId: parseInt(Math.random() * 10000000),
                    guestId: this.userInfo.id, // 游客 ID

                    guestSession: this.guestSession,
                    avatarUrl: this.userInfo.avatarUrl || 'https://static.sxmaps.com/icon/teacher_man.png',
                    nickName: this.userInfo.nickName,
                    roomNumber: this.liveData.lecturerLivingSecretKey,
                    remarkName: this.userInfo.remarkName || ''
                },
                ...data
            }
            socket.send(json)
        }
    }
}
</script>

<style lang="less" scoped>
.live-player {
    background: #1e1e1e;
    height: 100vh;
    color: white;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    // 顶部
    .live-header {
        .live-user {
            flex: 3;
            overflow: hidden;
            .live-user-rigth {
                margin-left: 7px;
            }
            .live-user-name {
                margin: 8px 0 5px 0;
                width: 70px;
                font-size: 13.5px;
            }
        }
        .watch-user {
            flex: 5;
            position: relative;
            flex-direction: row-reverse;
            .temp-position {
                width: 12px;
            }
            .watch-user-image {
                margin: 0 3.5px;
            }
            .watch-user-sum {
                position: absolute;
                right: 0;
                top: 50%;
                transform: translatey(-50%);
                padding: 1px 5px;
                background: #3f3f3f;
                color: #dddddd;
                border-radius: 40%;
            }
        }
    }

    // 直播屏幕
    .live-main {
        height: 200px;
        //background: #fff;
        margin-top: 15px;
    }
}
</style>
