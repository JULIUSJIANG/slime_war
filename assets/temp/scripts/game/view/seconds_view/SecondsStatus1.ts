import jiang from "../../../frame/global/Jiang";
import SecondsStatus from "./SecondsStatus";

/**
 * 数秒倒计时 - 状态 - 1 秒
 */
export default class SecondsStatus1 extends SecondsStatus {
    /**
     * 要等候的时间
     */
    msWait = 600;

    public OnStep(ms: number): void {
        this.msWait -= ms;
        this.msWait = Math.max (this.msWait, 0);
        if (this.msWait == 0) {
            jiang.mgrUI.Close (this.relMachine._idView);
        };
    }

    public GetTxtScale(): number {
        let rate = this.msWait / 600;
        rate = Math.pow (rate, 2);
        rate *= 2;
        rate = Math.max (rate, 1);
        return rate;
    }

    public GetTxtOpacity(): number {
        let rate = 1 - this.msWait / 600;
        return rate;
    }

    public GetTxtCtx(): string {
        return `开始!`;
    }
}