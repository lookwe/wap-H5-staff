import {
    mapGetters,
    mapMutations
} from "vuex";

export default {
    computed: {
        ...mapGetters({
            userInfo: 'getUserInfo', // 用户信息
            liveData: 'getLiveData', // 直播信息
            socketSession: 'socketSession', // 连接会话信息
        }),
    },
    methods: {
        ...mapMutations('live', ['setLiveData']),
        ...mapMutations("account", ["setUserInfo"]),
        ...mapMutations("socket", ["setSocketSession"]),
    }
}