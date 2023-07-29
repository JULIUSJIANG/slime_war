import { b2BodyType } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import GameElementBody from "../GameElementBody";
import GameElementBodyBehaviour from "../GameElementBodyBehaviour";
import GameElementBodyBehaviourRS from "../GameElementBodyBehaviourRS";
import MBPlayer from "../logic_3031/MBPlayer";
import Logic3035Args from "./Logic3035Args";
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
import gameCommon from "../../../GameCommon";

const APP = `Logic3035`;

/**
 * 箭头 + 200401 跳跳糖定制
 */
class Logic3035 extends GameElementBodyBehaviour {
    /**
     * 参数
     */
    public args: Logic3035Args;

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3035>({
        instantiate: () => {
            return new Logic3035();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, ge: GameElementBody, args: Logic3035Args) {
        let val = UtilObjPool.Pop(Logic3035._t, apply);
        val.relBody = ge;
        val.args = args;
        return val;
    }

    /**
     * 跳跃次数
     */
    private jumpCount: number;
    /**
     * 初始速度
     */
    private initB2Vec: number;
    /**
     * 初始水平速度
     */
    private initSpeedX: number;
    /**
     * 初始垂直速度
     */
    private initSpeedY: number;

    public OnInit(): void {
        this.jumpCount = this.args.jumpAbleCount;
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
        this.initB2Vec = Math.sqrt (vSpeed.x ** 2 + vSpeed.y ** 2);
        this.initSpeedX = vSpeed.x;
        this.initSpeedY = vSpeed.y;
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

        if (this.relBody.commonBody.b2Body.GetLinearVelocity().y < 0 && 0 < this.relBody.listConcatedBodyEnemy.length) {
            let vec = UtilObjPool.Pop (UtilObjPool.typeB2Vec2, APP);
            // vec.x = this.relBody.relState.player.commonBehaviour.b2GetSpeedX();
            vec.x = Math.abs (this.initB2Vec * this.args.rateVer);
            vec.y = Math.abs (this.initB2Vec * this.args.rateHor);
            this.relBody.commonBody.b2Body.SetLinearVelocity (vec);
            this.relBody.ClearDmgRecord ();

            let concat = this.relBody.listConcatedBodyEnemy[0];
            GameSizeMarkRS.PlayEffHitByConcat (
                APP,
                concat,
                this.relBody.relState,
                this.relBody.commonCache.colorMain,
                this.relBody.commonArgsCfg.size_mark
            );
            if (this.relBody.CheckDmgAble (concat)) {
                this.relBody.CauseDmg (
                    concat,
                    GameElementBodyCtxDmg.Pop(
                        APP,
                        {
                            dmg: this.relBody.commonInfluence,
                            posX: concat.position.x,
                            posY: concat.position.y,
        
                            repel: this.relBody.commonArgsCfg.props_repel,
                            norX: concat.normal.x,
                            norY: concat.normal.y,
        
                            type: GameElementBodyCtxDmgType.equipment
                        }   
                    )
                );
            };

            this.jumpCount--;
            if (this.jumpCount == 0) {
                this.relBody.relState.RemEle(this.relBody);
                return;
            };
        };

        if (
            0 < this.relBody.listConcatedGround.length 
            && this.relBody.commonBody.b2Body.GetLinearVelocity().y <= 0 
            && this.relBody.commonCenterPos.y < gameCommon.GROUND_Y
        ) 
        {
            GameSizeMarkRS.PlayEffHitByBodyForHitGround (
                APP,
                this.relBody
            );
            this.relBody.relState.RemEle(this.relBody);
        };
    }

    public OnDestory(): void {
        this.relBody.BodyDestory(this.relBody.commonBody);
        GameElementPart.BoomForBody(
            APP,
            this.relBody.relState,
            this.relBody.commonCache.colorMain,
            this.args.bodyRadius,
            this.relBody.commonFootPos.x,
            this.relBody.commonFootPos.y,
            this.relBody.commonBody.b2Body.GetLinearVelocity().x,
            this.relBody.commonBody.b2Body.GetLinearVelocity().y
        );
        VoiceOggViewState.inst.VoiceSet(this.args.deathOgg);
    }
}

namespace Logic3035 {
    export const rs = GameElementBodyBehaviourRS.Pop<Logic3035Args>(
        APP,
        {
            logicCode: 3035,
            cfgToArgs: (cfg) => {
                return {
                    deathOgg: Number.parseFloat (cfg.prop_0),
                    bodyRadius: Number.parseFloat (cfg.prop_1),
                    roundPerSeconds: utilString.ParseStrToNum (cfg.prop_2),
                    jumpAbleCount: utilString.ParseStrToNum (cfg.prop_3),
                    rateHor: utilString.ParseStrToNum (cfg.prop_4),
                    rateVer: utilString.ParseStrToNum (cfg.prop_5),
                };
            },
            init: (ge, t) => {
                ge.commonBehaviour = Logic3035.Pop(APP, ge, t);
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

export default Logic3035;