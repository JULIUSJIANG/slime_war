import UtilObjPool from "../UtilObjPool";
import UtilObjPoolType from "../UtilObjPoolType";
import LayoutAlignmentHor from "./LayoutAlignmentHor";

const APP = `LayoutAlignmentHorCenter`;

/**
 * 数据层排版 - 位置偏好 - 水平线方向 - 中
 */
export default class LayoutAlignmentHorCenter extends LayoutAlignmentHor {
    
    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<LayoutAlignmentHorCenter>({
        instantiate: () => {
            return new LayoutAlignmentHorCenter();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    public static Pop (app: string) {
        return UtilObjPool.Pop(LayoutAlignmentHorCenter._t, app);
    }

    public override GetPosX(gridX: number, gridWidth: number, eleWidth: number) {
        return gridX + (gridWidth - eleWidth) / 2;
    }

    static inst = UtilObjPool.Pop(LayoutAlignmentHorCenter._t, APP);
}