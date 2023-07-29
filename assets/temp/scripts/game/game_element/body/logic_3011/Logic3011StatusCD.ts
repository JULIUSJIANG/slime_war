import { b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import GameElementBody from "../GameElementBody";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import Logic3011 from "./Logic3011";
import Logic3011Status from "./Logic3011Status";

const APP = `Logic3011StatusCD`;

/**
 * 状态机 - 状态 - 已受伤
 */
export default class Logic3011StatusCD extends Logic3011Status{
    
    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3011StatusCD>({
        instantiate: () => {
            return new Logic3011StatusCD();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3011) {
        let val = UtilObjPool.Pop(Logic3011StatusCD._t, apply);
        val.relMachine = machine;
        return val;
    }

    /**
     * 冷却
     */
    private _cd: number;

    public OnEnter(): void {
        this.relMachine.relBody.commonAnim = Logic3011Status.ANIM_ORDINARY;

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
            this.relMachine.EnterStatus(this.relMachine.statusOrdinary);
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