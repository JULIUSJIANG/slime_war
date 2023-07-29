import UtilObjPool from "../UtilObjPool";
import UtilObjPoolType from "../UtilObjPoolType";
import Layout from "./Layout";
import LayoutConstraint from "./LayoutConstraint";

const APP = `LayoutConstraintRow`;

/**
 * 数据层排版 - 约束 - 行
 */
export default class LayoutConstraintRow extends LayoutConstraint {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<LayoutConstraintRow>({
        instantiate: () => {
            return new LayoutConstraintRow();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (
        apply: string,
        constraintCount: number,
        minColumnCount: number
    )
    {
        let val = UtilObjPool.Pop(LayoutConstraintRow._t, apply);
        val.constraintCount = constraintCount;
        val.minColumnCount = minColumnCount;
        return val;
    }

    /**
     * 约束量
     */
    private constraintCount: number;

    /**
     * 最少列数
     */
    private minColumnCount: number;

    public override GetRowCount(layout: Layout) {
        return this.constraintCount;
    }

    public override GetColumnCount(layout: Layout) {
        let columnCount = Math.ceil(layout._listEle.length / this.constraintCount);
        columnCount = Math.max(columnCount, this.minColumnCount);
        return columnCount;
    }

    static one = LayoutConstraintRow.Pop(
        APP,
        1,
        0
    );
}