import UtilObjPool from "./UtilObjPool";
import UtilObjPoolType from "./UtilObjPoolType";

const APP = `BCPromiseCtrl`;

/**
 * 有参数进程控制
 */
export default class BCPromiseCtrl<T> {
    /**
     * 实际进程
     */
    _promise: Promise<T>;

    private constructor () {}

    private static _t = new UtilObjPoolType<BCPromiseCtrl<any>> ({
        instantiate: () => {
            return new BCPromiseCtrl<any>();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop<T> (apply: string) {
        let t = UtilObjPool.Pop(BCPromiseCtrl._t, apply);
        t._promise = UtilObjPool.PopPromise(
            APP,
            (resolve, reject) => {
                t._resolve = resolve;
                t._reject = reject;
            }
        );
        return t as BCPromiseCtrl<T>;
    }

    /**
     * 已出结果
     */
    public isResulted = false;

    /**
     * 已完成
     */
    public isResolved = false;

    /**
     * 进程控制器 - 完成
     */
    _resolve: any = null;

    /**
     * 完成
     * @param t 
     */
    resolve (t: T) {
        if (this.isResulted) {
            return;
        };
        this.isResulted = true;
        this.isResolved = true;
        this._resolve(t);
    }

    /**
     * 已拒绝
     */
    public isRejected = false;

    /**
     * 进程控制器 - 拒绝
     */
    _reject: any = null; 
 
    /**
     * 拒绝
     * @param err 
     */
    reject (err: any) {
        if (this.isResulted) {
            return;
        };
        this.isResulted = true;
        this.isRejected = true;
        this._reject(err);
    }
} 