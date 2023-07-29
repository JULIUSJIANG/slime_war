import WXVideoAdInst from "./WXVideoAdInst";

/**
 * 微信视频广告 - 实例 - 播放状态
 */
abstract class WXVideoAdInstPlayStatus {

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
     * 事件派发 - 要求播放广告
     */
    PlayOnPlay (): Promise<boolean> {
        return Promise.resolve (false);
    }
    /**
     * 事件派发 - 视频广告在播放完全的情况下关闭
     * @param data 
     */
    PlayOnPlayAll () {

    }
    /**
     * 事件派发 - 视频广告在未播放完的情况下关闭
     */
    PlayOnPlayBreak () {
        
    }
}

export default WXVideoAdInstPlayStatus;