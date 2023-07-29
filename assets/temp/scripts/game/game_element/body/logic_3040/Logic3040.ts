import { b2BodyType } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import GameElementBody from "../GameElementBody";
import GameElementBodyBehaviour from "../GameElementBodyBehaviour";
import GameElementBodyBehaviourRS from "../GameElementBodyBehaviourRS";
import MBPlayer from "../logic_3031/MBPlayer";
import Logic3040Args from "./Logic3040Args";
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

const APP = `Logic3040`;

/**
 * 箭头 + 时光逆转
 */
class Logic3040 extends GameElementBodyBehaviour {
    /**
     * 参数
     */
    public args: Logic3040Args;

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3040>({
        instantiate: () => {
            return new Logic3040();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, ge: GameElementBody, args: Logic3040Args) {
        let val = UtilObjPool.Pop(Logic3040._t, apply);
        val.relBody = ge;
        val.args = args;
        return val;
    }

    public OnInit(): void {
        this.relBody.commonHpMax = 0;
        this.relBody.commonHpCurrent = 0;

        const npcBD = UtilObjPool.Pop(UtilObjPool.typeBodyDef, APP);
        npcBD.type = b2BodyType.b2_dynamicBody;
        npcBD.position.x = this.relBody.commonFootPos.x * jiang.mgrUI._sizePerPixel;
        this.b2PosXinited = npcBD.position.x;
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

    /**
     * 初始化完成时候的 b2 位置
     */
    b2PosXinited: number;

    public OnTimeStep(passedMS: number): void {
        this.MapB2PosToPixelPos();
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
            return;
        };

        if (0 < this.relBody.listConcatedBodyEnemy.length) {
            let concat = this.relBody.listConcatedBodyEnemy[0];
            if (this.relBody.CheckDmgAble (concat)) {
                GameSizeMarkRS.PlayEffHitByConcat (
                    APP,
                    concat,
                    this.relBody.relState,
                    this.relBody.commonCache.colorMain,
                    this.relBody.commonArgsCfg.size_mark
                );
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
                )
            };

            let vec = UtilObjPool.Pop (UtilObjPool.typeB2Vec2, APP);
            vec.y = this.relBody.commonBody.b2Body.GetLinearVelocity ().y - this.relBody.relState.b2Gravity * this.relBody.commonArgsCfg.gravity_scale * this.args.msRecovery / 1000;
            vec.x = this.relBody.commonBody.b2Body.GetLinearVelocity ().x;
            let pos = UtilObjPool.Pop (UtilObjPool.typeB2Vec2, APP);
            pos.x = this.relBody.commonBody.b2Body.GetPosition().x - this.relBody.commonBody.b2Body.GetLinearVelocity ().x * this.args.msRecovery / 1000;
            // 不可穿越回到发射前的位置
            if (pos.x <= this.b2PosXinited) {
                this.relBody.relState.RemEle (this.relBody);
                return;
            };
            let offset = this.relBody.relState.player.commonBehaviour.b2GetSpeedX() * this.args.msRecovery / 1000;
            pos.x += offset;
            this.b2PosXinited += offset;

            pos.y = this.relBody.commonBody.b2Body.GetPosition().y;
            pos.y = this.relBody.commonBody.b2Body.GetPosition().y - vec.y * this.args.msRecovery / 1000 - 0.5 * this.relBody.relState.b2Gravity * this.relBody.commonArgsCfg.gravity_scale * (this.args.msRecovery / 1000) ** 2;
            this.relBody.commonBody.b2Body.SetPosition (pos);
            this.relBody.commonBody.b2Body.SetLinearVelocity (vec);
            this.MapB2PosToPixelPos ();
            GameSizeMarkRS.PlayEffTransition (
                APP,
                this.relBody
            );
            this.relBody.ClearDmgRecord ();
        };
    }

    MapB2PosToPixelPos () {
        this.relBody.commonFootPos.x = this.relBody.commonBody.b2Body.GetPosition().x / jiang.mgrUI._sizePerPixel;
        this.relBody.commonFootPos.y = this.relBody.commonBody.b2Body.GetPosition().y / jiang.mgrUI._sizePerPixel;
        this.relBody.commonCenterPos.x = this.relBody.commonFootPos.x;
        this.relBody.commonCenterPos.y = this.relBody.commonFootPos.y;
        this.relBody.commonHeadPos.x = this.relBody.commonFootPos.x;
        this.relBody.commonHeadPos.y = this.relBody.commonFootPos.y;
    }

    public OnDestory(): void {
        this.relBody.BodyDestory(this.relBody.commonBody);
    }
}

namespace Logic3040 {
    export const rs = GameElementBodyBehaviourRS.Pop<Logic3040Args>(
        APP,
        {
            logicCode: 3040,
            cfgToArgs: (cfg) => {
                return {
                    deathOgg: Number.parseFloat (cfg.prop_0),
                    bodyRadius: Number.parseFloat (cfg.prop_1),
                    roundPerSeconds: utilString.ParseStrToNum (cfg.prop_2),
                    msRecovery: utilString.ParseStrToNum (cfg.prop_3)
                };
            },
            init: (ge, t) => {
                ge.commonBehaviour = Logic3040.Pop(APP, ge, t);
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

export default Logic3040;