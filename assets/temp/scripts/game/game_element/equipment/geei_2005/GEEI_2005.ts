import utilMath from "../../../../frame/basic/UtilMath";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import CfgEquipmentProps from "../../../../frame/config/src/CfgEquipmentProps";
import GraphicsDrawer from "../../../../frame/extend/graphics_drawer/GraphicsDrawer";
import jiang from "../../../../frame/global/Jiang";
import MgrUI from "../../../../frame/ui/MgrUI";
import gameCommon from "../../../GameCommon";
import GameDisplayEquipment002 from "../../../display/GameDisplayEquipment002";
import EquipmentView from "../../../view/equipment_view/EquipmentView";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import GameElementBody from "../../body/GameElementBody";
import MBPlayer from "../../body/logic_3031/MBPlayer";
import EquipmentInst from "../EquipmentInst";
import EquipmentInstRS from "../EquipmentInstRS";
import { GEEI_2005_args } from "./GEEI_2005_args";
import GEEI_2005_status from "./GEEI_2005_status";
import GEEI_2005_status_a_start from "./GEEI_2005_status_atk_a_start";
import GEEI_2005_status_b_ing from "./GEEI_2005_status_atk_b_ing";
import GEEI_2005_status_c_end from "./GEEI_2005_status_atk_c_end";
import GEEI_2005_status_cd from "./GEEI_2005_status_cd";
import GEEI_2005_status_keep from "./GEEI_2005_status_keep";
import GEEI_2005_status_ready from "./GEEI_2005_status_ready";

const APP = `GEEI_2005`;

/**
 * 类似 cf 枪支的武器模板 + 近战定制
 */
class GEEI_2005 extends EquipmentInst {

    private static _t = new UtilObjPoolType<GEEI_2005>({
        instantiate: () => {
            return new GEEI_2005();
        },
        onPop: (t) => {

        },
        onPush: (t)  => {

        },
        tag: APP
    });

    static Pop (
        apply: string,
        args: GEEI_2005_args
    )
    {
        let val = UtilObjPool.Pop (GEEI_2005._t, apply);
        val.args = args;
        return val;
    }

    OnInit(): void {
        this.statusAtkAStart = GEEI_2005_status_a_start.Pop (APP, this);
        this.statusAtkBIng = GEEI_2005_status_b_ing.Pop (APP, this);
        this.statusAtkCEnd = GEEI_2005_status_c_end.Pop (APP, this);
        this.statusCD = GEEI_2005_status_cd.Pop (APP, this);
        this.statusKeep = GEEI_2005_status_keep.Pop (APP, this);
        this.statusReady = GEEI_2005_status_ready.Pop (APP, this);

        this.EnterStatus (this.statusCD);
    }

    /**
     * 缓存了的参数
     */
    args: GEEI_2005_args;
    /**
     * 状态 - 攻击 - 前摇
     */
    statusAtkAStart: GEEI_2005_status_a_start;
    /**
     * 状态 - 攻击 - 进行时
     */
    statusAtkBIng: GEEI_2005_status_b_ing;
    /**
     * 状态 - 攻击 - 后摇
     */
    statusAtkCEnd: GEEI_2005_status_c_end;
    /**
     * 状态 - 攻击 - 冷却
     */
    statusCD: GEEI_2005_status_cd;
    /**
     * 状态 - 攻击 - 蓄力
     */
    statusKeep: GEEI_2005_status_keep;
    /***
     * 状态 - 攻击 - 就绪
     */
    statusReady: GEEI_2005_status_ready;

    /**
     * 当前状态
     */
    currStatus: GEEI_2005_status;

    EnterStatus (status: GEEI_2005_status) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec != null) {
            this.currStatus.OnExit ();
        };
        this.currStatus.OnEnter ();
    }

    OnStep (ms: number): void {
        let msChange = this.args.angleOffsetMax / this.args.angleDec * ms;
        this.angleOffset -= msChange;
        this.angleOffset = Math.max (this.angleOffset, 0);
        this.currStatus.OnStep (ms);
    }
    OnDraw(drawer: GraphicsDrawer): void {
        let radius = gameCommon.MARK_TIPS_BASE_RADIUS + Math.abs( this.angleOffset ) * gameCommon.MARK_RADIUS_PER_ANGLE;
        let angleTotal = (gameCommon.MARK_DOT_COUNT - 1) * gameCommon.MARK_DOT_SPACING;
        for (let i = 0; i < gameCommon.MARK_DOT_COUNT; i++) {
            let angleCurrent = Math.PI / 2 - angleTotal / 2 + i * gameCommon.MARK_DOT_SPACING;
            let colorStandard = this.relEquip.GetDrawColor ();
            let color = UtilObjPool.PopCCColor (APP, colorStandard.r, colorStandard.g, colorStandard.b, 255);
            drawer.RoundFill (
                this.relEquip.firePos.x + Math.cos (angleCurrent) * radius,
                this.relEquip.firePos.y + Math.sin (angleCurrent) * radius,
                drawer.Pixel (3),
                color
            );
            drawer.RoundFill (
                this.relEquip.firePos.x + Math.cos (angleCurrent) * (radius + drawer.Pixel (10)),
                this.relEquip.firePos.y + Math.sin (angleCurrent) * (radius + drawer.Pixel (10)),
                drawer.Pixel (2),
                color
            );
            UtilObjPool.Push (color);
        };
        this.currStatus.OnDraw (drawer);
    }
    OnFireEnter(): void {
        this.currStatus.OnFireStart();
    }
    OnFireStep(): void {
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
        this.currStatus.OnHand();
    }
    OnCostNeed(): number {
        return this.cfgProps.props_cost * this.args.dAtkIngTimes;
        return this.cfgProps.props_cost * this.args.dAtkIngTimes - (this.args.bKeepMS + this.args.cAtkStartMS + this.args.dAtkIngSpace * (this.args.dAtkIngTimes - 1)) * this.relEquip.npc.args.mpInc;
    }
    OnCD(): number {
        return this.currStatus.OnCd ();
    }
    OnMpRecoveryAble(): boolean {
        return this.currStatus == this.statusReady;
    }

    /**
     * 绘制的角度
     */
    atkAngle: number;

    /**
     * 更新瞄准方向
     */
    UpdateAim () {
        // 由水平速度、垂直速度，得到抛射角
        this.atkAngle = Math.atan2 (this.relEquip.firePos.y - this.relEquip.npc.playerEquipPos.y, this.relEquip.firePos.x - this.relEquip.npc.playerEquipPos.x);
        this.atkAngle = Math.min (this.atkAngle, Math.PI / 6);
        this.atkAngle = Math.max (this.atkAngle, 0);
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
        let currentAtkAngleCos = Math.cos (currentAtkAngle);
        let currentAtkAngleSin = Math.sin (currentAtkAngle);

        this.angleOffset += this.args.angleOfffsetUnit;
        this.angleOffset = Math.min (this.angleOffset, this.args.angleOffsetMax);

        VoiceOggViewState.inst.VoiceSet(this.args.voice);
        let eleBody = GameElementBody.Pop(
            APP,

            {
                posX: this.relEquip.machine.equip.npc.playerEquipPos.x + this.cfgProps.distance_o_to_output * currentAtkAngleCos,
                posY: this.relEquip.machine.equip.npc.playerEquipPos.y + this.cfgProps.distance_o_to_output * currentAtkAngleSin,

                vecX: currentAtkAngleCos / 1000 / 10000,
                vecY: currentAtkAngleSin / 1000 / 10000,

                cfgId: this.cfgProps.arrow,
                camp: this.relEquip.machine.equip.npc.relBody.commonArgsCamp,
                power: this.power,
                caller: this.relEquip.machine.equip.npc.relBody
            }
        );
        this.relEquip.machine.equip.npc.relBody.relState.AddEle(eleBody);
    }
}

EquipmentInstRS.Pop<GEEI_2005_args> (
    APP,
    {
        logicCode: 2005,
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
            };
        },
        instCreator: (apply: string, args: GEEI_2005_args) => {
            return GEEI_2005.Pop (apply, args);
        },
        instDisplay: (state, npc, equipList) => {
            let mbPlayer = npc.commonBehaviour as MBPlayer;
            let equipmentInst = mbPlayer.playerMgrEquipment.equipInst;
            equipList.push(GameDisplayEquipment002.GetNodeTypeByRes(equipmentInst.cfgProps).CreateNode(
                state,
                npc.id,
                -npc.id
            ));
        },
        getPropsSpacing: (cfg, args) => {
            return args.bKeepMS + args.cAtkStartMS + (args.dAtkIngTimes - 1) * args.dAtkIngSpace + args.eAtkEndMS + args.fCDMS;
        },
        getPropsCost: (cfg, args) => {
            return cfg.props_cost * args.dAtkIngTimes;
        },
        getPropsDmg: (cfg, args, power) => {
            return EquipmentInstRS.GetSingleDmgByPower (cfg.id, power) * args.dAtkIngTimes;
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

export default GEEI_2005;