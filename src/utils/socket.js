import socketIO from 'socket.io-client'

export const socket = {
    connect(query, receiveData) {
        this._query = query
        return new Promise((resolve, reject) => {
            try {
                this._socket = socketIO.connect(process.env.VUE_APP_SOCKET_URL, {
                    query,
                    transports: ['websocket', 'xhr-polling', 'jsonp-polling']
                })
            } catch (error) {
                this.disConnect = false
                console.log('连接异常');
            }

            // 链接成功
            this._socket.on('connect', () => {
                console.log('链接成功')
                resolve()
                this.disConnect = true
            })

            // 持续监听
            this._socket.on('message', receiveData)

            // 断开连接
            this._socket.on('disconnect', () => {
                this.disConnect = false
            })

            // 连接失败
            this._socket.on('error', () => {
                console.log('连接失败');
                this.disConnect = false
                reject()
            })

            // 广播推送
            this._socket.on('showmsg', (data) => {
                console.log('广播：', data)
            })
        })
    },
    send(data) {
        if (this._socket && this.disConnect) {
            this._socket.emit('msgpub', JSON.stringify(data))
        }
    }
}