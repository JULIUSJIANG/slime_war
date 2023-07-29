import MgrSdkCoreWX from "./MgrSdkCoreWX";
import WXVideoAdInstLoadStatus from "./WXVideoAdInstLoadStatus";

/**
 * 微信视频广告 - 实例 - 加载状态 - 加载中
 */
class WXVideoAdInstLoadStatusLoading extends WXVideoAdInstLoadStatus {

    OnExit(): void {
        this.relMachine.relMgr.OnLoadExit ();
    }

    LoadOnLoadSuccess(): void {
        this.relMachine.LoadEnterStatus (this.relMachine.loadStatusReady);
    }

    LoadOnLoadError(): void {
        this.relMachine.LoadEnterStatus (this.relMachine.loadStatusNone);
    }

    LoadOnPlayBreak(): void {
        // 没播放完就关掉的话，不产生新的视频拉取，那么直接就绪
        this.relMachine.LoadEnterStatus (this.relMachine.loadStatusReady);
    }
}

export default WXVideoAdInstLoadStatusLoading;