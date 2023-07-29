import UtilObjPool from "../UtilObjPool";
import UtilObjPoolType from "../UtilObjPoolType";
import Layout from "./Layout";
import LayoutStartAxis from "./LayoutStartAxis";

const APP = `LayoutStartAxisVer`;

/**
 * 数据层排版 - 起始方向 - 垂直线
 */
export default class LayoutStartAxisVer extends LayoutStartAxis {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<LayoutStartAxisVer>({
        instantiate: () => {
            return new LayoutStartAxisVer();
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
        let val = UtilObjPool.Pop(LayoutStartAxisVer._t, apply);
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
            ele.gridIdxY = i % countRow;
            ele.gridIdxX = (i - ele.gridIdxY) / countRow;
        };
    }

    static inst = LayoutStartAxisVer.Pop(APP);
}