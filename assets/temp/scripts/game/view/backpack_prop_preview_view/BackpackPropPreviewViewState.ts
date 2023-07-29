import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import ViewState from "../../../frame/ui/ViewState";
import IndexLayer from "../../../IndexLayer";
import gameCommon from "../../GameCommon";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";


const APP = `BackpackPropPreviewViewState`;

/**
 * 装备奖励的预览界面 - 背包物品
 */
export default class BackpackPropPreviewViewState extends ViewState {
    private constructor () {
        super (
            IndexLayer.GAME,
            ViewState.BG_TYPE.MASK,
            true
        );
    }

    private static _t = new UtilObjPoolType<BackpackPropPreviewViewState>({
        instantiate: () => {
            return new BackpackPropPreviewViewState();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, idCfg: number, count: number) {
        let val = UtilObjPool.Pop(BackpackPropPreviewViewState._t, apply);
        val.idCfg = idCfg;
        val.count = count;
        return val;
    }

    OnMaskTouch(): void {
        VoiceOggViewState.inst.VoiceSet (gameCommon.BTN_VOICE);
        jiang.mgrUI.Close(this._idView);
    }

    /**
     * 当前查看内容的配表 id
     */
    idCfg: number;
    /**
     * 数量
     */
    count: number;
}