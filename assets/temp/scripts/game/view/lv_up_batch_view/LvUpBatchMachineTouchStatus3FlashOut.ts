import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import CfgLottery from "../../../frame/config/src/CfgLottery";
import jiang from "../../../frame/global/Jiang";
import gameCommon from "../../GameCommon";
import CfgCacheLottery from "../../cfg_cache/CfgCacheLottery";
import GameStateReward from "../../game_element/GameStateReward";
import GameCfgBodyCacheDropRS from "../../game_element/body/GameCfgBodyCacheDropRS";
import RewardViewState from "../reward_view/RewardViewState";
import LvUpBatchMachineTouchStatus from "./LvUpBatchMachineTouchStatus";

const MS_WAIT = 600;

const APP = `LvUpBatchMachineTouchStatus3FlashOut`;

/**
 * 升级遮挡淡出，进入该状态时候，发生强化的事实
 */
export default class LvUpBatchMachineTouchStatus3FlashOut extends LvUpBatchMachineTouchStatus {

    /**
     * 要等候的时间
     */
    msWait: number;

    OnEnter(): void {
        this.msWait = MS_WAIT;
        // 把最新等级同步过来
        for (let i = 0; i < this.relMachine.relState.listRecord.length; i++) {
            let listRecordI = this.relMachine.relState.listRecord [i];
            listRecordI.UpdateTempCount ();
            jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_LOTTO);
        };
    }

    OnStep(ms: number): void {
        jiang.mgrUI.ModuleRefresh (IndexDataModule.LV_UP_BATCH_OPACITY);
        this.msWait -= ms;
        this.msWait = Math.max (this.msWait, 0);
        if (this.msWait == 0) {
            this.relMachine.Enter (this.relMachine.status4Sort);
        };
    }

    GetNodeLvUpOpacity(): number {
        return 1;
    }

    GetNodeFlashOpacity(): number {
        return this.msWait / MS_WAIT;
    }
}