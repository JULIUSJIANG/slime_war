import UtilObjPool from "./UtilObjPool";
import UtilObjPoolType from "./UtilObjPoolType";

const APP = `BCType`;

/**
 * 类型
 */
class BCType<T> {
    /**
     * 对等
     */
    _equal: (a: T, b: T) => boolean;
    /**
     * 释放
     */
    _release: (inst: T) => void;
    /**
     * 拷贝
     */
    _clone: (inst: T) => T;

    private constructor (

    ) 
    {

    }

    private static _t = new UtilObjPoolType<BCType<any>> ({
        instantiate: () => {
            return new BCType();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop<T> (
        apply: string,
        equal: (a: T, b: T) => boolean,
        release: (inst: T) => void,
        clone: (inst: T) => T
    ) 
    {
        let t = UtilObjPool.Pop(BCType._t, apply);
        t._equal = equal;
        t._release = release;
        t._clone = clone;
        return t;
    }
}

namespace BCType {
    /**
     * 类型 - 数字
     */
    export const typeNumber = BCType.Pop<number> (
        APP,
        (a, b) => {
            return a == b;
        },
        (inst) => {

        },
        (a) => {
            return a;
        }
    );

    /**
     * 类型 - 字符串
     */
    export const typeString = BCType.Pop<string> (
        APP,
        (a, b) => {
            return a == b;
        },
        (inst) => {

        },
        (a) => {
            return a;
        }
    );

    /**
     * 类型 - 布尔值
     */
    export const typeBoolean = BCType.Pop<boolean> (
        APP,
        (a, b) => {
            return a == b;
        },
        (inst) => {

        },
        (a) => {
            return a;
        }
    );

    /**
     * 类型 - 数组
     */
    export const typeArray = BCType.Pop<Array<any>> (
        APP,
        (a, b) => {
            if (a == null && b == null) {
                return false;
            };
            if (a == null) {
                return false;
            };
            if (b == null) {
                return false;
            };
            if (a.length != b.length) {
                return false;
            };
            for (let i = 0; i < a.length; i++) {
                if (a[i] != b[i]) {
                    return false;
                };
            };
            return true;
        },
        (inst) => {
            UtilObjPool.Push(inst);
        },
        (a) => {
            let clone = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
            clone.push(...a);
            return clone;
        }
    );
}

export default BCType;