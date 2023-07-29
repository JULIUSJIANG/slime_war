import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import GameCD from "./GameCD";
import GameCDStatus from "./GameCDStatus";


const APP = `GameCDStatusReady`;

/**
 * cd 计时器 - 状态 - 已就绪
 */
export default class GameCDStatusReady extends GameCDStatus {
    private static _t = new UtilObjPoolType <GameCDStatusReady> ({
        instantiate: () => {
            return new GameCDStatusReady ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relGameCD: GameCD) {
        let val = UtilObjPool.Pop (GameCDStatusReady._t, apply);
        val.relGameCD = relGameCD;
        return val;
    }

    OnTryCall () {
        this.relGameCD.Enter (this.relGameCD.statusIng);
        return true;
    }
}