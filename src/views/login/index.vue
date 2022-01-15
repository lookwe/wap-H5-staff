<template>
    <div class="mod-login">
        <div class="form-box">
            <van-form
                :show-error-message="false"
                @submit="onSubmit"
                ref="vanForm"
            >
                <van-field
                    v-model="form.nickName"
                    name="nickName"
                    label="昵称"
                    placeholder="请输入您的昵称"
                    :rules="[{ required: true }]"
                />

                <van-field
                    v-model="form.cellphone"
                    name="cellphone"
                    label="手机号"
                    type="tel"
                    placeholder="请输入您的手机号"
                    :rules="[{ required: true }]"
                />

                <van-field
                    v-model="form.code"
                    name="code"
                    label="验证码"
                    type="digit"
                    center
                    clearable
                    placeholder="请输入验证码"
                    :rules="[{ required: true }]"
                >
                    <template #button>
                        <van-button
                            size="small"
                            type="primary"
                            plain
                            :disabled="time > 0"
                            @click.prevent="getCode"
                        >
                            <span v-if="time == 0">获取验证码</span>
                            <span v-else>重新发送({{ time }})</span>
                        </van-button>
                    </template>
                </van-field>

                <div style="margin: 16px">
                    <van-button block type="primary" native-type="submit"
                        >提交</van-button
                    >
                </div>
            </van-form>
        </div>

        <div class="foot">
            <div><img src="@/assets/images/login-logo.png" /></div>
            <div>升学教育信息技术中心</div>
        </div>
    </div>
</template>
 
<script>
import { mapMutations } from "vuex";
export default {
    name: "login",
    data() {
        return {
            form: {
                nickName: "",
                cellphone: "",
                code: "",
            },
            time: 0,
            avatarUrl: "", // 微信
        };
    },
    created() {
        const { urlParams, isNewUser, userData } = this.$route.query;

        console.log("login页面：", this.$route.query);

        this.urlParams = urlParams;
        this.userData = userData;
        this.isNewUser = isNewUser;

        if (isNewUser) {
            this.form.nickName = userData.nickName;
        }
    },
    methods: {
        ...mapMutations("account", ["setUserInfo"]),
        // 提交
        async onSubmit(parmas) {
            if (!this.isPhone) return;

            const loginApi = "user/registOrBindingCellPhone";

            // 判断是否微信新用户
            let apiParams = this.isNewUser
                ? {
                      openId: this.userData?.openId,
                      publicId: this.userData?.openId,
                      ...parmas,
                  }
                : parmas;

            const userData = await this.$post(loginApi, apiParams);

            // 模拟Api
            // console.log(loginApi, apiParams);
            // const userData = {
            //     nickName: "lookwe",
            //     openId: null,
            //     province: null,
            //     publicId: null,
            //     remarkName: "kk",
            //     sex: null,
            //     subscribe: null,
            //     subscribeTime: null,
            //     token: "38_1567d4ae8bbd4f1297e429f12c8ca9d4",
            //     avatarUrl: "",
            //     cellphone: "17665090980",
            //     city: null,
            //     code: "402325",
            //     country: null,
            //     createTime: "2022-01-06T03:07:59Z",
            // };

            this.addUserCache(userData); // 缓存

            // 跳转首页
            if (userData.token) {
                try {
                    this.$router.push(
                        {
                            path: "/live-player",
                            query: this.urlParams || {},
                        },
                        () => {}
                    );
                } catch (error) {
                    console.error("登录页跳转报错：" + error);
                }
            }
        },

        async getCode() {
            if (this.time != 0) {
                return;
            }

            if (this.form.cellphone == "") {
                this.$refs.vanForm.validate("cellphone");
                return;
            }
            if (!this.isPhone) return;

            this.timeHandle();
            try {
                await this.$get("user/sendSMSCode", {
                    cellphone: this.form.cellphone,
                });
                this.$toast("发送成功！");
            } catch (error) {
                console.log(error);
                this.clearHandle();
            }
        },

        isPhone() {
            if (!/\d{11}/.test(this.form.cellphone)) {
                this.$toast("手机号格式错误 ！");
                return false;
            }
            return true;
        },

        timeHandle() {
            this.time = 60;
            this.timeOut = setInterval(() => {
                this.time--;
                if (this.time == 0) {
                    this.clearHandle();
                }
            }, 1000);
        },
        clearHandle() {
            clearInterval(this.timeOut);
            this.time = 0;
        },

        addUserCache(userData) {
            const avatarUrl =
                userData.headImgUrl ||
                this.userData?.headImgUrl ||
                this.avatarUrl ||
                "";
            const data = {
                ...userData,
                ...this.form,
                avatarUrl,
                headImgUrl: avatarUrl,
            };
            this.setUserInfo(data);
            console.log("设置缓存");
            console.log(this.setUserInfo(data));
        },
    },
};
</script>
 
<style scoped lang="less">
.mod-login {
    background-color: #f4f4f4;
    height: 100vh;
    position: relative;
    overflow: hidden;

    .foot {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 4%;
        text-align: center;
        color: #999;
        font-size: 0.75em;
        img {
            width: 30%;
            margin-bottom: 0.5em;
        }
    }
}
</style>