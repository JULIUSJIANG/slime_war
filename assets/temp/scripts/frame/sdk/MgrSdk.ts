import indexBuildConfig from "../../IndexBuildConfig";
import UtilObjPool from "../basic/UtilObjPool";
import UtilObjPoolType from "../basic/UtilObjPoolType";
import MgrSdkCore from "./MgrSdkCore";
import MgrSdkCoreH5 from "./MgrSdkCoreH5";
import MgrSdkCoreWX from "./wx/MgrSdkCoreWX";

const APP = `MgrSdk`;

const LOG_ABLE = true;

/**
 * sdk 管理器
 */
export default class MgrSdk {

    private constructor () {
        if (MgrSdkCoreWX.wx) {
            this.core = MgrSdkCoreWX.Pop (APP);
            return;
        };
        this.core = MgrSdkCoreH5.Pop (APP);
    }

    private static _t = new UtilObjPoolType<MgrSdk>({
        instantiate: () => {
            return new MgrSdk();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        return UtilObjPool.Pop(MgrSdk._t, apply);
    }

    /**
     * 全局实例
     */
    static inst = MgrSdk.Pop(APP);

    /**
     * 实际核心
     */
    core: MgrSdkCore;

    /**
     * 打印信息
     * @param msg
     */
    Log (...msg: Array<any>) {
        if (!indexBuildConfig.IS_DEBUG) {
            return;
        };
        if (!LOG_ABLE) {
            return
        };
        console.log (...msg);
    }

    /**
     * 进行错误提示
     * @param msg 
     */
    Error (...msg: Array<any>) {
        if (!indexBuildConfig.IS_DEBUG) {
            return;
        };
        console.error (...msg);
    }

    /**
     * 是否为 pc 端
     * @returns 
     */
    IsPc () {
        return !cc.sys.isMobile;
    }
}