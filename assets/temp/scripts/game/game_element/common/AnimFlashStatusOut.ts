import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import AnimFlash from "./AnimFlash";
import AnimFlashStatus from "./AnimFlashStatus";

const APP = `AnimFlashStatusOut`;

/**
 * 动画 - 闪现 - 状态 - 渐出
 */
export default class AnimFlashStatusOut extends AnimFlashStatus {
    private static _t = new UtilObjPoolType <AnimFlashStatusOut> ({
        instantiate: () => {
            return new AnimFlashStatusOut ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relAnimFlash: AnimFlash) {
        let val = UtilObjPool.Pop (AnimFlashStatusOut._t, apply);
        val.relAnimFlash = relAnimFlash;
        return val;
    }

    OnStep (ms: number): void {
        this.relAnimFlash.rateVisibility -= ms / this.relAnimFlash.msFadeOut;
        this.relAnimFlash.rateVisibility = Math.max (this.relAnimFlash.rateVisibility, 0);
    }

    OnFlash(): void {
        this.relAnimFlash.Enter (this.relAnimFlash.statusIn);
    }
}