import { b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import gameCommon from "../../../GameCommon";
import GameElementPart from "../../common/GameElementPart";
import GameElementBody from "../GameElementBody";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import GameElementBodyCtxDmgType from "../GameElementBodyCtxDmgType";
import MBPlayer from "../logic_3031/MBPlayer";
import Logic3008 from "./Logic3008";
import Logic3008Status from "./Logic3008Status";

const APP = `Logic3008StatusJumped`;

/**
 * 状态机 - 状态 - 已跃起
 */
export default class Logic3008StatusJumped extends Logic3008Status {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3008StatusJumped>({
        instantiate: () => {
            return new Logic3008StatusJumped();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3008) {
        let val = UtilObjPool.Pop(Logic3008StatusJumped._t, apply);
        val.relMachine = machine;
        return val;
    }

    /**
     * 瞄准了的目标
     */
    target: GameElementBody;

    public OnEnter(): void {
        this.jumpedMS = 0;

        let pos = UtilObjPool.Pop (UtilObjPool.typeB2Vec2, APP);
        let posX = this.relMachine.relBody.relState.player.commonFootPos.x + this.relMachine.args.atkArea + this.relMachine.args.bodyRadius;
        pos.x = posX;
        pos.x *= jiang.mgrUI._sizePerPixel;
        pos.y = gameCommon.GROUND_Y * jiang.mgrUI._sizePerPixel;

        this.relMachine.relBody.commonBody.b2Body.SetPosition (pos);
        this.relMachine.relBody.commonAnim = Logic3008Status.ANIM_JUMPED;
        let vec = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);

        vec.x = (
                    (this.target.commonFootPos.x - posX + this.relMachine.args.bodyRadius) * jiang.mgrUI._sizePerPixel  
                    + 
                    this.target.commonBehaviour.b2GetSpeedX() * this.relMachine.args.atkTime / 1000
                ) 
                / 
                this.relMachine.args.atkTime * 1000;
        vec.y = - this.relMachine.relBody.relState.b2Gravity * this.relMachine.args.atkTime / 1000 / 2 * Logic3008.GRAVITY_SCALE;
        this.relMachine.relBody.commonBody.b2Body.SetLinearVelocity(
            vec
        );

        GameElementPart.BoomForBody(
            APP,
            this.relMachine.relBody.relState,
            this.relMachine.relBody.commonCache.colorMain,
            this.relMachine.args.bodyRadius,
            this.relMachine.relBody.commonBody.b2Body.GetPosition().x / jiang.mgrUI._sizePerPixel,
            this.relMachine.relBody.commonBody.b2Body.GetPosition().y / jiang.mgrUI._sizePerPixel,
            0,
            -1
        );
    }

    /**
     * 累计跳跃时长
     */
    jumpedMS: number;

    public OnTimeStep(passedMS: number): void {
        this.jumpedMS += passedMS;
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