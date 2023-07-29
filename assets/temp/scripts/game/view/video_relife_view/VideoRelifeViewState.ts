import IndexLayer from "../../../IndexLayer";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import ViewState from "../../../frame/ui/ViewState";
import gameCommon from "../../GameCommon";
import DefineVoice from "../../game_element/body/DefineVoice";
import GameElementBody from "../../game_element/body/GameElementBody";
import GameElementBodyCtxDmg from "../../game_element/body/GameElementBodyCtxDmg";
import GameElementBodyCtxDmgType from "../../game_element/body/GameElementBodyCtxDmgType";
import MBPlayer from "../../game_element/body/logic_3031/MBPlayer";
import GameElementEff from "../../game_element/common/GameElementEff";
import EquipmentInstRS from "../../game_element/equipment/EquipmentInstRS";
import PlayOrdinary from "../../play_ordinary/PlayOrdinary";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";

const APP = `VideoRelifeViewState`;

export default class VideoRelifeViewState extends ViewState {
    private constructor () {
        super (
            IndexLayer.GAME,
            ViewState.BG_TYPE.MASK,
            true
        );
    }

    private static _t = new UtilObjPoolType<VideoRelifeViewState>({
        instantiate: () => {
            return new VideoRelifeViewState ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, playOrdinary: PlayOrdinary) {
        let val = UtilObjPool.Pop (VideoRelifeViewState._t, apply);
        val.playOrdinary = playOrdinary;
        return val;
    }

    /**
     * 控制的状态机
     */
    playOrdinary: PlayOrdinary;

    OnMaskTouch (): void {
        VoiceOggViewState.inst.VoiceSet (gameCommon.BTN_VOICE);
        this.OnNo ();
    }

    /**
     * 确定
     */
    OnYes () {
        jiang.mgrSdk.core.WXVideo ()
            .then ((success) => {
                if (success) {
                    this.playOrdinary.Enter (this.playOrdinary.statusPlaying);
                    let mbPlayer = this.playOrdinary.gameState.player.commonBehaviour as MBPlayer;
                    mbPlayer.playerMgrHealth.machine.relMgrHealth.relNpc.relBody.commonHpCurrent += 1;
                    mbPlayer.playerMgrHealth.machine.Enter (mbPlayer.playerMgrHealth.machine.statusHurted);
                    jiang.mgrUI.Close (this._idView);
                    GameElementEff.PopForXYBind (
                        APP,
                        mbPlayer.relBody.commonCenterPos.x,
                        mbPlayer.relBody.commonCenterPos.y,
                        0,
                        1,
                        10003,
                        cc.Color.WHITE,
                        this.playOrdinary.gameState.player
                    );
                    VoiceOggViewState.inst.VoiceSet (DefineVoice.CLEAR_SCREEN);
                    let listBody = this.playOrdinary.gameState.GetTypeAllEle (GameElementBody);
                    let listClone: Array <GameElementBody> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                    listClone.push (...listBody);
                    for (let i = 0; i < listClone.length; i++) {
                        let listCloneI = listClone [i];
                        // 非法的话，忽略
                        if (!listCloneI.isValid) {
                            continue;
                        };
                        // 友方的话，忽略
                        if (listCloneI.commonArgsCamp == gameCommon.FRIENDLY_CAMP) {
                            continue;
                        };
                        listCloneI.commonEvterDmg.Call (GameElementBodyCtxDmg.Pop (
                            APP,
                            {
                                dmg: EquipmentInstRS.GetSingleDmgByPower (gameCommon.STANDARD_EQUIP, mbPlayer.playerMgrEquipment.equipInst.power),
                                posX: listCloneI.commonCenterPos.x,
                                posY: listCloneI.commonCenterPos.y,

                                repel: EquipmentInstRS.GetSingleRepel (gameCommon.STANDARD_EQUIP) * 2,
                                norX: 1,
                                norY: 1,

                                type: GameElementBodyCtxDmgType.shield
                            }
                        ))
                    };
                };
            });
    }

    /**
     * 取消
     */
    OnNo () {
        this.playOrdinary.Enter (this.playOrdinary.statusFailed);
        jiang.mgrUI.Close (this._idView);
    }

    OnDisplay(): void {
        VoiceOggViewState.inst.VoiceSet (DefineVoice.FAIL_1);
    }
}