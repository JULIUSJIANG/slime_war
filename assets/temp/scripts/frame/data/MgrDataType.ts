import UtilObjPool from "../basic/UtilObjPool";
import UtilObjPoolType from "../basic/UtilObjPoolType";

const APP = `MgrDataType`;

class  MgrDataType<T> {

    private constructor () {}

    private static _t = new UtilObjPoolType<MgrDataType<any>> ({
        instantiate: () => {
            return new MgrDataType<any>();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop<T> (
        apply: string,
        toString: (t: T) => string,
        toVal: (str: string) => T
    ) 
    {
        let val = UtilObjPool.Pop(MgrDataType._t, apply) as MgrDataType<T>;
        val.toString = toString;
        val.toVal = toVal;
        return val;
    }

    /**
     * 转换为字符串
     */
    toString: (t: T) => string;
    /**
     * 转换为值
     */
    toVal: (str: string) => T;
}

namespace MgrDataType {
    /**
     * 数字
     */
    export const typeNumber = MgrDataType.Pop<number>(
        APP,
        (val) => {
            return `${val}`;
        },
        (str) => {
            return Number(str);
        }
    );

    /**
     * 字符串
     */
    export const typeString = MgrDataType.Pop<string>(
        APP,
        (val) => {
            return val;
        },
        (str) => {
            return str
        }
    );

    /**
     * 布尔值
     */
    export const typeBool = MgrDataType.Pop<boolean>(
        APP,
        (val) => {
            return `${val}`;
        },
        (str) => {
            return str == "true" ? true : false;
        }
    );

    /**
     * 对象
     */
    export const typeObject = MgrDataType.Pop<object>(
        APP,
        (val) => {
            return JSON.stringify(val);
        },
        (str) => {
            return JSON.parse(str);
        }
    );
}

export default MgrDataType;