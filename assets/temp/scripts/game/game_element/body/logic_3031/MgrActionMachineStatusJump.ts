import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import MgrActionMachine from "./MgrActionMachine";
import GameElementNpcPlayerActStatus from "./MgrActionMachineStatus";

const APP = `MgrActionMachineStatusJump`;

/**
 * 状态机 - 状态 - 跳起
 */
export default class MgrActionMachineStatusJump extends GameElementNpcPlayerActStatus {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<MgrActionMachineStatusJump>({
        instantiate: () => {
            return new MgrActionMachineStatusJump();
        },
        onPop: (t) => {
            
        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: MgrActionMachine) {
        let val = UtilObjPool.Pop(MgrActionMachineStatusJump._t, apply);
        val.machine = machine;
        return val;
    }

    /**
     * 速度方向
     */
    _vecTemp = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);

    /**
     * 最大允许的长按量
     */
    _keepMax: number;

    OnEnter(): void {
        this._vecTemp.x = -this.machine.npc.args.speed * jiang.mgrUI._sizePerPixel * 1000;
        this._vecTemp.y = -this.machine.npc.relBody.relState.b2Gravity * 1000 / 1000 / 2;
        this._keepMax = 150;
    }


    OnStep(ms: number): void {
        let vec = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
        vec.x = this._vecTemp.x;
        vec.y = this._vecTemp.y;
        this.machine.npc.relBody.commonBody.b2Body.SetLinearVelocity( vec );

        this._keepMax -= ms;
        if (this._keepMax <= 0) {
            this.machine.EnterStatus(this.machine.statusJumpUp);
        };
    }

    OnJumpRelease(): void {
        this.machine.EnterStatus(this.machine.statusJumpUp);
    }
}