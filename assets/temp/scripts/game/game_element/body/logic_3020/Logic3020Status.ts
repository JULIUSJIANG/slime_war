import { b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import jiang from "../../../../frame/global/Jiang";
import GameElementBody from "../GameElementBody";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import Logic3020 from "./Logic3020";

const APP = `Logic3020Status`;

/**
 * 状态机 - 状态
 */
export default abstract class Logic3020Status {
    /**
     * 归属的状态机
     */
    public relMachine: Logic3020;

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
        return Logic3020Status.ANIM_ORDINARY;
    }

    /**
     * 攻击
     * @param target 
     */
    public Atk (target: GameElementBody) {
        let vec = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
        vec.x = (
                    (target.commonCenterPos.x - this.relMachine.relBody.commonCenterPos.x)
                    + 
                    target.commonBehaviour.b2GetSpeedX() * this.relMachine.args.atkTime / 1000 / jiang.mgrUI._sizePerPixel
                ) 
                / 
                this.relMachine.args.atkTime;
        vec.y = - this.relMachine.relBody.relState.b2Gravity * this.relMachine.args.atkTime / 1000 / 2 * Logic3020.GRAVITY_SCALE / jiang.mgrUI._sizePerPixel / 1000;
        let eleBody = GameElementBody.PopForCall (
            APP,

            {
                posX: this.relMachine.relBody.commonCenterPos.x,
                posY: this.relMachine.relBody.commonCenterPos.y,

                vecX: vec.x,
                vecY: vec.y,

                cfgId: this.relMachine.args.bullet,
                camp: this.relMachine.relBody.commonArgsCamp,
                caller: this.relMachine.relBody
            }
        );
        this.relMachine.relBody.relState.AddEle (eleBody);
    }
}