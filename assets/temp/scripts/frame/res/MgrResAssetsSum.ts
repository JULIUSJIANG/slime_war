import UtilObjPool from "../basic/UtilObjPool";
import UtilObjPoolType from "../basic/UtilObjPoolType";
import MgrRes from "./MgrRes";
import MgrResAssets from "./MgrResAssets";
import MgrResAssetsLoadRecord from "./MgrResAssetsLoadRecord";
import MgrResConfig from "./MgrResConfig";

const APP = `MgrResAssetsSum`;

/**
 * 资源下载管理器
 */
export default class MgrResAssetsSum {
    private constructor () {}
    private static _t = new UtilObjPoolType<MgrResAssetsSum>({
        instantiate: () => {
            return new MgrResAssetsSum ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relMgr: MgrRes) {
        let val = UtilObjPool.Pop (MgrResAssetsSum._t, apply);
        val.relMgr = relMgr;
        while (val.listAssetsLoader.length < MgrResConfig.MAX_ASYNC_COUNT) {
            val.listAssetsLoader.push (MgrResAssets.Pop (apply, val, val.listAssetsLoader.length));
        };
        return val;
    }
    /**
     * 资源加载管理器
     */
    listAssetsLoader: Array <MgrResAssets> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
    /**
     * 归属的资源管理器
     */
    relMgr: MgrRes;
    /**
     * 当前要加载的任务
     */
    listTask: Array <MgrResAssetsLoadRecord< any >> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
    /**
     * 路径到下载记录的映射
     */
    mapPathToLoadRecord: Map<string, MgrResAssetsLoadRecord< any >> = UtilObjPool.Pop (UtilObjPool.typeMap, APP);

    /**
     * 获取加载记录，没有的话记得新建
     * @param path 
     */
    GetLoadRecord (path: string): MgrResAssetsLoadRecord<any> {
        // 还没有记录的话
        if (!this.mapPathToLoadRecord.has (path)) {
            // 把地址分割成单个词
            let pathSplit = path.split (/\//g);
            // 得到包路径
            let pathBundle = pathSplit.shift ();
            // 得到资源路径
            let pathAssets = pathSplit.join (`\/`);
            // 生成下载任务
            let loadRecord = MgrResAssetsLoadRecord.Pop<any> (APP, pathBundle, pathAssets);
            // 记录下载任务
            this.mapPathToLoadRecord.set (path, loadRecord);
            // 归属的包加载完以后
            this.relMgr.mgrBundle.GetLoadRecord (pathBundle)
                .process
                ._promise
                .then (() => {
                    this.AddTask (loadRecord);
                });
        };
        return this.mapPathToLoadRecord.get (path);
    }

    /**
     * 添加任务
     * @param loadRecord 
     */
    AddTask (loadRecord: MgrResAssetsLoadRecord<any>) {
        // 加入任务队列
        this.listTask.push (loadRecord);
        // 有新增任务，那么优先级数据算作变化
        this.priorityVersion++;
        // 通知加载器们，有新增任务
        for (let i = 0; i < this.listAssetsLoader.length; i++) {
            this.listAssetsLoader [i].currStatus.OnTaskAdd ();
        };
    }

    /**
     * 优先级版本
     */
    priorityVersion: number = 0;
    /**
     * 最新一次排序的优先级版本
     */
    versionSortedLast: number;
}