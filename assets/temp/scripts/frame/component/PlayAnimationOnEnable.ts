const {ccclass, property} = cc._decorator;

/**
 * 显示的时候播放身上的动画
 */
@ccclass
export default class PlayAnimationOnEnable extends cc.Component {

    /**
     * 对应的动画组件
     */
    _anim: cc.Animation;

    protected onLoad(): void {
        this._anim = this.getComponent(cc.Animation);
    }

    protected onDisable(): void {
        this._anim.stop();
    }

    Reset () {
        if (this._anim == null) {
            return;
        };+
        this._anim.play();
    }

    protected onEnable(): void {
        this.Reset();
    }
}