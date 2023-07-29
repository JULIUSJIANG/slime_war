import { b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import GameElementBody from "../GameElementBody";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import Logic3008 from "./Logic3008";
import Logic3008Status from "./Logic3008Status";

const APP = `Logic3008StatusCD`;

/**
 * 状态机 - 状态 - 已受伤
 */
export default class Logic3008StatusCD extends Logic3008Status{
    
    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3008StatusCD>({
        instantiate: () => {
            return new Logic3008StatusCD();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3008) {
        let val = UtilObjPool.Pop(Logic3008StatusCD._t, apply);
        val.relMachine = machine;
        return val;
    }

    /**
     * 冷却
     */
    private _cd: number;

    public OnEnter(): void {
        this.relMachine.relBody.commonAnim = Logic3008Status.ANIM_ORDINARY;

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