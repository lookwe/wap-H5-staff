<template>
    <div class="record-player">
        <van-loading class="loading" v-if="loading" type="spinner" />
        <div class="btn-con flex c" v-if="!isPlay">
            <van-button @click="_play" type="primary">开始播放</van-button>
        </div>
        <video
            id="recordVideo"
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
// type = 1
import videojs from "video.js";
import "video.js/dist/video-js.min.css";
export default {
    data() {
        return {
            player: null,
            loading: true,
            isPlay: false,
        };
    },
    beforeDestroy() {
        clearInterval(this.seekTimeHandler);
    },
    methods: {
        init({ url, coverUrl }) {
            this.player = videojs("recordVideo", {
                bigPlayButton: false,
                textTrackDisplay: false,
                posterImage: true,
                errorDisplay: false,
                controls: true,
                poster: coverUrl,
            });
            this.player.src([
                {
                    type: "application/x-mpegURL",
                    src: url,
                },
            ]);
            const self = this;
            this.player.on("seeking", function () {
                if (!self.isAutoChangePlayTime) {
                    clearInterval(self.timeHandler);
                    self.timeHandler = setInterval(() => {
                        if (self.player.bufferedPercent() > 0) {
                            clearInterval(self.timeHandler);
                            self.player.currentTime(
                                self.player.currentTime() + 0.5
                            );
                        }
                    }, 1000);
                    self.isAutoChangePlayTime = true;
                } else {
                    self.isAutoChangePlayTime = false;
                }
            });
            this.loading = false;
            this.seekTimeHandler = setInterval(() => {
                this.$emit("getCurrentTime", this.player.currentTime());
            }, 3000);
        },
        _play() {
            if (this.player) {
                this.player.play();
                this.isPlay = true;
            } else {
                console.log("player is not defined...");
            }
        },
    },
};
</script>
<style lang="less" scoped>
.record-player {
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
