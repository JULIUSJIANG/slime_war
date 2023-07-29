import BCPromiseCtrl from "../basic/BCPromiseCtrl";
import UtilObjPool from "../basic/UtilObjPool";
import utilString from "../basic/UtilString";
import MgrSdk from "../sdk/MgrSdk";
import MgrData from "./MgrData";

const APP = `MgrDataItemMediaRS`;

/**
 * 存储介质的注册信息
 */
class MgrDataItemMediaRS {
    /**
     * 事件派发 - 加载
     */
    onLoad: () => Promise <unknown>;
    /**
     * 事件派发 - 更改
     */
    onSet: () => void;
    /**
     * 事件派发 - 存储
     */
    onSave: () => void;
    /**
     * 执行存储
     */
    onDoSave: () => void;

    constructor (args: {
        onLoad: () => Promise <unknown>,
        onSet: () => void,
        onSave: () => void,
        onDoSave: () => void
    }) {
        this.onLoad = args.onLoad;
        this.onSet = args.onSet;
        this.onSave = args.onSave;
        this.onDoSave = args.onDoSave;

        MgrDataItemMediaRS.listRS.push (this);
    }
}

namespace MgrDataItemMediaRS {
    /**
     * 所有媒介的集合
     */
    export const listRS: Array <MgrDataItemMediaRS> = [];

    /**
     * 本地数据的版本
     */
    let localVersion = 0;
    /**
     * 本地数据的版本 - 已存储
     */
    let localVersionStoraged = 0;
    /**
     * 本地存储
     */
    export const local = new MgrDataItemMediaRS ({
        onLoad: () => {
            let ctrl = BCPromiseCtrl.Pop (APP);
            MgrSdk.inst.core.LocalGet ()
                .then ((data) => {
                    data = data || {};
                    MgrData.inst._moduleSet.forEach ((dataItem) => {
                        // 忽略非本地媒介的数据
                        if (dataItem.media != local) {
                            return;
                        };
                        let val = data [dataItem.tag];
                        if (val == null) {
                            MgrData.inst._dataCache.set(dataItem, dataItem.defVal());
                        }
                        else {
                            MgrData.inst._dataCache.set(dataItem, val);
                        };
                    });
                    ctrl.resolve (null);
                });
            return ctrl._promise;
        },
        onSet: () => {
            localVersion++;
        },
        onSave: () => {
            if (localVersionStoraged == localVersion) {
                return;
            };
            localVersionStoraged = localVersion;
            local.onDoSave ();
        },
        onDoSave: () => {
            let data = {};
            MgrData.inst._dataCache.forEach(( val, index ) => {
                if (index.media != local) {
                    return;
                };
                data [index.tag] = val;
            });
            MgrSdk.inst.core.LocalSet (data); 
        }
    });

    /**
     * 服务器数据的版本
     */
    let serverVersion = 0;
    /**
     * 服务器数据的版本 - 已存储
     */
    let serverVersionStoraged = 0;
    /**
     * 服务器存储
     */
    export const server = new MgrDataItemMediaRS ({
        onLoad: () => {
            let ctrl = BCPromiseCtrl.Pop (APP);
            MgrSdk.inst.core.ServerGet ()
                .then ((data) => {
                    data = data || {};
                    MgrData.inst._moduleSet.forEach ((dataItem) => {
                        // 忽略非本地媒介的数据
                        if (dataItem.media != server) {
                            return;
                        };
                        let val = data [dataItem.tag];
                        if (val == null) {
                            MgrData.inst._dataCache.set(dataItem, dataItem.defVal());
                        }
                        else {
                            MgrData.inst._dataCache.set(dataItem, val);
                        };
                    });
                    ctrl.resolve (null);
                });
            return ctrl._promise;
        },
        onSet: () => {
            serverVersion++;
        },
        onSave: () => {
            if (serverVersionStoraged == serverVersion) {
                return;
            };
            serverVersionStoraged = serverVersion;
            server.onDoSave ();
        },
        onDoSave: () => {
            let data = {};
            MgrData.inst._dataCache.forEach(( val, index ) => {
                if (index.media != server) {
                    return;
                };
                data [index.tag] = val;
            });
            MgrSdk.inst.core.ServerSet (data); 
        }
    });
}

export default MgrDataItemMediaRS;