import { b2BodyType, b2CircleShape, b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
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
import Logic3023Args from "./Logic3023Args";
import Logic3023Status from "./Logic3023Status";
import Logic3023StatusCD from "./Logic3023StatusCD";
import Logic3023StatusOrdinary from "./Logic3023StatusOrdinary";
import GameCtxB2BodyFixtureTypeRS from "../../GameCtxB2BodyFixtureTypeRS";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import GameCtxB2BodyFixture from "../../GameCtxB2BodyFixture";
import Logic3023StatusPower from "./Logic3023StatusPower";
import GameElementLigthPoint from "../../common/GameElementLightPoint";
import GameDisplayBody011 from "../../../display/GameDisplayBody011";
import GameElementBodyCtxDmgType from "../GameElementBodyCtxDmgType";
import GameElementEff from "../../common/GameElementEff";
import GameSizeMarkRS from "../GameSizeMarkRS";

const APP = `Logic3023`;

/**
 * 经典模板，寻敌、跃击 + 鬼火守护
 */
export default class Logic3023 extends GameElementBodyBehaviour {
    /**
     * 重力缩放
     */
    static GRAVITY_SCALE = 1;

    /**
     * 参数
     */
    public args: Logic3023Args;

    constructor () {
        super();
        this.statusOrdinary = Logic3023StatusOrdinary.Pop(APP, this);
        this.statusPower = Logic3023StatusPower.Pop(APP, this);
        this.statusCD = Logic3023StatusCD.Pop(APP, this);
    }
 
    private static _t = new UtilObjPoolType<Logic3023>({
        instantiate: () => {
            return new Logic3023();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, ge: GameElementBody, args: Logic3023Args) {
        let val = UtilObjPool.Pop(Logic3023._t, apply);
        val.relBody = ge;
        val.args = args;
        val.EnterStatus(val.statusOrdinary);
        return val;
    }

    /**
     * 当前状态
     */
    public currStatus: Logic3023Status;

    /**
     * 状态 - 常态
     */
    public statusOrdinary: Logic3023StatusOrdinary;
    /**
     * 状态 - 蓄力
     */
    public statusPower: Logic3023StatusPower;
    /**
     * 状态 - 已受伤
     */
    public statusCD: Logic3023StatusCD;

    /**
     * 进入某个状态
     * @param status 
     */
    public EnterStatus (status: Logic3023Status) {
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
    /**
     * 形状 - 卫星
     */
    fixBall: GameCtxB2BodyFixture;

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
        mainBodyDef.gravityScale = Logic3023.GRAVITY_SCALE;
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

        // 卫星
        let ballShapeDef = UtilObjPool.Pop (UtilObjPool.typeFixtureDef, APP);
        let ballCircleShape = UtilObjPool.Pop (UtilObjPool.typeCircleShape, APP);
        let ballPos = UtilObjPool.Pop (UtilObjPool.typeccVec2, APP);
        ballCircleShape.Set (ballPos, this.args.defenderRadius * jiang.mgrUI._sizePerPixel);
        ballShapeDef.shape = ballCircleShape;
        this.fixBall = this.relBody.commonBody.FixtureCreate (APP, ballShapeDef, GameCtxB2BodyFixtureTypeRS.AREA_SHIELD);

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

    /**
     * 复用的位置
     */
    pos = UtilObjPool.Pop (UtilObjPool.typeB2Vec2, APP);
    
    /**
     * 角度
     */
    angle: number = 0;

    public OnTimeStep(passedMS: number): void {
        this.angle += Math.PI * 2 * passedMS / this.args.timeCircle;
        this.pos.x = (Math.cos (this.angle) * this.args.moveRadius) * jiang.mgrUI._sizePerPixel;
        this.pos.y = this.args.defenderY * jiang.mgrUI._sizePerPixel; // (Math.sin (this.angle) * this.args.moveRadius + this.args.bodyRadius) * jiang.mgrUI._sizePerPixel;
        (this.fixBall.b2Fixture.GetShape() as b2CircleShape).Set (this.pos);

        this.currStatus.OnTimeStep(passedMS);

        this.relBody.commonFootPos.x = this.relBody.commonBody.b2Body.GetPosition().x / jiang.mgrUI._sizePerPixel;
        this.relBody.commonFootPos.y = this.relBody.commonBody.b2Body.GetPosition().y / jiang.mgrUI._sizePerPixel;
        this.relBody.commonCenterPos.x = this.relBody.commonFootPos.x;
        this.relBody.commonCenterPos.y = this.relBody.commonFootPos.y + this.args.bodyRadius;
        this.relBody.commonHeadPos.x = this.relBody.commonFootPos.x;
        this.relBody.commonHeadPos.y = this.relBody.commonFootPos.y + this.args.bodyRadius * 2;

        for (let i = 0; i < this.relBody.listConcatedBodyEnemy.length; i++) {
            let concat = this.relBody.listConcatedBodyEnemy[i];
            let ele = concat.relFixture.relBody.relEle as GameElementBody;
            // 身体有接触到单位
            if (concat.fixtureSelf == this.fixBody) {
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
        
                                repel: 0,
                                norX: concat.normal.x,
                                norY: concat.normal.y,
        
                                type: GameElementBodyCtxDmgType.equipment
                            }
                        )
                    )
                };
            };
            // 护盾
            if (concat.fixtureSelf == this.fixBall && concat.relFixture.type == GameCtxB2BodyFixtureTypeRS.BODY_BULLET) {
                this.relBody.relState.RemEle (concat.relFixture.relBody.relEle);
                GameElementTxt.PopForTips (
                    APP,
                    `抵挡`,
                    concat.position.x,
                    concat.position.y,
                    this.relBody
                );
            };
            if (concat.fixtureSelf == this.fixArea) {
                // 进入冷却
                this.currStatus.OnTarget(ele);
            };
        };
    }

    public OnDestory(): void {
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
        let p = (this.fixBall.b2Fixture.GetShape() as b2CircleShape).m_p;
        GameElementPart.BoomForBody(
            APP,
            this.relBody.relState,
            this.relBody.commonCache.colorMain,
            this.args.defenderRadius,
            this.relBody.commonFootPos.x + p.x / jiang.mgrUI._sizePerPixel,
            this.relBody.commonFootPos.y + p.y / jiang.mgrUI._sizePerPixel,
            0,
            -1
        );
        this.relBody.BodyDestory(this.relBody.commonBody);
        VoiceOggViewState.inst.VoiceSet(this.args.deathOgg);
    }

    static rs = GameElementBodyBehaviourRS.Pop<Logic3023Args>(
        APP,
        {
            logicCode: 3023,
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
                    bullet: Number.parseFloat(cfg.prop_10),

                    defenderRadius: Number.parseFloat(cfg.prop_11),
                    moveRadius: Number.parseFloat(cfg.prop_12),
                    timeCircle: Number.parseFloat(cfg.prop_13),
                    defenderY: Number.parseFloat(cfg.prop_14)
                };
            },
            init: (ge, t) => {
                ge.commonBehaviour = Logic3023.Pop(APP, ge, t);
            },
            instDisplay: (state, ge, displayList) => {
                displayList.push(GameDisplayBody011.GetNodeType(ge.commonArgsCfg).CreateNode(
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
                list.push (t.bullet);
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
