import { b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import GameElementBody from "../GameElementBody";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import GameElementBodyCtxDmgType from "../GameElementBodyCtxDmgType";
import MBPlayer from "../logic_3031/MBPlayer";
import Logic3018 from "./Logic3018";
import Logic3018Status from "./Logic3018Status";

const APP = `Logic3018StatusJumped`;

/**
 * 状态机 - 状态 - 已跃起
 */
export default class Logic3018StatusJumped extends Logic3018Status {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3018StatusJumped>({
        instantiate: () => {
            return new Logic3018StatusJumped();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3018) {
        let val = UtilObjPool.Pop(Logic3018StatusJumped._t, apply);
        val.relMachine = machine;
        return val;
    }

    /**
     * 瞄准了的目标
     */
    target: GameElementBody;

    public OnEnter(): void {
        this.relMachine.relBody.commonAnim = Logic3018Status.ANIM_JUMPED;

        let vec = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);

        vec.x = (
                    (this.target.commonFootPos.x - this.relMachine.relBody.commonFootPos.x + this.relMachine.args.bodyRadius) * jiang.mgrUI._sizePerPixel  
                    + 
                    this.target.commonBehaviour.b2GetSpeedX() * this.relMachine.args.atkTime / 1000
                ) 
                / 
                this.relMachine.args.atkTime * 1000;
        vec.y = - this.relMachine.relBody.relState.b2Gravity * this.relMachine.args.atkTime / 1000 / 2 * Logic3018.GRAVITY_SCALE;
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