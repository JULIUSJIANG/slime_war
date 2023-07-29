import UtilObjPool from "./UtilObjPool";
import UtilObjPoolType from "./UtilObjPoolType";

const APP = `BCCounter`;

/**
 * 计数状态
 */
export default class BCCounter {

    private constructor () {}

    private static _t = new UtilObjPoolType<BCCounter>({
        instantiate: () => {
            return new BCCounter();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        return UtilObjPool.Pop(BCCounter._t, apply);
    }

    /**
     * 当前是否处于激活状态
     */
    get active () {
        return 0 < this._set.size;
    }

    /**
     * 迭代 id
     */
    _genId: number = 0;

    /**
     * 集合
     */
    _set = UtilObjPool.Pop(UtilObjPool.typeSet, APP);

    /**
     * 应用
     */
    Apply (): number {
        let id = ++this._genId;
        this._set.add(id);
        return id;
    }

    /**
     * 取消
     */
    Cancel (id: number) {
        this._set.delete(id);
    }   

    /**
     * 清空所有
     */
    Clear () {
        this._set.clear();
    }
}