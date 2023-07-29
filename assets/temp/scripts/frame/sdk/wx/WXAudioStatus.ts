import WXAudio from "./WXAudio";

const APP = `WXAudioStatus`;

/**
 * 微信小游戏上的音频播放 - 状态
 */
export default abstract class WXAudioStatus {
    /**
     * 归属的状态机
     */
    relMachine: WXAudio;

    constructor (relMachine: WXAudio) {
        this.relMachine = relMachine;
    }

    /**
     * 事件派发 - 进入状态
     */
    OnEnter () {

    }

    /**
     * 事件派发 - 离开状态
     */
    OnExit () {

    }

    /**
     * 事件派发 - 播放
     */
    OnPlay () {

    }

    /**
     * 事件派发 - 暂停
     */
    OnStop () {

    }

    /**
     * 事件派发 - 音量变化
     */
    OnVolume () {

    }
}