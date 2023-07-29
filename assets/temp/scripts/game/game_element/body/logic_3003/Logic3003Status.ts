import { b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import GameElementBody from "../GameElementBody";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import Logic3003 from "./Logic3003";

const APP = `Logic3003Status`;

/**
 * 状态机 - 状态
 */
export default abstract class Logic3003Status {
    /**
     * 归属的状态机
     */
    public relMachine: Logic3003;

    public OnEnter () {

    }

    public OnDmg (ctx: GameElementBodyCtxDmg) {
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

    public OnConcatA (cont: b2Contact<b2Shape, b2Shape>) {

    }

    public OnConcatB (cont: b2Contact<b2Shape, b2Shape>) {

    }

    public OnTimeStep (passedMS: number) {

    }

    public OnExit () {

    }

    public OnTarget (ele: GameElementBody) {

    }

    static ANIM_ORDINARY = `npc_slime_2001001001_ordinary`;

    static ANIM_POWER = `npc_slime_2001001001_power`;

    static ANIM_JUMPED = `npc_slime_2001001001_jumped`;

    /**
     * 获取动画名
     */
    public GetAnimName () {
        return Logic3003Status.ANIM_ORDINARY;
    }
}