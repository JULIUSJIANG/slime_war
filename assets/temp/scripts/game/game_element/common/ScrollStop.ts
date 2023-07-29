import IndexDataModule from "../../../IndexDataModule";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import ScrollStopStatus from "./ScrollStopStatus";
import ScrollStopStatusGo from "./ScrollStopStatusGo";
import ScrollStopStatusIdle from "./ScrollStopStatusIdle";

const APP = `ScrollStop`;

/**
 * 滚动视图辅助 - 停止滚动
 */
export default class ScrollStop {

    private constructor () {}

    private static _t = new UtilObjPoolType <ScrollStop> ({
        instantiate: () => {
            return new ScrollStop ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {
            
        },
        tag: APP
    });

    static Pop (apply: string, relModule: IndexDataModule) {
        let val = UtilObjPool.Pop (ScrollStop._t, apply);
        val.relModule = relModule;
        val.statusIdle = ScrollStopStatusIdle.Pop (apply, val);
        val.statusGo = ScrollStopStatusGo.Pop (apply, val);
        val.Enter (val.statusIdle);
        return val;
    }

    /**
     * 状态 - 待机
     */
    statusIdle: ScrollStopStatusIdle;
    /**
     * 状态 - 进行时
     */
    statusGo: ScrollStopStatusGo;
    /**
     * 当前状态
     */
    currStatus: ScrollStopStatus;
    /**
     * 用于触发刷新的模块
     */
    relModule: IndexDataModule;

    /**
     * 进入某个状态
     * @param status 
     */
    Enter (status: ScrollStopStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.currStatus.OnEnter ();
    }
}