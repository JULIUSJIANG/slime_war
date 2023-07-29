import UtilObjPool from "../UtilObjPool";
import UtilObjPoolType from "../UtilObjPoolType";
import Layout from "./Layout";
import LayoutConstraint from "./LayoutConstraint";

const APP = `LayoutConstraintColumn`;

/**
 * 数据层排版 - 约束 - 列
 */
export default class LayoutConstraintColumn extends LayoutConstraint {
    
    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<LayoutConstraintColumn>({
        instantiate: () => {
            return new LayoutConstraintColumn();
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
        minRowCount: number
    ) 
    {
        let val = UtilObjPool.Pop(LayoutConstraintColumn._t, apply);
        val.constraintCount = constraintCount;
        val.minRowCount = minRowCount;
        return val;
    }

    /**
     * 约束量
     */
    private constraintCount: number;

    /**
     * 最少行数
     */
    private minRowCount: number;

    public override GetColumnCount(layout: Layout) {
        return this.constraintCount;
    }
    
    public override GetRowCount(layout: Layout) {
        let rowCount = Math.ceil(layout._listEle.length / this.constraintCount);
        rowCount = Math.max(rowCount, this.minRowCount);
        return rowCount;
    }

    static one = LayoutConstraintColumn.Pop(
        APP,
        1,
        0
    );

    static two = LayoutConstraintColumn.Pop(
        APP,
        2,
        0
    );

    static three = LayoutConstraintColumn.Pop(
        APP,
        3,
        0
    );

    static four = LayoutConstraintColumn.Pop(
        APP,
        4,
        0
    );

    static five = LayoutConstraintColumn.Pop(
        APP,
        5,
        0
    );
}