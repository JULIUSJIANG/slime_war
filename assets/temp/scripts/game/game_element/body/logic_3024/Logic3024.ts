import { b2BodyType, b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import utilString from "../../../../frame/basic/UtilString";
import jiang from "../../../../frame/global/Jiang";
import GameDisplayHp from "../../../display/GameDisplayHp";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import GameElementPart from "../../common/GameElementPart";
import GameElementTxt from "../../common/GameElementTxt";
import GameElementBody from "../GameElementBody";
import GameElementBodyBehaviour from "../GameElementBodyBehaviour";
import GameElementBodyBehaviourRS from "../GameElementBodyBehaviourRS";
import Logic3024Args from "./Logic3024Args";
import Logic3024Status from "./Logic3024Status";
import Logic3024StatusCD from "./Logic3024StatusCD";
import Logic3024StatusOrdinary from "./Logic3024StatusOrdinary";
import GameCtxB2BodyFixtureTypeRS from "../../GameCtxB2BodyFixtureTypeRS";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import GameCtxB2BodyFixture from "../../GameCtxB2BodyFixture";
import Logic3024StatusPower from "./Logic3024StatusPower";
import GameDisplayBody002 from "../../../display/GameDisplayBody002";
import GameElementLigthPoint from "../../common/GameElementLightPoint";
import GameElementBodyCtxDmgType from "../GameElementBodyCtxDmgType";
import GameElementEff from "../../common/GameElementEff";
import GameSizeMarkRS from "../GameSizeMarkRS";

const APP = `Logic3024`;

/**
 * 经典模板，寻敌、跃击 + 孢子攻击
 */
export default class Logic3024 extends GameElementBodyBehaviour {
    /**
     * 重力缩放
     */
    static GRAVITY_SCALE = 1;

    /**
     * 参数
     */
    public args: Logic3024Args;

    constructor () {
        super();
        this.statusOrdinary = Logic3024StatusOrdinary.Pop(APP, this);
        this.statusPower = Logic3024StatusPower.Pop(APP, this);
        this.statusCD = Logic3024StatusCD.Pop(APP, this);
    }
 
    private static _t = new UtilObjPoolType<Logic3024>({
        instantiate: () => {
            return new Logic3024();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, ge: GameElementBody, args: Logic3024Args) {
        let val = UtilObjPool.Pop(Logic3024._t, apply);
        val.relBody = ge;
        val.args = args;
        val.EnterStatus(val.statusOrdinary);
        return val;
    }

    /**
     * 当前状态
     */
    public currStatus: Logic3024Status;

    /**
     * 状态 - 常态
     */
    public statusOrdinary: Logic3024StatusOrdinary;
    /**
     * 状态 - 蓄力
     */
    public statusPower: Logic3024StatusPower;
    /**
     * 状态 - 已受伤
     */
    public statusCD: Logic3024StatusCD;

    /**
     * 进入某个状态
     * @param status 
     */
    public EnterStatus (status: Logic3024Status) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.OnExit();
        };
        if (this.currStatus) {
            this.currStatus.OnEnter();
        };
    }

    /**
     * 形状 - 身体
     */
    fixBody: GameCtxB2BodyFixture;
    /**
     * 形状 - 范围
     */
    fixArea: GameCtxB2BodyFixture;

    public OnInit(): void {
        this.relBody.relState.AddEle(GameElementLigthPoint.Pop(
            APP,
            this.relBody.id,
            this.relBody.commonCache.colorMain,
            GameElementBodyBehaviourRS.GetSize (this.relBody.commonArgsCfg.id)
        ));

        this.relBody.commonHpMax = this.args.hpMax + this.args.hpLevInc * this.relBody.commonArgsPower;
        this.relBody.commonHpCurrent = this.relBody.commonHpMax;
        // 物体
        const mainBodyDef = UtilObjPool.Pop(UtilObjPool.typeBodyDef, APP);
        mainBodyDef.gravityScale = Logic3024.GRAVITY_SCALE;
        mainBodyDef.type = b2BodyType.b2_dynamicBody;
        mainBodyDef.position.x = this.relBody.commonFootPos.x * jiang.mgrUI._sizePerPixel;
        mainBodyDef.position.y = this.relBody.commonFootPos.y * jiang.mgrUI._sizePerPixel;
        this.relBody.commonBody = this.relBody.BodyCreate(
            APP,
            mainBodyDef
        );
        this.relBody.commonBody.b2Body.SetFixedRotation(true);

        // 形状
        const mainShapeDef = UtilObjPool.Pop(UtilObjPool.typeFixtureDef, APP);
        let mainCircleShape = UtilObjPool.Pop(UtilObjPool.typeCircleShape, APP);
        let mainPos = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
        mainPos.y = this.args.bodyRadius * jiang.mgrUI._sizePerPixel;
        mainCircleShape.Set(
            mainPos,
            this.args.bodyRadius * jiang.mgrUI._sizePerPixel
        );
        mainShapeDef.shape = mainCircleShape;
        this.fixBody = this.relBody.commonBody.FixtureCreate(APP, mainShapeDef, GameCtxB2BodyFixtureTypeRS.BODY);

        // 范围形状
        const areaShapeDef = UtilObjPool.Pop(UtilObjPool.typeFixtureDef, APP);
        areaShapeDef.density = 0;
        let areaCircleShape = UtilObjPool.Pop(UtilObjPool.typeCircleShape, APP);
        let areaPos = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
        areaPos.y = this.args.bodyRadius * jiang.mgrUI._sizePerPixel;
        areaCircleShape.Set(
            areaPos,
            (this.args.atkArea + this.args.bodyRadius) * jiang.mgrUI._sizePerPixel
        );
        areaShapeDef.shape = areaCircleShape;
        this.fixArea = this.relBody.commonBody.FixtureCreate(APP, areaShapeDef, GameCtxB2BodyFixtureTypeRS.AREA);
        this.relBody.commonBody.b2Body.SetLinearVelocity(this.relBody.commonArgsInitVec.mulSelf(jiang.mgrUI._sizePerPixel * 1000));

        this.OnTimeStep(0);
    }

    public OnDmg(ctx: GameElementBodyCtxDmg): void {
        this.currStatus.OnDmg(ctx);
        GameElementTxt.PopForDmg(
            APP,
            ctx,
            this.relBody.relState
        );
        VoiceOggViewState.inst.VoiceSet(this.args.hurtedOgg);
        this.relBody.commonHpCurrent -= ctx.dmg;
        this.relBody.commonHpCurrent = Math.max(0, this.relBody.commonHpCurrent);
        if (this.relBody.commonHpCurrent != 0) {
            return;
        };
        this.relBody.relState.RemEle(this.relBody);
    }

    public OnConcatA(cont: b2Contact<b2Shape, b2Shape>): void {
        this.currStatus.OnConcatA(cont);
    }

    public OnConcatB(cont: b2Contact<b2Shape, b2Shape>): void {
        this.currStatus.OnConcatB(cont);
    }

    public OnTimeStep(passedMS: number): void {
        this.currStatus.OnTimeStep(passedMS);

        this.relBody.commonFootPos.x = this.relBody.commonBody.b2Body.GetPosition().x / jiang.mgrUI._sizePerPixel;
        this.relBody.commonFootPos.y = this.relBody.commonBody.b2Body.GetPosition().y / jiang.mgrUI._sizePerPixel;
        this.relBody.commonCenterPos.x = this.relBody.commonFootPos.x;
        this.relBody.commonCenterPos.y = this.relBody.commonFootPos.y + this.args.bodyRadius;
        this.relBody.commonHeadPos.x = this.relBody.commonFootPos.x;
        this.relBody.commonHeadPos.y = this.relBody.commonFootPos.y + this.args.bodyRadius * 2;

        for (let i = 0; i < this.relBody.listConcatedBodyEnemy.length; i++) {
            let concat = this.relBody.listConcatedBodyEnemy[i];
            // 身体有接触到单位
            if (concat.fixtureSelf == this.fixBody && this.relBody.CheckDmgAble (concat)) {
                this.relBody.BodyStop ();
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
    
                            repel: 0,
                            norX: concat.normal.x,
                            norY: concat.normal.y,

                            type: GameElementBodyCtxDmgType.equipment
                        }
                    )
                );
            };
            if (concat.fixtureSelf == this.fixArea && concat.CheckValid ()) {
                let ele = concat.relFixture.relBody.relEle as GameElementBody;
                // 进入冷却
                this.currStatus.OnTarget(ele);
            };
        };
    }

    public OnDestory(): void {
        this.Logic3024OnDestory ();
        this.relBody.BodyDestory(this.relBody.commonBody);
        GameElementPart.BoomForBody(
            APP,
            this.relBody.relState,
            this.relBody.commonCache.colorMain,
            this.args.bodyRadius,
            this.relBody.commonCenterPos.x,
            this.relBody.commonCenterPos.y,
            0,
            -1
        );
        VoiceOggViewState.inst.VoiceSet(this.args.deathOgg);
    }

    protected Logic3024OnDestory () {

    }

    static rs = GameElementBodyBehaviourRS.Pop<Logic3024Args>(
        APP,
        {
            logicCode: 3024,
            cfgToArgs: (cfg) => {
                return {
                    deathOgg: Number.parseFloat(cfg.prop_0),
    
                    hpMax: Number.parseFloat(cfg.prop_1),
                    hpLevInc: Number.parseFloat(cfg.lv_inc_1),
                    bodyRadius: Number.parseFloat(cfg.prop_2),
                    moveSpeed: Number.parseFloat(cfg.prop_3),
                    hurtedOgg: Number.parseFloat(cfg.prop_4),
                    cd: Number.parseFloat(cfg.prop_5),
                    repel: Number.parseFloat(cfg.prop_6),
                    atkArea: Number.parseFloat(cfg.prop_7),
                    powerTime: Number.parseFloat(cfg.prop_8),
                    atkTime: Number.parseFloat(cfg.prop_9),
                    listSplit: utilString.ParseStrToListNum (cfg.prop_10),
                    random: Number.parseFloat(cfg.prop_11),
                };
            },
            init: (ge, t) => {
                ge.commonBehaviour = Logic3024.Pop(APP, ge, t);
            },
            instDisplay: (state, ge, displayList) => {
                displayList.push(GameDisplayBody002.GetNodeType(ge.commonArgsCfg).CreateNode(
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
                return Math.ceil (t.hpMax + t.hpLevInc * cfg.power);
            },
            sizeGetter: (t) => {
                return t.bodyRadius;
            },

            aditionalBody: (cfg, t) => {
                let list: Array<number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                list.push (...t.listSplit);
                return list;
            },
            aditionalEff: (cfg, t) => {
                let list: Array<number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                return list;
            },
            aditionalVoice: (cfg, t) => {
                let list: Array<number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                list.push (
                    t.hurtedOgg,
                    t.deathOgg
                );
                return list;
            }
        }
    )
}
