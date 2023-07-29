import UtilObjPool from "../basic/UtilObjPool";
import UtilObjPoolType from "../basic/UtilObjPoolType";
import MgrRes from "./MgrRes";
import MgrResAssetsStatus from "./MgrResAssetsStatus";
import MgrResAssetsStatusIdle from "./MgrResAssetsStatusIdle";
import MgrResAssetsStatusLoading from "./MgrResAssetsStatusLoading";
import MgrResBundleStatus from "./MgrResBundleStatus";
import MgrResBundleStatusIdle from "./MgrResBundleStatusIdle";
import MgrResBundleStatusLoading from "./MgrResBundleStatusLoading";
import MgrResBundleSum from "./MgrResBundleSum";

const APP = `MgrResBundle`;

/**
 * 资源包下载管理器 - 单个下载任务的管理
 */
export default class MgrResBundle {
    private constructor () {}

    private static _t = new UtilObjPoolType<MgrResBundle>({
        instantiate: () => {
            return new MgrResBundle ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relMgr: MgrResBundleSum, idx: number) {
        let val = UtilObjPool.Pop (MgrResBundle._t, apply);
        val.idx = idx;
        val.relMgr = relMgr;
        val.statusIdle = MgrResBundleStatusIdle.Pop (APP, val);
        val.statusLoading = MgrResBundleStatusLoading.Pop (APP, val);
        val.EnterStatus (val.statusIdle);
        return val;
    }
    /**
     * 索引
     */
    idx: number;
    /**
     * 归属的资源管理器
     */
    relMgr: MgrResBundleSum;
    
    /**
     * 状态 - 待机
     */
    statusIdle: MgrResBundleStatusIdle;
    /**
     * 状态 - 加载中
     */
    statusLoading: MgrResBundleStatusLoading;
    /**
     * 当前状态
     */
    currStatus: MgrResBundleStatus;
    /**
     * 进入某状态
     * @param status 
     */
    EnterStatus (status: MgrResBundleStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.currStatus.OnEnter ();
    }
}