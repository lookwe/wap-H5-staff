<template>
    <div class="smart-player">
        <van-loading class="loading" v-if="loading" type="spinner" />
        <div class="btn-con flex c" v-if="status !== 3">
            <van-button :disabled="status !== 1" @click="_play" type="primary">{{ statusStr }}</van-button>
        </div>
        <video
            id="smartVideo"
            class="video-js vjs-default-skin vjs-big-play-centered"
            x-webkit-airplay="allow"
            webkit-playsinline
            playsinline
            x5-video-player-type="h5"
            x5-video-player-fullscreen="true"
            preload="auto"
        ></video>
    </div>
</template>

<script>
// type = 2

import videojs from 'video.js'
// import dayjs from 'dayjs'

export default {
    data() {
        return {
            player: null,
            loading: true,
            isPlay: false,
            liveState: 0
        }
    },
    watch: {
        liveState(v) {
            if (v !== 1) {
                this.isPlay = 0
                this.player && this.player.pause()
            }
        }
    },
    computed: {
        // 0:已结束，1:可播放，2:未开始，3:已播放
        status() {
            const { liveState, isPlay } = this
            if (isPlay) {
                return 3
            }
            return liveState
        },
        statusStr() {
            return ['直播已结束', '开始播放', '直播未开始', ''][this.status]
        }
    },
    beforeDestroy() {
        clearInterval(this.timeHandler)
    },
    methods: {
        init({ url, coverUrl }) {
            this.player = videojs('smartVideo', {
                bigPlayButton: false,
                textTrackDisplay: false,
                posterImage: true,
                errorDisplay: false,
                controlBar: false,
                poster: coverUrl
            })
            this.player.src([
                {
                    type: 'application/x-mpegURL',
                    src: url
                }
            ])
            this.loading = false
        },
        _play() {
            if (this.player) {
                this.player.play()
                this.isPlay = true
            } else {
                console.log('player is not defined...')
            }
        }
    }
}
</script>
<style lang="less" scoped>
.smart-player {
    height: 100%;
    position: relative;
    background: #1e1e1e;
    .video-js,
    video {
        width: 100% !important;
        height: 100% !important;
    }
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
        z-index: 1;
    }
}
</style>
