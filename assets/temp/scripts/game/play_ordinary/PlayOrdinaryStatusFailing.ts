import indexBuildConfig from "../../IndexBuildConfig";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../frame/basic/UtilObjPoolType";
import PlayOrdinary from "./PlayOrdinary";
import PlayOrdinaryStatus from "./PlayOrdinaryStatus";

const APP = `PlayOrdinaryStatusFailing`;

/**
 * 玩法 - 经典 - 状态 - 失败进行中
 */
export default class PlayOrdinaryStatusFailing extends PlayOrdinaryStatus {
    private constructor () {super();}

    private static _t = new UtilObjPoolType<PlayOrdinaryStatusFailing>({
        instantiate: () => {
            return new PlayOrdinaryStatusFailing();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relMachine: PlayOrdinary) {
        let val = UtilObjPool.Pop(PlayOrdinaryStatusFailing._t, apply);
        val.relMachine = relMachine;
        return val;
    }

    private cd: number;

    public OnEnter(): void {
        this.cd = 1000;
    }

    public OnStep(ms: number): void {
        this.relMachine.gameState.StepMS(ms);
        this.cd -= ms;
        if (0 < this.cd) {
            return;
        };
        // 有重生机会，尝试重生
        if (indexBuildConfig.VIDEO_ENABLE) {
            this.relMachine.Enter (this.relMachine.statusRelife);
            return;
        };
        this.relMachine.Enter(this.relMachine.statusFailed);
    }
}