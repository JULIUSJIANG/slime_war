import { b2BodyType } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import GameElementBody from "../GameElementBody";
import GameElementBodyBehaviour from "../GameElementBodyBehaviour";
import GameElementBodyBehaviourRS from "../GameElementBodyBehaviourRS";
import MBPlayer from "../logic_3031/MBPlayer";
import Logic3030Args from "./Logic3030Args";
import GameDisplayMonster000 from "../../../display/GameDisplayBody000";
import GameCtxB2BodyFixtureTypeRS from "../../GameCtxB2BodyFixtureTypeRS";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import GameElementPart from "../../common/GameElementPart";
import GameElementEff from "../../common/GameElementEff";
import GameElementBodyCtxDmgType from "../GameElementBodyCtxDmgType";
import GameSizeMarkRS from "../GameSizeMarkRS";
import GameDisplayHp from "../../../display/GameDisplayHp";
import Logic3030Status from "./Logic3030Status";
import Logic3030StatusUp from "./Logic3030StatusUp";
import Logic3030StatusDown from "./Logic3030StatusDown";
import MgrSdk from "../../../../frame/sdk/MgrSdk";

const APP = `Logic3030`;

/**
 * 震荡弹
 */
class Logic3030 extends GameElementBodyBehaviour {
    /**
     * 参数
     */
    public args: Logic3030Args;

    /**
     * 伤害许可
     */
    public dmgAbleCount: number = 1;

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3030>({
        instantiate: () => {
            return new Logic3030();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, ge: GameElementBody, args: Logic3030Args) {
        let val = UtilObjPool.Pop(Logic3030._t, apply);
        val.relBody = ge;
        val.args = args;

        val.statusUp = new Logic3030StatusUp (val);
        val.statusDown = new Logic3030StatusDown (val);
        val.EnterStatus (val.statusUp);

        return val;
    }

    /**
     * 当前状态
     */
    currStatus: Logic3030Status;
    /**
     * 状态 - 上升中
     */
    statusUp: Logic3030StatusUp;
    /**
     * 状态 - 下降中
     */
    statusDown: Logic3030StatusDown;
    /**
     * 进入状态
     */
    public EnterStatus (status: Logic3030Status) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.currStatus.OnEnter ();
    }

    public OnInit(): void {
        this.relBody.commonHpMax = this.args.countDefend;
        this.relBody.commonHpCurrent = this.args.countDefend;

        const npcBD = UtilObjPool.Pop(UtilObjPool.typeBodyDef, APP);
        npcBD.type = b2BodyType.b2_dynamicBody;
        npcBD.position.x = this.relBody.commonFootPos.x * jiang.mgrUI._sizePerPixel;
        npcBD.position.y = this.relBody.commonFootPos.y * jiang.mgrUI._sizePerPixel;
        npcBD.gravityScale = this.relBody.commonArgsCfg.gravity_scale;
        this.relBody.commonBody = this.relBody.BodyCreate(
            APP,
            npcBD
        );
        this.relBody.commonBody.b2Body.SetFixedRotation(true);

        const npcFD = UtilObjPool.Pop(UtilObjPool.typeFixtureDef, APP);
        let wheelShapeBottom = UtilObjPool.Pop(UtilObjPool.typeCircleShape, APP);
        wheelShapeBottom.Set(
            UtilObjPool.Pop(UtilObjPool.typeccVec2, APP),
            this.args.bodyRadius * jiang.mgrUI._sizePerPixel
        );
        npcFD.shape = wheelShapeBottom;
        this.relBody.commonBody.FixtureCreate(APP, npcFD, GameCtxB2BodyFixtureTypeRS.BODY_BULLET);
        let vSpeed = this.relBody.commonArgsInitVec.mulSelf(jiang.mgrUI._sizePerPixel * 1000);
        this.relBody.commonBody.b2Body.SetLinearVelocity(vSpeed);
    }

    public OnDmg(ctx: GameElementBodyCtxDmg): void {
        this.currStatus.OnDmg (ctx);
    }

    public OnTimeStep(passedMS: number): void {
        this.relBody.commonFootPos.x = this.relBody.commonBody.b2Body.GetPosition().x / jiang.mgrUI._sizePerPixel;
        this.relBody.commonFootPos.y = this.relBody.commonBody.b2Body.GetPosition().y / jiang.mgrUI._sizePerPixel;
        this.relBody.commonCenterPos.x = this.relBody.commonFootPos.x;
        this.relBody.commonCenterPos.y = this.relBody.commonFootPos.y;
        this.relBody.commonHeadPos.x = this.relBody.commonCenterPos.x;
        this.relBody.commonHeadPos.y = this.relBody.commonCenterPos.y + this.args.bodyRadius;

        if (this.relBody.commonBody.b2Body.GetLinearVelocity ().y < 0) {
            this.currStatus.OnDown ();
        };
        if (0 < this.relBody.commonBody.b2Body.GetLinearVelocity ().y) {
            this.currStatus.OnUp ();
        };
        this.currStatus.OnStep (passedMS);
    }

    public OnDestory(): void {
        let eleBody = GameElementBody.PopForCall (
            APP,

            {
                posX: this.relBody.commonCenterPos.x,
                posY: this.relBody.commonCenterPos.y,

                vecX: 0,
                vecY: 0,
                cfgId: this.args.effDestory,
                camp: this.relBody.commonArgsCamp,
                caller: this.relBody
            }
        );
        this.relBody.relState.AddEle (eleBody);
        // this.relBody.relState.AddEle (GameElementEff.PopForXYStatic (
        //     APP,
        //     this.relBody.commonCenterPos.x,
        //     this.relBody.commonCenterPos.y,
        //     0,
        //     1,
        //     this.args.effDestory,
        //     this.relBody.commonCache.colorMain
        // ));
        this.relBody.BodyDestory(this.relBody.commonBody);
        VoiceOggViewState.inst.VoiceSet(this.args.deathOgg);
    }
}

namespace Logic3030 {
    export const rs = GameElementBodyBehaviourRS.Pop<Logic3030Args>(
        APP,
        {
            logicCode: 3030,
            cfgToArgs: (cfg) => {
                return {
                    deathOgg: Number.parseFloat(cfg.prop_0),
                    bodyRadius: Number.parseFloat(cfg.prop_1),
                    effDestory: Number.parseFloat(cfg.prop_2),
                    countDefend: Number.parseFloat(cfg.prop_3)
                };
            },
            init: (ge, t) => {
                ge.commonBehaviour = Logic3030.Pop(APP, ge, t);
            },
            instDisplay: (state, ge, displayList) => {
                displayList.push(GameDisplayMonster000.GetNodeTypeForAtk(ge.commonArgsCfg).CreateNode(
                    state,
                    ge.id,
                    ge.id
                ));
            },
            boardDisplay: (state, props, displayList) => {
                displayList.push(GameDisplayHp.nodeType.CreateNode(
                    state,
                    props,
                    props[0]
                ))
            },
            atkGetter: (cfg, t) => {
                return 0;
            },
            hpGetter: (cfg, t) => {
                return 0;
            },
            sizeGetter: (t) => {
                return t.bodyRadius;
            },

            aditionalBody: (cfg, t) => {
                let list: Array<number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                list.push (t.effDestory);
                return list;
            },
            aditionalEff: (cfg, t) => {
                let list: Array<number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                return list;
            },
            aditionalVoice: (cfg, t) => {
                let list: Array<number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                list.push (
                    t.deathOgg
                );
                return list;
            }
        }
    );
}

export default Logic3030;