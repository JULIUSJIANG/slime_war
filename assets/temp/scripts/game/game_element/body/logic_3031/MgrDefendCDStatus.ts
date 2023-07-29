import MgrDefendCD from "./MgrDefendCD";

const APP = `MgrDefendCDStatus`;

/**
 * 防御管理 - 状态
 */
export default abstract class MgrDefendCDStatus {
    /**
     * 归属的状态机
     */
    relMachine: MgrDefendCD;

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
     * 时间步进
     * @param ms 
     */
    OnStep (ms: number) {

    }

    /**
     * 事件派发 - 格挡
     */
    OnDefend () {

    }
}