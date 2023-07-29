import UtilObjPool from "../UtilObjPool";
import UtilObjPoolType from "../UtilObjPoolType";
import LayoutEle from "./LayoutEle";

const APP = `LayoutCollectionColumn`;

/**
 * 排版的收纳记录
 */
export default class LayoutCollection {

    private constructor () {}

    private static _t = new UtilObjPoolType<LayoutCollection>({
        instantiate: () => {
            return new LayoutCollection();
        },
        onPop: (t) => {

        },
        onPush: (t) => {
            t.listEle.length = 0;
        },
        tag: APP
    });

    static Pop (
        apply: string,
        
        idx: number
    )
    {
        let val = UtilObjPool.Pop(LayoutCollection._t, apply);
        val.idx = idx;
        return val;
    }

    /**
     * 索引
     */
    idx: number;

    /**
     * 容器 - 收纳了的元素
     */
    listEle: Array<LayoutEle> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);

    /**
     * 列容器的宽度
     */
    size: number;

    /**
     * 起始刻度
     */
    posStart: number;
    /**
     * 结束刻度
     */
    posEnd: number;

    /**
     * 起始拓展区域的刻度
     */
    extendStart: number;
    /**
     * 结束拓展区域的刻度
     */
    extendEnd: number;
}