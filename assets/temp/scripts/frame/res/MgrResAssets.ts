import UtilObjPool from "../basic/UtilObjPool";
import UtilObjPoolType from "../basic/UtilObjPoolType";
import MgrRes from "./MgrRes";
import MgrResAssetsStatus from "./MgrResAssetsStatus";
import MgrResAssetsStatusIdle from "./MgrResAssetsStatusIdle";
import MgrResAssetsStatusLoading from "./MgrResAssetsStatusLoading";
import MgrResAssetsSum from "./MgrResAssetsSum";

const APP = `MgrResAssets`;

/**
 * 资源下载管理器
 */
export default class MgrResAssets {
    private constructor () {}
    private static _t = new UtilObjPoolType<MgrResAssets>({
        instantiate: () => {
            return new MgrResAssets ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relMgr: MgrResAssetsSum, idx: number) {
        let val = UtilObjPool.Pop (MgrResAssets._t, apply);
        val.idx = idx;
        val.relMgr = relMgr;
        val.statusIdle = MgrResAssetsStatusIdle.Pop (APP, val);
        val.statusLoading = MgrResAssetsStatusLoading.Pop (APP, val);
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
    relMgr: MgrResAssetsSum;
    
    /**
     * 状态 - 待机
     */
    statusIdle: MgrResAssetsStatusIdle;
    /**
     * 状态 - 加载中
     */
    statusLoading: MgrResAssetsStatusLoading;
    /**
     * 当前状态
     */
    currStatus: MgrResAssetsStatus;
    /**
     * 进入某状态
     * @param status 
     */
    EnterStatus (status: MgrResAssetsStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.currStatus.OnEnter ();
    }
}