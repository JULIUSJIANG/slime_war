import UtilObjPool from "../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../frame/basic/UtilObjPoolType";
import PlayOrdinaryEnemyCallItemn from "./PlayOrdinaryEnemyCallItem";

const APP = `PlayOrdinaryEnemyCall`;

/**
 * 敌方召唤触发器
 */
export default class PlayOrdinaryEnemyCall {

    private static _t = new UtilObjPoolType<PlayOrdinaryEnemyCall>({
        instantiate: () => {
            return new PlayOrdinaryEnemyCall();
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
        listMS: number[],
        listIdCfg: number[],
        listPos: number[]
    )
    {
        let val = UtilObjPool.Pop(PlayOrdinaryEnemyCall._t, apply);
        val.ms = ms;

        for (let i = 0; i < listIdCfg.length; i++) {
            val.listItem.push(PlayOrdinaryEnemyCallItemn.Pop(
                apply,
                listMS[i],
                listIdCfg[i],
                listPos[2 * i],
                listPos[2 * i + 1]
            ));
        };

        return val;
    }

    /**
     * 触发的毫秒数
     */
    ms: number;

    /**
     * 要召唤的单位
     */
    listItem: PlayOrdinaryEnemyCallItemn[] = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
}