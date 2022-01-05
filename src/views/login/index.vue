<template>
    <div class="mod-login">
        <div class="form-box">
            <van-form @submit="onSubmit" ref="vanForm">
                <van-field
                    v-model="form.nickName"
                    name="nickName"
                    label="昵称"
                    placeholder="请输入您的昵称"
                    :rules="[{ required: true, message: '请填写昵称' }]"
                />

                <van-field
                    v-model="form.cellphone"
                    name="cellphone"
                    label="手机号"
                    placeholder="请输入您的手机号"
                    type="tel"
                    :rules="[{ required: true, message: '请填写手机号' }]"
                />

                <van-field
                    v-model="form.code"
                    label="验证码"
                    name="code"
                    center
                    clearable
                    placeholder="请输入验证码"
                >
                    <template #button>
                        <van-button
                            size="small"
                            type="primary"
                            @click.prevent="getCode"
                            >获取验证码</van-button
                        >
                    </template>
                </van-field>

                <div style="margin: 16px">
                    <van-button round block type="info" native-type="submit"
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
        };
    },
    methods: {
        onSubmit(values) {
            console.log("submit", values);
        },

        getCode() {
            // 判断时间 是否0，判断手机输入输入
            if (this.form.cellphone == "") {
                console.log(this.$refs.vanForm.validate("cellphone"));
                return;
            }

            if (!/\d{11}/.test(this.form.cellphone)) {
                this.$Toast.fail("手机号格式错误 ！");
                return;
            }
            console.log(123);
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
        font-size: 0.75rem;
        img {
            width: 30%;
            margin-bottom: 0.5rem;
        }
    }
}
</style>