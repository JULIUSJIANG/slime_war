import BCPromiseCtrl from "../basic/BCPromiseCtrl";
import UtilObjPool from "../basic/UtilObjPool";
import UtilObjPoolType from "../basic/UtilObjPoolType";
import utilString from "../basic/UtilString";
import jiang from "../global/Jiang";
import MgrSdk from "../sdk/MgrSdk";
import MgrDataItem from "./MgrDataItem";
import MgrDataItemMediaRS from "./MgrDateItemMediaRS";

const APP = `MgrData`;

/**
 * 数据中心
 */
export default class MgrData {

    private constructor () {}

    private static _t = new UtilObjPoolType<MgrData> ({
        instantiate: () => {
            return new MgrData();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        return UtilObjPool.Pop(MgrData._t, apply);
    }

    /**
     * 全局唯一的单例
     */
    static inst = MgrData.Pop(APP);
    /**
     * 当前模块
     */
    _moduleSet: Set<MgrDataItem<unknown>> = UtilObjPool.Pop(UtilObjPool.typeSet, APP) as Set<MgrDataItem<unknown>>;
    
    /**
     * 添加模块
     * @param dataItem 
     */
    AddModule (dataItem: MgrDataItem<unknown>) {
        this._moduleSet.add(dataItem);
    }

    /**
     * 数据缓存
     */
    _dataCache: Map<MgrDataItem<any>, any> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    /**
     * 所有异步初始化
     */
    promiseArr: Array<Promise<unknown>> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);

    /**
     * 初始化的进程
     */
    initPromise = BCPromiseCtrl.Pop(APP);

    /**
     * 数据版本
     */
    dataVersion = 0;

    Init () {
        this.promiseArr.push (...MgrDataItemMediaRS.listRS.map ((media) => {
            return media.onLoad ();
        }));
        Promise.all(this.promiseArr)
            .then(() => {
                this.initPromise.resolve(null);
                jiang.mgrEvter.evterUpdate.On (() => {
                    this.Save ();
                });
            });
    }

    /**
     * 读取数据
     * @param dataItem 
     * @returns 
     */
    Get<T> (dataItem: MgrDataItem<T>): T {
        return this._dataCache.get(dataItem);
    }

    /**
     * 存储数据
     * @param dataItem 
     * @param t 
     * @returns 
     */
    Set<T> (dataItem: MgrDataItem<T>, t: T): void {
        this._dataCache.set(dataItem, t);
        dataItem.media.onSet ();
    }

    /**
     * 存储
     */
    Save () {
        for (let i = 0; i < MgrDataItemMediaRS.listRS.length; i++) {
            let mgrDataItemMediaRS = MgrDataItemMediaRS.listRS [i];
            mgrDataItemMediaRS.onSave ();
        };
    }

    /**
     * 存储
     */
    DoSave () {
        for (let i = 0; i < MgrDataItemMediaRS.listRS.length; i++) {
            let mgrDataItemMediaRS = MgrDataItemMediaRS.listRS [i];
            mgrDataItemMediaRS.onDoSave ();
        };
    }
}