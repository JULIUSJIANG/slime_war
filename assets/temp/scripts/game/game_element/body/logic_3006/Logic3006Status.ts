import { b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
import GameElementBody from "../GameElementBody";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import Logic3006 from "./Logic3006";

/**
 * 状态机 - 状态
 */
export default abstract class Logic3006Status {
    /**
     * 归属的状态机
     */
    public relMachine: Logic3006;

    public OnEnter () {

    }

    public OnDmg (ctx: GameElementBodyCtxDmg) {

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
        return Logic3006Status.ANIM_ORDINARY;
    }
}