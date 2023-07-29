import Logic3043 from "./Logic3043";

/**
 * 3037 的状态
 */
export default abstract class Logic3043Status {
    /**
     * 归属的状态机
     */
    relMachine: Logic3043;

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