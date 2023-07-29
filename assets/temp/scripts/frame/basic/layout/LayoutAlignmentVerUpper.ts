import UtilObjPool from "../UtilObjPool";
import UtilObjPoolType from "../UtilObjPoolType";
import LayoutAlignmentVer from "./LayoutAlignmentVer";

const APP = `LayoutAlignmentVerUpper`;

/**
 * 数据层排版 - 位置偏好 - 垂直线方向 - 上
 */
export default class LayoutAlignmentVerUpper extends LayoutAlignmentVer {
    
    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<LayoutAlignmentVerUpper>({
        instantiate: () => {
            return new LayoutAlignmentVerUpper();
        },
        onPop: (t) => {
            
        },
        onPush: (t) => {

        },
        tag: APP
    });

    public static Pop (app: string) {
        return UtilObjPool.Pop(LayoutAlignmentVerUpper._t, app);
    }

    public override GetPosY(gridY: number, gridHeight: number, eleHeight: number) {
        return gridY + gridHeight - eleHeight;
    }

    static inst = UtilObjPool.Pop(LayoutAlignmentVerUpper._t, APP);
}