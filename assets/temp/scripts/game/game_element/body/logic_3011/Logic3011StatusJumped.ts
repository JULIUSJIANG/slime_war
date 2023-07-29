import { b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import gameCommon from "../../../GameCommon";
import GameElementPart from "../../common/GameElementPart";
import GameElementBody from "../GameElementBody";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import GameElementBodyCtxDmgType from "../GameElementBodyCtxDmgType";
import GameSizeMarkRS from "../GameSizeMarkRS";
import MBPlayer from "../logic_3031/MBPlayer";
import Logic3011 from "./Logic3011";
import Logic3011Status from "./Logic3011Status";

const APP = `Logic3011StatusJumped`;

/**
 * 状态机 - 状态 - 已跃起
 */
export default class Logic3011StatusJumped extends Logic3011Status {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3011StatusJumped>({
        instantiate: () => {
            return new Logic3011StatusJumped();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3011) {
        let val = UtilObjPool.Pop(Logic3011StatusJumped._t, apply);
        val.relMachine = machine;
        return val;
    }

    /**
     * 瞄准了的目标
     */
    target: GameElementBody;

    public OnEnter(): void {
        this.relMachine.relBody.commonAnim = Logic3011Status.ANIM_JUMPED;
        this.jumpedMS = 0;

        let pos = UtilObjPool.Pop (UtilObjPool.typeB2Vec2, APP);
        pos.x = this.target.commonFootPos.x;
        pos.y = this.target.commonHeadPos.y - 0.5 * this.relMachine.relBody.relState.b2Gravity * Logic3011.GRAVITY_SCALE * (this.relMachine.args.atkTime / 1000) ** 2 / jiang.mgrUI._sizePerPixel;
        pos.x *= jiang.mgrUI._sizePerPixel;
        pos.y *= jiang.mgrUI._sizePerPixel;
        this.relMachine.relBody.commonBody.b2Body.SetPosition (pos);
        let vec = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
        vec.x = this.target.commonBehaviour.b2GetSpeedX();
        this.relMachine.relBody.commonBody.b2Body.SetLinearVelocity (vec);

        this.relMachine.UpdatePosData ();
        GameSizeMarkRS.PlayEffTransition (
            APP,
            this.relMachine.relBody
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