const getters = {
    getUserInfo: state => state.account.userInfo,
    getLiveData: state => state.live.liveData,
    socketData: state => state.socket.socketData,
    socketSession: state => state.socket.socketSession,
}

export default getters