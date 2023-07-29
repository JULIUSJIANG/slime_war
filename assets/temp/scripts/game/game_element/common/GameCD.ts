import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import GameCDStatus from "./GameCDStatus";
import GameCDStatusIng from "./GameCDStatusIng";
import GameCDStatusReady from "./GameCDStatusReady";

const APP = `GameCD`;

/**
 * cd 计时器
 */
export default class GameCD {

    private constructor () {}

    private static _t = new UtilObjPoolType <GameCD> ({
        instantiate: () => {
            return new GameCD ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, msCD) {
        let val = UtilObjPool.Pop (GameCD._t, apply);
        val.msCD = msCD;

        val.statusIng = GameCDStatusIng.Pop (APP, val);
        val.statusReady = GameCDStatusReady.Pop (APP, val);
        val.Enter (val.statusReady);

        return val;
    }

    /**
     * 冷却时间
     */
    msCD: number;

    /**
     * 当前还需要等候的时间
     */
    currentCD: number = 0;

    /**
     * 状态 - 正在冷却
     */
    statusIng: GameCDStatusIng;

    /**
     * 状态 - 已就绪
     */
    statusReady: GameCDStatusReady;

    /**
     * 当前状态
     */
    currStatus: GameCDStatus;

    /**
     * 进入某个状态
     * @param status 
     */
    Enter (status: GameCDStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.currStatus.OnEnter ();
    }
}