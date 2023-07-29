import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import ViewState from "../../../frame/ui/ViewState";
import IndexLayer from "../../../IndexLayer";
import GameState from "../../game_element/GameState";
import gameCommon from "../../GameCommon";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";

const APP = `GameOptionsViewState`;

/**
 * 游戏选项界面状态中心
 */
export default class GameOptionsViewState extends ViewState {
    
    private constructor () {
        super (
            IndexLayer.GAME,
            ViewState.BG_TYPE.MASK,
            true
        );
    }

    private static _t = new UtilObjPoolType<GameOptionsViewState>({
        instantiate: () => {
            return new GameOptionsViewState();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, idCfgLev: number, gameState: GameState) {
        let val = UtilObjPool.Pop(GameOptionsViewState._t, apply);
        val.idCfgLev = idCfgLev;
        val.gameState = gameState;
        return val;
    }

    public OnMaskTouch(): void {
        VoiceOggViewState.inst.VoiceSet (gameCommon.BTN_VOICE);
        jiang.mgrUI.Close(this._idView);
    }

    /**
     * 当前挑战关卡的配表 id
     */
    idCfgLev: number;

    /**
     * 游戏核心状态
     */
    gameState: GameState;
}