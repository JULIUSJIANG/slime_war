import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import CfgLottery from "../../../frame/config/src/CfgLottery";
import jiang from "../../../frame/global/Jiang";
import MgrSdk from "../../../frame/sdk/MgrSdk";
import gameCommon from "../../GameCommon";
import CfgCacheLottery from "../../cfg_cache/CfgCacheLottery";
import GameStateReward from "../../game_element/GameStateReward";
import DefineVoice from "../../game_element/body/DefineVoice";
import GameCfgBodyCacheDropRS from "../../game_element/body/GameCfgBodyCacheDropRS";
import RewardViewState from "../reward_view/RewardViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import LvUpBatchMachineTouchStatus from "./LvUpBatchMachineTouchStatus";

const MS_WAIT = 600;

const APP = `LvUpBatchMachineTouchStatus2FlashIn`;

/**
 * 升级遮挡淡入
 */
export default class LvUpBatchMachineTouchStatus2FlashIn extends LvUpBatchMachineTouchStatus {

    /**
     * 要等候的时间
     */
    msWait: number;

    OnEnter(): void {
        VoiceOggViewState.inst.VoiceSet (DefineVoice.EQUIPMENT_DROP_TRIGGER);
        this.msWait = MS_WAIT;
        
        // 副本
        let listClone: Array<CfgLottery> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
        for (let i = 0; i < jiang.mgrCfg.cfgLottery._list.length; i++) {
            let cfg = jiang.mgrCfg.cfgLottery._list [i];
            // 未解锁的话，要忽略掉
            if (!CfgCacheLottery.CheckUsUnlocked (this.relMachine.relState.challengeChapter, cfg)) {
                continue;
            };
            listClone.push (cfg);
        };                        
        // 奖励列表
        let listReward: Array<GameStateReward> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
        // 有视频奖励的时候，完全随机
        while (listReward.length < listClone.length) {
            let randomIdx = Math.floor (Math.random () * listClone.length);
            let randomItem = listClone.splice (randomIdx, 1) [0];
            let randomItemRS = GameCfgBodyCacheDropRS.mapCodeToRS.get (randomItem.item_type);
            listReward.push (
                randomItemRS.onLotteryCreateReward (randomItem, this.relMachine.relState.countGot)
            );
        };

        // 清除升级标记
        for (let i = 0; i < this.relMachine.relState.listRecord.length; i++) {
            let listRecordI = this.relMachine.relState.listRecord [i];
            listRecordI.isLvUped = false;
        };
        // 得到升级的，会拥有标记
        for (let i = 0; i < listReward.length; i++) {
            let listRewardI = listReward [i];
            let record = this.relMachine.relState.mapIdCfgToRecord.get (listRewardI.props [0]);
            if (!record) {
                continue;
            };
            record.isLvUped = true;
        };

        // 把奖励悄悄放入背包
        for (let i = 0; i < listReward.length; i++) {
            let listRewardI = listReward [i];
            listRewardI.rs.onEnterBackpack (listRewardI.props);
        };
        indexDataStorageItem.listBackpackProp.media.onSet ();
        // 刷新画面
        jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_EQUIP)
        jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_LOTTO);
    }

    OnStep(ms: number): void {
        jiang.mgrUI.ModuleRefresh (IndexDataModule.LV_UP_BATCH_OPACITY);
        this.msWait -= ms;
        this.msWait = Math.max (this.msWait, 0);
        if (this.msWait == 0) {
            this.relMachine.Enter (this.relMachine.status3FlashOut);
        };
    }

    GetNodeFlashOpacity(): number {
        return 1 - this.msWait / MS_WAIT;
    }
}