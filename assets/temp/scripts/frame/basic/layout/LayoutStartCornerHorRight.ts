import UtilObjPool from "../UtilObjPool";
import UtilObjPoolType from "../UtilObjPoolType";
import Layout from "./Layout";
import LayoutStartCornerHor from "./LayoutStartCornerHor";

const APP = `LayoutStartCornerHorRight`;

/**
 * 数据层排版 - 起始角落 - 水平线 - 右
 */
export default class LayoutStartCornerHorRight extends LayoutStartCornerHor {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<LayoutStartCornerHorRight>({
        instantiate: () => {
            return new LayoutStartCornerHorRight();
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
        let val = UtilObjPool.Pop(LayoutStartCornerHorRight._t, apply);
        return val;
    }

    public override UpdateGridIdxHor(
        layout: Layout,

        countColumn: number
    ) 
    {
        // 左右翻转
        for (let i = 0; i < layout._listEle.length; i++) {
            let ele = layout._listEle[i];
            ele.gridIdxX = countColumn - 1 - ele.gridIdxX;
        };
    }

    static inst = LayoutStartCornerHorRight.Pop(APP);
}