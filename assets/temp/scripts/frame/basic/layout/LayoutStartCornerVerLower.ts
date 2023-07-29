import UtilObjPool from "../UtilObjPool";
import UtilObjPoolType from "../UtilObjPoolType";
import Layout from "./Layout";
import LayoutStartCornerVer from "./LayoutStartCornerVer";

const APP = `LayoutStartCornerVerLower`;

/**
 * 数据层排版 - 起始角落 - 垂直线 - 下
 */
export default class LayoutStartCornerVerLower extends LayoutStartCornerVer {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<LayoutStartCornerVerLower>({
        instantiate: () => {
            return new LayoutStartCornerVerLower();
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
        let val = UtilObjPool.Pop(LayoutStartCornerVerLower._t, apply);
        return val;
    }

    public override UpdateGridIdxVer(
        layout: Layout, 
        countRow: number
    ) 
    {
        // 什么也不用干
    }

    static inst = LayoutStartCornerVerLower.Pop(APP);
}