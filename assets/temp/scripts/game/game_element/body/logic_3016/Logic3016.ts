import { b2BodyType } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import GameElementBody from "../GameElementBody";
import GameElementBodyBehaviour from "../GameElementBodyBehaviour";
import GameElementBodyBehaviourRS from "../GameElementBodyBehaviourRS";
import Logic3016Args from "./Logic3016Args";
import GameDisplayMonster000 from "../../../display/GameDisplayBody000";
import GameCtxB2BodyFixtureTypeRS from "../../GameCtxB2BodyFixtureTypeRS";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import GameElementPart from "../../common/GameElementPart";
import GameElementBodyCtxDmgType from "../GameElementBodyCtxDmgType";
import GameDisplayMonster001 from "../../../display/GameDisplayBody001";
import GameElementEff from "../../common/GameElementEff";
import GameSizeMarkRS from "../GameSizeMarkRS";

const APP = `Logic3016`;

/**
 * 孢子射弹
 */
class Logic3016 extends GameElementBodyBehaviour {
    /**
     * 参数
     */
    public args: Logic3016Args;

    /**
     * 伤害许可
     */
    public effAbleCount: number = 1;

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3016>({
        instantiate: () => {
            return new Logic3016();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, ge: GameElementBody, args: Logic3016Args) {
        let val = UtilObjPool.Pop(Logic3016._t, apply);
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
        this.relBody.relState.RemEle(this.relBody);
    }

    private _isFloat = false;

    public OnTimeStep(passedMS: number): void {
        if (!this._isFloat && this.relBody.commonBody.b2Body.GetLinearVelocity().y < 0) {
            this._isFloat = true;
            this.relBody.commonBody.b2Body.SetGravityScale (0);
            let vec = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
            vec.x = this.relBody.relState.player.commonBehaviour.b2GetSpeedX();
            vec.y = - this.relBody.commonArgsInitVec.len() / 10;
            this.relBody.commonBody.b2Body.SetLinearVelocity (vec);
        };

        this.relBody.commonFootPos.x = this.relBody.commonBody.b2Body.GetPosition().x / jiang.mgrUI._sizePerPixel;
        this.relBody.commonFootPos.y = this.relBody.commonBody.b2Body.GetPosition().y / jiang.mgrUI._sizePerPixel;
        this.relBody.commonCenterPos.x = this.relBody.commonFootPos.x;
        this.relBody.commonCenterPos.y = this.relBody.commonFootPos.y;
        this.relBody.commonHeadPos.x = this.relBody.commonFootPos.x;
        this.relBody.commonHeadPos.y = this.relBody.commonFootPos.y;

        // 遇到敌方的话造成伤害
        if (0 < this.relBody.listConcatedBodyEnemy.length) {
            let concat = this.relBody.listConcatedBodyEnemy [0];
            if (this.effAbleCount == 0) {
                return;
            };
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
                )
            };
            
            this.effAbleCount--;
            if (this.effAbleCount == 0) {
                this.relBody.relState.RemEle(this.relBody);
                return;
            };
        };

        // 遇到友方的话造成治疗
        if (this._isFloat && 0 < this.relBody.listConcatedBodyFriendNoBullet.length) {
            let concat = this.relBody.listConcatedBodyFriendNoBullet [0];
            if (this.effAbleCount == 0) {
                return;
            };
            (concat.relFixture.relBody.relEle as GameElementBody).commonEvterCureWithEff.Call(this.relBody.commonInfluence);

            this.effAbleCount--;
            if (this.effAbleCount == 0) {
                this.relBody.relState.RemEle(this.relBody);
                return;
            };
        };

        // 触地即亡
        if (0 < this.relBody.listConcatedGround.length) {
            this.relBody.relState.RemEle(this.relBody);
            return;
        };
    }

    public OnDestory(): void {
        this.relBody.BodyDestory(this.relBody.commonBody);
        this.relBody.relState.AddEle (GameElementEff.PopForXYStatic (
            APP,
            this.relBody.commonCenterPos.x,
            this.relBody.commonCenterPos.y,
            0,
            1,
            this.args.effDismiss,
            this.relBody.commonCache.colorMain
        ));
        VoiceOggViewState.inst.VoiceSet(this.args.deathOgg);
    }
}

namespace Logic3016 {
    export const rs = GameElementBodyBehaviourRS.Pop<Logic3016Args>(
        APP,
        {
            logicCode: 3016,
            cfgToArgs: (cfg) => {
                return  {
                    deathOgg: Number.parseFloat(cfg.prop_0),
                    bodyRadius: Number.parseFloat(cfg.prop_1),
                    effDismiss: Number.parseFloat(cfg.prop_2)
                };
            },
            init: (ge, t) => {
                ge.commonBehaviour = Logic3016.Pop(APP, ge, t);
            },
            instDisplay: (state, ge, displayList) => {
                displayList.push(GameDisplayMonster001.GetNodeType(ge.commonArgsCfg).CreateNode(
                    state,
                    ge.id,
                    ge.id
                ));
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
                list.push (t.effDismiss);
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

export default Logic3016;