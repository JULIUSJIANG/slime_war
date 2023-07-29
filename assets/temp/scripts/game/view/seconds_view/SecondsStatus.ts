import SecondsViewState from "./SecondsViewState";

/**
 * 数秒倒计时 - 状态
 */
export default abstract class SecondsStatus {
    /**
     * 归属的状态机
     */
    public relMachine: SecondsViewState;

    public constructor (relMachine: SecondsViewState) {
        this.relMachine = relMachine;
    }

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
     * 获取文本缩放
     * @returns 
     */
    public GetTxtScale () {
        return 1;
    }
    /**
     * 获取文本不透明度
     * @returns 
     */
    public GetTxtOpacity () {
        return 1;
    }
    /**
     * 获取文本内容
     * @returns 
     */
    public GetTxtCtx () {
        return `0`;
    }
}