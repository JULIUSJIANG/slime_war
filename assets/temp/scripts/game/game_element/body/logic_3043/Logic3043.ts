import { b2BodyType } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import GameElementBody from "../GameElementBody";
import GameElementBodyBehaviour from "../GameElementBodyBehaviour";
import GameElementBodyBehaviourRS from "../GameElementBodyBehaviourRS";
import MBPlayer from "../logic_3031/MBPlayer";
import Logic3043Args from "./Logic3043Args";
import GameDisplayMonster000 from "../../../display/GameDisplayBody000";
import GameCtxB2BodyFixtureTypeRS from "../../GameCtxB2BodyFixtureTypeRS";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import GameElementPart from "../../common/GameElementPart";
import GameElementEff from "../../common/GameElementEff";
import GameElementBodyCtxDmgType from "../GameElementBodyCtxDmgType";
import GameSizeMarkRS from "../GameSizeMarkRS";
import GameDisplayMonster017 from "../../../display/GameDisplayBody017";
import utilString from "../../../../frame/basic/UtilString";
import GameDisplayMonster013 from "../../../display/GameDisplayBody013";
import Logic3043StatusFly from "./Logic3043StatusFly";
import Logic3043StatusKeep from "./Logic3043StatusKeep";
import Logic3043Status from "./Logic3043Status";

const APP = `Logic3043`;

/**
 * 箭头 + 滞空伤害
 */
class Logic3043 extends GameElementBodyBehaviour {
    /**
     * 参数
     */
    public args: Logic3043Args;

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3043>({
        instantiate: () => {
            return new Logic3043();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, ge: GameElementBody, args: Logic3043Args) {
        let val = UtilObjPool.Pop(Logic3043._t, apply);
        val.relBody = ge;
        val.args = args;
        return val;
    }

    /**
     * 状态 - 飞翔
     */
    statusFly: Logic3043StatusFly;
    /**
     * 状态 - 滞空
     */
    statusKeep: Logic3043StatusKeep;
    /**
     * 当前状态
     */
    currStatus: Logic3043Status;
    /**
     * 进入状态
     */
    EnterStatus (status: Logic3043Status) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.currStatus.OnEnter ();
    }

    public OnInit(): void {
        this.statusFly = Logic3043StatusFly.Pop (APP, this);
        this.statusKeep = Logic3043StatusKeep.Pop (APP, this);
        this.EnterStatus (this.statusFly);

        this.relBody.commonHpMax = 0;
        this.relBody.commonHpCurrent = 0;

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
        this.relBody.commonBody.b2Body.SetAngularVelocity(this.args.roundPerSeconds * 2 * Math.PI);
    }

    public OnDmg(ctx: GameElementBodyCtxDmg): void {
        this.relBody.relState.RemEle(this.relBody);
    }

    public OnTimeStep(passedMS: number): void {
        this.relBody.commonFootPos.x = this.relBody.commonBody.b2Body.GetPosition().x / jiang.mgrUI._sizePerPixel;
        this.relBody.commonFootPos.y = this.relBody.commonBody.b2Body.GetPosition().y / jiang.mgrUI._sizePerPixel;
        this.relBody.commonCenterPos.x = this.relBody.commonFootPos.x;
        this.relBody.commonCenterPos.y = this.relBody.commonFootPos.y;
        this.relBody.commonHeadPos.x = this.relBody.commonFootPos.x;
        this.relBody.commonHeadPos.y = this.relBody.commonFootPos.y;

        this.currStatus.OnStep (passedMS);
    }

    public OnDestory(): void {
        this.relBody.BodyDestory(this.relBody.commonBody);
        VoiceOggViewState.inst.VoiceSet(this.args.deathOgg);
    }
}

namespace Logic3043 {
    export const rs = GameElementBodyBehaviourRS.Pop<Logic3043Args>(
        APP,
        {
            logicCode: 3043,
            cfgToArgs: (cfg) => {
                return {
                    deathOgg: Number.parseFloat (cfg.prop_0),
                    bodyRadius: Number.parseFloat (cfg.prop_1),
                    roundPerSeconds: utilString.ParseStrToNum (cfg.prop_2),
                    dmgTimes: utilString.ParseStrToNum (cfg.prop_3),
                    dmgSpacing: utilString.ParseStrToNum (cfg.prop_4),
                    gravityScaleWhileKeep: utilString.ParseStrToNum (cfg.prop_5)
                };
            },
            init: (ge, t) => {
                ge.commonBehaviour = Logic3043.Pop(APP, ge, t);
            },
            instDisplay: (state, ge, displayList) => {
                switch (ge.commonArgsCfg.style_code) {
                    case 1013: {
                        displayList.push(GameDisplayMonster013.GetNodeTypeForAtk(ge.commonArgsCfg).CreateNode(
                            state,
                            ge.id,
                            ge.id
                        ));
                        break;
                    };
                    case 1017: {
                        displayList.push(GameDisplayMonster017.GetNodeTypeForAtk(ge.commonArgsCfg).CreateNode(
                            state,
                            ge.id,
                            ge.id
                        ));
                        break;
                    };
                    default: {
                        displayList.push(GameDisplayMonster000.GetNodeTypeForAtk(ge.commonArgsCfg).CreateNode(
                            state,
                            ge.id,
                            ge.id
                        ));
                        break;
                    };
                }
            },
            boardDisplay: null,
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

export default Logic3043;