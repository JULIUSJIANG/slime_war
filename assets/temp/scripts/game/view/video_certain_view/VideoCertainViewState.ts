import IndexLayer from "../../../IndexLayer";
import BCPromiseCtrl from "../../../frame/basic/BCPromiseCtrl";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import ViewState from "../../../frame/ui/ViewState";
import gameCommon from "../../GameCommon";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";

const APP = `VideoCertainViewState`;

export default class VideoCertainViewState extends ViewState {
    private constructor () {
        super (
            IndexLayer.GAME,
            ViewState.BG_TYPE.MASK,
            true
        );
    }

    private static _t = new UtilObjPoolType<VideoCertainViewState>({
        instantiate: () => {
            return new VideoCertainViewState ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, title: string) {
        let val = UtilObjPool.Pop (VideoCertainViewState._t, apply);
        val.title = title;
        return val;
    }

    /**
     * 标题
     */
    title: string;

    /**
     * 控制器
     */
    ctrl: BCPromiseCtrl <boolean> = BCPromiseCtrl.Pop (APP);

    OnMaskTouch(): void {
        VoiceOggViewState.inst.VoiceSet (gameCommon.BTN_VOICE);
        this.OnNo ();
    }

    /**
     * 确定
     */
    OnYes () {
        jiang.mgrSdk.core.WXVideo ()
            .then ((videoCtx) => {
                if (!videoCtx.isRewardAble) {
                    return;
                };
                jiang.mgrUI.Close (this._idView);
                this.ctrl.resolve (true);
            });
    }

    /**
     * 取消
     */
    OnNo () {
        jiang.mgrUI.Close (this._idView);
        this.ctrl.resolve (false);
    }
}