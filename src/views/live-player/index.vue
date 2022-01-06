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
                        <div class="fz-12">点赞: 342</div>
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
                    :src="liveData.coverUrl"
                ></van-image>
            </div>
        </div>

        <!-- 下半部 -->
        <div class="u-box live-lower-half">
            <!-- 直播小助手 -->
            <div class="live-assistant flex jsb ac" v-show="false">
                <div class="flex ac">
                    <van-image
                        round
                        width="25"
                        height="25"
                        src="https://cdn.udivui.com/udiv/album/1.jpg"
                    ></van-image>
                    <span class="fz-12 u-lfet-2">小助手</span>
                </div>
                <div class="fz-12">123</div>
            </div>

            <!-- 公告 -->
            <div class="fz-14 u-line-3 live-notice">
                <span class="fw-b">【公告】</span>
                <span>
                    {{ liveData.announcement }}
                </span>
            </div>

            <!-- 用户聊天模块 -->
            <div class="speak-list">
                <div
                    class="speak-list__li"
                    v-for="(item, index) in msgList"
                    :key="index"
                >
                    <!-- 提示类型 -->
                    <template v-if="item.isMsgTitle">
                        <span class="new-user-add"> {{ item.content }} </span>
                    </template>

                    <!-- flag 1=讲师。2=助教 。其他=学生  -->
                    <template v-else-if="item.flag">
                        <!-- 班主任信息提示 -->
                        <div
                            class="live-admin-speak fz-14"
                            v-if="item.flag == 1"
                        >
                            <span class="admin"
                                >{{ item.nickName }}-班主任：</span
                            >
                            {{ item.content }}
                        </div>
                    </template>

                    <!-- 发言类型 -->
                    <template v-else>
                        <span class="user-speak-name"
                            >{{ item.nickName }}：
                        </span>
                        <span>{{ item.content }}</span>
                    </template>
                </div>
            </div>

            <!-- 右侧操作栏 -->
            <div class="live-right-handel">
                <div class="bnt"></div>
                <div class="bnt"></div>
                <div class="bnt"></div>
                <div class="bnt"></div>
            </div>

            <!-- 底部发言模块 -->
            <div class="user-bottom-handel">
                <div class="flex jsb ac">
                    <div class="user-speak">
                        <div class="speak-info-sun fz-13">99+条信息消息</div>
                        <van-search
                            v-model="userValue"
                            shape="round"
                            :clearable="false"
                            background="#1e1e1e"
                            placeholder="请输入内容"
                            @search="sendInfo"
                        />
                    </div>
                    <div class="user-handel flex jsb">
                        <div class="bnt">
                            <van-icon class-prefix="icon" name="toupin" />
                        </div>
                        <div class="bnt">
                            <van-icon class-prefix="icon" name="yuyin" />
                        </div>
                        <div class="bnt">
                            <van-icon class-prefix="icon" name="Frame347" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { socket } from "@/utils/socket";

const ob = {
    guestSession: "",
};

export default {
    name: "live-player",
    data() {
        return {
            userValue: "",
            liveData: {}, // 直播信息
            msgList: [], // 消息列表
        };
    },
    computed: {
        ...mapGetters(["getUserInfo"]),
    },
    created() {
        this.getRoomInfo();
    },
    methods: {
        // 处理全类型消息
        handlerMsg(val) {
            console.log("1111111");
            console.log(val);
            ob.guestSession = val.sessionTo;
            ob.socketType = val.messageType || "";

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
                    this.msgList.push({
                        ...message,
                        isMsgTitle: true,
                    });
                    break;

                // [老师发消息] 访客发送消息。接受游客发的消息
                case "GUEST_SEND_MSG":
                    // flag 1=讲师。2=助教 。其他=学生
                    this.msgList.push({
                        ...message,
                        flag: val.flag,
                    });
                    break;

                // 访客退出
                case "GUEST_EXIT":
                    this.msgList.push({
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

                default:
                    break;
            }
        },
        //
        async getRoomInfo() {
            const roomId = "61d6939dc449907ff32cd86c";
            const data = await this.$get("user/getRoomInfo", {
                roomId,
            });
            this.liveData = data || {};
            const query = {
                roomNumber: data.lecturerLivingSecretKey, // 站点编号
                remarkName: this.getUserInfo.remarkName || "",
                guestId: this.getUserInfo.id, // 游客 ID
                timeStamp: new Date().getTime(), // 请求时间
                nickName: this.getUserInfo.nickName,
                cellphone: this.getUserInfo.cellphone,
                avatarUrl: this.getUserInfo.avatarUrl || "",
            };

            socket.connect(query, this.handlerMsg);
        },

        // 新增消息
        addMsgInfo(val) {
            this.socketType = val.messageType || "";
        },

        // 用户发送消息
        sendInfo() {
            if (/^\s+$/.test(this.userValue) || this.userValue == "") {
                this.userValue = "";
                return;
            }
            // flag 1=讲师。2=助教 。其他=学生
            var json = {
                messageType: "GUEST_SEND_MSG",
                data: {
                    guestSession: "a97b1714-1fb1-4b40-b706-3d4d056e702d",

                    msgId: Math.random() * 100000,
                    guestId: this.getUserInfo.id, // 游客 ID
                    // guestSession: ob.guestSession,
                    avatarUrl:
                        this.getUserInfo.avatarUrl ||
                        "https://static.sxmaps.com/icon/teacher_man.png",
                    nickName: this.getUserInfo.nickName,
                    roomNumber: this.liveData.lecturerLivingSecretKey,
                    remarkName: this.getUserInfo.remarkName || "123",
                },
                message: this.userValue,
            };
            console.log(json);
            socket.send(json).then(() => {
                this.userValue = "";
            });
        },
    },
};
</script>

<style lang="less" scoped>
@import "./less/index.less";
</style>
