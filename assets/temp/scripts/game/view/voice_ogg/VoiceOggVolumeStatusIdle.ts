import VoiceOggVolumeStatus from "./VoiceOggVolumeStatus";

/**
 * 音频界面状态 - 待机
 */
export default class VoiceOggVolumeStatusIdle extends VoiceOggVolumeStatus {
    OnVolumeChange(): void {
        this.relMachine.Enter (this.relMachine.statusCD);
    }
}