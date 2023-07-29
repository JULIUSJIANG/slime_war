import IndexDataModule from "../../../IndexDataModule";
import jiang from "../../../frame/global/Jiang";
import LockViewState from "../lock_view/LockViewState";
import LvUpBatchMachineTouchStatus from "./LvUpBatchMachineTouchStatus";

/**
 * 等候下一次升级
 */
export default class LvUpBatchMachineTouchStatus5Idle extends LvUpBatchMachineTouchStatus {

    OnEnter(): void {
        LockViewState.inst.LockCancel (this.relMachine.lockId);

        // 把最新索引同步过来
        for (let i = 0; i < this.relMachine.relState.listRecord.length; i++) {
            let listRecordI = this.relMachine.relState.listRecord [i];
            listRecordI.UpdateTempIdx ();
        };

        jiang.mgrUI.ModuleRefresh (IndexDataModule.LV_UP_BATCH_OPACITY);
        jiang.mgrUI.ModuleRefresh (IndexDataModule.LV_UP_BATCH_POS);
    }

    OnExit(): void {
        this.relMachine.lockId = LockViewState.inst.LockApp ();
    }

    /**
     * 维持
     * @returns 
     */
    GetNodeStrengthenOpacity(): number {
        return 1;
    }

    GetNodeLvUpOpacity(): number {
        return 1;
    }
}