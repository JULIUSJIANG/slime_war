import { b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import GameElementTxt from "../../common/GameElementTxt";
import GameElementBody from "../GameElementBody";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import GameElementBodyCtxDmgType from "../GameElementBodyCtxDmgType";
import MBPlayer from "../logic_3031/MBPlayer";
import Logic3005 from "./Logic3005";
import Logic3005Status from "./Logic3005Status";

const APP = `Logic3005StatusJumped`;

/**
 * 状态机 - 状态 - 已跃起
 */
export default class Logic3005StatusJumped extends Logic3005Status {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3005StatusJumped>({
        instantiate: () => {
            return new Logic3005StatusJumped();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3005) {
        let val = UtilObjPool.Pop(Logic3005StatusJumped._t, apply);
        val.relMachine = machine;
        return val;
    }

    /**
     * 瞄准了的目标
     */
    target: GameElementBody;

    public OnEnter(): void {
        this.relMachine.relBody.commonAnim = Logic3005Status.ANIM_JUMPED;

        let vec = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);

        vec.x = (
                    (this.target.commonFootPos.x - this.relMachine.relBody.commonFootPos.x + this.relMachine.args.bodyRadius) * jiang.mgrUI._sizePerPixel  
                    + 
                    this.target.commonBehaviour.b2GetSpeedX() * this.relMachine.args.atkTime / 1000
                ) 
                / 
                this.relMachine.args.atkTime * 1000;
        vec.y = - this.relMachine.relBody.relState.b2Gravity * this.relMachine.args.atkTime / 1000 / 2 * Logic3005.GRAVITY_SCALE;
        this.relMachine.relBody.commonBody.b2Body.SetLinearVelocity(
            vec
        );
        
        VoiceOggViewState.inst.VoiceSet (this.relMachine.args.hurtedOgg);
        // 本身处于隐匿状态的话，要给个提示
        if (this.relMachine.hmCurrStatus == this.relMachine.hmStatusOrdinary) {
            GameElementTxt.PopForTips (
                APP,
                `显形`,
                this.relMachine.relBody.commonCenterPos.x,
                this.relMachine.relBody.commonCenterPos.y,
                this.relMachine.relBody
            );
        };
        this.relMachine.HMEnterStatus (this.relMachine.hmStatusCD);
    }

    public OnConcatA(cont: b2Contact<b2Shape, b2Shape>): void {
        cont.SetTangentSpeed(0);
        this.relMachine.AMEnterStatus(this.relMachine.amStatusCD);
    }

    public OnConcatB(cont: b2Contact<b2Shape, b2Shape>): void {
        cont.SetTangentSpeed(0);
        this.relMachine.AMEnterStatus(this.relMachine.amStatusCD);
    }

    public OnDmg(ctx: GameElementBodyCtxDmg): void {
        if (ctx.type != GameElementBodyCtxDmgType.shield) {
            return;
        };
        this.relMachine.AMEnterStatus(this.relMachine.amStatusCD);
    }
}