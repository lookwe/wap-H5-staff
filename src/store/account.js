import LocalStorage from "@/utils/localStorage"

const constant = {
    namespaced: true,
    state: {
        userInfo: {}
    },
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo
            LocalStorage.set("userInfo", userInfo);
        }
    }

}

export default constant