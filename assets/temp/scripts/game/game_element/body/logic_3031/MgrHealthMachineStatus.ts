import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import GameElementBody from "../GameElementBody";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import MgrHealthMachine from "./MgrHealthMachine";

const APP = `MgrHealthMachineStatus`;

/**
 * npc 生命管理-状态机-状态
 */
export default abstract class MgrHealthMachineStatus {

    /**
     * 归属的状态机
     */
    relMachine: MgrHealthMachine;

    /**
     * 事件派发-进入状态 
     */
    OnEnter () {

    }

    /**
     * 事件派发-离开状态
     */
    OnExit () {

    }

    /**
     * 事件派发-时间步进
     * @param passedMS 
     */
    OnStep (passedMS: number) {

    }

    /**
     * 事件派发-受伤
     */
    OnDmg (ctxDmg: GameElementBodyCtxDmg) {

    }
}