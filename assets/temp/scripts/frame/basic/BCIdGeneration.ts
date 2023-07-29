import UtilObjPool from "./UtilObjPool";
import UtilObjPoolType from "./UtilObjPoolType";

const APP = `BCIdGeneration`;

/**
 * 标识生成器
 */
export default class BCIdGeneration {

    private constructor () {}

    private static _t = new UtilObjPoolType<BCIdGeneration> ({
        instantiate: () => {
            return new BCIdGeneration();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        return UtilObjPool.Pop(BCIdGeneration._t, apply);
    }

    /**
     * 当前 id
     */
    _genId = 0;

    /**
     * 生成新的 id
     * @returns 
     */
    GenId () {
        return ++this._genId;
    }
}