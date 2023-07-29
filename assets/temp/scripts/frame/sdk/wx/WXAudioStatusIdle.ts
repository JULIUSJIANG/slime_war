import WXAudioStatus from "./WXAudioStatus";

const APP = `WXAudioStatusIdle`;

/**
 * 微信小游戏上的音频播放 - 状态 - 待机
 */
export default class WXAudioStatusIdle extends WXAudioStatus {

    OnPlay(): void {
        this.relMachine.Enter (this.relMachine.statusPlaying)
    }
}