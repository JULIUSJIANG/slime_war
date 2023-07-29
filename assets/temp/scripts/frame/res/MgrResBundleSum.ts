import UtilObjPool from "../basic/UtilObjPool";
import UtilObjPoolType from "../basic/UtilObjPoolType";
import MgrRes from "./MgrRes";
import MgrResBundle from "./MgrResBundle";
import MgrResBundleLoadRecord from "./MgrResBundleLoadRecord";
import MgrResConfig from "./MgrResConfig";

const APP = `MgrResBundleSum`;

/**
 * 资源包管理器整合 - 统筹多线程下载
 */
export default class MgrResBundleSum {
    private constructor () {}

    private static _t = new UtilObjPoolType<MgrResBundleSum>({
        instantiate: () => {
            return new MgrResBundleSum ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relMgr: MgrRes) {
        let val = UtilObjPool.Pop (MgrResBundleSum._t, apply);
        val.relMgr = relMgr;
        while (val.listBundleLoader.length < MgrResConfig.MAX_ASYNC_COUNT) {
            val.listBundleLoader.push (MgrResBundle.Pop (apply, val, val.listBundleLoader.length));
        };
        return val;
    }

    /**
     * 资源包加载管理器
     */
    listBundleLoader: Array <MgrResBundle> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
    /**
     * 归属的资源管理器
     */
    relMgr: MgrRes;
    /**
     * 当前要加载的任务
     */
    listTask: Array <MgrResBundleLoadRecord> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
    /**
     * 路径到下载记录的映射
     */
    mapPathToLoadRecord: Map<string, MgrResBundleLoadRecord> = UtilObjPool.Pop (UtilObjPool.typeMap, APP);
    /**
     * 已加载的资源包集合
     */
    listLoadedBundle: Array <cc.AssetManager.Bundle> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);

    /**
     * 获取加载记录，没有的话记得新建
     * @param path 
     * @returns 
     */
    GetLoadRecord (path: string): MgrResBundleLoadRecord {
        // 还没有记录的话
        if (!this.mapPathToLoadRecord.has (path)) {
            // 新建加载记录
            let loadRecord = MgrResBundleLoadRecord.Pop (APP, path);
            // 记录加载记录
            this.mapPathToLoadRecord.set (path, loadRecord);
            // 加入任务队列
            this.listTask.push (loadRecord);
            for (let i = 0; i < this.listBundleLoader.length; i++) {
                // 告诉加载器们，加载任务的队列有变化
                this.listBundleLoader [i].currStatus.OnTaskAdd ();
            };
        };
        return this.mapPathToLoadRecord.get (path);
    }

    /**
     * 获取资源包
     * @param path 
     * @returns 
     */
    GetBundle (path: string) {
        if (!this.mapPathToLoadRecord.has (path)) {
            return null;
        };
        return this.mapPathToLoadRecord.get (path).content;
    }
}