import UtilObjPool from "../UtilObjPool";
import UtilObjPoolType from "../UtilObjPoolType";
import Layout from "./Layout";
import LayoutStartAxis from "./LayoutStartAxis";

const APP = `LayoutStartAxisHor`;

/**
 * 数据层排版 - 起始方向 - 水平线
 */
export default class LayoutStartAxisHor extends LayoutStartAxis {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<LayoutStartAxisHor>({
        instantiate: () => {
            return new LayoutStartAxisHor();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (
        apply: string
    )
    {
        let val = UtilObjPool.Pop(LayoutStartAxisHor._t, apply);
        return val;
    }

    public override UpdateGridIdx (
        layout: Layout,

        countColumn: number,
        countRow: number
    ) 
    {
        for (let i = 0; i < layout._listEle.length; i++) {
            let ele = layout._listEle[i];
            ele.gridIdxX = i % countColumn;
            ele.gridIdxY = (i - ele.gridIdxX) / countColumn;
        };
    }

    static inst = LayoutStartAxisHor.Pop(APP);
}