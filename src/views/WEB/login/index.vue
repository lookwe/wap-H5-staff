<template>
    <div class="web-login">
        <div class="login-box">
            <h3>登录</h3>
            <login />
        </div>
    </div>
</template>
 
<script>
import login from "@/views/login";
export default {
    name: "webLogin",
    components: {
        login,
    },
    data() {
        return {};
    },
    created() {
        console.log("是否WEB端", this.$isWeb);
    },
    methods: {},
};
</script>
 
<style scoped lang="less">
.web-login {
    width: 100vw;
    height: 100vh;
    background: url(https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.soumeitu.com%2Fwp-content%2Fuploads%2F2020%2F05%2F5ecf5e9b86cea.jpg&refer=http%3A%2F%2Fwww.soumeitu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1644806781&t=3cc71520fff5dc8b6ee1d4f9170746a2)
        no-repeat;
    background-size: cover;
    overflow: hidden;

    .login-box {
        width: 400px;
        height: 285px;
        margin: 200px auto;
        border-radius: 5px;
        overflow: hidden;
        background: #fff;

        h3 {
            text-indent: 15px;
        }

        /deep/.van-cell {
            font-size: 16px;
        }

        /deep/.mod-login {
            height: 100%;
        }

        /deep/.foot {
            font-size: 0.75em;
            img {
                width: 200px;
                margin-bottom: 0.5em;
            }
        }
    }
}
</style>