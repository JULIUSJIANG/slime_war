import MgrDateNow from "./MgrDateNow";
import MgrDateNowStatus from "./MgrDateNowStatus";

/**
 * 时间戳管理器 - 待机
 */
export default class MgrDateNowStatusIdle extends MgrDateNowStatus {
    public OnTime() {
        this.relMachine.EnterStatus (this.relMachine.statusGetting)
        return this.relMachine.statusGetting.OnTime ();
    }
}