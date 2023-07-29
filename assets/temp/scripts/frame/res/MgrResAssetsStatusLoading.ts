import IndexDataModule from "../../IndexDataModule";
import UtilObjPool from "../basic/UtilObjPool";
import UtilObjPoolType from "../basic/UtilObjPoolType";
import jiang from "../global/Jiang";
import MgrSdk from "../sdk/MgrSdk";
import MgrRes from "./MgrRes";
import MgrResAssets from "./MgrResAssets";
import MgrResAssetsLoadRecord from "./MgrResAssetsLoadRecord";
import MgrResAssetsStatus from "./MgrResAssetsStatus";

const APP = `MgrResStatusLoading`;

/**
 * 资源管理器 - 状态 - 正在加载内容
 */
export default class MgrResAssetsStatusLoading extends MgrResAssetsStatus {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<MgrResAssetsStatusLoading>({
        instantiate: () => {
            return new MgrResAssetsStatusLoading ();
        },
        onPop: (t) => {
            
        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, mgrRes: MgrResAssets) {
        let val = UtilObjPool.Pop (MgrResAssetsStatusLoading._t, apply);
        val.relMgr = mgrRes;
        return val;
    }

    public OnEnter(): void {
        this.Go ();
    }

    private static _sort = (a: MgrResAssetsLoadRecord<any>, b: MgrResAssetsLoadRecord<any>) => a.priorityForUI - b.priorityForUI;

    private Go () {
        // 没有任务，忽略
        if (this.relMgr.relMgr.listTask.length == 0) {
            this.relMgr.EnterStatus (this.relMgr.statusIdle)
            return;
        };
        
        // 超过最大异步数，忽略
        if (this.relMgr.relMgr.relMgr.asyncAble <= this.relMgr.idx) {
            this.relMgr.EnterStatus (this.relMgr.statusIdle)
            return;
        };

        // 数据发生变化的话，排序一遍
        if (this.relMgr.relMgr.versionSortedLast != this.relMgr.relMgr.priorityVersion) {
            this.relMgr.relMgr.versionSortedLast = this.relMgr.relMgr.priorityVersion
            this.relMgr.relMgr.listTask.sort (MgrResAssetsStatusLoading._sort);
        };
        let task = this.relMgr.relMgr.listTask.shift ();
        MgrSdk.inst.Log(`加载 [${task.pathBundle}] [${task.pathAssets}]..`);
        let bundle = this.relMgr.relMgr.relMgr.mgrBundle.GetBundle (task.pathBundle);
        // 确实在子包里面，那么通过子包加载
        bundle.load<cc.Asset> (task.pathAssets, (err: any) => {
            if (err) {
                // 延期重试
                task.cd += 1000;
                console.error (`加载 [${task.pathBundle}] [${task.pathAssets}] 失败，[${task.cd}] ms 后重试...`)
                setTimeout(() => {
                    this.relMgr.relMgr.AddTask (task);
                }, task.cd);
            }
            else {
                task.process.resolve(bundle.get<cc.Asset>(task.pathAssets));
            };
            // 自循环继续
            this.Go ();
            // 可能加载的是 ui 要用到的资源，那么加载一遍画面
            jiang.mgrUI.ModuleRefresh (IndexDataModule.RELOAD);
        });
    }
    
    /**
     * 数据版本
     */
    public dataVersion: number = 0;
    /**
     * 最新一次排序的版本
     */
    public lastSortedVersion: number = 0;
}