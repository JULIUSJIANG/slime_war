import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import Logic3030 from "./Logic3030";

const APP = `Logic3030Status`;

/**
 * 震荡弹 - 状态
 */
export default abstract class Logic3030Status {

    /**
     * 归属的状态机
     */
    relMachine: Logic3030;

    public constructor (relMachine: Logic3030) {
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
     * 事件派发 - 上升中
     */
    public OnUp () {

    }
    /**
     * 事件派发 - 下降中
     */
    public OnDown () {

    }
    /**
     * 事件派发 - 受到伤害
     * @param ctx 
     */
    public OnDmg (ctx: GameElementBodyCtxDmg) {

    }
}