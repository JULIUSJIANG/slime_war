import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import MgrDefendAct from "./MgrDefendAct";

const APP = `MgrDefendActStatus`;

/**
 * 防御执行 - 状态
 */
export default abstract class MgrDefendActStatus {
    /**
     * 归属的状态机
     */
    relMachine: MgrDefendAct;

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
     * 事件派发 - 防御
     */
    OnDefend () {

    }

    /**
     * 事件派发 - 受伤
     * @param ctxDmg 
     */
    OnDmg (ctxDmg: GameElementBodyCtxDmg) {

    }
}