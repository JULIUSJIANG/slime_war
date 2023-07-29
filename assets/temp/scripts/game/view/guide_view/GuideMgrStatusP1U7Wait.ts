import GamePlayView from "../game_play/GamePlayView";
import GuideMgrStatus from "./GuideMgrStatus";

/**
 * 新手引导管理器 - 状态 - 引导等候
 */
export default class GuideMgrStatusP1U7Wait extends GuideMgrStatus {

    private _countStep = 0;

    public OnEnter(): void {
        this._countStep = 0;
    }

    public P1U2OnGameCoreStep (ms: number): void {
        this._countStep += ms;
        if (1000 < this._countStep) {
            this.relMgr.EnterStatus (this.relMgr.statusP1U8Defend);
        };
    }

    public P1U2OnGamePlayViewStyle () {
        this.relMgr.gamePlayView.containerEquipmentList.active = false;
        this.relMgr.gamePlayView.btnForward.node.active = false;
        this.relMgr.gamePlayView.btnOptions.node.active = false;
        this.relMgr.gamePlayView.nodeHp.active = false;
    }
}