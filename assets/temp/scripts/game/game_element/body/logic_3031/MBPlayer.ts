import { b2Body, b2BodyDef, b2BodyType, b2CircleShape, b2Contact, b2FixtureDef, b2Mat33, b2PolygonShape, b2RevoluteJointDef, b2Shape, b2Vec2, b2Vec2_zero } from "../../../../../box2d_ts/Box2D";
import MgrEquipment from "./MgrEquipment";
import MgrActionMachine from "./MgrActionMachine";
import GameElementScene from "../../common/GameElementScene";
import MgrHealth from "./MgrHealth";
import GameElementBody from "../GameElementBody";
import jiang from "../../../../frame/global/Jiang";
import b2Extend from "../../../../frame/extend/b2_extend/B2Extend";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import GameElementBodyBehaviour from "../GameElementBodyBehaviour";
import Logic3031Args from "./Logic3031Args";
import GameCtxB2BodyFixtureTypeRS from "../../GameCtxB2BodyFixtureTypeRS";
import MgrBodyDir from "./MgrBodyDir";
import MgrDefendCD from "./MgrDefendCD";
import MgrDefendAct from "./MgrDefendAct";
import GameElementLigthPoint from "../../common/GameElementLightPoint";
import AnimKeep from "../../common/AnimKeep";
import gameCommon from "../../../GameCommon";
import AnimFlash from "../../common/AnimFlash";
import UIRoot from "../../../../frame/ui/UIRoot";
import MgrHorseFrame from "./MgrHorseFrame";

const APP = `MBPlayer`;

/**
 * 元素-npc
 */
export default class MBPlayer extends GameElementBodyBehaviour {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<MBPlayer>({
        instantiate: () => {
            return new MBPlayer();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (
        apply: string,
        monster: GameElementBody,
        args: Logic3031Args
    ) 
    {
        let val = UtilObjPool.Pop(MBPlayer._t, apply);
        val.relBody = monster;
        val.args = args;
        
        // 当前能量
        val.mpMax = args.mpMax;
        val.mpCurrent = 0;
        val.mpInc = args.mpInc;

        // 记下主体
        val.relBody = monster;

        val.relBody.evterAdded.On(() => {
            const npcBD = UtilObjPool.Pop(UtilObjPool.typeBodyDef, APP);
            const npcFD = UtilObjPool.Pop(UtilObjPool.typeFixtureDef, APP);

            npcBD.type = b2BodyType.b2_dynamicBody;
            npcBD.position.x = val.relBody.commonFootPos.x * jiang.mgrUI._sizePerPixel;
            npcBD.position.y = val.relBody.commonFootPos.y * jiang.mgrUI._sizePerPixel;
            npcBD.gravityScale = 1;
            val.relBody.commonBody = val.relBody.BodyCreate(
                APP,
                npcBD
            );
            val.relBody.commonBody.b2Body.SetFixedRotation(true);
    
            let wheelShapeBottom = UtilObjPool.Pop(UtilObjPool.typeCircleShape, APP);
            let p = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
            p.y = args.bodyRadius * jiang.mgrUI._sizePerPixel;
            wheelShapeBottom.Set(
                p,
                args.bodyRadius * jiang.mgrUI._sizePerPixel
            );
            npcFD.shape = wheelShapeBottom;
            val.relBody.commonBody.FixtureCreate(APP, npcFD, GameCtxB2BodyFixtureTypeRS.BODY);

            const npcFDDefend = UtilObjPool.Pop(UtilObjPool.typeFixtureDef, APP);
            let wheelShapeBottomDefend = UtilObjPool.Pop(UtilObjPool.typeCircleShape, APP);
            let pDefend = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
            pDefend.y = args.defendRadius * jiang.mgrUI._sizePerPixel;
            wheelShapeBottomDefend.Set(
                pDefend,
                args.defendRadius * jiang.mgrUI._sizePerPixel
            );
            npcFDDefend.shape = wheelShapeBottomDefend;
            val.relBody.commonBody.FixtureCreate(APP, npcFDDefend, GameCtxB2BodyFixtureTypeRS.SHIELD);

            val.UpdatePosData ();

            // 管理器 - 生命
            val.playerMgrHealth = MgrHealth.Pop(
                APP,
                val
            );
            // 管理器 - 装备
            val.playerMgrEquipment = MgrEquipment.Pop(
                APP,
                val
            );
            // 管理器 - 马的行为
            val.playerMgrAction = MgrActionMachine.Pop(
                APP,
                val
            );
            // 管理器 - 身体朝向
            val.playerMgrBodyDir = MgrBodyDir.Pop(
                APP,
                val
            );
            // 管理器 - 格挡 cd
            val.playerMgrDefendCD = MgrDefendCD.Pop(
                APP,
                val
            );
            // 管理器 - 格挡行为
            val.playerMgrDefendAct = MgrDefendAct.Pop(
                APP,
                val
            );
            // 管理器 - 马的帧动画
            val.playerMgrHorseFrame = MgrHorseFrame.Pop(
                APP,
                val
            );

            val.relBody.evterContactGroundA.On((cont) => {
                cont.SetTangentSpeed(args.speed * jiang.mgrUI._sizePerPixel * 1000);
                val.playerMgrAction.currStatus.OnConcatWithGround();
            });
    
            val.relBody.evterContactGroundB.On((cont) => {
                cont.SetTangentSpeed(-args.speed * jiang.mgrUI._sizePerPixel * 1000);
                val.playerMgrAction.currStatus.OnConcatWithGround();
            });
    
            val.relBody.commonEvterDmg.On((ctx) => {
                val.playerMgrDefendAct.currStatus.OnDmg (ctx);
            });
        });
        return val;
    }

    /**
     * 更新坐标数据
     */
    UpdatePosData () {
        this.relBody.commonFootPos.x = this.relBody.commonBody.b2Body.GetPosition().x / jiang.mgrUI._sizePerPixel;
        this.relBody.commonFootPos.y = this.relBody.commonBody.b2Body.GetPosition().y / jiang.mgrUI._sizePerPixel;
        this.relBody.commonCenterPos.x = this.relBody.commonFootPos.x;
        this.relBody.commonCenterPos.y = this.relBody.commonFootPos.y + this.args.bodyRadius;
        this.relBody.commonHeadPos.x = this.relBody.commonFootPos.x;
        this.relBody.commonHeadPos.y = this.relBody.commonFootPos.y + this.args.bodyRadius * 2;

        this.playerEquipPos.x = this.relBody.commonFootPos.x + this.args.equipOffsetX;
        this.playerEquipPos.y = this.relBody.commonFootPos.y + this.args.equipOffsetY;
    }

    OnTimeStep(passedMS: number): void {
        this.animKeepDefend.currStatus.OnStep (passedMS);
        this.animKeepShield.currStatus.OnStep (passedMS);
        this.animFlashReady.currStatus.OnStep (passedMS);
        this.animShieldReady.currStatus.OnStep (passedMS);
        this.animDmgedFlash.currStatus.OnStep (passedMS);
        this.animTraceFlash.currStatus.OnStep (passedMS);

        if (this.playerMgrEquipment.equipInst.OnMpRecoveryAble()) {
            this.mpCurrent += passedMS * this.mpInc;
        };
        // 充盈
        if (this.mpMax <= this.mpCurrent) {
            this.mpCurrent = this.mpMax;
        };

        this.UpdatePosData ();

        this.playerMgrHealth.machine.currStatus.OnStep(passedMS);
        this.playerMgrAction.currStatus.OnStep(passedMS);
        this.playerMgrEquipment.OnStep(passedMS);
        this.playerMgrDefendCD.currStatus.OnStep (passedMS);
        this.playerMgrDefendAct.OnStep (passedMS);
        this.playerMgrHorseFrame.currStatus.OnStep (passedMS);
    }

    GetPhysicsTag(): Function {
        return MBPlayer;
    }

    /**
     * 渐变 - 防御
     */
    animKeepDefend = AnimKeep.Pop (APP, gameCommon.PLAYER_MS_DEFEND_IN, gameCommon.PLAYER_MS_DEFEND_OUT);
    /**
     * 渐变 - 护盾
     */
    animKeepShield = AnimKeep.Pop (APP, gameCommon.PLAYER_MS_SHIELD_IN, gameCommon.PLAYER_MS_SHIELD_OUT);
    /**
     * 渐变 - 就绪闪烁
     */
    animFlashReady = AnimFlash.Pop (APP, gameCommon.PLAYER_MS_READY_IN, gameCommon.PLAYER_MS_READY_OUT);
    /**
     * 渐变 - 就绪常驻
     */
    animShieldReady = AnimKeep.Pop (APP, 100, 100);

    /**
     * 管理器 - 生命
     */
    playerMgrHealth: MgrHealth;
    /**
     * 管理器 - 装备
     */
    playerMgrEquipment: MgrEquipment;
    /**
     * 管理器 - 行为
     */
    playerMgrAction: MgrActionMachine;
    /**
     * 管理器 - 朝向
     */
    playerMgrBodyDir: MgrBodyDir;
    /**
     * 管理器 - 格挡冷却
     */
    playerMgrDefendCD: MgrDefendCD;
    /**
     * 管理器 - 格挡行为
     */
    playerMgrDefendAct: MgrDefendAct;
    /**
     * 管理器 - 马的帧动画
     */
    playerMgrHorseFrame: MgrHorseFrame;

    /**
     * 参数
     */
    args: Logic3031Args;

    /**
     * 默认飞弹数量
     */
    playerSkillIncCount = 1;
    /**
     * 默认角度变化
     */
    playerSkillIncAngle = 1;
    /**
     * 默认装填速度
     */
    playerSkillIncSpeed = 1;
    /**
     * 装备的位置
     */
    playerEquipPos = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP); 
    /**
     * 最大能量
     */
    mpMax: number;
    /**
     * 当前能量
     */
    mpCurrent: number;
    /**
     * 回能提升
     */
    mpInc: number;
    /**
     * 有余力的
     */
    powerEnable: boolean = true;
    /**
     * 受伤闪烁
     */
    animDmgedFlash = AnimFlash.Pop (APP, gameCommon.MS_DMG_FLASH_IN, gameCommon.MS_DMG_FLASH_OUT);
    /**
     * 轨迹闪烁
     */
    animTraceFlash = AnimFlash.Pop (APP, gameCommon.MS_FORWARD_TRACE_FADE_IN, gameCommon.MS_FORWARD_TRACE_FADE_OUT);

    /**
     * 获取水平速度
     * @returns 
     */
    public override b2GetSpeedX(): number {
        return -this.args.speed * jiang.mgrUI._sizePerPixel * 1000
    }

    public GetTraceOpacity () {
        return this.animTraceFlash.Get255 () * 0.2;
    }
}