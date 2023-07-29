import BCPromiseCtrl from "../basic/BCPromiseCtrl";
import UtilObjPool from "../basic/UtilObjPool";
import UtilObjPoolType from "../basic/UtilObjPoolType";
import MgrRes from "./MgrRes";

const APP = `MgrResAssetsLoadRecord`;

/**
 * 资源加载记录
 */
export default class MgrResAssetsLoadRecord<T> {
    /**
     * 资源包路径
     */
    pathBundle: string;
    /**
     * 资源路径
     */
    pathAssets: string;
    /**
     * 实际内容
     */
    content: T;
    /**
     * 进度
     */
    process: BCPromiseCtrl<T> = BCPromiseCtrl.Pop (APP);
    /**
     * 冷却
     */
    cd: number = 0;

    /**
     * 优先级
     */
    private _priorityForUI: number;
    /**
     * 加载的优先级
     */
    get priorityForUI () {
        return this._priorityForUI;
    }
    set priorityForUI (val: number) {
        this._priorityForUI = val;
        // 提醒下次提取任务前记得排序
        MgrRes.inst.mgrAssets.priorityVersion++;
    }
    private constructor () {}
    private static _t = new UtilObjPoolType<MgrResAssetsLoadRecord<any>>({
        instantiate: () => {
            return new MgrResAssetsLoadRecord();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop<T> (apply: string, pathBundle: string, pathAssets: string) {
        let val = UtilObjPool.Pop(MgrResAssetsLoadRecord._t, apply);
        val.pathBundle = pathBundle;
        val.pathAssets = pathAssets;
        val.process._promise.then(( t ) => {
            val.content = t;
        });
        return val;
    }
}