import UtilObjPool from "../UtilObjPool";
import UtilObjPoolType from "../UtilObjPoolType";

const APP = `LayoutEle`;

/**
 * 排版模块里面的元素记录
 */
export default class LayoutEle {

    private constructor () {}

    private static _t = new UtilObjPoolType<LayoutEle>({
        instantiate: () => {
            return new LayoutEle();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (
        apply: string,
        id: number,
        width: number,
        height: number
    ) 
    {
        let val = UtilObjPool.Pop(LayoutEle._t, apply);
        val.id = id;
        val.sizeWidth = width;
        val.sizeHeight = height;
        return val;
    }

    /**
     * 标识
     */
    id: number;

    /**
     * 宽
     */
    sizeWidth: number;
    /**
     * 高
     */
    sizeHeight: number;

    /**
     * 格子位的 x 坐标
     */
    gridIdxX: number;
    /**
     * 格子位的 y 坐标
     */
    gridIdxY: number;

    /**
     * 坐标 x
     */
    posX: number;
    /**
     * 坐标 y
     */
    posY: number;
}