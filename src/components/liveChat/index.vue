<template>
    <!-- 下半部 -->
    <div class="live-chat">
        <!-- 直播小助手 -->
        <div class="live-assistant flex jsb ac" v-if="topImgInfo.imageUrl">
            <div class="flex ac">
                <van-image
                    round
                    width="25"
                    height="25"
                    :src="topImgInfo.avatarUrl"
                ></van-image>
                <span class="fz-12 u-lfet-2 ml10">{{
                    topImgInfo.nickName
                }}</span>
            </div>
            <van-image
                width="30"
                height="30"
                :src="topImgInfo.imageUrl"
            ></van-image>
        </div>
        <!-- 公告 -->
        <div class="fz-14 live-notice">
            <span class="fw-b">【公告】</span>
            <span>
                {{ announcement }}
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
                        class="live-admin-speak fz-14 chat-content"
                        v-if="['1', '2'].includes(item.flag)"
                    >
                        <span class="admin user"
                            >{{ item.nickName }}-{{
                                ["", "班主任", "助理"][item.flag * 1]
                            }}：</span
                        >
                        <span class="content" v-html="item.content"></span>
                    </div>
                </template>

                <!-- 发言类型 -->
                <template v-else>
                    <div class="chat-content">
                        <span class="user-speak-name user"
                            >{{ item.nickName }}：
                        </span>
                        <span class="content">{{ item.content }}</span>
                    </div>
                </template>
            </div>
        </div>
        <!-- 右侧点赞特效栏 -->
        <div class="live-right-handel">
            <canvas
                id="thumsCanvas"
                width="200"
                height="400"
                style="width: 100px; height: 220px"
            ></canvas>
        </div>
        <!-- 底部发言模块 回访模式不显示 -->
        <div class="user-bottom-handel" v-if="!playback">
            <div class="flex jsb ac">
                <div class="user-speak-box">
                    <!-- todo -->
                    <div class="speak-info-sun fz-13" v-if="false">
                        99+条信息消息
                    </div>
                    <van-search
                        v-model="userValue"
                        shape="round"
                        :clearable="false"
                        background="#1e1e1e"
                        placeholder="请输入内容"
                        @search="_sendInfo"
                    />
                </div>

                <div class="user-handel flex jsb ac">
                    <!-- <div class="bnt">
                        <van-icon class-prefix="icon" name="toupin" />
                    </div>
                    <div class="bnt">
                        <van-icon class-prefix="icon" name="yuyin" />
                    </div> -->
                    <div
                        id="dianzan"
                        class="bnt"
                        @click="_onThumbClick({ idName: 'dianzan' })"
                    >
                        <van-icon class-prefix="icon" name="Frame347" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Canvas from "./js/canvas";
export default {
    props: ["announcement", "playback"],
    data() {
        return {
            userValue: "",
            msgList: [], // 消息列表

            topImgInfo: {},
        };
    },
    computed: {},
    mounted() {
        this.thumbsUpAni = new Canvas();
    },
    methods: {
        // 添加聊天信息
        setMsg(msgData) {
            this.msgList.push(msgData);
            this._onSenScrollTop();
        },
        setMsgAll(list) {
            this.msgList = list;
            this._onSenScrollTop();
        },
        // 设置顶部图片
        setTopInfo(option) {
            this.topImgInfo = option;
        },
        // 点赞特效
        upvoteAni() {
            this.thumbsUpAni.start();
        },

        // 新增消息后，滚动条到底部
        _onSenScrollTop() {
            const el = document.querySelector(".live-chat");
            el.scrollTop = el.scrollHeight;
        },

        // 发送socket消息，和socket约定格式
        _socketSend(type, data) {
            this.$emit("socketSend", {
                type,
                data,
            });
        },
        // 用户发送消息
        _sendInfo() {
            if (/^\s+$/.test(this.userValue) || this.userValue == "") {
                this.userValue = "";
                return;
            }
            this._socketSend("GUEST_SEND_MSG", {
                message: this.userValue,
            });
            this.userValue = "";
        },
        // 点赞点击
        _onThumbClick({ idName }) {
            this._socketSend("UPVOTE");

            const bnt = document.querySelector("#" + idName);
            bnt.classList.add("__click");
            setTimeout(() => {
                bnt.classList.remove("__click");
            }, 650);
        },
    },
};
</script>
<style scoped lang="less">
.live-chat {
    overflow-y: auto;
    margin-top: 5px;
    position: relative;
    padding: 15px;

    .live-notice {
        color: #fff5db;
    }

    .live-assistant {
        background: #182f57;
        border-radius: 5px;
        padding: 10px 15px;
        margin-bottom: 5px;
    }

    // 用户发言列表模块
    .speak-list {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 65px;
        width: 80vw;
        &__li {
            margin: 9px 0;
        }
        .user-speak-name {
            color: #a2c8df;
            padding-right: 5px;
        }
        .new-user-add {
            color: #dcdee0;
        }
        // 管理发言
        .live-admin-speak {
            background: #f83333;
            border-radius: 5px;
            color: #ffffff;
            padding: 10px;
            margin-top: 5px;
            .admin {
                color: #ffda56;
            }
        }

        .chat-content {
            .user {
                float: left;
            }
            .content {
                word-wrap: break-word;
            }
        }
    }

    .speak-info-sun {
        padding: 2px 4px;
        background: #fff;
        color: #70584f;
        display: inline-block;
        border-radius: 20px;
        position: absolute;
        top: -25px;
        left: 15px;
    }

    .live-right-handel {
        position: fixed;
        bottom: 50px;
        right: -15px;
    }

    // 底部用户发言操作
    .user-bottom-handel {
        width: 100vw;
        background: #1e1e1e;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 10;
        .u-box {
            padding: 5px 15px 20px;
        }

        .user-speak-box {
            width: 86%;
        }

        .user-handel {
            padding-right: 14px;
            height: 54px;
            .bnt {
                width: 36px;
                height: 36px;
                background: #363636;
                border-radius: 50%;
                margin-right: 15px;
                text-align: center;
                line-height: 36px;

                .icon {
                    color: #bbbbbb;
                    font-size: 30px;
                }

                &:last-child {
                    margin-right: 0;
                }

                &.__click {
                    animation: masked-animation 0.7s infinite linear;
                    -webkit-animation: masked-animation 0.7s infinite linear;
                    .icon {
                        color: #f8c033;
                    }
                }

                @-webkit-keyframes masked-animation {
                    0% {
                        transform: scale(0.9, 0.9);
                        -webkit-transform: scale(0.9, 0.9);
                        -moz-transform: scale(0.9, 0.9);
                        -ms-transform: scale(0.9, 0.9);
                        -o-transform: scale(0.9, 0.9);
                    }

                    50% {
                        transform: scale(1, 1);
                        -webkit-transform: scale(1, 1);
                        -moz-transform: scale(1, 1);
                        -ms-transform: scale(1, 1);
                        -o-transform: scale(1, 1);
                    }

                    100% {
                        transform: scale(1.05, 1.05);
                        -webkit-transform: scale(1.05, 1.05);
                        -moz-transform: scale(1.05, 1.05);
                        -ms-transform: scale(1.05, 1.05);
                        -o-transform: scale(1.05, 1.05);
                    }
                }
            }
        }
    }

    // 样式穿透
    /deep/.van-field__left-icon {
        display: none;
    }
}
</style>
