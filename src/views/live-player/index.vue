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
                        <div class="fz-12">
                            点赞: {{ liveData.cacheUpvote }}
                        </div>
                    </div>
                </div>
                <div class="watch-user flex">
                    <div class="temp-position"></div>
                    <!-- 前榜六大哥 -->
                    <div
                        v-for="(item, index) in [1, 2, 3, 4, 5, 6]"
                        :key="index"
                        class="watch-user-image"
                    >
                        <van-image
                            round
                            width="30"
                            height="30"
                            src="https://avatars.githubusercontent.com/u/37289564?v=1"
                        />
                    </div>
                    <div class="watch-user-sum fz-12 fw-b">123</div>
                </div>
            </div>

            <!-- 直播题目 -->
            <div class="fz-16 u-line-2 u-box">
                {{ liveData.courseName }}
            </div>

            <!-- 直播屏幕 -->
            <div class="live-main">
                <van-image
                    width="100vw"
                    height="200"
                    fit="scale-down"
                    :src="liveData.coverUrl"
                ></van-image>
            </div>
        </div>

        <!-- 下半部 -->
        <live-player-chat ref="liveChat" />
    </div>
</template>

<script>
import { socket } from "@/utils/socket";

import mixin from "@/views/live-player/js/mixin";
import livePlayerChat from "@/views/live-player/component/live-player-chat";
import Canvas from "@/views/live-player/js/canvas";

export default {
    name: "live-player",
    mixins: [mixin],
    components: {
        "live-player-chat": livePlayerChat,
    },
    data() {
        return {};
    },

    mounted() {
        this.getByIdRoomInfo();
        this.thumbsUpAni = new Canvas();
    },

    methods: {
        // 处理消息回调
        onMsgSessinCallback(val) {
            console.log("会话信息：");
            console.log(val);

            // 连接成功
            // 保存回话信息
            this.setSocketSession(val);

            const { message } = val;

            switch (val.messageType) {
                // 老师拖拽视频
                case "USER_MOVE_VIDEO":
                    break;

                // 开播
                case "LIVE_START_EVENT":
                    break;

                // 停播
                case "LIVE_END_EVENT":
                    break;

                // 获取当前人员 更新房间人数
                case "LIVE_GUEST_COUNT":
                    break;

                // 访客加入房间-访客 访客连接成功后, 提示有人进入
                case "GUEST_JOIN_ROOM":
                    this.$refs.liveChat.setMsg({
                        ...message,
                        isMsgTitle: true,
                    });
                    break;

                // [老师发消息] 访客发送消息。接受游客发的消息
                case "GUEST_SEND_MSG":
                    // flag 1=讲师。2=助教 。其他=学生
                    this.$refs.liveChat.setMsg({
                        ...message,
                        flag: val.flag,
                    });
                    break;

                // 访客退出
                case "GUEST_EXIT":
                    this.$refs.liveChat.setMsg({
                        ...message,
                        isMsgTitle: true,
                    });
                    break;

                // 客服发送消息
                case "USER_SEND_MSG":
                    console.log(123);
                    console.log(val);
                    break;

                // 接收公告
                case "USER_SEND_ANNOUNCEMENT":
                    break;

                // 接收置顶图片
                case "USER_TOP_IMG":
                    break;

                // 禁言
                case "GUEST_FORBID_CHAT":
                    break;

                // 解除禁言
                case "GUEST_RESUME_CHAT":
                    break;

                // 拉黑，自己被拉黑
                case "GUEST_BLACK_LIST":
                    break;

                // 图片消息 接受图片信息
                case "USER_SEND_IMG":
                    break;

                // [点赞]
                case "UPVOTE":
                    // 开启点赞特效
                    this.thumbsUpAni.start();
                    this.onSetUPVOTE(message);
                    break;

                default:
                    break;
            }
        },

        onSetUPVOTE(message) {
            let data = this.liveData;
            data.cacheUpvote = message || data.cacheUpvote;
            this.setLiveData(data);
        },

        /* 根据直播房间ID 获取对应直播信息 **/
        async getByIdRoomInfo() {
            const roomId = "61d8f0177465d96bf56387a7";
            const data = await this.$get("user/getRoomInfo", {
                roomId,
            });

            this.setLiveData(data);
            const query = {
                roomNumber: data.lecturerLivingSecretKey, // 站点编号
                remarkName: this.userInfo.remarkName || "",
                guestId: this.userInfo.id, // 游客 ID
                timeStamp: new Date().getTime(), // 请求时间
                nickName: this.userInfo.nickName,
                cellphone: this.userInfo.cellphone,
                avatarUrl: this.userInfo.avatarUrl || "",
            };

            // 开始连接房间
            socket.connect(query, this.onMsgSessinCallback);
        },
    },
};
</script>

<style lang="less" scoped>
@import "./less/index.less";
</style>
