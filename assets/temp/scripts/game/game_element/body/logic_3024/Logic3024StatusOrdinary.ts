import { b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import gameCommon from "../../../GameCommon";
import GameElementBody from "../GameElementBody";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import Logic3024 from "./Logic3024";
import Logic3024Status from "./Logic3024Status";

const APP = `Logic3024StatusOrdinary`;

/**
 * 状态机 - 状态 - 已受伤
 */
export default class Logic3024StatusOrdinary extends Logic3024Status{
    
    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3024StatusOrdinary>({
        instantiate: () => {
            return new Logic3024StatusOrdinary();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3024) {
        let val = UtilObjPool.Pop(Logic3024StatusOrdinary._t, apply);
        val.relMachine = machine;
        return val;
    }
    
    public OnConcatA(cont: b2Contact<b2Shape, b2Shape>): void {
        cont.SetTangentSpeed(this.GetSpeed() * jiang.mgrUI._sizePerPixel * 1000);
    }

    public OnConcatB(cont: b2Contact<b2Shape, b2Shape>): void {
        cont.SetTangentSpeed(-this.GetSpeed() * jiang.mgrUI._sizePerPixel * 1000);
    }

    /**
     * 获取速度
     */
    GetSpeed () {
        return this.relMachine.args.moveSpeed;
    }

    public OnEnter(): void {
        this.relMachine.relBody.commonAnim = Logic3024Status.ANIM_ORDINARY;
        if (!this.relMachine.relBody.commonBody) {
            return;
        };
        let p = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
        p.x = -1;
        this.relMachine.relBody.commonBody.b2Body.ApplyForceToCenter(p);
    }

    public OnDmg(ctx: GameElementBodyCtxDmg): void {
        let pusle = ctx.repel * this.relMachine.args.repel;
        if (pusle == 0) {
            return;
        };
        let vec = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
        let speed = this.relMachine.relBody.commonBody.b2Body.GetLinearVelocity();
        vec.Set(speed.x / 2, speed.y / 2)
        this.relMachine.relBody.commonBody.b2Body.SetLinearVelocity(vec);
        this.relMachine.relBody.commonBody.b2Body.ApplyLinearImpulse(
            UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP).Set(0, pusle),
            UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP)
        );
    }

    public OnTarget(ele: GameElementBody): void {
        if (this.relMachine.relBody.commonBody.b2Body.GetLinearVelocity().y != 0) {
            return;
        };
        this.relMachine.EnterStatus(this.relMachine.statusPower);
        this.relMachine.currStatus.OnTarget(ele);
    }
}