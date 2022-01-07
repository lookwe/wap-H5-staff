<template>
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
                    <div class="live-admin-speak fz-14" v-if="item.flag == 1">
                        <span class="admin">{{ item.nickName }}-班主任：</span>
                        {{ item.content }}
                    </div>
                </template>

                <!-- 发言类型 -->
                <template v-else>
                    <span class="user-speak-name">{{ item.nickName }}： </span>
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
</template>
 
<script>
import mixin from "@/views/live-player/js/mixin";
import { socket } from "@/utils/socket";
export default {
    name: "live-player-chat",
    mixins: [mixin],
    data() {
        return {
            userValue: "",
            msgList: [], // 消息列表
        };
    },
    methods: {
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
                    msgId: Math.random() * 100000,
                    guestId: this.userInfo.id, // 游客 ID

                    guestSession: this.socketSession.sessionTo,
                    avatarUrl:
                        this.userInfo.avatarUrl ||
                        "https://static.sxmaps.com/icon/teacher_man.png",
                    nickName: this.userInfo.nickName,
                    roomNumber: this.liveData.lecturerLivingSecretKey,
                    remarkName: this.userInfo.remarkName || "123",
                },
                message: this.userValue,
            };
            console.log("发送消息");
            console.log(json);
            socket.send(json).finally(() => {
                this.userValue = "";
            });
        },

        // 追加消息
        setMsg(msgData) {
            this.msgList.push(msgData);
        },
    },
};
</script>
 
<style scoped lang="less">
@import "../less/index.less";
</style>