import WXVideoAdInstPlayStatus from "./WXVideoAdInstPlayStatus";

/**
 * 微信视频广告 - 实例 - 播放状态 - 待机
 */
class WXVideoAdInstPlayStatusIdle extends WXVideoAdInstPlayStatus {

    PlayOnPlay(): Promise<boolean> {
        // 委托给播放状态进行处理
        this.relMachine.PlayEnterStatus (this.relMachine.playStatusPlaying);
        this.relMachine.loadCurrStatus.LoadOnPlay ();
        return this.relMachine.playCurrStatus.PlayOnPlay ();
    }
}

export default WXVideoAdInstPlayStatusIdle;