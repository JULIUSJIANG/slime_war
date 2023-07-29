import WXLifeCycleStatus from "./WXLifeCycleStatus";

/**
 * 微信生命周期 - 状态 - 待机
 */
class WXLifeCycleStatusIdle extends WXLifeCycleStatus {

    OnAppQuit(): void {
        this.relMachine.EnterStatus (this.relMachine.statusExitTips);
    }
}

export default WXLifeCycleStatusIdle;