import IndexLayer from "../../../IndexLayer";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import ViewState from "../../../frame/ui/ViewState";
import gameCommon from "../../GameCommon";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";

const APP = `StoreTipsViewState`;

/**
 * 商店提示界面 - 状态
 */
export default class StoreTipsViewState extends ViewState {

    private constructor () {
        super (
            IndexLayer.GAME,
            ViewState.BG_TYPE.MASK,
            true
        );
    }

    private static _t = new UtilObjPoolType <StoreTipsViewState>({
        instantiate: () => {
            return new StoreTipsViewState ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        let val = UtilObjPool.Pop (StoreTipsViewState._t, apply);
        return val;
    }

    override OnMaskTouch(): void {
        VoiceOggViewState.inst.VoiceSet (gameCommon.BTN_VOICE);
        jiang.mgrUI.Close(this._idView);
    }
}