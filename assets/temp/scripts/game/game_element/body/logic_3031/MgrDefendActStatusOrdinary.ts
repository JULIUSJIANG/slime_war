import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import MgrDefendAct from "./MgrDefendAct";
import MgrDefendActStatus from "./MgrDefendActStatus";
import MgrDefendCDStatus from "./MgrDefendCDStatus";

const APP = `MgrDefendActStatusOrdinary`;

/**
 * 防御执行 - 状态 - 常态
 */
export default class MgrDefendActStatusOrdinary extends MgrDefendActStatus {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType <MgrDefendActStatusOrdinary> ({
        instantiate: () => {
            return new MgrDefendActStatusOrdinary ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: MgrDefendAct) {
        let val = UtilObjPool.Pop (MgrDefendActStatusOrdinary._t, apply);
        val.relMachine = machine;
        return val;
    }

    OnDefend(): void {
        this.relMachine.Enter (this.relMachine.statusIng);
    }

    OnDmg(ctx: GameElementBodyCtxDmg): void {
        this.relMachine.relMBPlayer.playerMgrHealth.machine.currStatus.OnDmg(ctx);
    }

    OnEnter(): void {
        this.relMachine.relMBPlayer.relBody.ClearDmgRecord ();
    }
}