import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import ViewState from "../../../frame/ui/ViewState";
import IndexLayer from "../../../IndexLayer";
import IndexDataModule from "../../../IndexDataModule";
import DefineVoice from "../../game_element/body/DefineVoice";
import GameState from "../../game_element/GameState";
import LotteryTipsViewState from "../lottery_view/LotteryTipsViewState";
import LotteryViewState from "../lottery_view/LotteryViewState";
import LvUpBatchViewState from "../lv_up_batch_view/LvUpBatchViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";


const APP = `GameFailedViewState`;

export default class GameFailedViewState extends ViewState {
    private constructor () {
        super (
            IndexLayer.GAME,
            ViewState.BG_TYPE.MASK,
            true
        );
    }

    private static _t = new UtilObjPoolType<GameFailedViewState>({
        instantiate: () => {
            return new GameFailedViewState();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, idCfgLev: number, gameState: GameState) {
        let val = UtilObjPool.Pop(GameFailedViewState._t, apply);
        val.idCfgLev = idCfgLev;
        val.gameState = gameState;
        val.stateLvUpBatch = LvUpBatchViewState.Pop (APP);
        return val;
    }

    /**
     * 当前挑战关卡的配表 id
     */
    idCfgLev: number;

    /**
     * 战斗核心
     */
    gameState: GameState;

    OnDisplay(): void {
        VoiceOggViewState.inst.VoiceSet (DefineVoice.FAIL_2);
    }

    /**
     * 强化界面
     */
    stateLvUpBatch: LvUpBatchViewState;

    OnChange (module: IndexDataModule): void {
        this.stateLvUpBatch.OnChange (module);
    }
}