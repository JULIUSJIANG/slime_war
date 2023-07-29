import { b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import GameElementBody from "../GameElementBody";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import Logic3022 from "./Logic3022";
import Logic3022Status from "./Logic3022Status";

const APP = `Logic3022StatusCD`;

/**
 * 状态机 - 状态 - 已受伤
 */
export default class Logic3022StatusCD extends Logic3022Status{
    
    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3022StatusCD>({
        instantiate: () => {
            return new Logic3022StatusCD();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3022) {
        let val = UtilObjPool.Pop(Logic3022StatusCD._t, apply);
        val.relMachine = machine;
        return val;
    }

    /**
     * 冷却
     */
    private _cd: number;

    public OnEnter(): void {
        this.relMachine.relBody.commonAnim = Logic3022Status.ANIM_ORDINARY;

        this._cd = this.relMachine.args.cd;
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
            this.relMachine.AMEnterStatus(this.relMachine.amStatusOrdinary);
        };
    }

    public OnDmg(ctx: GameElementBodyCtxDmg): void {
        let vec = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
        this.relMachine.relBody.commonBody.b2Body.SetLinearVelocity(vec);
        this.relMachine.relBody.commonBody.b2Body.ApplyLinearImpulse(
            UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP).Set(0, 1).SelfMul(ctx.repel * this.relMachine.args.repel),
            UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP)
        );
    }
}