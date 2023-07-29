import VoiceOggViewState from "./VoiceOggViewState";

/**
 * 音频界面状态
 */
export default abstract class VoiceOggVolumeStatus {
    /**
     * 归属的界面状态机
     */
    relMachine: VoiceOggViewState;

    public constructor (relMachine: VoiceOggViewState) {
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
     * 事件派发 - 时间推进
     * @param ms 
     */
    OnStep (ms: number) {

    }

    /**
     * 事件派发 - 音量发生变化
     */
    OnVolumeChange () {

    }
}