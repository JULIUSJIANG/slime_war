import jiang from "../../../frame/global/Jiang";
import gameCommon from "../../GameCommon";
import DefineVoice from "../../game_element/body/DefineVoice";
import MBPlayer from "../../game_element/body/logic_3031/MBPlayer";
import GamePlayView from "../game_play/GamePlayView";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import GuideMgrStatus from "./GuideMgrStatus";

/**
 * 新手引导 - 状态 - 等待攻击
 */
export default class GuideMgrStatusP1U5Atk extends GuideMgrStatus {
    /**
     * 时间缩放的应用 id
     */
    private _timeScaleAppId;

    public OnEnter(): void {
        this.relMgr.dmgAble++;
        this._timeScaleAppId = this.relMgr.gamePlayViewState.playMachine.gameState.ApplyTimeScale (0);
        this.relMgr.guideTipsTxt = `注意！长按时自动连发`;
        this.relMgr.guideTipsPosX = 50;
        VoiceOggViewState.inst.VoiceSet (DefineVoice.GUIDE_TIPS_POP);
    }

    public OnExit(): void {
        this.relMgr.gamePlayViewState.playMachine.gameState.CancelTimeScale (this._timeScaleAppId);
    }

    public P1U2OnBtnAimTouchStart (com: GamePlayView, pos: cc.Event.EventTouch) {
        let mbPlayer = this.relMgr.gamePlayViewState.playMachine.gameState.player.commonBehaviour as MBPlayer;
        mbPlayer.playerMgrEquipment.machine.currStatus.OnFire (
            mbPlayer.playerEquipPos.x + mbPlayer.playerMgrEquipment.aimVec.x,
            mbPlayer.playerEquipPos.y + mbPlayer.playerMgrEquipment.aimVec.y,
        );
        mbPlayer.playerMgrEquipment.machine.currStatus.OnStep (0);
        mbPlayer.playerMgrEquipment.machine.currStatus.OnArmo ();
        // 进入下一个引导状态
        this.relMgr.EnterStatus (this.relMgr.statusP1U6Warning);
        super.P1U2OnBtnAimTouchStart (com, pos);
    }

    public P1U2OnGamePlayViewStyle () {
        this.relMgr.gamePlayView.containerEquipmentList.active = false;
        this.relMgr.gamePlayView.btnForward.node.active = false;
        this.relMgr.gamePlayView.btnOptions.node.active = false;
        this.relMgr.gamePlayView.nodeHp.active = false;
    }
}