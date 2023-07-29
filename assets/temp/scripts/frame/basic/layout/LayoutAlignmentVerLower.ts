import UtilObjPool from "../UtilObjPool";
import UtilObjPoolType from "../UtilObjPoolType";
import LayoutAlignmentVer from "./LayoutAlignmentVer";

const APP = `LayoutAlignmentVerLower`;

/**
 * 数据层排版 - 位置偏好 - 垂直线方向 - 下
 */
export default class LayoutAlignmentVerLower extends LayoutAlignmentVer {
    
    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<LayoutAlignmentVerLower>({
        instantiate: () => {
            return new LayoutAlignmentVerLower();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    public static Pop (app: string) {
        return UtilObjPool.Pop(LayoutAlignmentVerLower._t, app);
    }

    public override GetPosY(gridY: number, gridHeight: number, eleHeight: number) {
        return gridY;
    }

    static inst = UtilObjPool.Pop(LayoutAlignmentVerLower._t, APP);
}