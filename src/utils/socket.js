import socketIO from 'socket.io-client'
export const socket = {
    connect(query, receiveData) {
        this._query = query
        return new Promise((resolve, reject) => {
            this._socket = socketIO.connect(process.env.VUE_APP_SOCKET_URL, {
                query,
                transports: ['websocket', 'xhr-polling', 'jsonp-polling']
            })
            this._socket.on('connect', () => {
                console.log('链接成功')
                resolve()
                this, (disConnect = true)
            })
            this._socket.on('message', receiveData)
            this._socket.on('disconnect', () => {
                this.disConnect = true
            })
            this._socket.on('error', () => {
                console.log('连接失败')
                this.disConnect = true
                reject()
            })
        })
    },
    send(data) {
        if (this._socket) {
            socket.emit('msgpub', JSON.stringify(data))
        }
    }
}
