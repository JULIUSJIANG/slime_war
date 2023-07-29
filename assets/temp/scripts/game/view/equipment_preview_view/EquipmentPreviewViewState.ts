import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import ViewState from "../../../frame/ui/ViewState";
import IndexLayer from "../../../IndexLayer";
import gameCommon from "../../GameCommon";
import EquipmentViewState from "../equipment_view/EquipmentViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";


const APP = `EquipmentPreviewViewState`;

/**
 * 装备奖励的预览界面
 */
export default class EquipmentPreviewViewState extends ViewState {
    private constructor () {
        super (
            IndexLayer.GAME,
            ViewState.BG_TYPE.MASK,
            true
        );
    }

    private static _t = new UtilObjPoolType<EquipmentPreviewViewState>({
        instantiate: () => {
            return new EquipmentPreviewViewState();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, idCfg: number, count: number) {
        let val = UtilObjPool.Pop(EquipmentPreviewViewState._t, apply);
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