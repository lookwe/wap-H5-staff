<template>
    <div class="stream-player">
        <van-loading class="loading" v-if="loading" type="spinner" />
        <template v-else>
            <div class="btn-con flex c" v-if="status !== 3">
                <van-button :disabled="status !== 1" @click="_play" :type="status == 1 ? 'primary' : 'default'">{{
                    statusStr
                }}</van-button>
            </div>
            <div id="screen-player"></div>
            <div id="main-player"></div>
        </template>
    </div>
</template>

<script>
import WebRtc from './js/webrtc'
import { mapState } from 'vuex'
import { bus } from '@/utils/bus'
// 因浏览器限制，h5版本两条流都有后方可开始播放
export default {
    // 0:已结束，1:直播中，2:未开始
    props: ['liveState'],
    data() {
        return {
            streamState: 0, // 0:没有流，1:可播放，2:已播放
            loading: true
        }
    },
    watch: {
        liveState(v) {
            if (v === 2) {
                this.streamState = 0
            }
        }
    },
    computed: {
        ...mapState('account', ['userInfo']),
        // 0:已结束，1:可播放，2:未开始，3:已播放
        status() {
            const { liveState, streamState } = this
            if (liveState === 0 || liveState === 2) {
                return liveState
            } else {
                return [2, 1, 3][streamState]
            }
        },
        statusStr() {
            return ['直播已结束', '开始播放', '直播未开始', ''][this.status]
        }
    },
    mounted() {
        const self = this
        bus.$on('stream-can-play', () => {
            self.streamState = 1
        })
    },
    beforeDestroy() {
        bus.$off('stream-can-play')
    },
    methods: {
        // 初始化播放器
        async init(roomNumber) {
            this.loading = true
            const res = await this.$post('hwRtc/student/getSignature', {
                roomNumber
            })
            res.userName = this.userInfo.nickName
            await WebRtc.init(roomNumber, res)
            this.loading = false
        },
        // 开始播放
        _play() {
            WebRtc.play('main-player', 'screen-player')
            this.streamState = 2
        },
        // 停止播放
        _stop() {}
    }
}
</script>

<style lang="less" scoped>
.stream-player {
    height: 100%;
    position: relative;
    background: #1e1e1e;
    .loading {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .btn-con {
        position: absolute;
        width: 100%;
        height: 100%;
        background: transparent;
    }
    #screen-player {
        width: 100%;
        height: 100%;
    }
    #main-player {
        width: 107px;
        height: 67px;
        position: absolute;
        bottom: 10px;
        right: 10px;
        z-index: 1;
    }
}
</style>
