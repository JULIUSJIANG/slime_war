import indexBuildConfig from "../../IndexBuildConfig";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../frame/basic/UtilObjPoolType";
import PlayOrdinary from "./PlayOrdinary";
import PlayOrdinaryStatus from "./PlayOrdinaryStatus";


const APP = `PlayOrdinaryStatusSuccessing`;

export default class PlayOrdinaryStatusSuccessing extends PlayOrdinaryStatus {
    private constructor () {super();}

    private static _t = new UtilObjPoolType<PlayOrdinaryStatusSuccessing>({
        instantiate: () => {
            return new PlayOrdinaryStatusSuccessing();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relMachine: PlayOrdinary) {
        let val = UtilObjPool.Pop(PlayOrdinaryStatusSuccessing._t, apply);
        val.relMachine = relMachine;
        return val;
    }

    private cd = 1000;

    public OnStep(ms: number): void {
        this.relMachine.gameState.StepMS(ms);
        if (!indexBuildConfig.IS_FAKE_ENEMY) {
            this.cd -= ms;
        };
        if (0 < this.cd) {
            return;
        };
        this.relMachine.Enter(this.relMachine.statusSuccessed);
    }
}