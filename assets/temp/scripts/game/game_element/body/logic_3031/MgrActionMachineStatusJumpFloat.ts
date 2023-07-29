import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import MgrActionMachine from "./MgrActionMachine";
import GameElementNpcPlayerActStatus from "./MgrActionMachineStatus";

const APP = `MgrActionMachineStatusFloat`;

export default class MgrActionMachineStatusJumpFloat extends GameElementNpcPlayerActStatus {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<MgrActionMachineStatusJumpFloat>({
        instantiate: () => {
            return new MgrActionMachineStatusJumpFloat();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: MgrActionMachine) {
        let val = UtilObjPool.Pop(MgrActionMachineStatusJumpFloat._t, apply);
        val.machine = machine;
        return val;
    }

    OnConcatWithGround(): void {
        this.machine.EnterStatus(this.machine.statusWalk);
    }
}