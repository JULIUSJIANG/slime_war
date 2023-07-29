import indexDataStorageItem from "../../../IndexStorageItem";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import LvUpBatchViewState from "./LvUpBatchViewState";

const APP = `LvUpBatchViewStateItemRecord`;

/**
 * 升级元素的记录
 */
export default class LvUpBatchViewStateItemRecord {
    private constructor () {}

    private static _t = new UtilObjPoolType <LvUpBatchViewStateItemRecord> ({
        instantiate: () => {
            return new LvUpBatchViewStateItemRecord ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (
        apply: string,
        relState: LvUpBatchViewState,
        data: indexDataStorageItem.EquipmentRecord
    ) 
    {
        let val = UtilObjPool.Pop (LvUpBatchViewStateItemRecord._t, apply);
        val.relState = relState;
        val.data = data;
        return val;
    }

    /**
     * 归属的界面状态
     */
    relState: LvUpBatchViewState;

    /**
     * 得到升级
     */
    isLvUped: boolean;

    /**
     * 核心数据
     */
    data: indexDataStorageItem.EquipmentRecord;

    /**
     * 所在位置
     */
    idx: number;

    /**
     * 数量
     */
    tempCount: number;
    /**
     * 刷新数量
     */
    UpdateTempCount () {
        this.tempCount = this.data.count;
    }

    /**
     * 当前索引
     */
    tempIdx: number;
    /**
     * 刷新索引
     */
    UpdateTempIdx () {
        this.tempIdx = this.idx;
    }
}