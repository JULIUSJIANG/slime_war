import UtilObjPool from "../UtilObjPool";
import UtilObjPoolType from "../UtilObjPoolType";
import LayoutAlignmentHor from "./LayoutAlignmentHor";

const APP = `LayoutAlignmentHorLeft`;

/**
 * 数据层排版 - 位置偏好 - 水平线方向 - 左
 */
export default class LayoutAlignmentHorLeft extends LayoutAlignmentHor {
    
    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<LayoutAlignmentHorLeft>({
        instantiate: () => {
            return new LayoutAlignmentHorLeft();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    public static Pop (app: string) {
        return UtilObjPool.Pop(LayoutAlignmentHorLeft._t, app);
    }

    public override GetPosX(gridX: number, gridWidth: number, eleWidth: number) {
        return gridX;
    }

    static inst = UtilObjPool.Pop(LayoutAlignmentHorLeft._t, APP);
}