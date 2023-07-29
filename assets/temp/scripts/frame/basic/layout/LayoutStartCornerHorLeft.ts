import UtilObjPool from "../UtilObjPool";
import UtilObjPoolType from "../UtilObjPoolType";
import Layout from "./Layout";
import LayoutStartCornerHor from "./LayoutStartCornerHor";

const APP = `LayoutStartCornerHorLeft`;

/**
 * 数据层排版 - 起始角落 - 水平线 - 左
 */
export default class LayoutStartCornerHorLeft extends LayoutStartCornerHor {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<LayoutStartCornerHorLeft>({
        instantiate: () => {
            return new LayoutStartCornerHorLeft();
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
        let val = UtilObjPool.Pop(LayoutStartCornerHorLeft._t, apply);
        return val;
    }

    public override UpdateGridIdxHor(
        layout: Layout, 
        countColumn: number
    ) 
    {
        // 什么也不用干
    }

    static inst = LayoutStartCornerHorLeft.Pop(APP);
}