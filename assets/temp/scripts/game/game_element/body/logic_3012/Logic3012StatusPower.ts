import { b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
import utilMath from "../../../../frame/basic/UtilMath";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import DefineVoice from "../DefineVoice";
import GameElementBody from "../GameElementBody";
import Logic3012 from "./Logic3012";
import Logic3012Status from "./Logic3012Status";

const APP = `Logic3012StatusPower`;

/**
 * 状态机 - 状态 - 已蓄力
 */
export default class Logic3012StatusPower extends Logic3012Status {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3012StatusPower>({
        instantiate: () => {
            return new Logic3012StatusPower();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3012) {
        let val = UtilObjPool.Pop(Logic3012StatusPower._t, apply);
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
        this.relMachine.relBody.commonAnim = Logic3012Status.ANIM_POWER;

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
            for (let i = 0; i < this.relMachine.args.count; i++) {
                let vec = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
                vec.x = (
                            (this._target.commonCenterPos.x - this.relMachine.relBody.commonCenterPos.x)
                            + 
                            this._target.commonBehaviour.b2GetSpeedX() * this.relMachine.args.atkTime / 1000 / jiang.mgrUI._sizePerPixel
                        ) 
                        / 
                        this.relMachine.args.atkTime;
                vec.y = - this.relMachine.relBody.relState.b2Gravity * this.relMachine.args.atkTime / 1000 / 2 * Logic3012.GRAVITY_SCALE / jiang.mgrUI._sizePerPixel / 1000;
                vec.x *= (1 + this.relMachine.args.random * utilMath.RandomLowerToUpper ())
                vec.y *= (1 + this.relMachine.args.random * utilMath.RandomLowerToUpper());

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
            };
            this.relMachine.EnterStatus(this.relMachine.statusCD);
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