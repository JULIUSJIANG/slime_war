import UtilObjPool from "../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../frame/basic/UtilObjPoolType";
import PlayOrdinaryEnemyCall from "./PlayOrdinaryEnemyCall";

const APP = `PlayOrdinaryEnemyCallItemn`;

/**
 * 敌方召唤触发器
 */
export default class PlayOrdinaryEnemyCallItemn {

    private static _t = new UtilObjPoolType<PlayOrdinaryEnemyCallItemn>({
        instantiate: () => {
            return new PlayOrdinaryEnemyCallItemn();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (
        apply: string,
        ms: number,
        idCfg: number,
        x: number,
        y: number
    )
    {
        let val = UtilObjPool.Pop(PlayOrdinaryEnemyCallItemn._t, apply);
        val.ms = ms;
        val.idCfg = idCfg;
        val.x = x;
        val.y = y;
        return val;
    }

    /**
     * 触发的毫秒数
     */
    ms: number;

    /**
     * 要召唤的单位
     */
    idCfg: number;

    /**
     * 坐标 x
     */
    x: number;

    /**
     * 坐标 y
     */
    y: number;
}