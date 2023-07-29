import jiang from "../../../frame/global/Jiang";
import VoiceOggInfoStatus from "./VoiceOggInfoStatus";

/**
 * 音频数据 - 状态 - 已经展示出来
 */
export default class VoiceOggInfoStatusDisplaying extends VoiceOggInfoStatus {
    OnPush(): void {
        jiang.mgrSdk.core.AudioStop (this.relMachine.idVoice);
    }

    OnVolumeChange(): void {
        jiang.mgrSdk.core.AudioVolume (
            this.relMachine.idVoice,
            this.relMachine.typeRS.getterVolume ()
        );
    }
}