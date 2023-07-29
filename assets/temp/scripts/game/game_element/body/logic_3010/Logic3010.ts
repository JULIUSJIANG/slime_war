import { b2BodyType } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import GameElementBody from "../GameElementBody";
import GameElementBodyBehaviour from "../GameElementBodyBehaviour";
import GameElementBodyBehaviourRS from "../GameElementBodyBehaviourRS";
import MBPlayer from "../logic_3031/MBPlayer";
import Logic3010Args from "./Logic3010Args";
import GameDisplayMonster000 from "../../../display/GameDisplayBody000";
import GameCtxB2BodyFixtureTypeRS from "../../GameCtxB2BodyFixtureTypeRS";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import GameElementPart from "../../common/GameElementPart";
import GameElementBodyCtxDmgType from "../GameElementBodyCtxDmgType";
import GameElementEff from "../../common/GameElementEff";
import GameDisplayMonster013 from "../../../display/GameDisplayBody013";
import GameSizeMarkRS from "../GameSizeMarkRS";

const APP = `Logic3010`;

/**
 * 滚地射弹
 */
class Logic3010 extends GameElementBodyBehaviour {
    /**
     * 参数
     */
    public args: Logic3010Args;

    /**
     * 伤害许可
     */
    public dmgAbleCount: number = 1;

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3010>({
        instantiate: () => {
            return new Logic3010();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, ge: GameElementBody, args: Logic3010Args) {
        let val = UtilObjPool.Pop(Logic3010._t, apply);
        val.relBody = ge;
        val.args = args;
        return val;
    }

    public OnInit(): void {
        this.timeLess = this.args.deadTime;
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
        this.relBody.commonBody.FixtureCreate(APP, npcFD, GameCtxB2BodyFixtureTypeRS.BODY_BULLET_GROUND);

        let dropTime = this.relBody.commonArgsInitVec.y * jiang.mgrUI._sizePerPixel * 1000 / Math.abs (this.relBody.relState.b2Gravity) * 1000 * 2;
        let xSpeed = this.args.xOffset / dropTime;
        this.relBody.commonArgsInitVec.x += xSpeed;

        let vSpeed = this.relBody.commonArgsInitVec.mulSelf(jiang.mgrUI._sizePerPixel * 1000);
        this.relBody.commonBody.b2Body.SetLinearVelocity(vSpeed);
        this.relBody.commonBody.b2Body.SetAngularVelocity(Math.PI * 2 / 1);
    }

    public OnDmg(ctx: GameElementBodyCtxDmg): void {
        this.relBody.relState.RemEle(this.relBody);
    }

    vecPre = UtilObjPool.Pop (UtilObjPool.typeB2Vec2, APP);

    /**
     * 剩余留存时间
     */
    timeLess: number;

    public OnTimeStep(passedMS: number): void {
        this.timeLess -= passedMS;
        if (this.timeLess <= 0) {
            this.relBody.relState.RemEle(this.relBody);
            return;
        };

        this.relBody.commonFootPos.x = this.relBody.commonBody.b2Body.GetPosition().x / jiang.mgrUI._sizePerPixel;
        this.relBody.commonFootPos.y = this.relBody.commonBody.b2Body.GetPosition().y / jiang.mgrUI._sizePerPixel;
        this.relBody.commonCenterPos.x = this.relBody.commonFootPos.x;
        this.relBody.commonCenterPos.y = this.relBody.commonFootPos.y;
        this.relBody.commonHeadPos.x = this.relBody.commonFootPos.x;
        this.relBody.commonHeadPos.y = this.relBody.commonFootPos.y;
        
        let vec = this.relBody.commonBody.b2Body.GetLinearVelocity();
        if (0 < this.relBody.listConcatedGround.length) {
            if (this.vecPre.y < 0) {
                if (Math.abs( this.relBody.commonArgsInitVec.x * 0.1) < Math.abs (this.vecPre.x)) {
                    let mirror = UtilObjPool.Pop (UtilObjPool.typeB2Vec2, APP);
                    mirror.x = this.vecPre.x * this.args.speedMul;
                    mirror.y = - this.vecPre.y * this.args.speedMul;
                    this.relBody.commonBody.b2Body.SetLinearVelocity(mirror);
    
                    let vecAngular = this.relBody.commonBody.b2Body.GetAngularVelocity ();
                    this.relBody.commonBody.b2Body.SetAngularVelocity (vecAngular * this.args.speedMul);
                }
                else {
                    let speedZero = UtilObjPool.Pop (UtilObjPool.typeB2Vec2, APP);
                    speedZero.x = 0.001;
                    speedZero.y = 0.001;
                    this.relBody.commonBody.b2Body.SetLinearVelocity(speedZero);
                };
            };
        };
        this.vecPre.x = vec.x;
        this.vecPre.y = vec.y;

        if (0 < this.relBody.listConcatedBodyEnemy.length) {
            let concat = this.relBody.listConcatedBodyEnemy[0];
            if (this.dmgAbleCount == 0) {
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
                );
            };
            this.dmgAbleCount--;
            if (this.dmgAbleCount == 0) {
                this.relBody.relState.RemEle(this.relBody);
            };
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

namespace Logic3010 {
    export const rs = GameElementBodyBehaviourRS.Pop<Logic3010Args>(
        APP,
        {
            logicCode: 3010,
            cfgToArgs: (cfg) => {
                return {
                    deathOgg: Number.parseFloat(cfg.prop_0),
                    bodyRadius: Number.parseFloat(cfg.prop_1),
                    deadTime: Number.parseFloat(cfg.prop_2),
                    xOffset: Number.parseFloat(cfg.prop_3),
                    speedMul: Number.parseFloat(cfg.prop_4)
                };
            },
            init: (ge, t) => {
                ge.commonBehaviour = Logic3010.Pop(APP, ge, t);
            },
            instDisplay: (state, ge, displayList) => {
                displayList.push(GameDisplayMonster013.GetNodeTypeForAtk(ge.commonArgsCfg).CreateNode(
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

export default Logic3010;