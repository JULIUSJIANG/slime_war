import BCPromiseCtrl from "../basic/BCPromiseCtrl";
import UtilObjPool from "../basic/UtilObjPool";
import UtilObjPoolType from "../basic/UtilObjPoolType";
import MgrResAssets from "./MgrResAssets";
import MgrResAssetsLoadRecord from "./MgrResAssetsLoadRecord";
import MgrResAssetsSum from "./MgrResAssetsSum";
import MgrResBundle from "./MgrResBundle";
import MgrResBundleSum from "./MgrResBundleSum";
import MgrResConfig from "./MgrResConfig";

const APP = `MgrRes`;

/**
 * 资源管理器 - 统筹资源包、具体资源下载
 */
class MgrRes {

    private constructor () {}

    private static _t = new UtilObjPoolType<MgrRes>({
        instantiate: () => {
            return new MgrRes();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        let val = UtilObjPool.Pop(MgrRes._t, apply);
        val.mgrAssets = MgrResAssetsSum.Pop (APP, val);
        val.mgrBundle = MgrResBundleSum.Pop (APP, val);
        return val;
    }

    /**
     * 实例
     */
    static inst = MgrRes.Pop(APP);
    
    /**
     * 资源管理器
     */
    mgrAssets: MgrResAssetsSum;
    /**
     * 包管理器
     */
    mgrBundle: MgrResBundleSum;

    /**
     * 静态的预制体缓存
     */
    _staticPrefabCache: Map<string, cc.Prefab> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);
    
    /**
     * 获取预制体
     * @param resPath 
     * @returns 
     */
    GetPrefab (resPath: string) {
        if (this._staticPrefabCache.has(resPath)) {
            return this._staticPrefabCache.get(resPath);
        };
        return this.mgrAssets.GetLoadRecord(resPath).content as cc.Prefab;
    }

    /**
     * 异步数量许可
     */
    get asyncAble () {
        // 除非有要求，否则都是 1，以此保住帧率
        return 0 < this._asyncMaxApplied.size ? MgrResConfig.MAX_ASYNC_COUNT : 1
    }
    /**
     * 最大异步数量 - id 生成器
     */
    private _asyncMaxIdGen: number = 0;
    /**
     * 最大异步数量 - 已生效 id
     */
    private _asyncMaxApplied: Set<number> = UtilObjPool.Pop (UtilObjPool.typeSet, APP);
    /**
     * 要求异步数量提到最大，不管帧率问题
     * @returns 
     */
    AsyncMaxApp () {
        let id = ++this._asyncMaxIdGen;
        this._asyncMaxApplied.add (id);
        return id;
    }
    /**
     * 取消异步数量要求
     * @param id 
     */
    AsyncMaxCancel (id: number) {
        this._asyncMaxApplied.delete (id);
    }
}

export default MgrRes;