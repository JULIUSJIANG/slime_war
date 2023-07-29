import indexBuildConfig from "../../../IndexBuildConfig";
import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import CfgBackpackProp from "../../../frame/config/src/CfgBackpackProp";
import CfgChapter from "../../../frame/config/src/CfgChapter";
import CfgGameElement from "../../../frame/config/src/CfgGameElement";
import CfgLottery from "../../../frame/config/src/CfgLottery";
import jiang from "../../../frame/global/Jiang";
import gameCommon from "../../GameCommon";
import gameMath from "../../GameMath";
import CfgCacheChapter from "../../cfg_cache/CfgCacheChapter";
import CfgCacheLottery from "../../cfg_cache/CfgCacheLottery";
import GameStateReward from "../../game_element/GameStateReward";
import GameCfgBodyCacheDropRS from "../../game_element/body/GameCfgBodyCacheDropRS";
import LvUpBatchView from "../lv_up_batch_view/LvUpBatchView";
import LvUpBatchViewState from "../lv_up_batch_view/LvUpBatchViewState";
import RewardViewState from "../reward_view/RewardViewState";
import TipsViewState from "../tips_view/TipsViewState";
import VideoCertainView from "../video_certain_view/VideoCertainView";
import VideoCertainViewState from "../video_certain_view/VideoCertainViewState";
import LotteryViewBubbleData from "./LotteryViewBubbleData";

const APP = `LotteryViewState`;

/**
 * 气泡的生成冷却
 */
const BUBBLE_CD = 400;
/**
 * 气泡的总运动时间
 */
const BUBBLE_TOTAL = 3000;

/**
 * 乐透界面 - 状态
 */
export default class LotteryViewState {
    /**
     * 当前挑战的章节
     */
    challengeChapter: number;

    /**
     * 银币记录
     */
    recCoin: indexDataStorageItem.BackpackPropRecord;

    /**
     * 已解锁内容的集合
     */
    listUnlockedItem: Array <CfgLottery> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);

    /**
     * 气泡信息的集合
     */
    listBubbleData: Array <LotteryViewBubbleData> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);

    /**
     * 批量升级界面
     */
    stateLvUpBatch: LvUpBatchViewState;

    private constructor () {
        
    }

    private static _t = new UtilObjPoolType<LotteryViewState>({
        instantiate: () => {
            return new LotteryViewState();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        let val = UtilObjPool.Pop (LotteryViewState._t, apply);
        // 当前正在挑战的章节
        val.challengeChapter = CfgCacheChapter.GetChallengeChapter ();
        for (let i = 0; i < jiang.mgrCfg.cfgLottery._list.length; i++) {
            let cfg = jiang.mgrCfg.cfgLottery._list [i];
            // 未解锁的话，要忽略掉
            if (!CfgCacheLottery.CheckUsUnlocked (val.challengeChapter, cfg)) {
                continue;
            };
            val.listUnlockedItem.push (cfg);
        };
        val.stateLvUpBatch = LvUpBatchViewState.Pop (APP);
        val.OnChange (IndexDataModule.INDEXVIEW_LOTTO);
        return val;
    }

    OnChange (module: IndexDataModule) {
        this.stateLvUpBatch.OnChange (module);
    }

    /**
     * 子节点许可
     */
    childrenAble = false;

    /**
     * 当前气泡的冷却时间
     */
    cd = 0;

    /**
     * 时间推进
     * @param ms 
     */
    public OnStep (ms: number) {
        // 每帧刷新
        // 不允许生成气泡，又没有需要更新的数据，那么 update 是多余的
        if (!this.childrenAble && this.listBubbleData.length == 0) {
            return;
        };
        jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_LOTTO);
        for (let i = 0; i < this.listBubbleData.length;) {
            let bubbleData = this.listBubbleData [i];
            bubbleData.onStep (ms);
            // 已经到尽头的气泡，要及时销毁
            if (bubbleData.rate == 1) {
                this.listBubbleData.splice (i, 1);
            }
            // 否则处理下一个气泡
            else {
                i++;
            };
        };
        // 冷却完毕，生成新的气泡
        this.cd -= ms;
        if (this.childrenAble && this.cd <= 0) {
            this.cd = BUBBLE_CD;
            let randomItem = this.listUnlockedItem[Math.floor (Math.random () * this.listUnlockedItem.length)];
            this.listBubbleData.push (LotteryViewBubbleData.Pop (
                APP,
                Math.random () * 2 * Math.PI,
                BUBBLE_TOTAL,
                randomItem.id
            ));
        };
    }
}