<template>
    <div class="record-player">
        <van-loading class="loading" v-if="loading" type="spinner" />
        <div class="btn-con flex c" v-if="!isPlay">
            <van-button @click="_play" type="primary">{{ statusStr }}</van-button>
        </div>
        <video
            id="recordVideo"
            class="video-js vjs-default-skin vjs-big-play-centered"
            x-webkit-airplay="allow"
            :poster="roomInfo.coverUrl"
            webkit-playsinline
            playsinline
            x5-video-player-type="h5"
            x5-video-player-fullscreen="true"
            preload="auto"
        ></video>
    </div>
</template>

<script>
import videojs from 'video.js'
export default {
    data() {
        return {
            player: null,
            loading: true,
            isPlay: false
        }
    },
    methods: {
        init(url) {
            this.player = videojs('recordVideo', {
                bigPlayButton: false,
                textTrackDisplay: false,
                posterImage: true,
                errorDisplay: false,
                controlBar: false
            })
            myPlayer.src([
                {
                    type: 'application/x-mpegURL',
                    src: url
                }
            ])
            this.loading = false
        },
        _play() {
            this.player.play()
            this.isPlay = true
        }
    }
}
</script>
<style lang="less" scoped>
.record-player {
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
}
</style>
