import { b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import GameElementBody from "../GameElementBody";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import Logic3003 from "./Logic3003";
import Logic3003Status from "./Logic3003Status";

const APP = `Logic3003StatusMovePower`;

export default class Logic3003StatusMovePower extends Logic3003Status {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<Logic3003StatusMovePower>({
        instantiate: () => {
            return new Logic3003StatusMovePower();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3003) {
        let val = UtilObjPool.Pop(Logic3003StatusMovePower._t, apply);
        val.relMachine = machine;
        return val;
    }

    /**
     * 冷却
     */
    private _cd: number;

    public OnEnter(): void {
        this.relMachine.relBody.commonAnim = Logic3003Status.ANIM_POWER;

        this._cd = this.relMachine.args.powerTime / 2;
        let vec = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
        this.relMachine.relBody.commonBody.b2Body.SetLinearVelocity(vec);
    }

    public OnConcatA(cont: b2Contact<b2Shape, b2Shape>): void {
        cont.SetTangentSpeed(0);
    }

    public OnConcatB(cont: b2Contact<b2Shape, b2Shape>): void {
        cont.SetTangentSpeed(0);
    }

    public OnTimeStep(passedMS: number): void {
        this._cd -= passedMS;
        if (this._cd < 0) {
            this.relMachine.statusJumped.target = this._target;
            this.relMachine.EnterStatus(this.relMachine.statusMoveJump);
        };
    }

    /**
     * 瞄准了的目标
     */
    private _target: GameElementBody;

    public OnTarget(ele: GameElementBody): void {
        this._target = ele;
    }

    public OnDmg(ctx: GameElementBodyCtxDmg): void {
        return;
    }
}