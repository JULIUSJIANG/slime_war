import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import AnimKeep from "./AnimKeep";
import AnimKeepStatus from "./AnimKeepStatus";

const APP = `AnimKeepStatusOut`;

/**
 * 动画 - 状态维持 - 状态 - 渐出
 */
export default class AnimKeepStatusOut extends AnimKeepStatus {
    private static _t = new UtilObjPoolType <AnimKeepStatusOut> ({
        instantiate: () => {
            return new AnimKeepStatusOut ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relGameFade: AnimKeep) {
        let val = UtilObjPool.Pop (AnimKeepStatusOut._t, apply);
        val.relGameFade = relGameFade;
        return val;
    }

    OnStep (ms: number): void {
        this.relGameFade.rateVisibility -= ms / this.relGameFade.msFadeOut;
        this.relGameFade.rateVisibility = Math.max (this.relGameFade.rateVisibility, 0);
    }

    OnFadeIn(): void {
        this.relGameFade.Enter (this.relGameFade.statusIn);
    }
}