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
                        <div class="fz-14 live-user-name u-line-1">
                            升学教育
                        </div>
                        <div class="fz-12">点赞: 342</div>
                    </div>
                </div>
                <div class="watch-user flex">
                    <div class="temp-position"></div>
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
                    <div class="watch-user-sum fz-12">123</div>
                </div>
            </div>

            <!-- 直播题目 -->
            <div class="fz-16 u-line-2 u-box">
                最新华为认证入门到精通的技术DATACO M数通HCI技术
            </div>

            <!-- 直播屏幕 -->
            <div class="live-main">
                <van-image
                    width="100vw"
                    height="200"
                    src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttps%253A%252F%252Fcrawl.ws.126.net%252Fnbot2%252Fimg%252Fc2967abff06c4b2ca9c3524ad6536795.jpg%26thumbnail%3D660x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1643959509&t=28585a4da25d51d0afc7daf94ae7b4ae"
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
            <div class="fz-14 u-line-3">
                <span class="fw-600">【公告】</span>
                <span>
                    是指政府、团体对重大事件当众正式公布或者公开宣告，宣布。国务院2012年4月16日发布、2012法定事项”。其中包含两方面的内容。
                </span>
            </div>

            <!-- 管理重要信息提示 -->
            <div class="live-admin-speak fz-14">
                <span class="admin">班主任：</span>
                这个风景太美啦
            </div>

            <!-- 用户聊天模块 -->
            <div class="speak-list">
                <div
                    class="speak-list__li"
                    v-for="(item, index) in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                    :key="index"
                >
                    <template v-if="index != 0">
                        <span class="user-speak-name">彭伟{{ item }}： </span>
                        <span>感谢大家的礼物感谢大加守护物左上角加守护</span>
                    </template>
                    <template v-else>
                        <span class="new-user-add"> 雷克萨斯加入了直播间 </span>
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
                            v-model="value"
                            shape="round"
                            background="#1e1e1e"
                            placeholder="请输入内容"
                        />
                    </div>
                    <div class="user-handel flex jsb">
                        <div class="bnt">
                            <van-icon class-prefix="icon" name="toupin" />
                        </div>
                        <div class="bnt">
                            <van-icon class-prefix="icon" name="toupin" />
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
export default {
    name: "live-player",
    data() {
        return {
            value: "",
        };
    },
};
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

    // 下半部
    .live-lower-half {
        overflow-y: auto;
        margin-top: 5px;
        position: relative;
    }

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

    .live-main {
        height: 200px;
        background: #fff;
        margin-top: 15px;
    }

    // 直播助手
    .live-assistant {
        background: #182f57;
        border-radius: 5px;
        padding: 10px 15px;
        margin-bottom: 5px;
    }

    // 管理发言
    .live-admin-speak {
        background: #f83333;
        border-radius: 5px;
        color: #ffffff;
        padding: 10px;
        margin-top: 5px;
        display: inline-block;
        .admin {
            color: #ffda56;
        }
    }

    // 用户发言列表模块
    .speak-list {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 65px;
        &__li {
            margin: 7px 0;
        }
        .user-speak-name {
            color: #a2c8df;
            padding-right: 5px;
        }
        .new-user-add {
            color: #dcdee0;
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
        right: 0;
        width: 50px;

        .bnt {
            width: 36px;
            height: 36px;
            background: #fff;
            border-radius: 50%;
            margin-bottom: 15px;
        }
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

        .user-handel {
            padding-right: 14px;
            flex: 1;
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
            }
        }
    }

    // 样式穿透
    /deep/.van-field__left-icon {
        display: none;
    }
}
</style>
