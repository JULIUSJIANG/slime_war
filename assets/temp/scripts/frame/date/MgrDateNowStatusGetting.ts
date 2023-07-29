import IndexDataModule from "../../IndexDataModule";
import jiang from "../global/Jiang";
import MgrSdk from "../sdk/MgrSdk";
import MgrDateNow from "./MgrDateNow";
import MgrDateNowStatus from "./MgrDateNowStatus";

/**
 * 时间戳管理器 - 正在同步时间
 */
export default class MgrDateNowStatusGetting extends MgrDateNowStatus {
    /**
     * 时间同步的进展
     */
    private _promiseOnTime: Promise<unknown>;

    public OnEnter(): void {
        this._promiseOnTime = MgrSdk.inst.core.DateNow ()
            .then ((dateNow) => {
                this.relMachine.timeSpace = dateNow - Date.now ();
                MgrSdk.inst.Log (`MgrDateNowStatusGetting: timeSpace[${MgrDateNow.inst.timeSpace}]`);
                this.relMachine.EnterStatus (this.relMachine.statusIdle);
                jiang.mgrUI.ModuleRefresh (IndexDataModule.DEFAULT);
            });
    }

    public OnTime(): Promise<unknown> {
        return this._promiseOnTime;
    }
}