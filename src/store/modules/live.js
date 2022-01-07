import LocalStorage from "@/utils/localStorage"

const constant = {
    namespaced: true,
    state: {
        liveData: LocalStorage.get("liveData") || {}
    },
    mutations: {
        setLiveData(state, liveData) {
            state.liveData = liveData
            LocalStorage.set("liveData", liveData);
        }
    }

}

export default constant