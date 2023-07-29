import MgrDateNow from "./MgrDateNow";

/**
 * 时间戳管理器 - 状态
 */
export default abstract class MgrDateNowStatus {
    /**
     * 归属的状态机
     */
    public relMachine: MgrDateNow;

    /**
     * 
     * @param relMachine 
     */
    public constructor (relMachine: MgrDateNow) {
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
     * 事件派发 - 同步时间
     */
    public abstract OnTime (): Promise <unknown>;
}