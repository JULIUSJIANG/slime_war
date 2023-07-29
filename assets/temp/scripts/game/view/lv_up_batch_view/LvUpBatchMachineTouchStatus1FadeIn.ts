import IndexDataModule from "../../../IndexDataModule";
import jiang from "../../../frame/global/Jiang";
import LockViewState from "../lock_view/LockViewState";
import LvUpBatchMachineTouchStatus from "./LvUpBatchMachineTouchStatus";

const MS_WAIT = 200;

const APP = `LvUpBatchMachineTouchStatus1FadeIn`;

/**
 * 整个界面淡入
 */
export default class LvUpBatchMachineTouchStatus1FadeIn extends LvUpBatchMachineTouchStatus {

    /**
     * 要等候的时间
     */
    msWait: number;

    OnEnter(): void {
        this.relMachine.lockId = LockViewState.inst.LockApp ();
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
}