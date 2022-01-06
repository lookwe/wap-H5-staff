<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
import LocalStorage from "@/utils/localStorage";
import { mapMutations } from "vuex";
export default {
    created() {
        const userInfo = LocalStorage.get("userInfo");
        this.setUserInfo(userInfo);
    },
    methods: {
        ...mapMutations("account", ["setUserInfo"]),
    },
};
</script>
<style></style>
