import IndexDataModule from "../../../IndexDataModule";
import jiang from "../../../frame/global/Jiang";
import LvUpBatchMachineTouchStatus from "./LvUpBatchMachineTouchStatus";

const MS_WAIT = 200;

const APP = `LvUpBatchMachineTouchStatus1FadeIn`;

/**
 * 提示信息淡出
 */
export default class LvUpBatchMachineTouchStatus6TipsOut extends LvUpBatchMachineTouchStatus {

    /**
     * 要等候的时间
     */
    msWait: number;

    OnEnter(): void {
        this.msWait = MS_WAIT;
    }

    OnStep(ms: number): void {
        jiang.mgrUI.ModuleRefresh (IndexDataModule.LV_UP_BATCH_OPACITY);
        this.msWait -= ms;
        this.msWait = Math.max (this.msWait, 0);
        if (this.msWait == 0) {
            this.relMachine.Enter (this.relMachine.status2FlashIn);
        };
    }

    GetNodeStrengthenOpacity(): number {
        // 淡出
        return this.msWait / MS_WAIT;
    }

    GetNodeLvUpOpacity(): number {
        return this.msWait / MS_WAIT;
    }
}