import PlayOrdinary from "./PlayOrdinary";

const APP = `PlayOrdinaryStatus`;

/**
 * 玩法 - 经典 - 状态
 */
export default abstract class PlayOrdinaryStatus {
    /**
     * 归属的状态机
     */
    public relMachine: PlayOrdinary;
    
    /**
     * 事件派发 - 进入状态
     */
    public OnEnter () {

    }

    /**
     * 事件派发 - 离开状态
     */
    public OnExit () {

    }

    /**
     * 事件派发 - 时间推进
     * @param ms 
     */
    public OnStep (ms: number) {

    }

    /**
     * 事件派发 - 暂停
     */
    public OnPause () {

    }
}