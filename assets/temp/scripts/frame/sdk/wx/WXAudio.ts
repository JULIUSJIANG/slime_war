import MgrSdkCoreWX from "./MgrSdkCoreWX";
import WXAudioStatus from "./WXAudioStatus";
import WXAudioStatusIdle from "./WXAudioStatusIdle";
import WXAudioStatusPlaying from "./WXAudioStatusPlaying";

const APP = `WXAudio`;

/**
 * 微信小游戏上的音频播放
 */
export default class WXAudio {

    /**
     * 播放源
     */
    public src: string;

    /**
     * 标识
     */
    id: number;
    /**
     * 循环
     */
    loop: boolean;
    /**
     * 音量
     */
    volume: number;

    /**
     * 播放实例
     */
    ctx: any;

    public constructor (src: string) {
        this.statusIdle = new WXAudioStatusIdle (this);
        this.statusPlaying = new WXAudioStatusPlaying (this);
        this.Enter (this.statusIdle);

        this.src = src;
        this.ctx = MgrSdkCoreWX.wx.createInnerAudioContext({
          useWebAudioImplement: true
        })
        this.ctx.src = src;
    }

    /**
     * 状态 - 待机
     */
    statusIdle: WXAudioStatusIdle;
    /**
     * 状态 - 播放中
     */
    statusPlaying: WXAudioStatusPlaying;

    /**
     * 当前状态
     */
    currStatus: WXAudioStatus;

    /**
     * 进入某个状态
     * @param status 
     */
    Enter (status: WXAudioStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.currStatus.OnEnter ();
    }
}