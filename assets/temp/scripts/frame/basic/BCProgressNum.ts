import UtilObjPool from "./UtilObjPool";
import UtilObjPoolType from "./UtilObjPoolType";

const APP = `BCProgressNum`;

/**
 * 进度数字
 */
export default class BCProgressNum {
    
    private constructor () {}

    private static _t = new UtilObjPoolType <BCProgressNum> ({
        instantiate: () => {
            return new BCProgressNum ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });


    static Pop (apply: string, inc: number) {
        let val = UtilObjPool.Pop (BCProgressNum._t, apply);
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
     * 总和 - 满与否均算
     */
    get sum () {
        let s = 0;
        for (let i = 0; i < this.listVal.length; i++) {
            let val = this.listVal [i];
            s += val * this._inc ** i;
        };
        return s;
    }

    /**
     * 总和 - 只算满的
     */
    get sumFull () {
        let s = 0;
        for (let i = 0; i < this.listVal.length; i++) {
            let val = this.listVal [i];
            if (val < this._inc) {
                break;
            };
            s += val * this._inc ** i;
        };
        return s;
    }

    /**
     * 添加
     * @param idx 
     * @param count 
     */
    private Add (idx: number, count: number) {
        // 越界，忽略
        if (this.listVal.length <= idx) {
            this.listVal.push (0);
        };
        // 递增
        this.listVal [idx] += count;
        // 进位
        if (this._inc < this.listVal [idx]) {
            this.Add (idx + 1, (this.listVal [idx] - this._inc) / this._inc);
            this.listVal [idx] = this._inc;
        };
    }

    /**
     * 基础增长
     * @param count 
     */
    AddBasic (count: number) {
        this.Add (0, count);
    }

    /**
     * 拷贝
     * @param app 
     * @returns 
     */
    Clone (app: string) {
        let val = BCProgressNum.Pop (app, this._inc);
        val.listVal.push (...this.listVal);
        return val;
    }
}