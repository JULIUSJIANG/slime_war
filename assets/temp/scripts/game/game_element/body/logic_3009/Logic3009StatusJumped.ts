import { b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import GameElementBody from "../GameElementBody";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import GameElementBodyCtxDmgType from "../GameElementBodyCtxDmgType";
import MBPlayer from "../logic_3031/MBPlayer";
import Logic3009 from "./Logic3009";
import Logic3009Status from "./Logic3009Status";

const APP = `Logic3009StatusJumped`;

/**
 * 状态机 - 状态 - 已跃起
 */
export default class Logic3009StatusJumped extends Logic3009Status {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3009StatusJumped>({
        instantiate: () => {
            return new Logic3009StatusJumped();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3009) {
        let val = UtilObjPool.Pop(Logic3009StatusJumped._t, apply);
        val.relMachine = machine;
        return val;
    }

    /**
     * 瞄准了的目标
     */
    target: GameElementBody;

    public OnEnter(): void {
        this.relMachine.relBody.commonAnim = Logic3009Status.ANIM_JUMPED;

        let vec = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);

        vec.x = (
                    (this.target.commonFootPos.x - this.relMachine.relBody.commonFootPos.x + this.relMachine.args.bodyRadius) * jiang.mgrUI._sizePerPixel  
                    + 
                    this.target.commonBehaviour.b2GetSpeedX() * this.relMachine.args.atkTime / 1000
                ) 
                / 
                this.relMachine.args.atkTime * 1000;
        vec.y = - this.relMachine.relBody.relState.b2Gravity * this.relMachine.args.atkTime / 1000 / 2 * Logic3009.GRAVITY_SCALE;
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