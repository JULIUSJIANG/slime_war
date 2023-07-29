import gameCommon from "../../GameCommon";
import GameElementBody from "../../game_element/body/GameElementBody";
import GamePlayView from "../game_play/GamePlayView";
import GuideMgrStatus from "./GuideMgrStatus";

/**
 * 新手引导管理器 - 状态 - 引导等候
 */
export default class GuideMgrStatusP1U4Wait extends GuideMgrStatus {

    public P1U2OnGameCoreStep (ms: number): void {
        let distanceMax = null;
        let gameState = this.relMgr.gamePlayViewState.playMachine.gameState;
        let friendCount = 0;
        gameState.GetTypeAllEle (GameElementBody).forEach ((ele) => {
            if (ele.commonArgsCamp != gameCommon.ENEMY_CAMP) {
                friendCount++;
                return;
            };
            let distance = ele.commonFootPos.x - gameState.player.commonFootPos.x;
            if (distanceMax == null || distanceMax < distance) {
                distanceMax = distance;
            };
        });
        if (friendCount == 1 && distanceMax != null && distanceMax < 395) {
            this.relMgr.EnterStatus (this.relMgr.statusP1U5Atk);
        };
    }

    public P1U2OnBtnAimTouchStart(com: GamePlayView, pos: cc.Event.EventTouch): void {
        
    }
    public P1U2OnBtnAimTouchMove(com: GamePlayView, pos: cc.Event.EventTouch): void {
        
    }
    public P1U2OnBtnAimTouchEnd(com: GamePlayView, pos: cc.Event.EventTouch): void {
        
    }
    public P1U2OnGamePlayViewStyle () {
        this.relMgr.gamePlayView.containerEquipmentList.active = false;
        this.relMgr.gamePlayView.btnForward.node.active = false;
        this.relMgr.gamePlayView.btnOptions.node.active = false;
        this.relMgr.gamePlayView.nodeHp.active = false;
    }
}