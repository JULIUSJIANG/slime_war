import EquipmentInst from "../../equipment/EquipmentInst";
import MBPlayer from "./MBPlayer";
import MgrEquipmentMachine from "./MgrEquipmentMachine";
import EquipmentInstRS from "../../equipment/EquipmentInstRS";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import jiang from "../../../../frame/global/Jiang";
import CfgEquipmentProps from "../../../../frame/config/src/CfgEquipmentProps";
import CfgGameElement from "../../../../frame/config/src/CfgGameElement";
import gameCommon from "../../../GameCommon";
import GraphicsDrawer from "../../../../frame/extend/graphics_drawer/GraphicsDrawer";
import indexDataStorageItem from "../../../../IndexStorageItem";
import CfgCacheEquipment from "../../../cfg_cache/CfgCacheEquipment";
import gameMath from "../../../GameMath";
import MgrUI from "../../../../frame/ui/MgrUI";

const APP = `MgrEquipment`;

/**
 * npc 的武器
 */
export default class MgrEquipment {
    
    private constructor () {}

    private static _t = new UtilObjPoolType<MgrEquipment>({
        instantiate: () => {
            return new MgrEquipment();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, npc: MBPlayer) {
        let val = UtilObjPool.Pop(MgrEquipment._t, apply);
        val.aimVec.x = MgrUI.FAT_HEIGHT / gameCommon.SCENE_SCALE + gameCommon.CAMERA_OFFSET_X;
        val.machine = MgrEquipmentMachine.Pop(
            APP,
            val
        );
        val.npc = npc;
        return val;
    }

    /**
     * 状态机
     */
    machine: MgrEquipmentMachine;

    /**
     * npc
     */
    npc: MBPlayer;

    /**
     * 弹药出口位置
     */
    equipmentExport = 0;
 
    /**
     * 装备动画许可
     */
    equipAnimAble: number = 0;

    /**
     * 开了火
     */
    fired: boolean = false;

    /**
     * 当前开火目标位置
     */
    firePos: cc.Vec2 = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
    /**
     * 当前开火目标方向
     */
    aimVec: cc.Vec2 = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);

    OnStep (ms: number) {
        this.machine.equip.equipInst.OnStep(ms);
        this.machine.currStatus.OnStep(ms);
    }

    /**
     * 当前使用的装备的索引
     */
    currEquipIdx: number;
    /**
     * 当前装备的列表
     */
    listEquipmentInst: Array<EquipmentInst> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);

    /**
     * 当前控制的装备实例
     */
    get equipInst () {
        return this.listEquipmentInst[this.currEquipIdx];
    }

    /**
     * 添加装备
     * @param equipmentId 
     */
    AddEquipment (equipmentId: number) {
        let rec = jiang.mgrData.Get (indexDataStorageItem.listEquipment).find ((val) => {
            return val.idCfg == equipmentId;
        });
        let cfg = jiang.mgrCfg.cfgEquipmentProps.select (CfgEquipmentProps.idGetter, equipmentId)._list [0];
        let equipRS = EquipmentInstRS.instMap.get(cfg.logic);
        let equipInst = equipRS.instCreator (APP, CfgCacheEquipment.GetCache (cfg).args);
        equipInst.relEquip = this;
        equipInst.cfgProps = cfg;
        equipInst.rs = equipRS;
        // 相当于去除未达标的所有强度
        equipInst.power = gameMath.GetAppPower (gameMath.equip.ParseCountToPower (rec.count));
        equipInst.lev = gameMath.ParsePowerToLev (gameMath.equip.ParseCountToPower (rec.count));
        if (0 < jiang.mgrCfg.cfgGameElement.select (CfgGameElement.idGetter, cfg.arrow)._list.length) {
            equipInst.bulletGravityScale = jiang.mgrCfg.cfgGameElement.select (CfgGameElement.idGetter, cfg.arrow)._list [0].gravity_scale;
        };

        equipInst.OnInit ();
        this.listEquipmentInst.push (equipInst);
    }

    /**
     * 设置采用的装备索引
     * @param idx 
     */
    SetEquipmentIdx (idx: number) {
        // 重复设置没意义
        if (idx == this.currEquipIdx) {
            return;
        };
        // 索引越界，没意义
        if (this.listEquipmentInst.length <= idx) {
            return;
        };
        // 转身掏武器
        this.npc.playerMgrBodyDir.currStatus.OnLeft();
        let equipRec = this.listEquipmentInst [this.currEquipIdx];
        this.currEquipIdx = idx;
        let equipCurr = this.listEquipmentInst [this.currEquipIdx];
        // 通知当前装备，它被放回背包里面去了
        if (equipRec) {
            equipRec.OnBackPack();
        };
        // 通知当前装备，它被拿到手上去了
        equipCurr.OnHand();
    }

    /**
     * 绘制抛物线
     * @param equipInst 
     * @param drawer 
     * @param aimAngle 
     * @param vecLen 
     * @param tTotal 
     */
    DrawForCommon (equipInst: EquipmentInst, drawer: GraphicsDrawer, aimAngle: number, vecLen: number, tTotal: number) {
        this.Draw (
            equipInst,
            drawer,
            aimAngle,
            vecLen,
            tTotal,
            this.npc.playerEquipPos.x,
            this.npc.playerEquipPos.y
        );
    }

    /**
     * 绘制抛物线
     * @param equipInst 
     * @param drawer 
     * @param aimAngle 
     * @param vecLen 
     * @param tTotal 
     */
    Draw (equipInst: EquipmentInst, drawer: GraphicsDrawer, aimAngle: number, vecLen: number, tTotal: number, xStart: number, yStart: number) {
        tTotal /= 1000;
        let vecX = Math.cos(aimAngle) * vecLen * 1000 * jiang.mgrUI._sizePerPixel;
        let vecY = Math.sin(aimAngle) * vecLen * 1000 * jiang.mgrUI._sizePerPixel;

        // 绘画点的数量不超过 20
        let timeDistance = Math.max (gameCommon.TRACE_TIPS_SECOND_UNIT, tTotal / 20);

        let posX = xStart;
        let posY = yStart;
        posX *= jiang.mgrUI._sizePerPixel;
        posY *= jiang.mgrUI._sizePerPixel;
        let t = 0;
        t += timeDistance * 2.0;
        while (t < tTotal) {
            let alpha = 1 - t / tTotal;
            alpha = Math.sqrt (alpha);
            if (alpha < 0.1) {
                break;
            };
            let x = posX + vecX * t;
            x /= jiang.mgrUI._sizePerPixel;
            let y = posY + vecY * t + (1 / 2) * this.npc.relBody.relState.b2Gravity * equipInst.bulletGravityScale * (t ** 2);
            if (Math.abs (gameCommon.GROUND_Y - y) < drawer.Pixel (2)) {
                break;
            };
            y /= jiang.mgrUI._sizePerPixel;
            let colorTemp = this.GetDrawColor ();
            let color = UtilObjPool.PopCCColor (APP, colorTemp.r, colorTemp.g, colorTemp.b, 255 * alpha);
            drawer.RoundFill(x, y, drawer.Pixel(2), colorTemp);
            UtilObjPool.Push (color);
            t += timeDistance;
        };
    }

    /**
     * 获取绘制的颜色
     * @returns 
     */
    GetDrawColor () {
        return this.npc.relBody.relState.cfgSceneCache.colorDark;
    }
}