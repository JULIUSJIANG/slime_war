import IndexLayer from "../../../IndexLayer";
import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import CfgBackpackProp from "../../../frame/config/src/CfgBackpackProp";
import jiang from "../../../frame/global/Jiang";
import ViewState from "../../../frame/ui/ViewState";
import gameCommon from "../../GameCommon";
import gameMath from "../../GameMath";
import CfgCacheChapter from "../../cfg_cache/CfgCacheChapter";
import VideoCertainView from "../video_certain_view/VideoCertainView";
import VideoCertainViewState from "../video_certain_view/VideoCertainViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import LvUpBatchMachineTouch from "./LvUpBatchMachineTouch";
import LvUpBatchView from "./LvUpBatchView";
import LvUpBatchViewStateItemRecord from "./LvUpBatchViewStateItemRecord";

const APP = `LvUpBatchViewState`;

/**
 * 批量升级界面
 */
class LvUpBatchViewState extends ViewState {

    private constructor () {
        super (
            IndexLayer.GAME,
            ViewState.BG_TYPE.MASK,
            true
        );
    }

    private static _t = new UtilObjPoolType<LvUpBatchViewState> ({
        instantiate: () => {
            return new LvUpBatchViewState ();
        },
        onPop: () => {

        },
        onPush: () => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        let val = UtilObjPool.Pop (LvUpBatchViewState._t, apply);

        // 交互状态机
        val.touchMachine = LvUpBatchMachineTouch.Pop (APP, val);

        let listEquipment = jiang.mgrData.Get (indexDataStorageItem.listEquipment);
        if (listEquipment.length <= LvUpBatchViewState.HOR_COUNt / 2) {
            val.countHor = listEquipment.length;
            val.countVer = 1;
        }
        else if (listEquipment.length <= LvUpBatchViewState.HOR_COUNt) {
            val.countHor = Math.ceil (listEquipment.length / 2);
            val.countVer = 2;
        }
        else if (listEquipment.length <= LvUpBatchViewState.HOR_COUNt * 2) {
            val.countHor = Math.ceil (listEquipment.length / 3);
            val.countVer = 3;
        }
        else if (listEquipment.length <= LvUpBatchViewState.HOR_COUNt * 4) {
            val.countHor = Math.ceil (listEquipment.length / 4);
            val.countVer = 4;
        };

        val.containerWidth = val.countHor * (LvUpBatchViewState.ITEM_WIDTH + LvUpBatchViewState.SPACING_HOR) - LvUpBatchViewState.SPACING_HOR;
        val.containerHeight = val.countVer * (LvUpBatchViewState.ITEM_HEIGHT + LvUpBatchViewState.SPACING_VER) - LvUpBatchViewState.SPACING_VER;

        // 缓存武器数据，便于查找
        for (let i = 0; i < listEquipment.length; i++) {
            let listEquipmentI = listEquipment [i];
            // 里面自己爱缓存啥就缓存啥
            let record = LvUpBatchViewStateItemRecord.Pop (APP, val, listEquipmentI);
            val.listRecord.push (record);
        };
        // 键值对形式
        for (let i = 0; i < val.listRecord.length; i++) {
            let listRecordI = val.listRecord [i];
            val.mapIdCfgToRecord.set (listRecordI.data.idCfg, listRecordI);
        };
        // 重排序
        val.listRecord.sort ((a, b) => {
            return -(a.data.count - b.data.count);
        });
        // 更正序号
        for (let i = 0; i < val.listRecord.length; i++) {
            let listRecordI = val.listRecord [i];
            listRecordI.idx = i;
        };
        // 更正数量
        for (let i = 0; i < val.listRecord.length; i++) {
            let listRecordI = val.listRecord [i];
            // 更正数量
            listRecordI.UpdateTempCount ();
            // 更正索引
            listRecordI.UpdateTempIdx ();
        };
        // 查找资源对象
        let listBackpackProp = jiang.mgrData.Get (indexDataStorageItem.listBackpackProp);
        for (let i = 0; i < listBackpackProp.length; i++) {
            let rec = listBackpackProp [i];
            if (rec.idCfg != gameCommon.COIN_FOR_LOTTERY) {
                continue;
            };
            val.recCoin = rec;
        };
        // 当前正在挑战的章节
        val.challengeChapter = CfgCacheChapter.GetChallengeChapter ();
        val.OnChange (IndexDataModule.INDEXVIEW_LOTTO);
        return val;
    }

    /**
     * 交互状态机
     */
    touchMachine: LvUpBatchMachineTouch;

    /**
     * 水平线上单元个数
     */
    countHor: number;
    /**
     * 垂直线上单元个数
     */
    countVer: number;

    /**
     * 容器宽度
     */
    containerWidth: number;
    /**
     * 容器高度
     */
    containerHeight: number;

    /**
     * 配表 id 到具体映射的记录
     */
    mapIdCfgToRecord: Map <number, LvUpBatchViewStateItemRecord> = UtilObjPool.Pop (UtilObjPool.typeMap, APP);
    /**
     * 集合形式
     */
    listRecord: Array <LvUpBatchViewStateItemRecord> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);

    OnMaskTouch(): void {
        VoiceOggViewState.inst.VoiceSet (gameCommon.BTN_VOICE);
        jiang.mgrUI.Close (this._idView);
    }

    /**
     * 帧刷新的监听 id
     */
    private _listenIdUpdate: number;

    OnInit(): void {
        this._listenIdUpdate = jiang.mgrEvter.evterUpdate.On ((ms) => {
            this.touchMachine.currStatus.OnStep (ms);
        });
        this.touchMachine.Enter (this.touchMachine.status1FadeIn);
    }

    /**
     * 当前挑战的章节
     */
    challengeChapter: number;

    /**
     * 数量需要
     */
    countNeed: number = 0;

    /**
     * 金币记录
     */
    recCoin: indexDataStorageItem.BackpackPropRecord;

    /**
     * 获得的武器数量
     */
    countGot: number;
    /**
     * 获得的强度
     */
    countPower: number;
    /**
     * 本次获得的消耗量
     */
    countCost: number;

    OnChange (module: IndexDataModule): void {
        if (module != IndexDataModule.DEFAULT && module != IndexDataModule.INDEXVIEW_LOTTO) {
            return;
        };
        let listEquipment = jiang.mgrData.Get (indexDataStorageItem.listEquipment);
        for (let i = 0; i < listEquipment.length; i++) {
            let rec = listEquipment [i];
            let currentPower = gameMath.equip.ParseCountToPower (rec.count);
            let currentLev = gameMath.ParsePowerToLev (currentPower);
            let nextLev = currentLev + 1;
            let nextLevPower = gameMath.ParseLevToPower (nextLev);
            let nextLevPowerCount = gameMath.equip.ParsePowerToCount (nextLevPower);
            this.countNeed = Math.max (this.countNeed, nextLevPowerCount - rec.count);
        };
        this.countNeed = Math.ceil (this.countNeed);

        this.countGot = this.countNeed;
        this.countPower = gameMath.equip.ParseCountToPower (this.countGot);
        this.countCost = Math.ceil (gameMath.coin.ParsePowerToCount (this.countPower)); 
    }

    OnDestory(): void {
        jiang.mgrEvter.evterUpdate.Off (this._listenIdUpdate);
    }

    /**
     * 获取行为许可
     * @returns 
     */
    GetActionAble () {
        return Promise.resolve ()
            .then (() => {
                // 金币不足
                if (this.recCoin.count < this.countCost) {
                    let cfgCost = jiang.mgrCfg.cfgBackpackProp.select (CfgBackpackProp.idGetter, gameCommon.COIN_FOR_LOTTERY)._list [0];
                    let videoCertainState = VideoCertainViewState.Pop (APP, `${cfgCost.name}不足，完整观看视频后本次免费`);
                    jiang.mgrUI.Open (
                        VideoCertainView.nodeType,
                        videoCertainState
                    );
                    return videoCertainState.ctrl._promise;
                };
                // 否则直接消耗就好了
                this.recCoin.count -= this.countCost;
                this.recCoin.count = Math.ceil (this.recCoin.count);
                return true;
            });
    }

    /**
     * 走强化逻辑
     * @returns 
     */
    Go () {
        this.GetActionAble ()
            .then ((resp) => {
                // 获得行为许可，进行升级
                if (resp) {
                    jiang.mgrUI.Open (
                        LvUpBatchView.nodeType,
                        LvUpBatchViewState.Pop (APP)
                    );
                    return;
                };
            });
    }
}

namespace LvUpBatchViewState {
    /**
     * 每行最大数量
     */
    export const HOR_COUNt = 8;

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

export default LvUpBatchViewState;