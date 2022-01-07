import LocalStorage from "@/utils/localStorage"

const constant = {
    namespaced: true,
    state: {
        // 连接对象
        socketData: LocalStorage.get("socketData") || {},

        // 消息回话
        socketSession: LocalStorage.get("socketSession") || {},
    },
    mutations: {
        setSocKetData(state, socketData) {
            state.socketData = socketData
            LocalStorage.set("socketData", socketData);
        },

        setSocketSession(state, socketSession) {
            state.socketSession = socketSession
            LocalStorage.set("socketSession", socketSession);
        }
    }

}

export default constant