import IndexLayer from "../../../IndexLayer";
import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import ViewState from "../../../frame/ui/ViewState";
import gameCommon from "../../GameCommon";
import gameMath from "../../GameMath";
import DefineVoice from "../../game_element/body/DefineVoice";
import LotteryViewState from "../lottery_view/LotteryViewState";
import LvUpBatchViewState from "../lv_up_batch_view/LvUpBatchViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";

const APP = `EquipmentLvUpSumViewState`;

/**
 * 批量升级界面
 */
class EquipmentLvUpSumViewState extends ViewState {

    private constructor () {
        super (
            IndexLayer.GAME,
            ViewState.BG_TYPE.MASK,
            true
        );
    }

    private static _t = new UtilObjPoolType<EquipmentLvUpSumViewState>({
        instantiate: () => {
            return new EquipmentLvUpSumViewState ();
        },
        onPop: () => {

        },
        onPush: () => {

        },
        tag: APP
    });

    static Pop (apply: string, listIdCfg: Array <number>) {
        let val = UtilObjPool.Pop (EquipmentLvUpSumViewState._t, apply);

        // 克隆
        val.listIdCfg.push (...listIdCfg);
        // 排序
        val.listIdCfg.sort ((a, b) => {
            return a - b;
        });

        let countHor: number;
        let countVer: number;
        // 单行显示
        if (listIdCfg.length <= EquipmentLvUpSumViewState.LINE_MAX) {
            countHor = listIdCfg.length;
            countVer = 1;
        }
        // 双行显示
        else if (listIdCfg.length <= EquipmentLvUpSumViewState.LINE_MAX * 2) {
            countHor = Math.ceil (listIdCfg.length / 2);
            countVer = 2;
        }
        // 3 行显示
        else {
            countHor = Math.ceil (listIdCfg.length / 3);
            countVer = 3;
        };

        val.containerWidth = countHor * (EquipmentLvUpSumViewState.ITEM_WIDTH + EquipmentLvUpSumViewState.SPACING_HOR) - EquipmentLvUpSumViewState.SPACING_HOR;
        val.containerHeight = countVer * (EquipmentLvUpSumViewState.ITEM_HEIGHT + EquipmentLvUpSumViewState.SPACING_VER) - EquipmentLvUpSumViewState.SPACING_VER;

        let listEquipment = jiang.mgrData.Get (indexDataStorageItem.listEquipment);
        for (let i = 0; i < listEquipment.length; i++) {
            let rec = listEquipment [i];
            val.mapIdCfgToRecord.set (rec.idCfg, rec);
            let lv = gameMath.ParsePowerToLev (gameMath.equip.ParseCountToPower (rec.count));
            val.lvMax = Math.max (val.lvMax, lv);
        };

        val.stateLvUpBatch = LvUpBatchViewState.Pop (APP);
        return val;
    }

    /**
     * 配表 id 到具体记录的映射
     */
    mapIdCfgToRecord: Map <number, indexDataStorageItem.EquipmentRecord> = UtilObjPool.Pop (UtilObjPool.typeMap, APP);
    /**
     * 容器 - 宽
     */
    containerWidth: number;
    /**
     * 容器 - 高
     */
    containerHeight: number;

    /**
     * 要展示的内容集合
     */
    listIdCfg: Array <number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);

    /**
     * 最大等级
     */
    lvMax: number = 0;

    OnMaskTouch(): void {
        VoiceOggViewState.inst.VoiceSet (gameCommon.BTN_VOICE);
        jiang.mgrUI.Close (this._idView);
    }

    OnDisplay(): void {
        VoiceOggViewState.inst.VoiceSet (DefineVoice.NEW);
    }

    /**
     * 强化界面
     */
    stateLvUpBatch: LvUpBatchViewState;

    OnChange (module: IndexDataModule): void {
        this.stateLvUpBatch.OnChange (module);
    }
}

namespace EquipmentLvUpSumViewState {
    /**
     * 单行最大奖励数量
     */
    export const LINE_MAX = 6;

    /**
     * 水平间距
     */
    export const SPACING_HOR = 0;
    /**
     * 垂直间距
     */
    export const SPACING_VER = 0;
    /**
     * 单元宽
     */
    export const ITEM_WIDTH = 120;
    /**
     * 单元高
     */
    export const ITEM_HEIGHT = 120;
}

export default EquipmentLvUpSumViewState;