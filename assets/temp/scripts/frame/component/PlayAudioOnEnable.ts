const {ccclass, property} = cc._decorator;

/**
 * 显示的时候播放身上的音频
 */
@ccclass
export default class PlayAudioOnEnable extends cc.Component {
    /**
     * 对应的动画组件
     */
    private _audio: cc.AudioSource;

    protected onLoad(): void {
        this._audio = this.getComponent(cc.AudioSource);
    }

    protected onDisable(): void {
        this._audio.stop();
    }

    Reset () {
        if (this._audio == null) {
            return;
        };
        this._audio.play();
    }

    protected onEnable(): void {
        this.Reset();
    }
}