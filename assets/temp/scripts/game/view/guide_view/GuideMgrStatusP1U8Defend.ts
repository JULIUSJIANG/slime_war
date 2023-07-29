import utilNode from "../../../frame/basic/UtilNode";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import gameCommon from "../../GameCommon";
import DefineVoice from "../../game_element/body/DefineVoice";
import MBPlayer from "../../game_element/body/logic_3031/MBPlayer";
import GamePlayView from "../game_play/GamePlayView";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import GuideMgrStatus from "./GuideMgrStatus";

/**
 * 新手引导管理器 - 状态 - 格挡
 */
export default class GuideMgrStatusP1U8Defend extends GuideMgrStatus {

    public OnMaskDisplay(): boolean {
        return true;
    }

    /**
     * 时间缩放的应用 id
     */
    private _timeScaleAppId;

    public OnEnter(): void {
        let mbPlayer = this.relMgr.gamePlayViewState.playMachine.gameState.player.commonBehaviour as MBPlayer;
        // 有可能正在开火，所以记得收火
        mbPlayer.playerMgrEquipment.machine.currStatus.OnArmo();
        mbPlayer.playerMgrDefendCD.opacitySkill = 255;
        this._timeScaleAppId = this.relMgr.gamePlayViewState.playMachine.gameState.ApplyTimeScale (0);
        utilNode.SetGroup (this.relMgr.gamePlayView.btnForward.node, gameCommon.GROUP_IDX_GUIDE);
        this.relMgr.guideTipsTxt = `有危险！快格挡！`;
        this.relMgr.guideTipsPosX = 300 + 50;
        VoiceOggViewState.inst.VoiceSet (DefineVoice.GUIDE_TIPS_POP);
    }

    public OnExit(): void {
        this.relMgr.gamePlayViewState.playMachine.gameState.CancelTimeScale (this._timeScaleAppId);
    }

    public P1U2OnBtnAimTouchStart(com: GamePlayView, pos: cc.Event.EventTouch): void {
        
    }
    public P1U2OnBtnAimTouchMove(com: GamePlayView, pos: cc.Event.EventTouch): void {
        
    }
    public P1U2OnBtnAimTouchEnd(com: GamePlayView, pos: cc.Event.EventTouch): void {
        
    }
    public P1U2OnDraw(): void {
        
    }

    public P1U8OnBtnDefendTouched(): void {
        utilNode.SetGroup (this.relMgr.gamePlayView.btnForward.node, gameCommon.GROUP_IDX_UI);
        this.relMgr.EnterStatus (this.relMgr.statusP1U9WarningAgain);
    }
    public P1U2OnGamePlayViewStyle () {
        this.relMgr.gamePlayView.containerEquipmentList.active = false;
        this.relMgr.gamePlayView.btnForward.node.active = true;
        this.relMgr.gamePlayView.btnOptions.node.active = false;
        this.relMgr.gamePlayView.nodeHp.active = false;
    }
}