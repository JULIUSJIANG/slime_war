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
import Logic3001Args from "./Logic3001Args";
import Logic3001Status from "./Logic3001Status";
import Logic3001StatusCD from "./Logic3001StatusCD";
import Logic3001StatusOrdinary from "./Logic3001StatusOrdinary";
import GameCtxB2BodyFixtureTypeRS from "../../GameCtxB2BodyFixtureTypeRS";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import GameCtxB2BodyFixture from "../../GameCtxB2BodyFixture";
import Logic3001StatusPower from "./Logic3001StatusPower";
import Logic3001StatusJumped from "./Logic3001StatusJumped";
import GameDisplayBody002 from "../../../display/GameDisplayBody002";
import GameElementLigthPoint from "../../common/GameElementLightPoint";
import GameElementBodyCtxDmgType from "../GameElementBodyCtxDmgType";
import GameElementEff from "../../common/GameElementEff";
import GameSizeMarkRS from "../GameSizeMarkRS";
import GuideMgr from "../../../view/guide_view/GuideMgr";

const APP = `Logic3001`;

/**
 * 经典模板，寻敌、跃击
 */
export default class Logic3001 extends GameElementBodyBehaviour {
    /**
     * 重力缩放
     */
    static GRAVITY_SCALE = 1;

    /**
     * 参数
     */
    public args: Logic3001Args;

    constructor () {
        super();
        this.statusOrdinary = Logic3001StatusOrdinary.Pop(APP, this);
        this.statusPower = Logic3001StatusPower.Pop(APP, this);
        this.statusJumped = Logic3001StatusJumped.Pop(APP, this);
        this.statusCD = Logic3001StatusCD.Pop(APP, this);
    }
 
    private static _t = new UtilObjPoolType<Logic3001>({
        instantiate: () => {
            return new Logic3001();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, ge: GameElementBody, args: Logic3001Args) {
        let val = UtilObjPool.Pop(Logic3001._t, apply);
        val.relBody = ge;
        val.args = args;
        val.EnterStatus(val.statusOrdinary);
        return val;
    }

    /**
     * 当前状态
     */
    public currStatus: Logic3001Status;

    /**
     * 状态 - 常态
     */
    public statusOrdinary: Logic3001StatusOrdinary;
    /**
     * 状态 - 蓄力
     */
    public statusPower: Logic3001StatusPower;
    /**
     * 状态 - 跳跃
     */
    public statusJumped: Logic3001StatusJumped;
    /**
     * 状态 - 已受伤
     */
    public statusCD: Logic3001StatusCD;

    /**
     * 进入某个状态
     * @param status 
     */
    public EnterStatus (status: Logic3001Status) {
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
        mainBodyDef.gravityScale = Logic3001.GRAVITY_SCALE;
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
        GameElementTxt.PopForDmg(
            APP,
            ctx,
            this.relBody.relState
        );
        // 引导中
        if (GuideMgr.inst.currStatus != GuideMgr.inst.statusIdle && ctx.type != GameElementBodyCtxDmgType.shield) {
            // 可用的伤害次数
            if (GuideMgr.inst.dmgAble == 0) {
                return;
            };
            GuideMgr.inst.dmgAble--;
        };
        this.currStatus.OnDmg(ctx);
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
            if (concat.fixtureSelf == this.fixBody) {
                if (this.relBody.CheckDmgAble (concat)) {
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
            };
            if (concat.fixtureSelf == this.fixArea && concat.CheckValid ()) {
                let ele = concat.relFixture.relBody.relEle as GameElementBody;
                // 进入冷却
                this.currStatus.OnTarget(ele);
            };
        };
    }

    public OnDestory(): void {
        this.Logic3001OnDestory ();
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

    protected Logic3001OnDestory () {

    }

    static rs = GameElementBodyBehaviourRS.Pop<Logic3001Args>(
        APP,
        {
            logicCode: 3001,
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
                    atkTime: Number.parseFloat(cfg.prop_9)
                };
            },
            init: (ge, t) => {
                ge.commonBehaviour = Logic3001.Pop(APP, ge, t);
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
