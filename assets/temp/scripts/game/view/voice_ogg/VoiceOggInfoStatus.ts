import VoiceOggInfo from "./VoiceOggInfo";
import VoiceOggViewItem from "./VoiceOggViewItem";

/**
 * 音频数据 - 状态
 */
export default abstract class VoiceOggInfoStatus {
    /**
     * 名称
     */
    name: string;

    /**
     * 归属的状态机
     */
    relMachine: VoiceOggInfo;

    /**
     * 归属的界面状态
     * @param relMachine 
     */
    public constructor (name: string, relMachine: VoiceOggInfo) {
        this.name = name;
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
     * 事件派发 - 实例被提取出来
     */
    OnPop () {

    }

    /**
     * 事件派发 - 实例被存储出来
     */
    OnPush () {

    }

    /**
     * 事件派发 - 实例展示中
     * @param com 
     */
    OnDisplay () {

    }

    /**
     * 事件派发 - 音量发生变化
     */
    OnVolumeChange () {

    }

    /**
     * 事件派发 - 时间推进
     */
    OnStep (ms: number) {

    }
}