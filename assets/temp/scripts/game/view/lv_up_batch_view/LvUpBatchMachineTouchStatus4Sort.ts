import IndexDataModule from "../../../IndexDataModule";
import jiang from "../../../frame/global/Jiang";
import LvUpBatchMachineTouchStatus from "./LvUpBatchMachineTouchStatus";

const MS_WAIT = 200;

const APP = `LvUpBatchMachineTouchStatus4Sort`;

/**
 * 重定位
 */
export default class LvUpBatchMachineTouchStatus4Sort extends LvUpBatchMachineTouchStatus {

    /**
     * 要等候的时间
     */
    msWait: number;

    OnEnter(): void {
        this.msWait = MS_WAIT;

        // 更正位置
        this.relMachine.relState.listRecord.sort ((a, b) => {
            return -(a.data.count - b.data.count);
        });
        // 更正序号
        for (let i = 0; i < this.relMachine.relState.listRecord.length; i++) {
            let listRecordI = this.relMachine.relState.listRecord [i];
            listRecordI.idx = i;
        };
    }

    OnStep(ms: number): void {
        jiang.mgrUI.ModuleRefresh (IndexDataModule.LV_UP_BATCH_OPACITY);
        jiang.mgrUI.ModuleRefresh (IndexDataModule.LV_UP_BATCH_POS);
        this.msWait -= ms;
        this.msWait = Math.max (this.msWait, 0);
        if (this.msWait == 0) {
            this.relMachine.Enter (this.relMachine.status5Idle);
        };
    }

    GetNodeStrengthenOpacity(): number {
        // 淡入
        return 1 - this.msWait / MS_WAIT;
    }

    GetNodeLvUpOpacity(): number {
        return 1;
    }

    GetSortRate(): number {
        return 1 - this.msWait / MS_WAIT;
    }
}