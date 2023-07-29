import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import GameElementBuff from "./GameElementBuff";

const APP = `GameElementBuffBehaviour`;

/**
 * buff 的实际策略
 */
export class GameElementBuffBehaviour<T> {

    protected constructor () {}

    private static _t = new UtilObjPoolType<GameElementBuffBehaviour<any>>({
        instantiate: () => {
            return new GameElementBuffBehaviour();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (
        apply: string
    )
    {
        return UtilObjPool.Pop(GameElementBuffBehaviour._t, apply);
    }

    /**
     * 初始化
     * @param relBuff 
     */
    Init (relBuff: GameElementBuff, t: T) {
        this.relBuff = relBuff;
    }

    /**
     * 事件派发 - 层数变化
     */
    OnLayerIncrease () {

    }

    /**
     * 归属的 buff
     */
    relBuff: GameElementBuff;

    /**
     * 参数
     */
    args: T;
}