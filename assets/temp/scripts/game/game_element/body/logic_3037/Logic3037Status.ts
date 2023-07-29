import Logic3037 from "./Logic3037";

/**
 * 3037 的状态
 */
export default abstract class Logic3037Status {
    /**
     * 归属的状态机
     */
    relMachine: Logic3037;

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
     */
    OnStep (ms: number) {

    }
}