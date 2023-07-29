import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import AnimFlash from "./AnimFlash";
import AnimFlashStatus from "./AnimFlashStatus";

const APP = `AnimFlashStatusIn`;

/**
 * 动画 - 闪现 - 状态 - 渐入
 */
export default class AnimFlashStatusIn extends AnimFlashStatus {
    private static _t = new UtilObjPoolType <AnimFlashStatusIn> ({
        instantiate: () => {
            return new AnimFlashStatusIn ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relAnimFlash: AnimFlash) {
        let val = UtilObjPool.Pop (AnimFlashStatusIn._t, apply);
        val.relAnimFlash = relAnimFlash;
        return val;
    }

    OnStep (ms: number): void {
        this.relAnimFlash.rateVisibility += ms / this.relAnimFlash.msFadeIn;
        this.relAnimFlash.rateVisibility = Math.min (this.relAnimFlash.rateVisibility, 1);
        if (this.relAnimFlash.rateVisibility == 1) {
            this.relAnimFlash.Enter (this.relAnimFlash.statusOut);
        };
    }
}