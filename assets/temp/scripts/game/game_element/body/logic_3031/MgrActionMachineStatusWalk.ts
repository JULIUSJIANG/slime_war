import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import MgrActionMachine from "./MgrActionMachine";
import GameElementNpcPlayerActStatus from "./MgrActionMachineStatus";

const APP = `MgrActionMachineStatusWalk`;

/**
 * 状态机 - 状态 - 行走
 */
export default class MgrActionMachineStatusWalk extends GameElementNpcPlayerActStatus {
    
    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<MgrActionMachineStatusWalk>({
        instantiate: () => {
            return new MgrActionMachineStatusWalk();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: MgrActionMachine) {
        let val = UtilObjPool.Pop(MgrActionMachineStatusWalk._t, apply);
        val.machine = machine;
        return val;
    }

    OnJumpPress(): void {
        this.machine.EnterStatus(this.machine.statusJumpUp);
    }

    OnForwardPress(): void {
        this.machine.EnterStatus(this.machine.statusForwardUp);
    }

    OnBackPress(): void {
        this.machine.EnterStatus(this.machine.statusBackUp);
    }
}