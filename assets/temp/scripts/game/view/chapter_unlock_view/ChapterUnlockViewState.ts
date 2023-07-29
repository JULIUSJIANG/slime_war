import IndexLayer from "../../../IndexLayer";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import CfgChapter from "../../../frame/config/src/CfgChapter";
import CfgScene from "../../../frame/config/src/CfgScene";
import jiang from "../../../frame/global/Jiang";
import MgrSdk from "../../../frame/sdk/MgrSdk";
import ViewState from "../../../frame/ui/ViewState";
import gameCommon from "../../GameCommon";
import DefineVoice from "../../game_element/body/DefineVoice";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";

const APP = `ChapterUnlockViewState`;

/**
 * 章节解锁界面
 */
export default class ChapterUnlockViewState extends ViewState {
    private constructor () {
        super (
            IndexLayer.GAME,
            ViewState.BG_TYPE.MASK,
            true
        );
    }

    private static _t = new UtilObjPoolType<ChapterUnlockViewState>({
        instantiate: () => {
            return new ChapterUnlockViewState ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, idCfgChapter: number) {
        let val = UtilObjPool.Pop (ChapterUnlockViewState._t, apply);
        val.idCfgScene = idCfgChapter;
        return val;
    }

    OnMaskTouch(): void {
        VoiceOggViewState.inst.VoiceSet (gameCommon.BTN_VOICE);
        jiang.mgrUI.Close (this._idView);
    }
    
    OnDisplay(): void {
        let cfgScene = jiang.mgrCfg.cfgScene.select (CfgScene.idGetter, this.idCfgScene)._list [0];
        VoiceOggViewState.inst.BgmSet (cfgScene.bgm);
        VoiceOggViewState.inst.VoiceSet (DefineVoice.NEW);
    }

    /**
     * 标识 - 章节
     */
    idCfgScene: number;
}