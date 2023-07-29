import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import jiang from "../../../frame/global/Jiang";
import TipsViewState from "../tips_view/TipsViewState";
import VoiceOggViewState from "./VoiceOggViewState";
import VoiceOggVolumeStatus from "./VoiceOggVolumeStatus";

/**
 * 音频界面状态 - 冷却
 */
export default class VoiceOggVolumeStatusCD extends VoiceOggVolumeStatus {

    /**
     * 要等候的时间
     */
    msWait: number;

    OnEnter (): void {
        this.msWait = 1000;
        // 该行代码，让音频变化立即生效
        this.relMachine.Enter (this.relMachine.statusIdle);
    }

    OnStep(ms: number): void {
        this.msWait -= ms;
        if (this.msWait <= 0) {
            this.relMachine.Enter (this.relMachine.statusIdle);
        };
    }

    OnExit(): void {
        // 派发事件
        for (let i = 0; i < this.relMachine.voiceList.length; i++) {
            let id = this.relMachine.voiceList[i];
            let rec = this.relMachine.GetRec(id);
            rec.currStatus.OnVolumeChange ();
        };
        // 同步背景音乐音量
        let bgmRec = this.relMachine.GetRec(this.relMachine.bgmAppId);
        if (bgmRec) {
            bgmRec.currStatus.OnVolumeChange ();
        };
    }
}