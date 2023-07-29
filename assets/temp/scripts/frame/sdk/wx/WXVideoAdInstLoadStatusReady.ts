import BCPromiseCtrl from "../../basic/BCPromiseCtrl";
import UtilObjPool from "../../basic/UtilObjPool";
import WXVideoAdInstLoadStatus from "./WXVideoAdInstLoadStatus";

const APP = `WXVideoAdInstStatus`;

/**
 * 微信视频广告 - 实例 - 加载状态 - 加载完成
 */
class WXVideoAdInstLoadStatusReady extends WXVideoAdInstLoadStatus {

    LoadOnPlay () {
        // 切换到状态 - 加载，由它等待新的加载完成事件
        this.relMachine.LoadEnterStatus (this.relMachine.loadStatusLoading);
    }
}

export default WXVideoAdInstLoadStatusReady;