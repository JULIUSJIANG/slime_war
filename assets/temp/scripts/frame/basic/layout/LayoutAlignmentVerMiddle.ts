import UtilObjPool from "../UtilObjPool";
import UtilObjPoolType from "../UtilObjPoolType";
import LayoutAlignmentVer from "./LayoutAlignmentVer";

const APP = `LayoutAlignmentVerMiddle`;

/**
 * 数据层排版 - 位置偏好 - 垂直线方向 - 中
 */
export default class LayoutAlignmentVerMiddle extends LayoutAlignmentVer {
    
    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<LayoutAlignmentVerMiddle>({
        instantiate: () => {
            return new LayoutAlignmentVerMiddle();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    public static Pop (app: string) {
        return UtilObjPool.Pop(LayoutAlignmentVerMiddle._t, app);
    }

    public override GetPosY(gridY: number, gridHeight: number, eleHeight: number) {
        return gridY + (gridHeight - eleHeight) / 2;
    }

    static inst = UtilObjPool.Pop(LayoutAlignmentVerMiddle._t, APP);
}