import { b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import DefineVoice from "../DefineVoice";
import GameElementBody from "../GameElementBody";
import Logic3022 from "./Logic3022";
import Logic3022Status from "./Logic3022Status";

const APP = `Logic3022StatusPower`;

/**
 * 状态机 - 状态 - 已蓄力
 */
export default class Logic3022StatusPower extends Logic3022Status {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3022StatusPower>({
        instantiate: () => {
            return new Logic3022StatusPower();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3022) {
        let val = UtilObjPool.Pop(Logic3022StatusPower._t, apply);
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
        this.relMachine.relBody.commonAnim = Logic3022Status.ANIM_POWER;

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
            this.relMachine.amStatusJumped.target = this._target;
            this.relMachine.AMEnterStatus(this.relMachine.amStatusJumped);
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