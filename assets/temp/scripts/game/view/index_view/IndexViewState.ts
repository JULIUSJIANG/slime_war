import IndexDataModule from "../../../IndexDataModule";
import IndexLayer from "../../../IndexLayer";
import jiang from "../../../frame/global/Jiang";
import ViewState from "../../../frame/ui/ViewState";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import indexLoading from "../../../IndexLoading";
import EquipmentViewState from "../equipment_view/EquipmentViewState";
import SettingViewState from "../setting/SettingViewState";
import IndexViewRS from "./IndexViewRS";
import ChallengeSelectViewState from "../challenge_select_view/ChallengeSelectViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import StoreViewState from "../store_view/StoreViewState";
import LotteryViewState from "../lottery_view/LotteryViewState";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import IndexViewStateStatus from "./IndexViewStateStatus";
import IndexViewStateStatusIdle from "./IndexViewStateStatusIdle";
import IndexViewStateStatusMoving from "./IndexViewStateStatusMoving";
import indexDataStorageItem from "../../../IndexStorageItem";
import DefineVoice from "../../game_element/body/DefineVoice";
import ShareViewState from "../share_view/ShareViewState";

const APP = `IndexViewState`;

/**
 * 根界面状态
 */
export default class IndexViewState extends ViewState {
    private constructor () {
        super(
            IndexLayer.GAME, 
            ViewState.BG_TYPE.SELF, 
            false
        );
    }

    private static _t = new UtilObjPoolType<IndexViewState> ({
        instantiate: () => {
            return new IndexViewState();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        let val = UtilObjPool.Pop(IndexViewState._t, apply);
        val.statusIdle = IndexViewStateStatusIdle.Pop (APP, val);
        val.statusMoving = IndexViewStateStatusMoving.Pop (APP, val);
        val.EnterStatus (val.statusIdle);
        indexLoading.promiseAllLoad._promise.then(() => {
            // 设置背景音乐
            VoiceOggViewState.inst.BgmSet(DefineVoice.BGM_TITLE);
            for (let i = 0; i < IndexViewRS.listInst.length; i++) {
                IndexViewRS.listInst[i].init(val);
            };
        });
        return val;
    }

    /**
     * 时间监听
     */
    private _msListen: number;

    /**
     * 秒刷新监听
     */
    private _secondListen: number;

    OnInit(): void {
        this._msListen = jiang.mgrEvter.evterUpdate.On((ms) => {
            this.currStatus.OnStep (ms);
            for (let i = 0; i < IndexViewRS.listInst.length; i++) {
                IndexViewRS.listInst[i].onUpdate(this, ms);
            };
        });
        this._secondListen = jiang.mgrEvter.evterSecondUpdate.On(() => {
            jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_MAIN);
        });
    }

    OnDestory(): void {
        jiang.mgrEvter.evterUpdate.Off (this._msListen);
        jiang.mgrEvter.evterSecondUpdate.Off (this._secondListen);
    }

    OnChange(module: IndexDataModule): void {
        if (this.stateEquip) {
            this.stateEquip.OnChange (module);
        };
        if (this.stateLottery) {
            this.stateLottery.OnChange (module);
        };
        if (this.stateStore) {
            this.stateStore.OnChange (module);
        };
        if (this.stateShare) {
            this.stateShare.OnChange (module);
        };
    }

    /**
     * 界面状态 - 挑战
     */
    stateChallenge: ChallengeSelectViewState;
    /**
     * 界面状态 - 装备
     */
    stateEquip: EquipmentViewState;
    /**
     * 界面状态 - 商店
     */
    stateStore: StoreViewState;
    /**
     * 界面状态 - 乐透
     */
    stateLottery: LotteryViewState;
    /**
     * 界面状态 - 设置
     */
    stateSetting: SettingViewState;
    /**
     * 界面状态 - 分享
     */
    stateShare: ShareViewState;

    /**
     * 当前状态
     */
    public currStatus: IndexViewStateStatus;
    /**
     * 状态 - 待机
     */
    public statusIdle: IndexViewStateStatusIdle;
    /**
     * 状态 - 切换中
     */
    public statusMoving: IndexViewStateStatusMoving;
    /**
     * 进入状态
     * @param status 
     */
    public EnterStatus (status: IndexViewStateStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.currStatus.OnEnter ();
    }
}