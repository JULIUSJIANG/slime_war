import IndexLayer from "../../../IndexLayer";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import ViewState from "../../../frame/ui/ViewState";
import gameCommon from "../../GameCommon";
import DefineVoice from "../../game_element/body/DefineVoice";
import EquipmentViewState from "../equipment_view/EquipmentViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";

const APP = `EquipmentLvUpViewState`;

/**
 * 装备升级界面
 */
export default class EquipmentLvUpViewState extends ViewState {
    private constructor () {
        super (
            IndexLayer.GAME,
            ViewState.BG_TYPE.MASK,
            true  
        );
    }

    private static _t = new UtilObjPoolType<EquipmentLvUpViewState>({
        instantiate: () => {
            return new EquipmentLvUpViewState ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });


    static Pop (apply: string, idCfg: number, lvPassed: number, lvCurrent: number) {
        let val = UtilObjPool.Pop (EquipmentLvUpViewState._t, apply);
        val.idCfg = idCfg;
        val.lvPassed = lvPassed;
        val.lvCurrent = lvCurrent;
        return val;
    }

    OnMaskTouch(): void {
        VoiceOggViewState.inst.VoiceSet (gameCommon.BTN_VOICE);
        jiang.mgrUI.Close (this._idView);
    }

    OnDisplay(): void {
        VoiceOggViewState.inst.VoiceSet (DefineVoice.NEW);
    }

    /**
     * 武器的配表 id
     */
    idCfg: number;
    /**
     * 过去等级
     */
    lvPassed: number;
    /**
     * 当前等级
     */
    lvCurrent: number;
}