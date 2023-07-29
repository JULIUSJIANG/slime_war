import UtilObjPool from "../basic/UtilObjPool";
import UtilObjPoolType from "../basic/UtilObjPoolType";
import MgrRes from "./MgrRes";
import MgrResAssets from "./MgrResAssets";
import MgrResAssetsLoadRecord from "./MgrResAssetsLoadRecord";
import MgrResAssetsStatus from "./MgrResAssetsStatus";
import MgrResBundle from "./MgrResBundle";
import MgrResBundleLoadRecord from "./MgrResBundleLoadRecord";
import MgrResBundleStatus from "./MgrResBundleStatus";

const APP = `MgrResBundleStatusIdle`;

/**
 * 资源管理器 - 状态 - 待机
 */
export default class MgrResBundleStatusIdle extends MgrResBundleStatus {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<MgrResBundleStatusIdle>({
        instantiate: () => {
            return new MgrResBundleStatusIdle ();
        },
        onPop: (t) => {
            
        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, mgrRes: MgrResBundle) {
        let val = UtilObjPool.Pop (MgrResBundleStatusIdle._t, apply);
        val.relMgr = mgrRes;
        return val;
    }

    public OnTaskAdd (): void {
        // 让加载状态代为处理
        this.relMgr.EnterStatus (this.relMgr.statusLoading);
    }
}