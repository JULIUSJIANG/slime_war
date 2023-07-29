import { b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
import utilMath from "../../../../frame/basic/UtilMath";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import DefineVoice from "../DefineVoice";
import GameElementBody from "../GameElementBody";
import Logic3015 from "../logic_3015/Logic3015";
import Logic3024 from "./Logic3024";
import Logic3024Status from "./Logic3024Status";

const APP = `Logic3024StatusPower`;

/**
 * 状态机 - 状态 - 已蓄力
 */
export default class Logic3024StatusPower extends Logic3024Status {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3024StatusPower>({
        instantiate: () => {
            return new Logic3024StatusPower();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3024) {
        let val = UtilObjPool.Pop(Logic3024StatusPower._t, apply);
        val.relMachine = machine;
        return val;
    }

    /**
     * 冷却
     */
    private _cd: number;

    public OnEnter(): void {
        this.relMachine.relBody.commonAnimTipsKeep.currStatus.OnFadeIn ();
        this.relMachine.relBody.commonAnimTipsFlash.currStatus.OnFlash ();
        VoiceOggViewState.inst.VoiceSet (DefineVoice.MONSTER_ATK);
        this.relMachine.relBody.commonAnim = Logic3024Status.ANIM_POWER;

        this._cd = this.relMachine.args.powerTime;
        let vec = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
        this.relMachine.relBody.commonBody.b2Body.SetLinearVelocity(vec);
    }

    public OnExit(): void {
        this.relMachine.relBody.commonActionId++;
        this.relMachine.relBody.ClearDmgRecord ();
        this.relMachine.relBody.commonAnimTipsKeep.currStatus.OnFadeOut ();
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
            let angleArea = Math.PI / 6;
            let angelDistance = angleArea / this.relMachine.args.listSplit.length;
            let speedLen = - this.relMachine.relBody.relState.b2Gravity * Logic3015.GRAVITY_SCALE / jiang.mgrUI._sizePerPixel / 1000 / 2;
            for (let i = 0; i < this.relMachine.args.listSplit.length; i++) {
                let angle = Math.PI / 2 + angleArea / 2 - (i * angelDistance) * (1 + utilMath.RandomLowerToUpper() * this.relMachine.args.random);
                let eleBody = GameElementBody.PopForCall (
                    APP,

                    {
                        posX: this.relMachine.relBody.commonCenterPos.x,
                        posY: this.relMachine.relBody.commonCenterPos.y,

                        vecX: Math.cos (angle) * speedLen * (1 + utilMath.RandomLowerToUpper() * this.relMachine.args.random),
                        vecY: Math.sin (angle) * speedLen * (1 + utilMath.RandomLowerToUpper() * this.relMachine.args.random),
                        cfgId: this.relMachine.args.listSplit [i],
                        camp: this.relMachine.relBody.commonArgsCamp,
                        caller: this.relMachine.relBody
                    }
                );
                this.relMachine.relBody.relState.AddEle (eleBody);
            };
            this.relMachine.EnterStatus (this.relMachine.statusOrdinary);
        };
    }

    /**
     * 瞄准了的目标
     */
    private _target: GameElementBody;

    public OnTarget(ele: GameElementBody): void {
        this._target = ele;
    }
}