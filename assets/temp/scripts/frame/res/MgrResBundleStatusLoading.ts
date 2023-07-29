import IndexDataModule from "../../IndexDataModule";
import UtilObjPool from "../basic/UtilObjPool";
import UtilObjPoolType from "../basic/UtilObjPoolType";
import jiang from "../global/Jiang";
import MgrSdk from "../sdk/MgrSdk";
import MgrRes from "./MgrRes";
import MgrResAssets from "./MgrResAssets";
import MgrResAssetsLoadRecord from "./MgrResAssetsLoadRecord";
import MgrResAssetsStatus from "./MgrResAssetsStatus";
import MgrResBundle from "./MgrResBundle";
import MgrResBundleLoadRecord from "./MgrResBundleLoadRecord";
import MgrResBundleStatus from "./MgrResBundleStatus";

const APP = `MgrResBundleStatusLoading`;

/**
 * 资源管理器 - 状态 - 正在加载内容
 */
export default class MgrResBundleStatusLoading extends MgrResBundleStatus {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<MgrResBundleStatusLoading>({
        instantiate: () => {
            return new MgrResBundleStatusLoading ();
        },
        onPop: (t) => {
            
        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, mgrRes: MgrResBundle) {
        let val = UtilObjPool.Pop (MgrResBundleStatusLoading._t, apply);
        val.relMgr = mgrRes;
        return val;
    }

    public OnEnter(): void {
        this.Go ();
    }

    private Go () {
        // 所有任务加载完成，回到空闲状态
        if (this.relMgr.relMgr.listTask.length == 0) {
            this.relMgr.EnterStatus (this.relMgr.statusIdle)
            return;
        };

        // 超过最大异步数，忽略
        if (this.relMgr.relMgr.relMgr.asyncAble <= this.relMgr.idx) {
            this.relMgr.EnterStatus (this.relMgr.statusIdle)
            return;
        };

        // 提取任务
        let task = this.relMgr.relMgr.listTask.shift ();
        MgrSdk.inst.Log(`加载 [${task.path}]..`);
        cc.assetManager.loadBundle (task.path, (err: any) => {
            if (err) {
                task.process.reject (err);
            }
            else {
                let bundle = cc.assetManager.getBundle (task.path);
                this.relMgr.relMgr.listLoadedBundle.push (bundle);
                task.process.resolve (bundle);
            };
            // 继续处理任务队列中的剩余任务
            this.Go ();
        });
    }
}