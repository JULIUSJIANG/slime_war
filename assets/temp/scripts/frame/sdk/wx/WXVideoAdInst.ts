import MgrSdk from "../MgrSdk";
import MgrSdkCoreWX from "./MgrSdkCoreWX";
import WXVideoAd from "./WXVideoAd";
import WXVideoAdInstLoadStatus from "./WXVideoAdInstLoadStatus";
import WXVideoAdInstLoadStatusIdle from "./WXVideoAdInstLoadStatusIdle";
import WXVideoAdInstLoadStatusLoading from "./WXVideoAdInstLoadStatusLoading";
import WXVideoAdInstLoadStatusNone from "./WXVideoAdInstLoadStatusNone";
import WXVideoAdInstLoadStatusReady from "./WXVideoAdInstLoadStatusReady";
import WXVideoAdInstPlayStatus from "./WXVideoAdInstPlayStatus";
import WXVideoAdInstPlayStatusIdle from "./WXVideoAdInstPlayStatusIdle";
import WXVideoAdInstPlayStatusPlaying from "./WXVideoAdInstPlayStatusPlaying";

/**
 * 微信视频广告 - 实例
 */
class WXVideoAdInst {

    /**
     * 归属的管理器
     */
    relMgr: WXVideoAd;

    /**
     * 广告 id
     */
    idAd: string;

    constructor (args: {
        relMgr: WXVideoAd,
        idAd: string
    })
    {
        this.relMgr = args.relMgr;
        this.idAd = args.idAd;

        this.loadStatusIdle = new WXVideoAdInstLoadStatusIdle (this);
        this.loadStatusLoading = new WXVideoAdInstLoadStatusLoading (this);
        this.loadStatusNone = new WXVideoAdInstLoadStatusNone (this);
        this.loadStatusReady = new WXVideoAdInstLoadStatusReady (this);
        this.LoadEnterStatus (this.loadStatusIdle);

        this.playStatusIdle = new WXVideoAdInstPlayStatusIdle (this);
        this.playStatusPlaying = new WXVideoAdInstPlayStatusPlaying (this);
        this.PlayEnterStatus (this.playStatusIdle);
    }

    /**
     * 加载 - 当前状态
     */
    loadCurrStatus: WXVideoAdInstLoadStatus;

    /**
     * 加载 - 状态 - 待机
     */
    loadStatusIdle: WXVideoAdInstLoadStatusIdle;
    /**
     * 加载 - 状态 - 加载中
     */
    loadStatusLoading: WXVideoAdInstLoadStatusLoading;
    /**
     * 加载 - 状态 - 没有合适的
     */
    loadStatusNone: WXVideoAdInstLoadStatusNone;
    /**
     * 加载 - 状态 - 已就绪
     */
    loadStatusReady: WXVideoAdInstLoadStatusReady;
    /**
     * 加载 - 进入状态
     * @param status 
     */
    LoadEnterStatus (
        status: WXVideoAdInstLoadStatus
    ) 
    {
        let rec = this.loadCurrStatus;
        this.loadCurrStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.loadCurrStatus.OnEnter ();
    }

    /**
     * 播放 - 当前状态
     */
    playCurrStatus: WXVideoAdInstPlayStatus;
    /**
     * 播放 - 状态 - 待机
     */
    playStatusIdle: WXVideoAdInstPlayStatusIdle;
    /**
     * 播放 - 状态 - 播放中
     */
    playStatusPlaying: WXVideoAdInstPlayStatusPlaying;
    /**
     * 播放 - 进入状态
     * @param status 
     */
    PlayEnterStatus (
        status: WXVideoAdInstPlayStatus
    )
    {
        let rec = this.playCurrStatus;
        this.playCurrStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.playCurrStatus.OnEnter ();
    }

    /**
     * sdk 返回的视频实例
     */
    video: any;

    /**
     * 初始化与否
     */
    isInited = false;

    /**
     * 初始化
     */
    Init () {
        if (this.isInited) {
            return;
        };
        this.isInited = true;
        // 进行初始化，监听所有事件
        this.video = MgrSdkCoreWX.wx.createRewardedVideoAd({ adUnitId: this.idAd, multiton: true });
        this.video.onLoad (() => {
            this.loadCurrStatus.LoadOnLoadSuccess ();
        });
        this.video.onError ((err) => {
            this.loadCurrStatus.LoadOnLoadError (err);
        });
        this.video.onClose ((data) => {
            if (data.isEnded) {
                this.playCurrStatus.PlayOnPlayAll ();
                return;
            };
            this.loadCurrStatus.LoadOnPlayBreak ();
            this.playCurrStatus.PlayOnPlayBreak ();
        });
        // 创建后会自动拉取，所以对应的状态应该是加载中
        this.LoadEnterStatus (this.loadStatusLoading);
    }
}

export default WXVideoAdInst;