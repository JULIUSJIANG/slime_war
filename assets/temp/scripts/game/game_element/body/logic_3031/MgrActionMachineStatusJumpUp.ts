import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import MgrActionMachine from "./MgrActionMachine";
import GameElementNpcPlayerActStatus from "./MgrActionMachineStatus";

const APP = `MgrActionMachineStatusUp`;

/**
 * 状态机 - 状态 - 上升
 */
export default class MgrActionMachineStatusJumpUp extends GameElementNpcPlayerActStatus {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<MgrActionMachineStatusJumpUp>({
        instantiate: () => {
            return new MgrActionMachineStatusJumpUp();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: MgrActionMachine) {
        let val = UtilObjPool.Pop(MgrActionMachineStatusJumpUp._t, apply);
        val.machine = machine;
        return val;
    }

    OnEnter(): void {
        let vec = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
        vec.x = -this.machine.npc.args.speed * jiang.mgrUI._sizePerPixel * 1000;
        vec.y = - this.machine.npc.relBody.relState.b2Gravity / 2 * 0.95;
        this.machine.npc.relBody.commonBody.b2Body.SetLinearVelocity(vec);
    }

    OnStep(ms: number): void {
        // 速度还朝上的话，忽略
        if (0 < this.machine.npc.relBody.commonBody.b2Body.GetLinearVelocity().y) {
            return;
        };
        this.machine.EnterStatus(this.machine.statusJumpFloat);
    }
}