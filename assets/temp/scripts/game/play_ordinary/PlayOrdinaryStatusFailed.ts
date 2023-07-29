import UtilObjPool from "../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../frame/basic/UtilObjPoolType";
import jiang from "../../frame/global/Jiang";
import GameFailedView from "../view/game_failed_view/GameFailedView";
import GameFailedViewState from "../view/game_failed_view/GameFailedViewState";
import PlayOrdinary from "./PlayOrdinary";
import PlayOrdinaryStatus from "./PlayOrdinaryStatus";
import RewardViewState from "../view/reward_view/RewardViewState";
import gameCommon from "../GameCommon";
import gameMath from "../GameMath";
import MgrSdk from "../../frame/sdk/MgrSdk";
import indexBuildConfig from "../../IndexBuildConfig";

const APP = `PlayOrdinaryStatusFailed`;

/**
 * 玩法 - 经典 - 状态 - 已失败
 */
export default class PlayOrdinaryStatusFailed extends PlayOrdinaryStatus {

    private constructor () {super();}

    private static _t = new UtilObjPoolType<PlayOrdinaryStatusFailed>({
        instantiate: () => {
            return new PlayOrdinaryStatusFailed();
        },
        onPop: (t) => {
         
        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relMachine: PlayOrdinary) {
        let val = UtilObjPool.Pop(PlayOrdinaryStatusFailed._t, apply);
        val.relMachine = relMachine;
        return val;
    }

    public OnEnter(): void {
        this.relMachine.gameState.ApplyTimeScale (0);

        jiang.mgrUI.Open(
            GameFailedView.nodeType,
            GameFailedViewState.Pop(APP, this.relMachine.idCfgLev, this.relMachine.gameState)
        );
        // 没开广告，也不是特殊关卡，那么可以直接把奖励带走
        if (!indexBuildConfig.VIDEO_ENABLE && gameMath.IsStandardRewardScene (this.relMachine.gameState.cfgSceneCache.idCfg)) {
            // 获得奖励
            RewardViewState.GotRewardOrdinary (gameCommon.TITLE_REWARD, this.relMachine.gameState.listRewardIdCfg);
            this.relMachine.gameState.listRewardIdCfg.length = 0;
        };
    }

    public OnExit(): void {
        
    }
}