import UtilObjPool from "../UtilObjPool";
import UtilObjPoolType from "../UtilObjPoolType";
import LayoutAlignmentHor from "./LayoutAlignmentHor";

const APP = `LayoutAlignmentHorRight`;

/**
 * 数据层排版 - 位置偏好 - 水平线方向 - 右
 */
export default class LayoutAlignmentHorRight extends LayoutAlignmentHor{
   
    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<LayoutAlignmentHorRight>({
        instantiate: () => {
            return new LayoutAlignmentHorRight();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    public static Pop (app: string) {
        return UtilObjPool.Pop(LayoutAlignmentHorRight._t, app);
    }

    public override GetPosX(gridX: number, gridWidth: number, eleWidth: number) {
        return gridX + gridWidth - eleWidth;
    }

    static inst = UtilObjPool.Pop(LayoutAlignmentHorRight._t, APP);
}