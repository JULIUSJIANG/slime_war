import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import GameCD from "./GameCD";
import GameCDStatus from "./GameCDStatus";


const APP = `GameCDStatusIng`;

/**
 * cd 计时器 - 状态 - 冷却中
 */
export default class GameCDStatusIng extends GameCDStatus {
    private static _t = new UtilObjPoolType <GameCDStatusIng> ({
        instantiate: () => {
            return new GameCDStatusIng ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relGameCD: GameCD) {
        let val = UtilObjPool.Pop (GameCDStatusIng._t, apply);
        val.relGameCD = relGameCD;
        return val;
    }

    OnEnter (): void {
        this.relGameCD.currentCD = this.relGameCD.msCD;
    }

    OnStep (ms: number): void {
        this.relGameCD.currentCD -= ms;
        this.relGameCD.currentCD = Math.max (this.relGameCD.currentCD, 0);
        if (this.relGameCD.currentCD == 0) {
            this.relGameCD.Enter (this.relGameCD.statusReady);
        };
    }

    OnTryCall (): boolean {
        return false;
    }
}