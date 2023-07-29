import IndexLayer from "../../../IndexLayer";
import IndexDataModule from "../../../IndexDataModule";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import ViewState from "../../../frame/ui/ViewState";
import GuideMgrStatus from "./GuideMgrStatus";
import GuideMgrStatusP1U1TouchStart from "./GuideMgrStatusP1U1TouchStart";
import GuideMgrStatusIdle from "./GuideMgrStatusIdle";
import GuideMgrStatusP1U2Wait from "./GuideMgrStatusP1U2Wait";
import GuideMgrStatusP1U3Atk from "./GuideMgrStatusP1U3Atk";
import GamePlayViewState from "../game_play/GamePlayViewState";
import GuideMgrStatusP1U6Warning from "./GuideMgrStatusP1U6Warning";
import GamePlayView from "../game_play/GamePlayView";
import GuideMgrStatusP1U8Defend from "./GuideMgrStatusP1U8Defend";
import GuideMgrStatusP1U9WarningAgain from "./GuideMgrStatusP1U9WarningAgain";
import GuideMgrStatusP1U11DefendAgain from "./GuideMgrStatusP1U11DefendAgain";
import GuideMgrStatusP1U7Wait from "./GuideMgrStatusP1U7Wait";
import GuideMgrStatusP1U10Wait from "./GuideMgrStatusP1U10Wait";
import GuideMgrStatusP1U4Wait from "./GuideMgrStatusP1U4Wait";
import GuideMgrStatusP1U5Atk from "./GuideMgrStatusP1U5Atk";
import GamePlayViewEquipmentBtn from "../game_play/GamePlayViewEquipmentBtn";

/**
 * 新手引导管理器
 */
export default class GuideMgr extends ViewState {
    
    static inst = new GuideMgr ();

    /**
     * 远程武器可伤害次数
     */
    dmgAble = 0;

    private constructor () {
        super (
            IndexLayer.SYSTEM,
            ViewState.BG_TYPE.NONE,
            false
        );
        this.statusIdle = new GuideMgrStatusIdle (this);
        this.statusP1U1TouchStart = new GuideMgrStatusP1U1TouchStart (this);
        this.statusP1U2Wait = new GuideMgrStatusP1U2Wait (this);
        this.statusP1U3Atk = new GuideMgrStatusP1U3Atk (this);
        this.statusP1U4Wait = new GuideMgrStatusP1U4Wait (this);
        this.statusP1U5Atk = new GuideMgrStatusP1U5Atk (this);
        this.statusP1U6Warning = new GuideMgrStatusP1U6Warning (this);
        this.statusP1U7Wait = new GuideMgrStatusP1U7Wait (this);
        this.statusP1U8Defend = new GuideMgrStatusP1U8Defend (this);
        this.statusP1U9WarningAgain = new GuideMgrStatusP1U9WarningAgain (this);
        this.statusP1U10Wait = new GuideMgrStatusP1U10Wait (this);
        this.statusP1U11DefendAgain = new GuideMgrStatusP1U11DefendAgain (this);
        this.EnterStatus (this.statusIdle);
    }

    /**
     * 状态 - 待机
     */
    public statusIdle: GuideMgrStatusIdle;

    /**
     * 状态 - 引导点击
     */
    public statusP1U1TouchStart: GuideMgrStatusP1U1TouchStart;
    /**
     * 状态 - 等候
     */
    public statusP1U2Wait: GuideMgrStatusP1U2Wait;
    /**
     * 状态 - 攻击
     */
    public statusP1U3Atk: GuideMgrStatusP1U3Atk;
    /**
     * 状态 - 等待
     */
    public statusP1U4Wait: GuideMgrStatusP1U4Wait;
    /**
     * 状态 - 攻击
     */
    public statusP1U5Atk: GuideMgrStatusP1U5Atk;
    /**
     * 状态 - 警告
     */
    public statusP1U6Warning: GuideMgrStatusP1U6Warning;
    /**
     * 状态 - 警告 - 等待
     */
    public statusP1U7Wait: GuideMgrStatusP1U7Wait;
    /**
     * 状态 - 格挡
     */
    public statusP1U8Defend: GuideMgrStatusP1U8Defend;
    /**
     * 状态 - 再次警告
     */
    public statusP1U9WarningAgain: GuideMgrStatusP1U9WarningAgain;
    /**
     * 状态 - 再次警告 - 等待
     */
    public statusP1U10Wait: GuideMgrStatusP1U10Wait;
    /**
     * 状态 - 再次格挡
     */
    public statusP1U11DefendAgain: GuideMgrStatusP1U11DefendAgain;

    /**
     * 当前状态
     */
    currStatus: GuideMgrStatus;

    /**
     * 进入状态
     * @param status 
     */
    public EnterStatus (status: GuideMgrStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        this.guideTipsTxt = null;
        if (rec) {
            rec.OnExit ();
        };
        this.currStatus.OnEnter ();
        jiang.mgrUI.ModuleRefresh (IndexDataModule.GUIDE);
    }

    /**
     * 具体的游戏界面
     */
    public gamePlayView: GamePlayView;
    /**
     * 捕获游戏界面
     * @param gamePlayView 
     */
    public CatchGamePlayView (gamePlayView: GamePlayView) {
        this.gamePlayView = gamePlayView;
    }

    /**
     * 当前需要控制的战斗界面状态
     */
    public gamePlayViewState: GamePlayViewState;
    /**
     * 捕获界面状态
     * @param state 
     */
    public CatchGamePlayViewState (state: GamePlayViewState) {
        this.gamePlayViewState = state;
    }

    /**
     * 装备按钮
     */
    public gamePlayViewEquipmentBtn: GamePlayViewEquipmentBtn;
    /**
     * 捕获主场景的装备按钮
     * @param evter 
     */
    public CatchGamePlayViewEquipmentBtn (btn: GamePlayViewEquipmentBtn) {
        this.gamePlayViewEquipmentBtn = btn;
    }

    /**
     * 提示信息
     */
    private _guideTipsTxt: string;
    get guideTipsTxt () {
        return this._guideTipsTxt;
    }
    set guideTipsTxt (val: string) {
        this._guideTipsTxt = val;
        jiang.mgrUI.ModuleRefresh (IndexDataModule.GUIDE);
    }

    /**
     * 提示的位置 x
     */
    private _guideTipsPosX: number;
    get guideTipsPosX () {
        return this._guideTipsPosX;
    }
    set guideTipsPosX (val: number) {
        this._guideTipsPosX = val;
        jiang.mgrUI.ModuleRefresh (IndexDataModule.GUIDE);
    }
}