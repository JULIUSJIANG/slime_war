import { b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import GameElementBody from "../GameElementBody";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import GameElementBodyCtxDmgType from "../GameElementBodyCtxDmgType";
import MBPlayer from "../logic_3031/MBPlayer";
import Logic3026 from "./Logic3026";
import Logic3026Status from "./Logic3026Status";

const APP = `Logic3026StatusJumped`;

/**
 * 状态机 - 状态 - 已跃起
 */
export default class Logic3026StatusJumped extends Logic3026Status {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3026StatusJumped>({
        instantiate: () => {
            return new Logic3026StatusJumped();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3026) {
        let val = UtilObjPool.Pop(Logic3026StatusJumped._t, apply);
        val.relMachine = machine;
        return val;
    }

    /**
     * 瞄准了的目标
     */
    target: GameElementBody;

    public OnEnter(): void {
        this.relMachine.relBody.commonAnim = Logic3026Status.ANIM_JUMPED;

        let vec = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
        let atkTime = this.relMachine.args.atkTime / this.relMachine.relBody.commonTimeScaleSelf;
        vec.x = (
                    (this.target.commonFootPos.x - this.relMachine.relBody.commonFootPos.x + this.relMachine.args.bodyRadius) * jiang.mgrUI._sizePerPixel  
                    + 
                    this.target.commonBehaviour.b2GetSpeedX() * atkTime / 1000
                ) 
                / 
                atkTime * 1000;
        vec.y = - this.relMachine.relBody.relState.b2Gravity * atkTime / 1000 / 2 * Logic3026.GRAVITY_SCALE;
        this.relMachine.relBody.commonBody.b2Body.SetLinearVelocity(
            vec
        );
    }

    public OnConcatA(cont: b2Contact<b2Shape, b2Shape>): void {
        cont.SetTangentSpeed(0);
        this.relMachine.EnterStatus(this.relMachine.statusCD);
    }

    public OnConcatB(cont: b2Contact<b2Shape, b2Shape>): void {
        cont.SetTangentSpeed(0);
        this.relMachine.EnterStatus(this.relMachine.statusCD);
    }

    public OnDmg(ctx: GameElementBodyCtxDmg): void {
        if (ctx.type != GameElementBodyCtxDmgType.shield) {
            return;
        };
        this.relMachine.EnterStatus(this.relMachine.statusCD);
    }
}