import UtilObjPool from "../basic/UtilObjPool";
import UtilObjPoolType from "../basic/UtilObjPoolType";
import MgrRes from "./MgrRes";
import MgrResAssets from "./MgrResAssets";
import MgrResAssetsLoadRecord from "./MgrResAssetsLoadRecord";
import MgrResAssetsStatus from "./MgrResAssetsStatus";

const APP = `MgrResAssetsStatusIdle`;

/**
 * 资源管理器 - 状态 - 待机
 */
export default class MgrResAssetsStatusIdle extends MgrResAssetsStatus {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<MgrResAssetsStatusIdle>({
        instantiate: () => {
            return new MgrResAssetsStatusIdle ();
        },
        onPop: (t) => {
            
        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, mgrRes: MgrResAssets) {
        let val = UtilObjPool.Pop (MgrResAssetsStatusIdle._t, apply);
        val.relMgr = mgrRes;
        return val;
    }

    public OnTaskAdd (): void {
        // 进入加载状态
        this.relMgr.EnterStatus (this.relMgr.statusLoading);
    }
}