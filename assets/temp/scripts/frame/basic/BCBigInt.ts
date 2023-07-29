import UtilObjPool from "./UtilObjPool";
import UtilObjPoolType from "./UtilObjPoolType";

const APP = `BCBigInt`;

/**
 * 大整数
 */
export default class BCBigInt {

    private constructor () {}

    private static _t = new UtilObjPoolType <BCBigInt> ({
        instantiate: () => {
            return new BCBigInt ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, inc: number) {
        let val = UtilObjPool.Pop (BCBigInt._t, apply);
        val._inc = inc;
        return val;
    }

    /**
     * 进制
     */
    private _inc: number;

    /**
     * 值集合
     */
    listVal: Array <number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);

    /**
     * 往某个索引添加值
     * @param idx 
     * @param count 
     */
    private Add (idx: number, count: number) {
        // 0 不带来任何变化，直接忽略
        if (count == 0) {
            return;
        };
        // 确保到该索引位置，均有值
        while (this.listVal.length <= idx) {
            this.listVal.push (0);
        };
        // 递增
        this.listVal [idx] += count;
        // 进位的值
        let addition = Math.floor (this.listVal [idx] / this._inc);
        // 本位剔除进位消耗
        this.listVal [idx] -= addition * this._inc;
        // 正式进位
        this.Add (idx + 1, addition);
    }

    /**
     * 进行增值
     * @param count 
     */
    AddBasic (count: number) {
        this.Add (0, count);
    }
}