import { b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import GameElementPart from "../../common/GameElementPart";
import DefineVoice from "../DefineVoice";
import GameElementBody from "../GameElementBody";
import Logic3011 from "./Logic3011";
import Logic3011Status from "./Logic3011Status";

const APP = `Logic3011StatusPower`;

/**
 * 状态机 - 状态 - 已蓄力
 */
export default class Logic3011StatusPower extends Logic3011Status {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3011StatusPower>({
        instantiate: () => {
            return new Logic3011StatusPower();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3011) {
        let val = UtilObjPool.Pop(Logic3011StatusPower._t, apply);
        val.relMachine = machine;
        return val;
    }

    /**
     * 冷却
     */
    _cd: number;

    public OnEnter(): void {
        this.relMachine.relBody.commonAnimTipsKeep.currStatus.OnFadeIn ();
        this.relMachine.relBody.commonAnimTipsFlash.currStatus.OnFlash ();
        VoiceOggViewState.inst.VoiceSet (DefineVoice.MONSTER_ATK);
        this.relMachine.relBody.commonAnim = Logic3011Status.ANIM_POWER;

        this._cd = this.relMachine.args.powerTime;
        let vec = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
        this.relMachine.relBody.commonBody.b2Body.SetLinearVelocity(vec);

        GameElementPart.BoomForBody(
            APP,
            this.relMachine.relBody.relState,
            this.relMachine.relBody.commonCache.colorMain,
            this.relMachine.args.bodyRadius,
            this.relMachine.relBody.commonCenterPos.x,
            this.relMachine.relBody.commonCenterPos.y,
            0,
            -1
        );
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
            this.relMachine.statusJumped.target = this._target;
            this.relMachine.EnterStatus(this.relMachine.statusJumped);
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