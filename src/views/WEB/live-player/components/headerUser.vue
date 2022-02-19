<template>
    <div class="header-user flex jsb ac">
        <!-- logo标识 -->
        <div class="web-logo">
            <img src="@/assets/images/login-logo.png" />
        </div>

        <!-- 用户信息 -->
        <div class="user-info flex ac">
            <van-image
                round
                width="40"
                height="40"
                :src="
                    userInfo.headImgUrl ||
                    userInfo.avatarUrl ||
                    'https://static.sxmaps.com/icon/teacher_man.png'
                "
            />
            <span class="fz-16 user-name">{{ userInfo.nickName }}</span>
        </div>
    </div>
</template>
 
<script>
import { mapState } from "vuex";
export default {
    name: "headerUser",
    data() {
        return {};
    },
    computed: {
        ...mapState("account", ["userInfo"]),
    },
    methods: {},
};
</script>
 
<style scoped lang="less">
.header-user {
    width: 100vw;
    height: 65px;
    background: #fff;

    .web-logo {
        img {
            width: 130px;
            margin-left: 20px;
        }
    }

    .user-info {
        margin-right: 20px;
        .user-name {
            margin-left: 10px;
        }
    }
}
</style>