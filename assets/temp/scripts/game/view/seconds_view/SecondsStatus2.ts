import SecondsStatus from "./SecondsStatus";

/**
 * 数秒倒计时 - 状态 - 2 秒
 */
export default class SecondsStatus2 extends SecondsStatus {
    /**
     * 要等候的时间
     */
    msWait = 600;

    public OnStep(ms: number): void {
        this.msWait -= ms;
        this.msWait = Math.max (this.msWait, 0);
        if (this.msWait == 0) {
            this.relMachine.Enter (this.relMachine.status1)
        };
    }

    public GetTxtScale(): number {
        let rate = 1 - this.msWait / 600;
        rate = Math.pow (rate, 0.25);
        return rate;
    }

    public GetTxtOpacity(): number {
        let rate = 1 - Math.abs (this.msWait - 300) / 300;
        rate = Math.pow (rate, 0.5);
        return rate;
    }

    public GetTxtCtx(): string {
        return `准备!`;
    }
}