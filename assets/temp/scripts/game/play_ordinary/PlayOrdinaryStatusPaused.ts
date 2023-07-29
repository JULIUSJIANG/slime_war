import UtilObjPool from "../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../frame/basic/UtilObjPoolType";
import jiang from "../../frame/global/Jiang";
import GameOptionsView from "../view/game_options/GameOptionsView";
import GameOptionsViewState from "../view/game_options/GameOptionsViewState";
import PlayOrdinary from "./PlayOrdinary";
import PlayOrdinaryStatus from "./PlayOrdinaryStatus";

const APP = `PlayOrdinaryStatusPaused`;

/**
 * 玩法 - 经典 - 状态 - 暂停
 */
export default class PlayOrdinaryStatusPaused extends PlayOrdinaryStatus {

    private constructor () {super();}

    private static _t = new UtilObjPoolType<PlayOrdinaryStatusPaused>({
        instantiate: () => {
            return new PlayOrdinaryStatusPaused();
        },
        onPop: (t) => {
         
        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relMachine: PlayOrdinary) {
        let val = UtilObjPool.Pop(PlayOrdinaryStatusPaused._t, apply);
        val.relMachine = relMachine;
        return val;
    }

    private _timeScaleAppId: number;

    public OnEnter(): void {
        this._timeScaleAppId = this.relMachine.gameState.ApplyTimeScale (0);

        let opState = GameOptionsViewState.Pop(APP, this.relMachine.idCfgLev, this.relMachine.gameState);
        opState._evterDestory.On(() => {
            this.relMachine.Enter(this.relMachine.statusPlaying);
        });
        jiang.mgrUI.Open(
            GameOptionsView.nodeType,
            opState
        );
    }

    public OnExit(): void {
        this.relMachine.gameState.CancelTimeScale(this._timeScaleAppId);
    }
}