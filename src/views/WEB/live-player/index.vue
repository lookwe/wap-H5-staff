<template>
    <div class="web-live-player">
        <headerUser></headerUser>
        <main class="web-main">
            <div class="player-box">
                <div id="player-video">
                    <component
                        v-if="currentVideoComponent"
                        v-bind:is="currentVideoComponent"
                        ref="videoPlayer"
                        :liveState="liveData.liveState"
                        :position="liveData.recordJobGetRespVO"
                        @getCurrentTime="onCurrentTime"
                    />
                </div>
                <div class="bottom-copyright">升学教育信息技术中心</div>
            </div>
            <div class="chat-box">
                <!-- 聊天室切换 -->
                <!-- <div class="top-nav-box">
                    <div
                        :class="chatType == 0 ? 'active' : ''"
                        @click="chatType = 0"
                    >
                        聊天室
                    </div>
                    <div
                        :class="chatType == 1 ? 'active' : ''"
                        @click="chatType = 1"
                    >
                        在线人数(292)
                    </div>
                </div> -->

                <!-- 聊天记录 -->
                <h3>聊天室</h3>
                <div class="public-notice">
                    <span class="fw-b">【公告】</span>
                    <span>{{ liveData.announcement }}</span>
                </div>

                <!-- 置顶图片 -->
                <div
                    class="live-assistant flex jsb ac"
                    v-if="topImgInfo.imageUrl"
                >
                    <div class="flex ac">
                        <van-image
                            round
                            width="25"
                            height="25"
                            :src="topImgInfo.avatarUrl"
                        />
                        <span class="fz-16 u-lfet-2 ml10">{{
                            topImgInfo.nickName
                        }}</span>
                    </div>
                    <van-image
                        width="30"
                        height="30"
                        :src="topImgInfo.imageUrl"
                    />
                </div>

                <!-- 聊天记录 -->
                <div
                    class="chat-list"
                    :style="{ height: overChatHeigth + 'px' }"
                >
                    <!-- 对方信息 -->
                    <div
                        v-for="(item, index) in msgList"
                        :key="index"
                        :class="['flex', item.isOneself ? 'f-row-re' : '']"
                    >
                        <div>
                            <van-image
                                round
                                width="40"
                                height="40"
                                :src="item.avatarUrl"
                            />
                        </div>
                        <div
                            :class="[
                                'chat-info',
                                item.isOneself ? 'oneself' : '',
                            ]"
                        >
                            <div class="fz-12 c-txt">
                                {{ item.nickName }} {{ item.time }}
                            </div>
                            <div class="chat-msg" v-html="item.content"></div>
                        </div>
                    </div>
                </div>

                <!-- 发送消息 -->
                <div class="bottom-input">
                    <input
                        type="text"
                        class="input-msg"
                        :placeholder="'同学、发个言吧' + overChatHeigth"
                        v-model="userValue"
                    />
                    <van-button type="primary" @click="_sendInfo">
                        <span class="c-000">发送</span>
                    </van-button>
                </div>
            </div>
        </main>
    </div>
</template>
 
<script>
import headerUser from "./components/headerUser";
import { mapGetters, mapMutations } from "vuex";
import { socket } from "@/utils/socket";

export default {
    name: "webPlayer",
    components: {
        headerUser,
    },
    data() {
        return {
            chatType: 0, // 0-聊天室，1-在线人数,
            userValue: "",

            playback: false, // 是否录播课
            liveData: {}, //直播房间信息
            guestSession: "", // 访客Session

            userList: [], // 观看用户
            totalNum: 0, // 总人数

            topImgInfo: {}, // 置顶图片信息
            msgList: [], // 消息列表,

            overChatHeigth: 500, // 默认聊天记录高度
        };
    },
    computed: {
        ...mapGetters({
            userInfo: "getUserInfo", // 用户信息
        }),

        // 根据房间信息,获取播放器组件
        currentVideoComponent() {
            let type = this.playback ? 4 : this.liveData.type;
            if (!type) {
                return null;
            }

            return ["streamPlayer", "smartPlayer", "obsPlayer", "recordPlayer"][
                type - 1
            ];
        },
    },
    mounted() {
        this.getByIdRoomInfo();

        const boxh = document.querySelector(".chat-box").offsetHeight;
        const puhh = document.querySelector(".public-notice").offsetHeight; // 65
        let heigth = boxh - puhh - 25 - 165;

        if (this.topImgInfo.imageUrl) {
            heigth -= 70;
        }

        this.overChatHeigth = heigth;
    },
    methods: {
        // 用户发送消息
        _sendInfo() {
            if (/^\s+$/.test(this.userValue) || this.userValue == "") {
                this.userValue = "";
                return;
            }
            this.socketSend("GUEST_SEND_MSG", {
                message: this.userValue,
            });
            this.userValue = "";
        },

        ...mapMutations("account", ["setUserInfo", "emptyUser"]),
        // 处理消息回调
        onMsgSessinCallback(val) {
            console.log("连接会话信息：", val);
            const { message, sendTo, sessionTo } = val;
            switch (val.messageType) {
                // 老师拖拽视频
                case "USER_MOVE_VIDEO":
                    if (this.currentVideoComponent === "streamPlayer") {
                        this.liveData.recordJobGetRespVO = {
                            ...this.liveData.recordJobGetRespVO,
                            ...JSON.parse(message),
                        };
                    }

                    break;

                // 开播
                case "LIVE_START_EVENT":
                    this.liveData.liveState = 1;
                    break;

                // 停播
                case "LIVE_END_EVENT":
                    this.liveData.liveState = 0;
                    break;

                // 获取当前人员 更新房间人数
                case "LIVE_GUEST_COUNT":
                    this.totalNum = parseInt(message) || 0;
                    break;

                // 访客加入房间-访客 访客连接成功后, 提示有人加入
                case "GUEST_JOIN_ROOM":
                    if (sendTo === this.userInfo.id) {
                        this.guestSession = sessionTo;
                    }
                    this.totalNum = parseInt(message.onlineCount) || 0;
                    this.userList.push(message);
                    break;

                // 接受消息
                case "GUEST_SEND_MSG":
                    // flag 1=讲师。2=助教 。其他=学生
                    this.setMsg({
                        ...message,
                        flag: val.flag,
                    });

                    break;

                // 访客退出
                case "GUEST_EXIT":
                    this.totalNum = parseInt(message.onlineCount) || 0;
                    break;

                // 客服发送消息
                case "USER_SEND_MSG":
                    // todo
                    console.log("客服发送消息");
                    break;

                // 接收公告 或 人数设置
                case "USER_SEND_ANNOUNCEMENT":
                    this.liveData.announcement = message;
                    this.liveData.userJoinNum = val.userJoinNum;
                    break;

                // 接收置顶图片
                case "USER_TOP_IMG":
                    this.topImgInfo = JSON.parse(message);
                    break;

                // 禁言
                case "GUEST_FORBID_CHAT":
                    break;

                // 解除禁言
                case "GUEST_RESUME_CHAT":
                    break;

                // 拉黑，自己被拉黑
                case "GUEST_BLACK_LIST":
                    this.$toast("你已被踢出直播间");
                    this.emptyUser();
                    this.$router.push({
                        name: "login",
                    });
                    break;

                // 图片消息 接受图片信息
                case "USER_SEND_IMG":
                    this.setMsg({
                        ...message,
                        flag: val.flag,
                    });
                    break;

                // [点赞]
                case "UPVOTE":
                    // this.$refs.liveChat.upvoteAni();
                    //this.liveData.cacheUpvote = message;
                    break;

                // 人数数量设置 或 当前用户设置别名
                case "LIVE_GUEST_LIST":
                    if (!Array.isArray(message)) return;

                    this.userList = message;
                    message.find((item) => {
                        if (item.id == this.userInfo.id) {
                            // 修改当前登录用户名字
                            let user = { ...this.userInfo };
                            user.remarkName = item.remarkName;
                            this.setUserInfo(user);
                            return item;
                        }
                    });
                    break;
                default:
                    break;
            }
        },

        // 回放获取
        async getAllMsgList() {
            const getMsgListByApp = "liveRecord/detail/msgListByApp";

            this.recordStartTime = this.liveData?.recordJobGetRespVO
                ?.fileStartTime
                ? new Date(
                      this.$formatTime(
                          this.liveData?.recordJobGetRespVO?.fileStartTime || ""
                      )
                  ).getTime() / 1000
                : 0;

            const params = JSON.stringify({
                roomNumber: this.liveData.lecturerLivingSecretKey,
                pageNum: 1,
                pageSize: 1000,
            });
            const { content = [] } = await this.$post(getMsgListByApp, params);

            const chatList = content.map((element) => {
                // 发送时间，格式化
                element.time =
                    new Date(this.$formatTime(element.sendTime)).getTime() /
                    1000;
                return element;
            });
            this.chatList = chatList;
        },

        // 视频进度 返回秒
        onCurrentTime(second) {
            if (this.recordStartTime) {
                const msgList = this.chatList
                    .filter((e) => {
                        return second + this.recordStartTime >= e.time;
                    })
                    .map((item) => {
                        return {
                            content: item.message,
                            nickName: item.nameFrom,
                            messageType: item.messageType,
                            flag: item.flag,
                            isMsgTitle: [
                                "GUEST_EXIT",
                                "GUEST_JOIN_ROOM",
                            ].includes(item.messageType),
                        };
                    });

                this.$nextTick(() => {
                    this.setMsgAll(msgList);
                });
            }
        },

        /* 根据直播房间ID 获取对应直播信息 **/
        async getByIdRoomInfo() {
            // 判断是否录播回放
            const { roomId, playback } = this.$route.query;

            this.playback = parseInt(playback) === 1;
            const data = await this.$get("user/getRoomInfo", {
                roomId,
            });
            console.log("直播间信息：", data);
            console.log(this.playback);
            this.setLiveData(data || {});

            this.$nextTick(() => {
                this.initPlayer();

                if (this.playback) {
                    // 回放聊天记
                    this.getAllMsgList();
                } else {
                    this.initSocket();
                }
            });
        },

        // 设置房间信息
        setLiveData(data) {
            this.liveData = { ...data };
        },

        // 初始化播放器
        initPlayer() {
            if (!this.$refs.videoPlayer) return;
            const {
                lecturerLivingSecretKey,
                recordJobGetRespVO,
                coverUrl,
                obsLiveUrl,
                type,
                dutyStartTime,
                fileRecordDuration,
            } = this.liveData;

            const flay = this.playback || parseInt(type) === 2;
            const url = flay ? recordJobGetRespVO.playUrl : obsLiveUrl;

            this.$refs.videoPlayer.init({
                roomNumber: lecturerLivingSecretKey,
                url,
                coverUrl,
                dutyStartTime,
                fileRecordDuration,
            });
        },

        // 连接直播间聊天
        initSocket() {
            const { lecturerLivingSecretKey } = this.liveData;
            const query = {
                roomNumber: lecturerLivingSecretKey, // 站点编号
                remarkName: this.userInfo.remarkName || "",
                guestId: this.userInfo.id, // 游客 ID
                timeStamp: new Date().getTime(), // 请求时间
                nickName: this.userInfo.nickName,
                cellphone: this.userInfo.cellphone,
                avatarUrl: this.userInfo.avatarUrl || "",
            };

            console.log("连接直播间聊天====initSocket:", query);

            // 开始连接房间聊天
            socket.connect(query, this.onMsgSessinCallback);
        },

        // 发送socket消息
        socketSend(type, data) {
            const json = {
                messageType: type,
                data: {
                    msgId: parseInt(Math.random() * 10000000),
                    guestId: this.userInfo.id, // 游客 ID

                    guestSession: this.guestSession,
                    avatarUrl:
                        this.userInfo.avatarUrl ||
                        "https://static.sxmaps.com/icon/teacher_man.png",
                    nickName: this.userInfo.nickName,
                    roomNumber: this.liveData.lecturerLivingSecretKey,
                    remarkName: this.userInfo.remarkName || "",
                },
                ...data,
            };
            socket.send(json);
        },

        // 添加聊天信息
        setMsg(msgData) {
            this.msgList.push({
                ...msgData,
                time: new Date().toLocaleTimeString(),
                // 判断是否自己发的
                isOneself: this.userInfo.nickName === msgData.nickName,
            });
            this._onSenScrollTop();
            // this._omAddImgClick();
        },
        setMsgAll(list) {
            this.msgList = list;
            this._onSenScrollTop();
        },

        _onSenScrollTop() {
            this.$nextTick(() => {
                const el = document.querySelector(".chat-list");
                el.scrollTop = el.scrollHeight + 1000;
            });
        },
    },
};
</script>
 
<style scoped lang="less">
.web-live-player {
    .web-main {
        width: 100vw;
        height: calc(100vh - 65px);
        display: flex;

        .player-box {
            flex: 4;
            background: #1e1e1e;
            position: relative;
            #player-video {
                width: 100%;
                height: 650px;
                margin-top: 100px;
                background: #fff;
            }
            .bottom-copyright {
                position: absolute;
                left: 50%;
                bottom: 20px;
                transform: translateX(-50%);
                font-size: 15.5px;
                color: #fff;
            }
        }

        .chat-box {
            flex: 1;
            padding: 15px;
            position: relative;
            overflow: hidden;
            box-sizing: border-box;
            border-top: 2px #e8e8e8 solid;
            border-left: 1px #1e1e1e solid;

            // 聊天室切换
            .top-nav-box {
                width: 70%;
                height: 50px;
                margin: 20px auto;
                border-radius: 15px;
                overflow: hidden;
                display: flex;
                & > div {
                    flex: 1;
                    text-align: center;
                    line-height: 50px;
                    background: #e9e9e9;
                    cursor: pointer;

                    &.active {
                        background: #f9c034;
                    }
                }
            }

            // 公告
            .public-notice {
                background: #fffce6;
                padding: 8px 10px;
                border-radius: 8px;
                border: 2px solid #fbe194;
            }

            // 置顶图片
            .live-assistant {
                background: #cce0ff;
                color: #1061ea;
                padding: 10px 15px;
                margin-bottom: 5px;
            }

            // 聊天记录
            .chat-list {
                margin-top: 15px;
                margin-bottom: 50px;
                min-height: 56vh;
                overflow-y: auto;
                .chat-info {
                    margin-left: 10px;

                    &.oneself {
                        margin-right: 10px;
                        margin-left: 0;
                    }

                    .chat-msg {
                        font-size: 14px;
                        padding: 4px 8px;
                        background: #e7e7e7;
                        margin-top: 5px;

                        /deep/ img {
                            max-width: 100%;
                        }
                    }
                }

                & > div {
                    margin-bottom: 15px;
                }
            }

            .bottom-input {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 50px;
                width: 100%;
                border-top: 2px #e8e8e8 solid;
                background: #fff;
                z-index: 10;
                padding: 15px;
                display: flex;
                overflow: hidden;

                .input-msg {
                    width: 72%;
                    height: 45px;
                    outline-style: none;
                    border: 1px solid #c0c4cc;
                    border-radius: 5px;
                    padding: 0;
                    padding: 10px 15px;
                    box-sizing: border-box;
                    font-family: "Microsoft soft";
                    &:focus {
                        border-color: #f07b00;
                        outline: 0;
                        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
                            #f07b00;
                        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
                            #f07b00;
                    }
                    margin-right: 10px;
                }
            }
        }
    }
}
</style>