import LocalStorage from "@/utils/localStorage"

const constant = {
    namespaced: true,
    state: {
        userInfo: LocalStorage.get("userInfo") || {}
    },
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo
            LocalStorage.set("userInfo", userInfo);
        },

        emptyUser(state) {
            state.userInfo = {}
            LocalStorage.removeAll()
        }
    }

}

export default constant