import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import ScrollStop from "./ScrollStop";
import ScrollStopStatus from "./ScrollStopStatus";

const APP = `ScrollStopStatusIdle`;

/**
 * 滚动视图辅助 - 停止滚动 - 状态 - 待机
 */
export default class ScrollStopStatusIdle extends ScrollStopStatus {
    private static _t = new UtilObjPoolType <ScrollStopStatusIdle> ({
        instantiate: () => {
            return new ScrollStopStatusIdle ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relMachine: ScrollStop) {
        let val = UtilObjPool.Pop (ScrollStopStatusIdle._t, apply);
        val.relMachine = relMachine;
        return val;
    }

    OnStop(): void {
        this.relMachine.Enter (this.relMachine.statusGo);
        jiang.mgrUI.ModuleRefresh (this.relMachine.relModule);
    }

    OnScrollAble(): boolean {
        return true;
    }
}