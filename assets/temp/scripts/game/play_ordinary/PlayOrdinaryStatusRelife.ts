import UtilObjPool from "../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../frame/basic/UtilObjPoolType";
import jiang from "../../frame/global/Jiang";
import gameCommon from "../GameCommon";
import DefineVoice from "../game_element/body/DefineVoice";
import GameElementBody from "../game_element/body/GameElementBody";
import GameElementBodyCtxDmg from "../game_element/body/GameElementBodyCtxDmg";
import GameElementBodyCtxDmgType from "../game_element/body/GameElementBodyCtxDmgType";
import MBPlayer from "../game_element/body/logic_3031/MBPlayer";
import GameElementEff from "../game_element/common/GameElementEff";
import EquipmentInstRS from "../game_element/equipment/EquipmentInstRS";
import GameOptionsViewState from "../view/game_options/GameOptionsViewState";
import LockViewState from "../view/lock_view/LockViewState";
import SecondsView from "../view/seconds_view/SecondsView";
import SecondsViewState from "../view/seconds_view/SecondsViewState";
import VideoCertainView from "../view/video_certain_view/VideoCertainView";
import VideoCertainViewState from "../view/video_certain_view/VideoCertainViewState";
import VideoRelifeView from "../view/video_relife_view/VideoRelifeView";
import VideoRelifeViewState from "../view/video_relife_view/VideoRelifeViewState";
import VoiceOggViewState from "../view/voice_ogg/VoiceOggViewState";
import PlayOrdinary from "./PlayOrdinary";
import PlayOrdinaryStatus from "./PlayOrdinaryStatus";

const APP = `PlayOrdinaryStatusRelife`;

export default class PlayOrdinaryStatusRelife extends PlayOrdinaryStatus {

    private constructor () {super();}

    private static _t = new UtilObjPoolType<PlayOrdinaryStatusRelife>({
        instantiate: () => {
            return new PlayOrdinaryStatusRelife ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relMachine: PlayOrdinary) {
        let val = UtilObjPool.Pop (PlayOrdinaryStatusRelife._t, apply);
        val.relMachine = relMachine;
        return val;
    }

    private _timeScaleAppId: number;

    public OnEnter(): void {
        this._timeScaleAppId = this.relMachine.gameState.ApplyTimeScale (0);

        let state = VideoCertainViewState.Pop (APP, `观看视频，释放全屏高伤害冲击波并复活`);
        jiang.mgrUI.Open (
            VideoCertainView.nodeType,
            state
        );
        Promise.resolve ()
            .then (() => {
                return state.ctrl._promise;
            })
            .then ((yes) => {
                if (!yes) {
                    this.relMachine.Enter (this.relMachine.statusFailed);
                    return;
                };
                let stateSeconds = SecondsViewState.Pop (APP);
                jiang.mgrUI.Open (
                    SecondsView.nodeType,
                    stateSeconds
                );
                return new Promise ((resolve) => {
                    stateSeconds._evterDestory.On (resolve);
                })
                    .then (() => {
                        this.relMachine.Enter (this.relMachine.statusPlaying);
                        let mbPlayer = this.relMachine.gameState.player.commonBehaviour as MBPlayer;
                        mbPlayer.playerMgrHealth.machine.relMgrHealth.relNpc.relBody.commonHpCurrent += 1;
                        mbPlayer.playerMgrHealth.machine.Enter (mbPlayer.playerMgrHealth.machine.statusHurted);
                        GameElementEff.PopForXYBind (
                            APP,
                            mbPlayer.relBody.commonCenterPos.x,
                            mbPlayer.relBody.commonCenterPos.y,
                            0,
                            1,
                            10003,
                            cc.Color.WHITE,
                            this.relMachine.gameState.player
                        );
                        VoiceOggViewState.inst.VoiceSet (DefineVoice.CLEAR_SCREEN);
                        let listBody = this.relMachine.gameState.GetTypeAllEle (GameElementBody);
                        let listClone: Array <GameElementBody> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                        listClone.push (...listBody);
                        let dmgStandard = EquipmentInstRS.GetSingleDmgByPower (gameCommon.STANDARD_EQUIP, mbPlayer.playerMgrEquipment.equipInst.power);
                        let repelStandard = EquipmentInstRS.GetSingleRepel (gameCommon.STANDARD_EQUIP);
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
                            let hpMax = listCloneI.commonHpMax || 0;
                            listCloneI.commonEvterDmg.Call (GameElementBodyCtxDmg.Pop (
                                APP,
                                {
                                    dmg: Math.max (dmgStandard, hpMax / 5),
                                    posX: listCloneI.commonCenterPos.x,
                                    posY: listCloneI.commonCenterPos.y,
                                
                                    repel: repelStandard,
                                    norX: 1,
                                    norY: 1,
                                
                                    type: GameElementBodyCtxDmgType.shield
                                }
                            ))
                        };
                    });
            });
    }

    public OnExit(): void {
        this.relMachine.gameState.CancelTimeScale(this._timeScaleAppId);
    }
}