import VoiceOggViewState from "../../../game/view/voice_ogg/VoiceOggViewState";
import BCPromiseCtrl from "../../basic/BCPromiseCtrl";
import WXVideoAdInstPlayStatus from "./WXVideoAdInstPlayStatus";


const APP = `WXVideoAdInstPlayStatusPlaying`;

/**
 * 微信视频广告 - 实例 - 播放状态 - 播放中
 */
class WXVideoAdInstPlayStatusPlaying extends WXVideoAdInstPlayStatus {
    /**
     * 当前播放结果
     */
    ctrlPlay: BCPromiseCtrl <boolean>;

    OnEnter(): void {
        this.ctrlPlay = BCPromiseCtrl.Pop (APP);
        this.relMachine.video.show ();
    }

    OnExit(): void {
        VoiceOggViewState.inst.ResetBgm ();
    }

    PlayOnPlay(): Promise<boolean> {
        return this.ctrlPlay._promise;
    }

        
    PlayOnPlayAll(): void {
        this.relMachine.PlayEnterStatus (this.relMachine.playStatusIdle);
        this.ctrlPlay.resolve (true);
    }

    PlayOnPlayBreak(): void {
        this.relMachine.PlayEnterStatus (this.relMachine.playStatusIdle);
        this.ctrlPlay.resolve (false);
    }
}

export default WXVideoAdInstPlayStatusPlaying;