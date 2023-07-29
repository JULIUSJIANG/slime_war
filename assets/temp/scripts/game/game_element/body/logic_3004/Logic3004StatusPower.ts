import { b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import CfgGameElement from "../../../../frame/config/src/CfgGameElement";
import jiang from "../../../../frame/global/Jiang";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import DefineVoice from "../DefineVoice";
import GameElementBody from "../GameElementBody";
import Logic3004 from "./Logic3004";
import Logic3004Status from "./Logic3004Status";

const APP = `Logic3004StatusPower`;

/**
 * 状态机 - 状态 - 已蓄力
 */
export default class Logic3004StatusPower extends Logic3004Status {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3004StatusPower>({
        instantiate: () => {
            return new Logic3004StatusPower();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3004) {
        let val = UtilObjPool.Pop(Logic3004StatusPower._t, apply);
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
        this.relMachine.relBody.commonAnim = Logic3004Status.ANIM_POWER;
        this._cd = this.relMachine.args.powerTime;
        let vec = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
        this.relMachine.relBody.commonBody.b2Body.SetLinearVelocity(vec);
    }

    public OnExit(): void {
        this.relMachine.relBody.commonActionId++;
        this.relMachine.relBody.ClearDmgRecord();
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
            let cfgBullet = jiang.mgrCfg.cfgGameElement.select (CfgGameElement.idGetter, this.relMachine.args.bullet)._list [0];
            let vec = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
            vec.x = (
                        (this._target.commonCenterPos.x - this.relMachine.relBody.commonCenterPos.x)
                        + 
                        this._target.commonBehaviour.b2GetSpeedX() * this.relMachine.args.atkTime / 1000 / jiang.mgrUI._sizePerPixel
                    ) 
                    / 
                    this.relMachine.args.atkTime;
            vec.y = - this.relMachine.relBody.relState.b2Gravity * this.relMachine.args.atkTime / 1000 / 2 * cfgBullet.gravity_scale / jiang.mgrUI._sizePerPixel / 1000;
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