import BCPromiseCtrl from "../../frame/basic/BCPromiseCtrl";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../frame/basic/UtilObjPoolType";
import CfgLevel from "../../frame/config/src/CfgLevel";
import CfgScene from "../../frame/config/src/CfgScene";
import CfgStore from "../../frame/config/src/CfgStore";
import CfgVoiceOgg from "../../frame/config/src/CfgVoiceOgg";
import jiang from "../../frame/global/Jiang";
import MgrSdk from "../../frame/sdk/MgrSdk";
import indexBuildConfig from "../../IndexBuildConfig";
import indexDataStorageItem from "../../IndexStorageItem";
import DefineVoice from "../game_element/body/DefineVoice";
import GameCfgBodyCacheDropRS from "../game_element/body/GameCfgBodyCacheDropRS";
import GameStateReward from "../game_element/GameStateReward";
import gameCommon from "../GameCommon";
import gameMath from "../GameMath";
import ChapterUnlockView from "../view/chapter_unlock_view/ChapterUnlockView";
import ChapterUnlockViewCard from "../view/chapter_unlock_view/ChapterUnlockViewCard";
import ChapterUnlockViewState from "../view/chapter_unlock_view/ChapterUnlockViewState";
import GamePlayViewState from "../view/game_play/GamePlayViewState";
import GameSuccessedView from "../view/game_successed_view/GameSuccessedView";
import GameSuccessedViewState from "../view/game_successed_view/GameSuccessedViewState";
import LoadingView from "../view/loading_view/LoadingView";
import LoadingViewState from "../view/loading_view/LoadingViewState";
import RewardViewState from "../view/reward_view/RewardViewState";
import PlayOrdinary from "./PlayOrdinary";
import PlayOrdinaryRS from "./PlayOrdinaryRS";
import PlayOrdinaryStatus from "./PlayOrdinaryStatus";

const APP = `PlayOrdinaryStatusSuccessed`;

/**
 * 玩法 - 经典 - 状态 - 挑战成功
 */
export default class PlayOrdinaryStatusSuccessed extends PlayOrdinaryStatus {

    /**
     * 就绪
     */
    ready = BCPromiseCtrl.Pop(APP);

    private constructor () {super();}

    private static _t = new UtilObjPoolType<PlayOrdinaryStatusSuccessed>({
        instantiate: () => {
            return new PlayOrdinaryStatusSuccessed();
        },
        onPop: (t) => {
         
        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relMachine: PlayOrdinary) {
        let val = UtilObjPool.Pop(PlayOrdinaryStatusSuccessed._t, apply);
        val.relMachine = relMachine;
        return val;
    }

    public OnEnter(): void {
        let levCurrent = this.relMachine.idCfgLev;
        let levNext = levCurrent + 1;
        // 更改记录前的章节标识
        let playRSBefore = PlayOrdinaryRS.GetRS (jiang.mgrData.Get (indexDataStorageItem.challengeLev));
        let sceneBefore = playRSBefore.getterSceneId (jiang.mgrData.Get (indexDataStorageItem.challengeLev));
        Promise.resolve()
            .then(() => {
                return this.ready._promise;
            })
            .then(() => {
                // 保存数据
                jiang.mgrData.Set(indexDataStorageItem.challengeLev, levNext);
            })
            .then(() => {
                let playRSAfter = PlayOrdinaryRS.GetRS (jiang.mgrData.Get (indexDataStorageItem.challengeLev));
                let sceneAfter = playRSAfter.getterSceneId (jiang.mgrData.Get (indexDataStorageItem.challengeLev));
                // 胜利窗口
                jiang.mgrUI.Open(
                    GameSuccessedView.nodeType,
                    GameSuccessedViewState.Pop(APP, this.relMachine.idCfgLev, this.relMachine.gameState)
                );
                // 没开视频奖励的话，这里自动获得，就不用玩家去戳一下了
                if (!indexBuildConfig.VIDEO_ENABLE || !gameMath.IsStandardRewardScene (this.relMachine.gameState.cfgSceneCache.idCfg)) {
                    RewardViewState.GotRewardOrdinary (gameCommon.TITLE_REWARD, this.relMachine.gameState.listRewardIdCfg);
                    this.relMachine.gameState.listRewardIdCfg.length = 0;
                };
                // 初始难度中，前后章节 id 变化，提示章节解锁
                if (sceneBefore != sceneAfter) {
                    let list = jiang.mgrCfg.cfgStore.select (CfgStore.unlock_val_0Getter, sceneAfter)._list;
                    if (0 < list.length) {
                        let gotCount: number;
                        // 有开视频，只给等级 1，否则没人给我看视频
                        let listEquipment = jiang.mgrData.Get (indexDataStorageItem.listEquipment);
                        gotCount = 0;
                        for (let i = 0; i < listEquipment.length; i++) {
                            let listBackpackPropI = listEquipment [i];
                            gotCount = Math.max (listBackpackPropI.count, gotCount);
                        };

                        // 奖励 1
                        let listReward: Array<GameStateReward> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                        for (let i = 0; i < list.length; i++) {
                            let cfgStore = list [i];
                            let rewardProps: Array<number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                            rewardProps.push (cfgStore.item_id, 1);
                            listReward.push ({
                                rs: GameCfgBodyCacheDropRS.xlsxEquipment,
                                props: rewardProps
                            });
                        };
                        RewardViewState.GotRewardOrdinary (gameCommon.TITLE_REWARD, listReward);
                        // 奖励 - 等级 1
                        for (let i = 0; i < list.length; i++) {
                            let cfgStore = list [i];
                            let rewardProps: Array<number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                            rewardProps.push (cfgStore.item_id, gotCount - 1);
                            GameCfgBodyCacheDropRS.xlsxEquipment.onEnterBackpack (rewardProps);
                        };
                    };

                    jiang.mgrUI.Open (
                        ChapterUnlockView.nodeType,
                        ChapterUnlockViewState.Pop (APP, sceneAfter)
                    );
                    GamePlayViewState.Load (jiang.mgrData.Get (indexDataStorageItem.challengeLev));

                    let cfgScene = jiang.mgrCfg.cfgScene.select (CfgScene.idGetter, sceneAfter)._list [0];
                    let cfgBgm = jiang.mgrCfg.cfgVoiceOgg.select (CfgVoiceOgg.idGetter, cfgScene.bgm)._list [0];
                    let listPrefab: Array <string> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                    let cfgVoice = jiang.mgrCfg.cfgVoiceOgg.select (CfgVoiceOgg.idGetter, DefineVoice.NEW)._list [0];
                    listPrefab.push (
                        cfgScene.card,
                        cfgBgm.res,
                        cfgVoice.res,
                        ChapterUnlockView.nodeType._prefabPath
                    );
                    // 只保留未加载的路径
                    listPrefab = listPrefab.filter ((path) => {
                        return jiang.mgrRes.GetPrefab (path) == null;
                    });
                    let listPromiseLoad = listPrefab.map ((path) => {
                        return jiang.mgrRes.mgrAssets.GetLoadRecord (path).process._promise;
                    });
                    // 期间把加载线程拉满
                    let appId = jiang.mgrRes.AsyncMaxApp ();
                    Promise.all (listPromiseLoad)
                        .then (() => {
                            jiang.mgrRes.AsyncMaxCancel (appId);
                        });
                    let loadState = LoadingViewState.Pop (
                        APP,
                        listPromiseLoad
                    );
                    jiang.mgrUI.Open (
                        LoadingView.nodeType,
                        loadState
                    );
                };
            });
    }

    public OnStep(ms: number): void {
        this.relMachine.gameState.StepMS(ms);
        if (!this.relMachine.gameState.counterAnimNeed.active) {
            this.ready.resolve(null);
        };
    }
}