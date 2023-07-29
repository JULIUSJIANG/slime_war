import UtilObjPool from "../basic/UtilObjPool";
import UtilObjPoolType from "../basic/UtilObjPoolType";
import MgrData from "./MgrData";
import MgrDataType from "./MgrDataType";
import MgrDataItemMediaRS from "./MgrDateItemMediaRS";

const APP = `MgrDataItem`;

/**
 * 数据单元
 */
export default class MgrDataItem<T> {

    private constructor () {}

    private static _t = new UtilObjPoolType<MgrDataItem<any>>({
        instantiate: () => {
            return new MgrDataItem();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop<T> (
        apply: string,
        tag: string,
        valType: MgrDataType<T>,
        defVal: () => T,
        media: MgrDataItemMediaRS 
    )
    {
        let val = UtilObjPool.Pop(MgrDataItem._t, apply) as MgrDataItem<T>;
        val.tag = tag;
        val.valType = valType;
        val.defVal = defVal;
        val.media = media;

        MgrData.inst.AddModule( val );
        return val;
    }

    /**
     * 标签
     */
    tag: string;
    /**
     * 值的类型
     */
    valType: MgrDataType<T>;
    /**
     * 默认值
     */
    defVal: () => T;
    /**
     * 媒介
     */
    media: MgrDataItemMediaRS;
}