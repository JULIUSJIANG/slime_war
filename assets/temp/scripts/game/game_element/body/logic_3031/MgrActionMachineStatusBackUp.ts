import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import MgrActionMachine from "./MgrActionMachine";
import MgrActionMachineStatus from "./MgrActionMachineStatus";


const APP = `MgrActionMachineStatusBackUp`;

/**
 * 状态机 - 状态 - 冲刺上升
 */
export default class MgrActionMachineStatusBackUp extends MgrActionMachineStatus {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<MgrActionMachineStatusBackUp>({
        instantiate: () => {
            return new MgrActionMachineStatusBackUp();
        },
        onPop: (t) => {
            
        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: MgrActionMachine) {
        let val = UtilObjPool.Pop(MgrActionMachineStatusBackUp._t, apply);
        val.machine = machine;
        return val;
    }

    OnEnter(): void {
        let vecTemp = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
        vecTemp.x = -this.machine.npc.args.speed * jiang.mgrUI._sizePerPixel * 1000;
        vecTemp.y = - this.machine.npc.relBody.relState.b2Gravity * 1000 / 1000 / 2;

        vecTemp.x *= -4;
        vecTemp.y /= 2;

        this.machine.npc.relBody.commonBody.b2Body.SetLinearVelocity( vecTemp );
    }


    OnStep(ms: number): void {
        // 速度还朝上的话，忽略
        if (0 < this.machine.npc.relBody.commonBody.b2Body.GetLinearVelocity().y) {
            return;
        };
        this.machine.EnterStatus(this.machine.statusBackFloat);
    }
}