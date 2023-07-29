import Layout from "../../../frame/basic/layout/Layout";
import LayoutAlignmentHorCenter from "../../../frame/basic/layout/LayoutAlignmentHorCenter";
import LayoutAlignmentVerMiddle from "../../../frame/basic/layout/LayoutAlignmentVerMiddle";
import LayoutConstraintColumn from "../../../frame/basic/layout/LayoutConstraintColumn";
import LayoutStartAxisHor from "../../../frame/basic/layout/LayoutStartAxisHor";
import LayoutStartCornerHorLeft from "../../../frame/basic/layout/LayoutStartCornerHorLeft";
import LayoutStartCornerVerUpper from "../../../frame/basic/layout/LayoutStartCornerVerUpper";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import GameCfgBodyCacheDropRS from "../../game_element/body/GameCfgBodyCacheDropRS";
import EquipmentViewSelectStatus from "./EquipmentViewSelectStatus";
import EquipmentViewSelectStatusBackpackProp from "./EquipmentViewSelectStatusBackpackProp";
import EquipmentViewSelectStatusEquipment from "./EquipmentViewSelectStatusEquipment";
import EquipmentViewStateItem from "./EquipmentViewStateItem";

const APP = `EquipmentViewState`;

class EquipmentViewState {

    private constructor () {

    }

    private static _t = new UtilObjPoolType<EquipmentViewState>({
        instantiate: () => {
            return new EquipmentViewState();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    /**
     * 排版
     */
    layout: Layout;

    /**
     * 滚动的 y 位置
     */
    scrollY: number = 0;

    /**
     * 滚动许可
     */
    scrollEnable: boolean;

    static Pop (apply: string) {
        let val = UtilObjPool.Pop(EquipmentViewState._t, apply);

        val.layout = Layout.Pop (
            APP,

            {
                paddingTop: EquipmentViewState.PADDING,
                paddingRight: EquipmentViewState.PADDING,
                paddingBottom: EquipmentViewState.PADDING,
                paddingLeft: EquipmentViewState.PADDING,

                spacingColumn: EquipmentViewState.SPACING,
                spacingRow: EquipmentViewState.SPACING,

                defSizeWidth: EquipmentViewState.ITEM_WIDTH,
                defSizeHeight: EquipmentViewState.ITEM_HEIGHT,

                startCornerHor: LayoutStartCornerHorLeft.inst,
                startCornerVer: LayoutStartCornerVerUpper.inst,

                startAxis: LayoutStartAxisHor.inst,
                constraint: LayoutConstraintColumn.five,

                alignmentHor: LayoutAlignmentHorCenter.inst,
                alignmentVer: LayoutAlignmentVerMiddle.inst
            }
        );

        // 已装备的列表
        let listCurrEquiped = jiang.mgrData.Get (indexDataStorageItem.listCurrentEquiped);
        // 确保每个槽位的索引已拓展
        while (listCurrEquiped.length < val.equipAbleCount) {
            listCurrEquiped.push (0);
            indexDataStorageItem.listCurrentEquiped.media.onSet ();
        };

        val.OnChange (IndexDataModule.INDEXVIEW_EQUIP);

        val.statusBackpackProp = EquipmentViewSelectStatusBackpackProp.Pop (APP, val);
        val.statusEquipment = EquipmentViewSelectStatusEquipment.Pop (APP, val);
        val.EnterStatus (val.statusEquipment);
        // 默认选装备第一位
        val.currStatus.OnEquipment (val.listDisplayEquip [0].idCfg);

        return val;
    }

    /**
     * 刷新激活性
     */
    UpdateActive () {
        this.layout.UpdateActive (
            0,
            this.scrollY,
            EquipmentViewState.VIEW_WIDTH,
            EquipmentViewState.VIEW_HEIGHT
        );
        jiang.mgrUI.ModuleRefresh (IndexDataModule.RELOAD);
    }

    /**
     * 状态 - 背包物品
     */
    statusBackpackProp: EquipmentViewSelectStatusBackpackProp;
    /**
     * 状态 - 装备
     */
    statusEquipment: EquipmentViewSelectStatusEquipment;
    /**
     * 当前状态
     */
    currStatus: EquipmentViewSelectStatus;
    /**
     * 当前状态
     * @param status 
     */
    EnterStatus (status: EquipmentViewSelectStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.currStatus.OnEnter ();
    }

    /**
     * 子节点许可
     */
    childrenAble = false;
    /**
     * 可装备数量
     */
    equipAbleCount = 2;
    /**
     * 已装备的集合
     */
    mapEquipedIdToNum: Map<number, number> = UtilObjPool.Pop (UtilObjPool.typeMap, APP);

    /**
     * 要展示的物品列表
     */
    listDisplayBackpackProp: Array<indexDataStorageItem.BackpackPropRecord> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
    /**
     * id 到物品记录的映射
     */
    mapIdToBackpackPropRec: Map <number, indexDataStorageItem.BackpackPropRecord> = UtilObjPool.Pop (UtilObjPool.typeMap, APP);

    /**
     * 要展示的装备列表
     */
    listDisplayEquip: Array<indexDataStorageItem.EquipmentRecord> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
    /**
     * id 到装备记录的映射
     */
    mapIdToEquipRec: Map <number, indexDataStorageItem.EquipmentRecord> = UtilObjPool.Pop (UtilObjPool.typeMap, APP);

    /**
     * 要展示的所有内容
     */
    listShouldDisplayAll: Array <EquipmentViewStateItem> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
    /**
     * id 到具体记录的映射
     */
    mapIdToRec: Map <number, EquipmentViewStateItem> = UtilObjPool.Pop (UtilObjPool.typeMap, APP);
    /**
     * 记录配表 id 到排序优先级的映射
     */
    mapIdCfgToPrevious: Map <number, Map<number, number>> = UtilObjPool.Pop (UtilObjPool.typeMap, APP);

    OnChange(module: IndexDataModule): void {
        if (module != IndexDataModule.DEFAULT && module != IndexDataModule.INDEXVIEW_EQUIP) {
            return;
        };
        this.listDisplayBackpackProp.length = 0;
        this.listDisplayBackpackProp.push (...jiang.mgrData.Get (indexDataStorageItem.listBackpackProp));
        this.mapIdToBackpackPropRec.clear ();
        for (let i = 0; i < this.listDisplayBackpackProp.length; i++) {
            let rec = this.listDisplayBackpackProp [i];
            this.mapIdToBackpackPropRec.set (rec.idCfg, rec);
        };

        this.listDisplayEquip.length = 0;
        this.listDisplayEquip.push (...jiang.mgrData.Get (indexDataStorageItem.listEquipment));
        this.mapIdToEquipRec.clear ();
        for (let i = 0; i < this.listDisplayEquip.length; i++) {
            let rec = this.listDisplayEquip [i];
            this.mapIdToEquipRec.set (rec.idCfg, rec);
        };

        this.mapEquipedIdToNum.clear ();
        let listEquip = jiang.mgrData.Get (indexDataStorageItem.listCurrentEquiped);
        for (let i = 0; i < listEquip.length; i++) {
            let idEquip = listEquip [i];
            if (idEquip == 0) {
                continue;
            };
            this.mapEquipedIdToNum.set (idEquip, i);
        };

        // 总生成内容集合
        for (let i = 0; i < this.listShouldDisplayAll.length; i++) {
            let shouldDisplay = this.listShouldDisplayAll [i];
            UtilObjPool.Push (shouldDisplay);
        };
        this.listShouldDisplayAll.length = 0;
        if (!this.mapIdCfgToPrevious.has (GameCfgBodyCacheDropRS.xlsxBackpackProp.code)) {
            this.mapIdCfgToPrevious.set (GameCfgBodyCacheDropRS.xlsxBackpackProp.code, UtilObjPool.Pop (UtilObjPool.typeMap, APP));
        };
        // 背包物品
        for (let i = 0; i < this.listDisplayBackpackProp.length; i++) {
            let item = EquipmentViewStateItem.Pop (APP, GameCfgBodyCacheDropRS.xlsxBackpackProp, this.listDisplayBackpackProp[i].idCfg);
            this.listShouldDisplayAll.push (item);
            this.mapIdCfgToPrevious.get (GameCfgBodyCacheDropRS.xlsxBackpackProp.code).set (item.idCfg, this.listDisplayBackpackProp[i].count);
        };
        if (!this.mapIdCfgToPrevious.has (GameCfgBodyCacheDropRS.xlsxEquipment.code)) {
            this.mapIdCfgToPrevious.set (GameCfgBodyCacheDropRS.xlsxEquipment.code, UtilObjPool.Pop (UtilObjPool.typeMap, APP));
        };
        // 装备
        for (let i = 0; i < this.listDisplayEquip.length; i++) {
            let item = EquipmentViewStateItem.Pop (APP, GameCfgBodyCacheDropRS.xlsxEquipment, this.listDisplayEquip[i].idCfg);
            this.listShouldDisplayAll.push (item);
            this.mapIdCfgToPrevious.get (GameCfgBodyCacheDropRS.xlsxEquipment.code).set (item.idCfg, this.listDisplayEquip[i].count);
        };
        // 记录下 id 到实例的映射
        this.mapIdToRec.clear ();
        for (let i = 0; i < this.listShouldDisplayAll.length; i++) {
            let ele = this.listShouldDisplayAll [i];
            this.mapIdToRec.set (ele.idCfg, ele);
        };
        // 排序
        this.listShouldDisplayAll.sort ((a, b) => {
            if (a.rs != b.rs) {
                return a.rs.code - b.rs.code;
            };
            let countA = this.mapIdCfgToPrevious.get (a.rs.code).get (a.idCfg);
            let countB = this.mapIdCfgToPrevious.get (b.rs.code).get (b.idCfg);
            return countB - countA;
        });
        // 生成虚拟的排版
        this.layout.Clear ();
        for (let i = 0; i < this.listShouldDisplayAll.length; i++) {
            let ele = this.listShouldDisplayAll [i];
            this.layout.Create (
                EquipmentViewState.ITEM_WIDTH,
                EquipmentViewState.ITEM_HEIGHT,

                ele.idCfg
            );
        };
        this.layout.UpdatePos ();
        this.UpdateActive ();
    }
}

namespace EquipmentViewState {
    /**
     * 内边距
     */
    export const PADDING = 5;

    /**
     * 视图 - 宽
     */
    export const VIEW_WIDTH = 530;
    /**
     * 视图 - 高
     */
    export const VIEW_HEIGHT = 550;
    /**
     * 间距
     */
    export const SPACING = 10;
    /**
     * 物品 - 宽
     */
    export const ITEM_WIDTH = 100;
    /**
     * 物品 - 高
     */
    export const ITEM_HEIGHT = 100;
}

export default EquipmentViewState;