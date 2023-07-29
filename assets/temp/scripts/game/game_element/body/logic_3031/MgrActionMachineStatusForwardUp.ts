import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import gameCommon from "../../../GameCommon";
import MgrActionMachine from "./MgrActionMachine";
import MgrActionMachineStatus from "./MgrActionMachineStatus";


const APP = `MgrActionMachineStatusForwardUp`;

/**
 * 状态机 - 状态 - 冲刺上升
 */
export default class MgrActionMachineStatusForwardUp extends MgrActionMachineStatus {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<MgrActionMachineStatusForwardUp>({
        instantiate: () => {
            return new MgrActionMachineStatusForwardUp();
        },
        onPop: (t) => {
            
        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: MgrActionMachine) {
        let val = UtilObjPool.Pop(MgrActionMachineStatusForwardUp._t, apply);
        val.machine = machine;
        return val;
    }

    /**
     * 冲刺的时间剩余
     */
    private _timeLess: number;

    OnEnter(): void {
        this.machine.npc.animTraceFlash.currStatus.OnFlash ();
        this._timeLess = gameCommon.MS_FORWARD_WHILE_SUFFERED_DMG;

        this.machine.npc.relBody.commonBody.b2Body.SetGravityScale (0);

        let vecTemp = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
        vecTemp.x = -this.machine.npc.args.speed * jiang.mgrUI._sizePerPixel * 1000;
        vecTemp.x *= gameCommon.HURTED_SPEED_SCALE;

        vecTemp.y = - this.machine.npc.relBody.relState.b2Gravity * 1000 / 1000 / 2;
        vecTemp.y /= 10000;

        this.machine.npc.relBody.commonBody.b2Body.SetLinearVelocity( vecTemp );
        this.machine.npc.relBody.commonTimeScaleSelf = gameCommon.HURTED_SPEED_SCALE;
    }

    OnExit (): void {
        this.machine.npc.relBody.commonTimeScaleSelf = 1;
        this.machine.npc.relBody.commonBody.b2Body.SetGravityScale (1);
    }

    OnStep(ms: number): void {
        this._timeLess -= ms;
        if (0 < this._timeLess) {
            return;
        };
        this.machine.EnterStatus(this.machine.statusForwardFloat);
    }
}