import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import MgrActionMachine from "./MgrActionMachine";
import GameElementNpcPlayerActStatus from "./MgrActionMachineStatus";

const APP = `MgrActionMachineStatusBackFloat`;

export default class MgrActionMachineStatusBackFloat extends GameElementNpcPlayerActStatus {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<MgrActionMachineStatusBackFloat>({
        instantiate: () => {
            return new MgrActionMachineStatusBackFloat();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: MgrActionMachine) {
        let val = UtilObjPool.Pop(MgrActionMachineStatusBackFloat._t, apply);
        val.machine = machine;
        return val;
    }

    OnConcatWithGround(): void {
        let vec = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
        vec.x = -this.machine.npc.args.speed * jiang.mgrUI._sizePerPixel * 1000;
        vec.y = 0;
        this.machine.npc.relBody.commonBody.b2Body.SetLinearVelocity(vec);

        this.machine.EnterStatus(this.machine.statusWalk);
    }
}