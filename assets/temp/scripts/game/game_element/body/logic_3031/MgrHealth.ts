import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import MBPlayer from "./MBPlayer";
import MgrHealthMachine from "./MgrHealthMachine";

const APP = `MgrHealth`;

/**
 * npc 生命管理
 */
export default class MgrHealth {
    
    private constructor () {}

    private static _t = new UtilObjPoolType<MgrHealth>({
        instantiate: () => {
            return new MgrHealth();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relNpc: MBPlayer) {
        let val = UtilObjPool.Pop(MgrHealth._t, apply);
        val.relNpc = relNpc;
        val.machine = MgrHealthMachine.Pop(APP, val);
        return val;
    }

    /**
     * 归属的单位
     */
    relNpc: MBPlayer;
    /**
     * 状态机
     */
    machine: MgrHealthMachine;
}