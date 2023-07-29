import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import Layout from "../../../frame/basic/layout/Layout";
import LayoutAlignmentHorCenter from "../../../frame/basic/layout/LayoutAlignmentHorCenter";
import LayoutAlignmentVerMiddle from "../../../frame/basic/layout/LayoutAlignmentVerMiddle";
import LayoutConstraintColumn from "../../../frame/basic/layout/LayoutConstraintColumn";
import LayoutStartAxisHor from "../../../frame/basic/layout/LayoutStartAxisHor";
import LayoutStartCornerHorLeft from "../../../frame/basic/layout/LayoutStartCornerHorLeft";
import LayoutStartCornerVerUpper from "../../../frame/basic/layout/LayoutStartCornerVerUpper";
import jiang from "../../../frame/global/Jiang";
import gameCommon from "../../GameCommon";
import gameMath from "../../GameMath";
import CfgCacheChapter from "../../cfg_cache/CfgCacheChapter";
import CfgCacheStore from "../../cfg_cache/CfgCacheStore";

const APP = `StoreViewState`;

/**
 * 商店界面 - 状态
 */
class StoreViewState {
    /**
     * 当前挑战的章节
     */
    challengeChapter: number;

    /**
     * 排版
     */
    layout: Layout;

    /**
     * 滚动许可
     */
    scrollEnable = false;

    /**
     * 子节点许可
     */
    childrenAble = false;

    /**
     * 滚动视图的 y 坐标
     */
    scrollY: number;

    /**
     * 金币记录
     */
    recCoin: indexDataStorageItem.BackpackPropRecord;

    private constructor () {
        let listBackpackProp = jiang.mgrData.Get (indexDataStorageItem.listBackpackProp);
        for (let i = 0; i < listBackpackProp.length; i++) {
            let rec = listBackpackProp [i];
            if (rec.idCfg != gameCommon.COIN_FOR_STORE) {
                continue;
            };
            this.recCoin = rec;
        };

        this.challengeChapter = CfgCacheChapter.GetChallengeChapter ();
        this.layout = Layout.Pop (
            APP,

            {
                paddingTop: 0,
                paddingRight: 0,
                paddingBottom: 0,
                paddingLeft: 0,

                spacingColumn: StoreViewState.SPACING_HOR,
                spacingRow: StoreViewState.SPACING_VER,

                defSizeWidth: StoreViewState.ITEM_WIDTH,
                defSizeHeight: StoreViewState.ITEM_HEIGHT,

                startCornerHor: LayoutStartCornerHorLeft.inst,
                startCornerVer: LayoutStartCornerVerUpper.inst,

                startAxis: LayoutStartAxisHor.inst,
                constraint: LayoutConstraintColumn.four,

                alignmentHor: LayoutAlignmentHorCenter.inst,
                alignmentVer: LayoutAlignmentVerMiddle.inst
            }
        );
        for (let i = 0; i < jiang.mgrCfg.cfgStore._list.length; i++) {
            let cfg = jiang.mgrCfg.cfgStore._list [i];
            // 未解锁的话，要忽略掉
            if (!CfgCacheStore.CheckIsUnlocked (this, cfg)) {
                continue;
            };
            this.layout.Create (
                StoreViewState.ITEM_WIDTH,
                StoreViewState.ITEM_HEIGHT,

                jiang.mgrCfg.cfgStore._list[i].id
            );
        };
        this.layout.UpdatePos ();
        this.OnChange (IndexDataModule.INDEXVIEW_STORE);
    }

    /**
     * 要展示的装备列表
     */
    listDisplayEquip: Array<indexDataStorageItem.EquipmentRecord> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
    /**
     * id 到装备记录的映射
     */
    mapIdToEquipRec: Map <number, indexDataStorageItem.EquipmentRecord> = UtilObjPool.Pop (UtilObjPool.typeMap, APP);
    /**
     * 最大等级
     */
    levMax: number;

    OnChange (module: IndexDataModule) {
        if (module != IndexDataModule.DEFAULT && module != IndexDataModule.INDEXVIEW_STORE) {
            return;
        };
        this.listDisplayEquip.length = 0;
        this.listDisplayEquip.push (...jiang.mgrData.Get (indexDataStorageItem.listEquipment));
        this.mapIdToEquipRec.clear ();
        for (let i = 0; i < this.listDisplayEquip.length; i++) {
            let rec = this.listDisplayEquip [i];
            this.mapIdToEquipRec.set (rec.idCfg, rec);
        };

        this.levMax = 0;
        let listEquipment = jiang.mgrData.Get (indexDataStorageItem.listEquipment);
        for (let i = 0; i < listEquipment.length; i++) {
            let rec = listEquipment [i];
            let currentPower = gameMath.equip.ParseCountToPower (rec.count);
            let currentLev = gameMath.ParsePowerToLev (currentPower);
            this.levMax = Math.max (this.levMax, currentLev);
        };
    }

    /**
     * 刷新激活性
     */
    UpdateActive () {
        this.layout.UpdateActive (
            0,
            this.scrollY,
            StoreViewState.VIEW_WIDTH,
            StoreViewState.VIEW_HEIGHT
        );
        jiang.mgrUI.ModuleRefresh (IndexDataModule.RELOAD);
    }

    private static _t = new UtilObjPoolType<StoreViewState>({
        instantiate: () => {
            return new StoreViewState();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        return UtilObjPool.Pop (StoreViewState._t, apply);
    }
}

namespace StoreViewState {
    /**
     * 视图 - 宽
     */
    export const VIEW_WIDTH = 530;
    /**
     * 视图 - 高
     */
    export const VIEW_HEIGHT = 520;
    /**
     * 物品 - 宽
     */
    export const ITEM_WIDTH = 120;
    /**
     * 物品 - 高
     */
    export const ITEM_HEIGHT = 166;
    /**
     * 间距 - 水平
     */
    export const SPACING_HOR = 10;
    /**
     * 间距 - 垂直
     */
    export const SPACING_VER = Math.floor ((520 - ITEM_HEIGHT * 3) / 2);
}

export default StoreViewState;