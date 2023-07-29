import GamePlayView from "../game_play/GamePlayView";
import GuideMgrStatus from "./GuideMgrStatus";

/**
 * 新手引导管理器 - 状态 - 等候警告
 */
export default class GuideMgrStatusP1U6Warning extends GuideMgrStatus {
    
    public P1U6OnBodyWarning(): void {
        this.relMgr.EnterStatus (this.relMgr.statusP1U7Wait);
    }
    public P1U2OnGamePlayViewStyle () {
        this.relMgr.gamePlayView.containerEquipmentList.active = false;
        this.relMgr.gamePlayView.btnForward.node.active = false;
        this.relMgr.gamePlayView.btnOptions.node.active = false;
        this.relMgr.gamePlayView.nodeHp.active = false;
    }
}