import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import AnimKeep from "./AnimKeep";
import AnimKeepStatus from "./AnimKeepStatus";

const APP = `AnimKeepStatusIn`;

/**
 * 动画 - 状态维持 - 状态 - 渐入
 */
export default class AnimKeepStatusIn extends AnimKeepStatus {
    private static _t = new UtilObjPoolType <AnimKeepStatusIn> ({
        instantiate: () => {
            return new AnimKeepStatusIn ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relGameFade: AnimKeep) {
        let val = UtilObjPool.Pop (AnimKeepStatusIn._t, apply);
        val.relGameFade = relGameFade;
        return val;
    }

    OnStep (ms: number): void {
        this.relGameFade.rateVisibility += ms / this.relGameFade.msFadeIn;
        this.relGameFade.rateVisibility = Math.min (this.relGameFade.rateVisibility, 1);
    }

    OnFadeOut(): void {
        this.relGameFade.Enter (this.relGameFade.statusOut);
    }
}