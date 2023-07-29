import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import MgrActionMachine from "./MgrActionMachine";
import GameElementNpcPlayerActStatus from "./MgrActionMachineStatus";

const APP = `MgrActionMachineStatusForwardFloat`;

export default class MgrActionMachineStatusForwardFloat extends GameElementNpcPlayerActStatus {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<MgrActionMachineStatusForwardFloat>({
        instantiate: () => {
            return new MgrActionMachineStatusForwardFloat();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: MgrActionMachine) {
        let val = UtilObjPool.Pop(MgrActionMachineStatusForwardFloat._t, apply);
        val.machine = machine;
        return val;
    }

    OnEnter(): void {
        let vec = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
        vec.x = -this.machine.npc.args.speed * jiang.mgrUI._sizePerPixel * 1000;
        vec.y = 0;
        this.machine.npc.relBody.commonBody.b2Body.SetLinearVelocity(vec);
    }

    OnConcatWithGround(): void {
        this.machine.EnterStatus(this.machine.statusWalk);
    }
}