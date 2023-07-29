import UtilObjPool from "../UtilObjPool";
import UtilObjPoolType from "../UtilObjPoolType";
import Layout from "./Layout";
import LayoutStartCornerVer from "./LayoutStartCornerVer";

const APP = `LayoutStartCornerVerUpper`

/**
 * 数据层排版 - 起始角落 - 垂直线 - 上
 */
export default class LayoutStartCornerVerUpper extends LayoutStartCornerVer {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<LayoutStartCornerVerUpper>({
        instantiate: () => {
            return new LayoutStartCornerVerUpper();
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
        let val = UtilObjPool.Pop(LayoutStartCornerVerUpper._t, apply);
        return val;
    }

    public override UpdateGridIdxVer(
        layout: Layout, 
        countRow: number
    ) 
    {
        // 上下翻转
        for (let i = 0; i < layout._listEle.length; i++) {
            let ele = layout._listEle[i];
            ele.gridIdxY = countRow - 1 - ele.gridIdxY;
        };
    }

    static inst = LayoutStartCornerVerUpper.Pop(APP);
}