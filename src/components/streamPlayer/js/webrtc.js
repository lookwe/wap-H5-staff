import HRTC from './hrtc'
import { bus } from '@/utils/bus'

export default {
    webRtcClient: null,
    mainStream: null,
    screenStream: null,
    async init(roomNumber, options) {
        const config = { appId: options.appId, domain: options.domain }
        this.webRtcClient = HRTC.createClient(config)
        const joinOption = {
            userId: options.userId,
            userName: options.userName,
            signature: options.signature,
            ctime: options.ctime,
            role: 2
        }
        this.webRtcClient.join(roomNumber, joinOption)
        this.addEvent()
    },
    // 用户手动操作开始播放按钮
    play(mainId, screenId) {
        this.mainStream && this.mainStream.play(mainId, { muted: false })
        this.screenStream && this.screenStream.play(screenId, { muted: false })
    },
    addEvent() {
        const webRtcClient = this.webRtcClient
        const self = this
        webRtcClient.on('stream-added', function (event) {
            webRtcClient.subscribe(event.stream, { video: true, audio: true })
            console.log('远程流订阅成功')
        })
        webRtcClient.on('stream-subscribed', function (event) {
            const stream = event.stream
            const type = stream.getType()
            console.log('监听到流，-----', type)
            switch (type) {
                case 'main':
                    self.mainStream = stream
                    break
                case 'auxiliary':
                    self.screenStream = stream
                    break
            }
            console.log(self.mainStream, self.screenStream, '===============')
            if (self.mainStream && self.screenStream) {
                bus.$emit('stream-can-play')
            }
        })
        webRtcClient.on('peer-leave', function (event) {
            console.log(event.userId + '老师离开了')
            self.streamAllRemove()
        })
        webRtcClient.on('stream-removed', function (event) {
            const type = event.stream.getType()
            if (type === 'main') {
                self.streamAllRemove()
            }
            console.log('老师关闭了流', type)
        })
    },
    streamAllRemove() {
        // bus.$emit('stream-all-stop')
        const { mainStream, screenStream } = this
        mainStream && mainStream.close()
        screenStream && screenStream.close()
        this.mainStream = null
        this.screenStream = null
    }
}
