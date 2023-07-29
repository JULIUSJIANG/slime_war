import WXAudioStatus from "./WXAudioStatus";

const APP = `WXAudioStatusPlaying`;

/**
 * 微信小游戏上的音频播放 - 状态 - 播放中
 */
export default class WXAudioStatusPlaying extends WXAudioStatus {

    OnEnter(): void {
        this.relMachine.ctx.loop = this.relMachine.loop;
        this.relMachine.ctx.volume = this.relMachine.volume;
        this.relMachine.ctx.play ();
    }

    OnVolume(): void {
        this.relMachine.ctx.volume = this.relMachine.volume;
    }

    OnStop(): void {
        this.relMachine.Enter (this.relMachine.statusIdle);
    }

    OnExit(): void {
        this.relMachine.ctx.stop ();
    }
}