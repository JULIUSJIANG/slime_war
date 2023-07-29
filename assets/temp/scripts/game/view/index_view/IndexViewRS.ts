import UtilObjPool from "../../../frame/basic/UtilObjPool";
import CfgScene from "../../../frame/config/src/CfgScene";
import jiang from "../../../frame/global/Jiang";
import UINode from "../../../frame/ui/UINode";
import indexBuildConfig from "../../../IndexBuildConfig";
import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import ChallengeSelectView from "../challenge_select_view/ChallengeSelectView";
import ChallengeSelectViewState from "../challenge_select_view/ChallengeSelectViewState";
import EquipmentView from "../equipment_view/EquipmentView";
import EquipmentViewState from "../equipment_view/EquipmentViewState";
import LoadingView from "../loading_view/LoadingView";
import LoadingViewState from "../loading_view/LoadingViewState";
import LotteryView from "../lottery_view/LotteryView";
import LotteryViewState from "../lottery_view/LotteryViewState";
import SettingView from "../setting/SettingView";
import SettingViewState from "../setting/SettingViewState";
import ShareView from "../share_view/ShareView";
import ShareViewState from "../share_view/ShareViewState";
import StoreView from "../store_view/StoreView";
import StoreViewState from "../store_view/StoreViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import IndexViewState from "./IndexViewState";

const APP = `IndexViewRS`;

/**
 * 根界面的注册信息
 */
class IndexViewRS {
    /**
     * 标识
     */
    id: number;

    /**
     * 名字
     */
    name: string;

    /**
     * 初始化
     */
    init: (state: IndexViewState) => void;

    /**
     * 填充内容
     */
    fill: (state: IndexViewState, listNode: Array<UINode>) => void;

    /**
     * 进入
     */
    onEnter: (state: IndexViewState) => void;
    /**
     * 离开
     */
    onExit: (state: IndexViewState) => void;
    /**
     * 匹配完毕
     */
    onMatch: (state: IndexViewState) => void;
    /**
     * 取消匹配
     */
    onUnMatch: (state: IndexViewState) => void;
    /**
     * 刷新中
     */
    onUpdate: (state: IndexViewState, ms: number) => void;
    /**
     * 合法性检查
     */
    validCheck: () => boolean;
    /**
     * 红点检查
     */
    redCheck: () => boolean;

    public constructor (args: {
        id: number,
        name: string,
        init: (state: IndexViewState) => void,
        fill: (state: IndexViewState, listNode: Array<UINode>) => void,
        onEnter: (state: IndexViewState) => void,
        onExit: (state: IndexViewState) => void,
        onMatch: (state: IndexViewState) => void,
        onUnMatch: (state: IndexViewState) => void,
        onUpdate: (state: IndexViewState, ms: number) => void,
        validCheck: () => boolean,
        redCheck: () => boolean
    })
    {
        this.id = args.id;
        this.name = args.name;
        this.init = args.init;
        this.fill = args.fill;

        this.onEnter = args.onEnter;
        this.onExit = args.onExit;
        this.onMatch = args.onMatch;
        this.onUnMatch = args.onUnMatch;
        this.onUpdate = args.onUpdate;
        this.validCheck = args.validCheck;
        this.redCheck = args.redCheck;

        // 没有通过合法性检查的话，相当于不存在
        if (!this.validCheck ()) {
            return;
        };

        IndexViewRS.mapInst.set(this.id, this);
        IndexViewRS.listInst.push(this);
    }
}

namespace IndexViewRS {
    /**
     * 实例的字典记录
     */
    export const mapInst: Map<number, IndexViewRS> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    /**
     * 实例的列表记录
     */
    export const listInst: Array<IndexViewRS> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);

    /**
     * 快速开始
     */
    export const fightQuick = new IndexViewRS({
        id: 1,
        name: `开始`,
        init: (state) => {

        },
        fill: (state, listNode) => {

        },
        onEnter: (state: IndexViewState) => {

        },
        onExit: (state: IndexViewState) => {

        },
        onMatch: (state: IndexViewState) => {

        },
        onUnMatch: (state: IndexViewState) => {

        },
        onUpdate: (state: IndexViewState) => {

        },
        validCheck: () => {
            return true;
        },
        redCheck: () => {
            return false
        }
    });

    /**
     * 挑战界面
     */
    export const challenge = new IndexViewRS({
        id: 2,
        name: `图鉴`,
        init: (state) => {
            state.stateChallenge = ChallengeSelectViewState.Pop(APP);
        },
        fill: (state, listNOde) => {
            listNOde.push(ChallengeSelectView.nodeType.CreateNode(
                state,
                challenge.id,
                challenge.id
            ));
        },
        onEnter: (state: IndexViewState) => {
            let cfgTheme = jiang.mgrCfg.cfgScene.select (CfgScene.idGetter, jiang.mgrData.Get (indexDataStorageItem.selectedChapter))._list [0];
            VoiceOggViewState.inst.BgmSet (cfgTheme.bgm);

            let focusEle = state.stateChallenge.chapterLayout._idToEleMap.get(jiang.mgrData.Get(indexDataStorageItem.selectedChapter));
            state.stateChallenge.chapterScrollViewY = focusEle.posY - ChallengeSelectViewState.CHAPTER_VIEW_HEIGHT / 2 + ChallengeSelectViewState.CHAPTER_ITEM_HEIGHT / 2;
            let minY = 0;
            let maxY = state.stateChallenge.chapterLayout.containerHeight - ChallengeSelectViewState.CHAPTER_VIEW_HEIGHT;
            state.stateChallenge.chapterScrollViewY = Math.max(state.stateChallenge.chapterScrollViewY, minY);
            state.stateChallenge.chapterScrollViewY = Math.min(state.stateChallenge.chapterScrollViewY, maxY);
            state.stateChallenge.chapterLayout.UpdateActive(
                0,
                state.stateChallenge.chapterScrollViewY,
                ChallengeSelectViewState.CHAPTER_VIEW_WIDTH,
                ChallengeSelectViewState.CHAPTER_VIEW_HEIGHT
            );

            state.stateChallenge.bookScrollViewY = state.stateChallenge.bookLayout.containerHeight - ChallengeSelectViewState.BOOK_VIEW_HEIGHT;
            state.stateChallenge.bookLayout.UpdateActive (
                0,
                state.stateChallenge.bookScrollViewY,
                ChallengeSelectViewState.BOOK_VIEW_WIDTH,
                ChallengeSelectViewState.BOOK_VIEW_HEIGHT
            );

            // 开启滚动惯性
            jiang.mgrUI.ModuleRefresh(IndexDataModule.INDEXVIEW_CHALLENGE);
        },
        onExit: (state: IndexViewState) => {
            state.stateChallenge.scrollStop.currStatus.OnStop ();
            // 关闭滚动惯性
            jiang.mgrUI.ModuleRefresh(IndexDataModule.INDEXVIEW_CHALLENGE);
        },
        onMatch: (state: IndexViewState) => {
            state.stateChallenge.childrenAble = true;
        },
        onUnMatch: (state: IndexViewState) => {
            state.stateChallenge.childrenAble = false;
        },
        onUpdate: (state: IndexViewState) => {

        },
        validCheck: () => {
            return true;
        },
        redCheck: () => {
            return false
        }
    });

    /**
     * 乐透界面
     */
    export const lotteryView = new IndexViewRS({
        id: 3,
        name: `强化`,
        init: (state) => {
            state.stateLottery = LotteryViewState.Pop (APP);
        },
        fill: (state, listNode) => {
            listNode.push (LotteryView.nodeType.CreateNode(
                state,
                lotteryView.id,
                lotteryView.id
            ));
        },
        onEnter: (state: IndexViewState) => {
            state.stateLottery.childrenAble = true;
        },
        onExit: (state: IndexViewState) => {
            state.stateLottery.childrenAble = false;
        },
        onMatch: (state: IndexViewState) => {

        },
        onUnMatch: (state: IndexViewState) => {

        },
        onUpdate: (state: IndexViewState, ms: number) => {
            if (state.stateLottery != null) {
                state.stateLottery.OnStep (ms);
            };
        },
        validCheck: () => {
            return true;
        },
        redCheck: () => {
            return false
        }
    });

    /**
     * 商店界面
     */
    export const storeView = new IndexViewRS({
        id: 4,
        name: `飞升`,
        init: (state) => {
            state.stateStore = StoreViewState.Pop (APP);
        },
        fill: (state, listNode) => {
            listNode.push (StoreView.nodeType.CreateNode(
                state,
                storeView.id,
                storeView.id
            ));
        },
        onEnter: (state: IndexViewState) => {
            state.stateStore.scrollY = state.stateStore.layout.containerHeight - StoreViewState.VIEW_HEIGHT;
            state.stateStore.layout.UpdateActive (
                0,
                state.stateStore.scrollY,
                StoreViewState.VIEW_WIDTH,
                StoreViewState.VIEW_HEIGHT
            );
            state.stateStore.scrollEnable = true;
            jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_STORE);
        },
        onExit: (state: IndexViewState) => {
            state.stateStore.scrollEnable = false;
            jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_STORE);
        },
        onMatch: (state: IndexViewState) => {
            state.stateStore.childrenAble = true;
        },
        onUnMatch: (state: IndexViewState) => {
            state.stateStore.childrenAble = false;
        },
        onUpdate: (state: IndexViewState) => {

        },
        validCheck: () => {
            return indexBuildConfig.VIDEO_ENABLE;
        },
        redCheck: () => {
            return false
        }
    });

    /**
     * 装备
     */
    export const equip = new IndexViewRS({
        id: 5,
        name: `背包`,
        init: (state) => {
            state.stateEquip = EquipmentViewState.Pop(APP);
        },
        fill: (state, listNode) => {
            listNode.push(EquipmentView.nodeType.CreateNode(
                state,
                equip.id,
                equip.id
            ));
        },
        onEnter: (state: IndexViewState) => {
            state.stateEquip.scrollY = state.stateEquip.layout.containerHeight - EquipmentViewState.VIEW_HEIGHT;
            state.stateEquip.scrollEnable = true;
            jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_EQUIP);
        },
        onExit: (state: IndexViewState) => {

        },
        onMatch: (state: IndexViewState) => {
            state.stateEquip.childrenAble = true;
        },
        onUnMatch: (state: IndexViewState) => {
            state.stateEquip.childrenAble = false;
        },
        onUpdate: (state: IndexViewState) => {
            
        },
        validCheck: () => {
            return true;
        },
        redCheck: () => {
            let listBackpack = jiang.mgrData.Get (indexDataStorageItem.listBackpackProp);
            for (let i = 0; i < listBackpack.length; i++) {
                let listBackpackI = listBackpack [i];
                if (!listBackpackI.isRead) {
                    return true;
                };
            };
            let listEquip = jiang.mgrData.Get (indexDataStorageItem.listEquipment);
            for (let i = 0; i < listEquip.length; i++) {
                let lisstEquipI = listEquip [i];
                if (!lisstEquipI.isRead) {
                    return true;
                };
            };
            return false;
        }
    });

    /**
     * 设置界面
     */
    export const setting = new IndexViewRS({
        id: 6,
        name: `设置`,
        init: (state) => {
            state.stateSetting = SettingViewState.Pop(APP);
        },
        fill: (state, listNode) => {
            listNode.push(SettingView.nodeType.CreateNode(
                state,
                setting.id,
                setting.id
            ));
        },
        onEnter: (state: IndexViewState) => {
            
        },
        onExit: (state: IndexViewState) => {

        },
        onMatch: (state: IndexViewState) => {
            state.stateSetting.childrenAble = true;
        },
        onUnMatch: (state: IndexViewState) => {

        },
        onUpdate: (state: IndexViewState) => {
            
        },
        validCheck: () => {
            return true;
        },
        redCheck: () => {
            return false;
        }
    });

    /**
     * 分享界面
     */
    export const share = new IndexViewRS({
        id: 7,
        name: `福利`,
        init: (state) => {
            state.stateShare = ShareViewState.Pop (APP);
        },
        fill: (state, listNode) => {
            listNode.push (ShareView.nodeType.CreateNode (
                state,
                share.id,
                share.id
            ));
        },
        onEnter: (state: IndexViewState) => {
            
        },
        onExit: (state: IndexViewState) => {

        },
        onMatch: (state: IndexViewState) => {
            state.stateShare.childrenAble = true;
            // 正式打开加载界面
            jiang.mgrUI.Open (
                LoadingView.nodeType,
                LoadingViewState.Pop (APP, state.stateShare.RequestJoinData ())
            );
        },
        onUnMatch: (state: IndexViewState) => {

        },
        onUpdate: (state: IndexViewState) => {
            
        },
        validCheck: () => {
            return true;
        },
        redCheck: () => {
            return false
        }
    });
}

export default IndexViewRS;