import MgrSdkCoreWX from "./MgrSdkCoreWX";
import WXLifeCycleStatus from "./WXLifeCycleStatus";

/**
 * 微信生命周期 - 状态 - 已退出
 */
class WXLifeCycleStatusExited extends WXLifeCycleStatus {

    OnEnter(): void {
        MgrSdkCoreWX.wx.exitMiniProgram ();
    }
}

export default WXLifeCycleStatusExited;