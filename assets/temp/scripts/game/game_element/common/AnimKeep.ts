import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import AnimKeepStatus from "./AnimKeepStatus";
import AnimKeepStatusIn from "./AnimKeepStatusIn";
import AnimKeepStatusOut from "./AnimKeepStatusOut";


const APP = `AnimKeep`;

/**
 * 动画 - 状态维持
 */
export default class AnimKeep {

    private constructor () {}

    private static _t = new UtilObjPoolType <AnimKeep> ({
        instantiate: () => {
            return new AnimKeep ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, msFadeIn: number, msFadeOut: number) {
        let val = UtilObjPool.Pop (AnimKeep._t, apply);
        val.msFadeIn = msFadeIn;
        val.msFadeOut = msFadeOut;

        val.statusIn = AnimKeepStatusIn.Pop (apply, val);
        val.statusOut = AnimKeepStatusOut.Pop (apply, val);
        
        val.Enter (val.statusOut);
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
    statusIn: AnimKeepStatusIn;
    /**
     * 状态 - 渐出
     */
    statusOut: AnimKeepStatusOut;

    /**
     * 当前状态
     */
    currStatus: AnimKeepStatus;

    /**
     * 进入某个状态
     * @param status 
     */
    Enter (status: AnimKeepStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.currStatus.OnEnter ();
    }

    /**
     * 转为 0 - 255
     * @returns 
     */
    Get255 () {
        return this.rateVisibility * 255;
    }
}