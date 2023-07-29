import jiang from "../../../frame/global/Jiang";
import VoiceOggInfoStatus from "./VoiceOggInfoStatus";
import VoiceOggViewItem from "./VoiceOggViewItem";

/**
 * 音频数据 - 状态 - 等待音频实例显示出来
 */
export default class VoiceOggInfoStatusWaitDisplay extends VoiceOggInfoStatus {
    OnDisplay (): void {
        this.relMachine.idVoice = jiang.mgrSdk.core.AudioPlay (
            this.relMachine.com.as.clip,
            this.relMachine.typeRS.isLoop,
            this.relMachine.typeRS.getterVolume ()
        );
        this.relMachine.Enter (this.relMachine.statusDisplaying);
    }
}