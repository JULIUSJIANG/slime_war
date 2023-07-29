import utilMath from "../../../../frame/basic/UtilMath";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import CfgEquipmentProps from "../../../../frame/config/src/CfgEquipmentProps";
import GraphicsDrawer from "../../../../frame/extend/graphics_drawer/GraphicsDrawer";
import jiang from "../../../../frame/global/Jiang";
import MgrUI from "../../../../frame/ui/MgrUI";
import gameCommon from "../../../GameCommon";
import GameDisplayEquipment002 from "../../../display/GameDisplayEquipment002";
import GameDisplayEquipment004 from "../../../display/GameDisplayEquipment004";
import GameDisplayEquipment005 from "../../../display/GameDisplayEquipment005";
import GameDisplayEquipment006 from "../../../display/GameDisplayEquipment006";
import EquipmentView from "../../../view/equipment_view/EquipmentView";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import GameElementBody from "../../body/GameElementBody";
import MBPlayer from "../../body/logic_3031/MBPlayer";
import EquipmentInst from "../EquipmentInst";
import EquipmentInstRS from "../EquipmentInstRS";
import { GEEI_2006_args } from "./GEEI_2006_args";
import GEEI_2006_status from "./GEEI_2006_status";
import GEEI_2006_status_a_start from "./GEEI_2006_status_atk_a_start";
import GEEI_2006_status_b_ing from "./GEEI_2006_status_atk_b_ing";
import GEEI_2006_status_c_end from "./GEEI_2006_status_atk_c_end";
import GEEI_2006_status_cd from "./GEEI_2006_status_cd";
import GEEI_2006_status_keep from "./GEEI_2006_status_keep";
import GEEI_2006_status_ready from "./GEEI_2006_status_ready";

const APP = `GEEI_2006`;

/**
 * 类似 cf 枪支的武器模板 + 持续输出
 */
class GEEI_2006 extends EquipmentInst {

    private static _t = new UtilObjPoolType<GEEI_2006>({
        instantiate: () => {
            return new GEEI_2006();
        },
        onPop: (t) => {

        },
        onPush: (t)  => {

        },
        tag: APP
    });

    static Pop (
        apply: string,
        args: GEEI_2006_args
    )
    {
        let val = UtilObjPool.Pop (GEEI_2006._t, apply);
        val.args = args;
        return val;
    }

    OnInit(): void {
        this.statusAtkAStart = GEEI_2006_status_a_start.Pop (APP, this);
        this.statusAtkBIng = GEEI_2006_status_b_ing.Pop (APP, this);
        this.statusAtkCEnd = GEEI_2006_status_c_end.Pop (APP, this);
        this.statusCD = GEEI_2006_status_cd.Pop (APP, this);
        this.statusKeep = GEEI_2006_status_keep.Pop (APP, this);
        this.statusReady = GEEI_2006_status_ready.Pop (APP, this);

        this.EnterStatus (this.statusCD);
    }

    /**
     * 缓存了的参数
     */
    args: GEEI_2006_args;
    /**
     * 状态 - 攻击 - 前摇
     */
    statusAtkAStart: GEEI_2006_status_a_start;
    /**
     * 状态 - 攻击 - 进行时
     */
    statusAtkBIng: GEEI_2006_status_b_ing;
    /**
     * 状态 - 攻击 - 后摇
     */
    statusAtkCEnd: GEEI_2006_status_c_end;
    /**
     * 状态 - 攻击 - 冷却
     */
    statusCD: GEEI_2006_status_cd;
    /**
     * 状态 - 攻击 - 蓄力
     */
    statusKeep: GEEI_2006_status_keep;
    /***
     * 状态 - 攻击 - 就绪
     */
    statusReady: GEEI_2006_status_ready;

    /**
     * 当前状态
     */
    currStatus: GEEI_2006_status;

    EnterStatus (status: GEEI_2006_status) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec != null) {
            rec.OnExit ();
        };
        this.currStatus.OnEnter ();
    }

    OnStep (ms: number): void {
        let msChange = this.args.angleOffsetMax / this.args.angleDec * ms;
        this.angleOffset -= msChange;
        this.angleOffset = Math.max (this.angleOffset, 0);
        if (this.relEquip.machine.currStatus == this.relEquip.machine.statusArmo) {
            this.UpdateAim ();
        };
        this.statusReady.animKeep.currStatus.OnStep (ms);
        this.currStatus.OnStep (ms);
    }
    OnDraw(drawer: GraphicsDrawer): void {
        this.relEquip.DrawForCommon (
            this,
            drawer,
            this.atkAngle,
            Math.sqrt (this.vx ** 2 + this.vy ** 2),
            this.tTotal
        );

        let a = this.bulletGravityScale * this.relEquip.npc.relBody.relState.b2Gravity / jiang.mgrUI._sizePerPixel / 1000 ** 2;
        let tVx = this.vx;
        let tVy = this.vy + a * this.tTotal
        let angleEnter = Math.atan2 (tVy, tVx);
        
        let atkEnterCos = Math.cos (angleEnter);
        let atkEnterSin = Math.sin (angleEnter);

        let radius = gameCommon.MARK_TIPS_BASE_RADIUS + Math.abs( this.angleOffset ) * gameCommon.MARK_RADIUS_PER_ANGLE;
        let angleTotal = (gameCommon.MARK_DOT_COUNT - 1) * gameCommon.MARK_DOT_SPACING;
        for (let i = 0; i < gameCommon.MARK_DOT_COUNT; i++) {
            let angleCurrent = Math.PI / 2 - angleTotal / 2 + i * gameCommon.MARK_DOT_SPACING;

            let angleCurrentCos = Math.cos (angleCurrent);
            let angleCurrentSin = Math.sin (angleCurrent);

            // 投影，-1 到 1
            let shadow = atkEnterCos * angleCurrentCos + atkEnterSin * angleCurrentSin;
            // 投影决定不透明度
            let opacity = (shadow - (-1)) / 2;

            let colorStandard = this.relEquip.GetDrawColor ();
            let color = UtilObjPool.PopCCColor (APP, colorStandard.r, colorStandard.g, colorStandard.b, 255 * opacity);
            drawer.RoundFill (
                this.aimPosition.x + Math.cos (angleCurrent) * radius,
                this.aimPosition.y + Math.sin (angleCurrent) * radius,
                drawer.Pixel (3),
                color
            );
            drawer.RoundFill (
                this.aimPosition.x + Math.cos (angleCurrent) * (radius + drawer.Pixel (10)),
                this.aimPosition.y + Math.sin (angleCurrent) * (radius + drawer.Pixel (10)),
                drawer.Pixel (2),
                color
            );
            UtilObjPool.Push (color);
        };
        this.currStatus.OnDraw (drawer);
    }
    OnFireEnter(): void {
        this.UpdateAim();
        this.currStatus.OnFireStart();
    }
    OnFireStep(): void {
        this.UpdateAim();
        this.currStatus.OnFiring();
    }
    OnFireExit(): void {
        this.currStatus.OnFireEnd();
    }
    OnBackPack(): void {
        this.EnterStatus (this.statusCD);
        this.currStatus.OnBackpack();
    }
    OnHand(): void {
        // 必定朝右
        this.relEquip.npc.playerMgrBodyDir.currStatus.OnRight ();
        this.UpdateAim ();
        this.currStatus.OnHand();
    }
    OnCostNeed(): number {
        return this.cfgProps.props_cost * this.args.dAtkIngTimes;
        return this.cfgProps.props_cost * this.args.dAtkIngTimes - (this.args.bKeepMS + this.args.cAtkStartMS + this.args.dAtkIngSpace * (this.args.dAtkIngTimes - 1)) * this.relEquip.npc.args.mpInc;
    }
    OnCD(): number {
        return this.currStatus.OnCd ();
    }
    OnMpRecoveryAble() {
        return this.currStatus == this.statusReady;
    }

    /**
     * 瞄准的位置
     */
    aimPosition = UtilObjPool.Pop (UtilObjPool.typeccVec2, APP);

    /**
     * 绘制的角度
     */
    atkAngle: number;

    /**
     * 发射的水平速度
     */
    vx: number;
    /**
     * 发射的垂直速度
     */
    vy: number;

    /**
     * 累计时间
     */
    tTotal: number;

    /**
     * 更新瞄准方向
     */
    UpdateAim () {
        this.aimPosition.x = Math.max (this.relEquip.firePos.x, this.relEquip.npc.relBody.commonFootPos.x + 100);
        this.aimPosition.y = Math.max (this.relEquip.firePos.y, gameCommon.GROUND_Y);

        // 产生最大时间的距离
        let lenMax = Math.sqrt (((MgrUI.FAT_HEIGHT + gameCommon.CAMERA_OFFSET_Y) / gameCommon.SCENE_SCALE) ** 2 + ((MgrUI.FAT_WIDTH + gameCommon.CAMERA_OFFSET_X) / gameCommon.SCENE_SCALE) ** 2);
        let lenCurrent = Math.sqrt ((this.aimPosition.x - this.relEquip.npc.playerEquipPos.x) ** 2 + (this.aimPosition.y - this.relEquip.npc.playerEquipPos.y) ** 2);
        // 垂直方向
        this.tTotal = this.args.msGot * lenCurrent / lenMax;
        let gravity = this.bulletGravityScale;
        this.vy = ((this.aimPosition.y - this.relEquip.npc.playerEquipPos.y) - 0.5 * gravity * this.relEquip.npc.relBody.relState.b2Gravity / jiang.mgrUI._sizePerPixel / (1000 ** 2) * this.tTotal ** 2) / this.tTotal;
        // 水平方向
        this.vx = (this.aimPosition.x - this.relEquip.npc.playerEquipPos.x) / this.tTotal;
        // 由水平速度、垂直速度，得到抛射角
        this.atkAngle = Math.atan2 (this.vy, this.vx);
    }

    /**
     * 角度偏移，后助力带来的
     */
    angleOffset: number = 0;

    /**
     * 射击偏移
     */
    angleOffsetFire: number = 0;

    /**
     * 开火
     */
    Fire () {
        // 减少能量
        this.relEquip.npc.mpCurrent -= this.cfgProps.props_cost;
        this.angleOffsetFire = this.angleOffset * utilMath.RandomLowerToUpper();
        let currentAtkAngle = this.atkAngle + this.angleOffsetFire;
        currentAtkAngle = Math.min (currentAtkAngle, Math.PI / 2);
        let vecLen = Math.sqrt (this.vx ** 2 + this.vy ** 2);
        let vecX = Math.cos (currentAtkAngle) * vecLen;
        let vecY = Math.sin (currentAtkAngle) * vecLen;

        this.angleOffset += this.args.angleOfffsetUnit;
        this.angleOffset = Math.min (this.angleOffset, this.args.angleOffsetMax);

        // 要额外推进的时间
        let t = this.cfgProps.distance_o_to_output * Math.cos (currentAtkAngle) / vecX;
        let gravityScale = this.bulletGravityScale;
        let a = gravityScale * this.relEquip.npc.relBody.relState.b2Gravity / jiang.mgrUI._sizePerPixel / 1000 ** 2;
        let dx = vecX * t;
        let dy = vecY * t + 0.5 * a * t ** 2;

        VoiceOggViewState.inst.VoiceSet(this.args.voice);
        let eleBody = GameElementBody.Pop(
            APP,

            {
                posX: this.relEquip.machine.equip.npc.playerEquipPos.x + dx,
                posY: this.relEquip.machine.equip.npc.playerEquipPos.y + dy,

                vecX: vecX + this.relEquip.npc.b2GetSpeedX() / jiang.mgrUI._sizePerPixel / 1000,
                vecY: vecY + a * t,

                cfgId: this.cfgProps.arrow,
                camp: this.relEquip.machine.equip.npc.relBody.commonArgsCamp,
                power: this.power,
                caller: this.relEquip.machine.equip.npc.relBody
            }
        );
        this.relEquip.machine.equip.npc.relBody.relState.AddEle(eleBody);
    }
}

EquipmentInstRS.Pop<GEEI_2006_args> (
    APP,
    {
        logicCode: 2006,
        cfgToArgs: (cfg: CfgEquipmentProps) => {
            return {
                // 1 - 就绪
                aReadyAnim: cfg.prop_0,

                // 2 - 蓄力
                bKeepMS: Number.parseFloat (cfg.prop_1),
                bKeepAnim: cfg.prop_2,

                // 3 - 前摇
                cAtkStartMS: Number.parseFloat (cfg.prop_3),
                cAtkStartAnim: cfg.prop_4,

                // 4 - 攻击中
                dAtkIngTimes: Number.parseFloat (cfg.prop_5),
                dAtkIngSpace: Number.parseFloat (cfg.prop_6),
                dAtkIngAnim: cfg.prop_7,

                // 5 - 后摇
                eAtkEndMS: Number.parseFloat (cfg.prop_8),
                eAtkEndAnim: cfg.prop_9,

                // 6 - 冷却
                fCDMS: Number.parseFloat (cfg.prop_10),
                fCDMSAnim: cfg.prop_11,

                // 每次发射产生的角度偏移
                angleOfffsetUnit: Number.parseFloat (cfg.prop_12),
                // 最大角度偏移
                angleOffsetMax: Number.parseFloat (cfg.prop_13),
                // 角度偏移的下降速度
                angleDec: Number.parseFloat (cfg.prop_14),

                // 发射速度
                voice: Number.parseFloat (cfg.prop_15),

                // 响应时间
                msGot: Number.parseFloat (cfg.prop_16)
            };
        },
        instCreator: (apply: string, args: GEEI_2006_args) => {
            return GEEI_2006.Pop (apply, args);
        },
        instDisplay: (state, npc, equipList) => {
            let mbPlayer = npc.commonBehaviour as MBPlayer;
            let equipmentInst = mbPlayer.playerMgrEquipment.equipInst;
            switch (equipmentInst.cfgProps.style) {
                case 1005: {
                    equipList.push(GameDisplayEquipment005.GetNodeTypeByRes(equipmentInst.cfgProps).CreateNode(
                        state,
                        npc.id,
                        -npc.id
                    ));
                    break;
                };
                case 1006: {
                    equipList.push(GameDisplayEquipment006.GetNodeTypeByRes(equipmentInst.cfgProps).CreateNode(
                        state,
                        npc.id,
                        -npc.id
                    ));
                    break;
                };
            }
        },
        getPropsSpacing: (cfg, args) => {
            return args.dAtkIngSpace;
        },
        getPropsCost: (cfg, args) => {
            return cfg.props_cost;
        },
        getPropsDmg: (cfg, args, power) => {
            return EquipmentInstRS.GetSingleDmgByPower (cfg.id, power);
        },

        aditionalBody: (cfg, t) => {
            let list: Array<number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
            list.push (cfg.arrow);
            return list;
        },
        aditionalEff: (cfg, t) => {
            let list: Array<number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
            return list;
        },
        aditionalVoice: (cfg, t) => {
            let list: Array<number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
            list.push (t.voice);
            return list;
        }
    }
)

export default GEEI_2006;