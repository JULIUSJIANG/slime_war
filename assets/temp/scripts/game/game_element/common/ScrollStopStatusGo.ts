import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import ScrollStop from "./ScrollStop";
import ScrollStopStatus from "./ScrollStopStatus";

const APP = `ScrollStopStatusGo`;

/**
 * 滚动视图辅助 - 停止滚动 - 状态 - 进行中
 */
export default class ScrollStopStatusGo extends ScrollStopStatus {
    private static _t = new UtilObjPoolType <ScrollStopStatusGo> ({
        instantiate: () => {
            return new ScrollStopStatusGo ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relMachine: ScrollStop) {
        let val = UtilObjPool.Pop (ScrollStopStatusGo._t, apply);
        val.relMachine = relMachine;
        return val;
    }

    OnApply(): void {
        this.relMachine.Enter (this.relMachine.statusIdle)
        jiang.mgrUI.ModuleRefresh (this.relMachine.relModule);
    }

    OnScrollAble(): boolean {
        return false;
    }
}