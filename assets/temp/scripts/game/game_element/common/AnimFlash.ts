import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import AnimFlashStatus from "./AnimFlashStatus";
import AnimFlashStatusIn from "./AnimFlashStatusIn";
import AnimFlashStatusOut from "./AnimFlashStatusOut";

const APP = `AnimFlash`;

/**
 * 动画 - 闪现
 */
export default class AnimFlash {

    private constructor () {}

    private static _t = new UtilObjPoolType <AnimFlash> ({
        instantiate: () => {
            return new AnimFlash ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, msFadeIn: number, msFadeOut: number) {
        let val = UtilObjPool.Pop (AnimFlash._t, apply);
        val.msFadeIn = msFadeIn;
        val.msFadeOut = msFadeOut;

        val.statusIn = AnimFlashStatusIn.Pop (apply, val);
        val.statusOut = AnimFlashStatusOut.Pop (apply, val);

        val.Enter (val.statusOut)
        return val;
    }

    /**
     * 当前比率
     */
    rateVisibility = 0;
    /**
     * 渐入时间
     */
    msFadeIn: number;
    /**
     * 渐出时间
     */
    msFadeOut: number;

    /**
     * 状态 - 渐入
     */
    statusIn: AnimFlashStatusIn;
    /**
     * 状态 - 渐出
     */
    statusOut: AnimFlashStatusOut;

    /**
     * 当前状态
     */
    currStatus: AnimFlashStatus;

    /**
     * 进入某个状态
     * @param status 
     */
    Enter (status: AnimFlashStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.currStatus.OnEnter ();
    }

    Get255 () {
        return this.rateVisibility * 255;
    }

    /**
     * 0 -> 1
     */
    GetRateTotal () {
        let msPassed = 0;
        if (this.currStatus == this.statusIn) {
            msPassed += this.rateVisibility * this.msFadeIn;
        };
        if (this.currStatus == this.statusOut) {
            msPassed += this.msFadeIn;
            msPassed += (1 - this.rateVisibility) * this.msFadeOut;
        };
        return msPassed / (this.msFadeIn + this.msFadeOut);
    }
}