import { b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import GameElementEff from "../../common/GameElementEff";
import DefineVoice from "../DefineVoice";
import GameElementBody from "../GameElementBody";
import GameSizeMarkRS from "../GameSizeMarkRS";
import Logic3021 from "./Logic3021";
import Logic3021Status from "./Logic3021Status";

const APP = `Logic3021StatusPower`;

/**
 * 状态机 - 状态 - 已蓄力
 */
export default class Logic3021StatusPower extends Logic3021Status {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3021StatusPower>({
        instantiate: () => {
            return new Logic3021StatusPower();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3021) {
        let val = UtilObjPool.Pop(Logic3021StatusPower._t, apply);
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
        VoiceOggViewState.inst.VoiceSet (DefineVoice.CALL);
        this.relMachine.relBody.commonAnim = Logic3021Status.ANIM_POWER;

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
            GameSizeMarkRS.PlayEffCall (APP, this.relMachine.relBody);
            let areaCall = this.relMachine.args.listCallTarget.length == 1 ? 0 : this.relMachine.args.areaCall;
            let distance = areaCall == 0 ? 0 : areaCall * 2 / (this.relMachine.args.listCallTarget.length - 1);
            for (let i = 0; i < this.relMachine.args.listCallTarget.length; i++) {
                let idCfg = this.relMachine.args.listCallTarget [i];
                let count = this.relMachine.relBody.relState.GetIdCfgCount (idCfg);
                // 数量超标
                if (this.relMachine.args.maxCount <= count) {
                    continue;
                };
                let vec = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
                let eleBody = GameElementBody.PopForCall (
                    APP,
    
                    {
                        posX: this.relMachine.relBody.commonCenterPos.x - areaCall + distance * i,
                        posY: this.relMachine.relBody.commonCenterPos.y,
    
                        vecX: vec.x,
                        vecY: vec.y,
    
                        cfgId: idCfg,
                        camp: this.relMachine.relBody.commonArgsCamp,
                        caller: this.relMachine.relBody
                    }
                );
                this.relMachine.relBody.relState.AddEle (eleBody);
                GameSizeMarkRS.PlayEffCall (APP, eleBody);
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