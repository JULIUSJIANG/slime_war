import indexBuildConfig from "../../../IndexBuildConfig";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import MBPlayer from "../../game_element/body/logic_3031/MBPlayer";
import GamePlayView from "../game_play/GamePlayView";
import GamePlayViewState from "../game_play/GamePlayViewState";
import GuideMgr from "./GuideMgr";
import GuideMgrStatusIdle from "./GuideMgrStatusIdle";

/**
 * 新手引导管理器 - 状态
 */
export default abstract class GuideMgrStatus {
    /**
     * 归属的引导管理器
     */
    public relMgr: GuideMgr;

    public constructor (relMgr: GuideMgr) {
        this.relMgr = relMgr;
    }

    /**
     * 事件派发 - 进入状态
     */
    public OnEnter () {

    }

    /**
     * 事件派发 - 离开状态
     */
    public OnExit () {

    }

    /**
     * 事件派发 - 一切已初始化完成
     */
    public OnInited () {

    }

    /**
     * 相关内容是否需要展示
     */
    public OnMaskDisplay () {
        return false;
    }

    /**
     * 事件派发 - 捕获到开始界面按钮
     * @param evter 
     */
    public P1U1OnGotNodeIndexViewBtnStart (evter: ComponentNodeEventer) {

    }
    /**
     * 事件派发 - 按下了开始界面的按钮
     * @param evter 
     */
    public P1U1OnGotNodeIndexViewBtnStartTouch (evter: ComponentNodeEventer) {

    }

    /**
     * 事件派发 - 瞄准按钮 - 按下
     * @returns 
     */
    public P1U2OnBtnAimTouchStart (com: GamePlayView, pos: cc.Event.EventTouch) {
        let mbPlayer = this.relMgr.gamePlayViewState.playMachine.gameState.player.commonBehaviour as MBPlayer;
        this.relMgr.gamePlayViewState.firePos.x = pos.getLocationX();
        this.relMgr.gamePlayViewState.firePos.y = pos.getLocationY();
        GamePlayView.CallFired(mbPlayer, com, this.relMgr.gamePlayViewState);
    }
    /**
     * 事件派发 - 瞄准按钮 - 拖动
     * @returns 
     */
    public P1U2OnBtnAimTouchMove (com: GamePlayView, pos: cc.Event.EventTouch) {
        let locX = pos.getLocationX();
        let locY = pos.getLocationY();
        this.relMgr.gamePlayViewState.firePos.x = locX;
        this.relMgr.gamePlayViewState.firePos.y = locY;
    }
    /**
     * 事件派发 - 瞄准按钮 - 抬起
     * @returns 
     */
    public P1U2OnBtnAimTouchEnd (com: GamePlayView, pos: cc.Event.EventTouch) {
        let mbPlayer = this.relMgr.gamePlayViewState.playMachine.gameState.player.commonBehaviour as MBPlayer;
        mbPlayer.playerMgrEquipment.machine.currStatus.OnArmo();
    }
    /**
     * 刷新样式
     */
    public P1U2OnGamePlayViewStyle () {
        this.relMgr.gamePlayView.containerEquipmentList.active = true;
        this.relMgr.gamePlayView.btnForward.node.active = !indexBuildConfig.HIDE_UI;
        this.relMgr.gamePlayView.btnOptions.node.active = true;
        this.relMgr.gamePlayView.nodeHp.active = true;
    }

    /**
     * 事件派发 - 战斗核心时间步进
     * @param ms 
     */
    public P1U2OnGameCoreStep (ms: number) {

    }

    /**
     * 绘制轨迹提示
     */
    public P1U2OnDraw () {
        let mbPlayer = this.relMgr.gamePlayViewState.playMachine.gameState.player.commonBehaviour as MBPlayer;
        mbPlayer.playerMgrEquipment.machine.currStatus.OnDraw (this.relMgr.gamePlayView.drawer);
    }

    /**
     * 事件派发 - 点击了装备按钮
     */
    public P1U5OnBtnEquipmentTouched () {

    }

    /**
     * 收到史莱姆警告
     */
    public P1U6OnBodyWarning () {

    }

    /**
     * 事件派发 - 按下了格挡按钮
     * @param evter 
     */
    public P1U8OnBtnDefendTouched () {

    }
}