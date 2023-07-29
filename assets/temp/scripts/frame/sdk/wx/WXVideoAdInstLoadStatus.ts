import WXVideoAdInst from "./WXVideoAdInst";

/**
 * 微信视频广告 - 实例 - 加载状态
 */
abstract class WXVideoAdInstLoadStatus {

    /**
     * 归属的广告实例
     */
    relMachine: WXVideoAdInst;

    constructor (relMachine: WXVideoAdInst) {
        this.relMachine = relMachine;
    }

    /**
     * 事件派发 - 进入状态
     */
    OnEnter () {

    }
    /**
     * 事件派发 - 离开状态
     */
    OnExit () {

    }

    /**
     * 事件派发 - 广告加载成功
     */
    LoadOnLoadSuccess () {

    }
    /**
     * 事件派发 - 广告加载失败
     */
    LoadOnLoadError (err: any) {
        
    }
    /**
     * 事件派发 - 要求播放广告
     */
    LoadOnPlay () {
        
    }
    /**
     * 事件派发 - 视频广告在未播放完的情况下关闭
     */
    LoadOnPlayBreak () {

    }
};

export default WXVideoAdInstLoadStatus;