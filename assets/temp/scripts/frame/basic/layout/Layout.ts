import BCIdGeneration from "../BCIdGeneration";
import UtilObjPool from "../UtilObjPool";
import UtilObjPoolType from "../UtilObjPoolType";
import LayoutAlignmentHor from "./LayoutAlignmentHor";
import LayoutAlignmentVer from "./LayoutAlignmentVer";
import LayoutCollection from "./LayoutCollectionColumn";
import LayoutConstraint from "./LayoutConstraint";
import LayoutEle from "./LayoutEle";
import LayoutStartAxis from "./LayoutStartAxis";
import LayoutStartCornerHor from "./LayoutStartCornerHor";
import LayoutStartCornerVer from "./LayoutStartCornerVer";

const APP = `Layout`;

/**
 * 数据层排版
 */
export default class Layout {

    private constructor () {}

    private static _t = new UtilObjPoolType<Layout>({
        instantiate: () => {
            return new Layout();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    /**
     * 内边距 - 上
     */
    private paddingTop: number;
    /**
     * 内边距 - 右
     */
    private paddingRight: number;
    /**
     * 内边距 - 下
     */
    private paddingBottom: number;
    /**
     * 内边距 - 左
     */
    private paddingLeft: number;

    /**
     * 间距 - 列
     */
    private spacingColumn: number;
    /**
     * 间距 - 行
     */
    private spacingRow: number;

    /**
     * 默认尺寸 - 宽
     */
    private defSizeWidth: number;
    /**
     * 默认尺寸 - 高
     */
    private defSizeHeight: number;

    /**
     * 起始角落 - 水平线方向
     */
    private startCornerHor: LayoutStartCornerHor;
    /**
     * 起始角落 - 垂直线方向
     */
    private startCornerVer: LayoutStartCornerVer;

    /**
     * 起始方向
     */
    private startAxis: LayoutStartAxis;

    /**
     * 约束
     */
    private constraint: LayoutConstraint;

    /**
     * 位置偏好 - 水平线上
     */
    private alignmentHor: LayoutAlignmentHor;
    /**
     * 位置偏好 - 垂直线上
     */
    private alignmentVer: LayoutAlignmentVer;

    static Pop (
        apply: string,

        args: {
            paddingTop: number,
            paddingRight: number,
            paddingBottom: number,
            paddingLeft: number,
    
            spacingColumn: number,
            spacingRow: number,

            defSizeWidth: number,
            defSizeHeight: number,

            startCornerHor: LayoutStartCornerHor,
            startCornerVer: LayoutStartCornerVer,

            startAxis: LayoutStartAxis,

            constraint: LayoutConstraint,

            alignmentHor: LayoutAlignmentHor,
            alignmentVer: LayoutAlignmentVer,
        }
    )
    {
        let val = UtilObjPool.Pop(Layout._t, apply);
        val.paddingTop = args.paddingTop;
        val.paddingRight = args.paddingRight;
        val.paddingBottom = args.paddingBottom;
        val.paddingLeft = args.paddingLeft;

        val.spacingColumn = args.spacingColumn;
        val.spacingRow = args.spacingRow;

        val.defSizeWidth = args.defSizeWidth;
        val.defSizeHeight = args.defSizeHeight;

        val.startCornerHor = args.startCornerHor;
        val.startCornerVer = args.startCornerVer;

        val.startAxis = args.startAxis;

        val.constraint = args.constraint;

        val.alignmentHor = args.alignmentHor;
        val.alignmentVer = args.alignmentVer;

        return val;
    }

    /**
     * id 到具体元素的映射
     */
    _idToEleMap: Map<number, LayoutEle> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);
    /**
     * 列表 - 元素
     */
    _listEle: Array<LayoutEle> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);

    /**
     * 填充元素
     * @param width 
     * @param height 
     */
    public Create (
        width: number,
        height: number,

        id: number
    )
    {
        if (this._idToEleMap.has(id)) {
            console.error(`id 冲突[${id}]`);
            return;
        };

        let ele = LayoutEle.Pop(
            APP,
            id,
            width,
            height
        );
        this._idToEleMap.set(id, ele);
        this._listEle.push(ele);
    }

    /**
     * 清除
     */
    public Clear () {
        for (let i = 0; i < this._listEle.length; i++) {
            UtilObjPool.Push(this._listEle[i]);
        };
        this._idToEleMap.clear();
        this._listEle.length = 0;
    }

    /**
     * 列记录
     */
    listColumn: Array<LayoutCollection> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
    /**
     * 行记录
     */
    listRow: Array<LayoutCollection> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);

    /**
     * 容器宽度
     */
    containerWidth: number;
    /**
     * 容器高度
     */
    containerHeight: number;

    /**
     * 刷新 - 位置
     */
    public UpdatePos () {
        // 获取列数量
        let countColumn = this.constraint.GetColumnCount(this);
        // 获取行数量
        let countRow = this.constraint.GetRowCount(this);

        let ele = this._idToEleMap.get (1028);

        // 初始化基准格子位
        this.startAxis.UpdateGridIdx(
            this,

            countColumn,
            countRow
        );

        // 更正水平线上的格子位置 x
        this.startCornerHor.UpdateGridIdxHor(
            this,
            countColumn
        );

        // 更正垂直线上的格子位置 y
        this.startCornerVer.UpdateGridIdxVer(
            this,
            countRow
        );

        // 回收旧的列记录
        for (let i = 0; i < this.listColumn.length; i++) {
            UtilObjPool.Push(this.listColumn[i]);
        };
        this.listColumn.length = 0;

        // 生成新的列记录
        while (this.listColumn.length < countColumn) {
            this.listColumn.push(LayoutCollection.Pop(APP, this.listColumn.length));
        };

        // 回收旧的行记录
        for (let i = 0; i < this.listRow.length; i++) {
            UtilObjPool.Push(this.listRow[i]);
        };
        this.listRow.length = 0;

        // 生成新的行记录
        while (this.listRow.length < countRow) {
            this.listRow.push(LayoutCollection.Pop(APP, this.listRow.length));
        };

        // 把所有元素分类到对应的行列容器中
        for (let i = 0; i < this._listEle.length; i++) {
            let ele = this._listEle[i];

            this.listColumn[ele.gridIdxX].listEle.push(ele);
            this.listRow[ele.gridIdxY].listEle.push(ele);
        };

        // 列容器中元素从下到上排序
        for (let i = 0; i < this.listColumn.length; i++) {
            let collectionColumn = this.listColumn[i];
            collectionColumn.listEle.sort((a, b) => {
                return a.gridIdxY - b.gridIdxY;
            });
            // 补充占位需求
            if (0 < collectionColumn.listEle.length) {
                let first = collectionColumn.listEle [0];
                for (let j = 0; j < first.gridIdxY; j++) {
                    collectionColumn.listEle.unshift (null);
                };
            };
        };

        // 行容器中元素从左到右排序
        for (let i = 0; i < this.listRow.length; i++) {
            let collectionRow = this.listRow[i];
            collectionRow.listEle.sort((a, b) => {
                return a.gridIdxX - b.gridIdxX;
            });
            // 补充占位需求
            if (0 < collectionRow.listEle.length) {
                let first = collectionRow.listEle [0];
                for (let j = 0; j < first.gridIdxX; j++) {
                    collectionRow.listEle.unshift (null);
                };
            };
        };

        // 更正列容器宽度为容纳内容的最大宽度
        for (let i = 0; i < this.listColumn.length; i++) {
            let collectionColumn = this.listColumn[i];
            collectionColumn.size = this.defSizeWidth;
            for (let j = 0; j < collectionColumn.listEle.length; j++) {
                let ele = collectionColumn.listEle[j];
                if (ele == null) {
                    continue;
                };
                collectionColumn.size = Math.max(collectionColumn.size, ele.sizeWidth);
            };
        };

        // 更正行容器高度为容纳内容的最大高度
        for (let i = 0; i < this.listRow.length; i++) {
            let collectionRow = this.listRow[i];
            collectionRow.size = this.defSizeHeight;
            for (let j = 0; j < collectionRow.listEle.length; j++) {
                let ele = collectionRow.listEle[j];
                if (ele == null) {
                    continue;
                };
                collectionRow.size = Math.max(collectionRow.size, ele.sizeHeight);
            };
        };

        // 更正列容器的 x 坐标参数
        let countWidth = 0;
        for (let i = 0; i < this.listColumn.length; i++) {
            let collectionColumn = this.listColumn[i];

            collectionColumn.posStart = this.paddingLeft + i * this.spacingColumn + countWidth;
            collectionColumn.posEnd = collectionColumn.posStart + collectionColumn.size;

            collectionColumn.extendStart = collectionColumn.posStart - (0 < i ? this.spacingColumn : 0);
            collectionColumn.extendEnd = collectionColumn.posEnd + ((i < this.listColumn.length - 1) ? this.spacingColumn : 0);

            countWidth += collectionColumn.size;
        };

        // 更正行容器的 y 坐标参数
        let countHeight = 0;
        for (let i = 0; i < this.listRow.length; i++) {
            let collectionRow = this.listRow[i];

            collectionRow.posStart = this.paddingBottom + i * this.spacingRow + countHeight;
            collectionRow.posEnd = collectionRow.posStart + collectionRow.size;

            collectionRow.extendStart = collectionRow.posStart - (0 < i ? this.spacingRow : 0);
            collectionRow.extendEnd = collectionRow.posEnd + ((i < this.listRow.length - 1) ? this.spacingRow : 0);

            countHeight += collectionRow.size;
        };

        // 更正元素的 x 坐标
        for (let i = 0; i < this.listColumn.length; i++) {
            let collectionColumn = this.listColumn[i];
            for (let j = 0; j < collectionColumn.listEle.length; j++) {
                let ele = collectionColumn.listEle[j];
                if (ele == null) {
                    continue;  
                };
                ele.posX = this.alignmentHor.GetPosX(
                    collectionColumn.posStart,
                    collectionColumn.size,

                    ele.sizeWidth
                );
            };
        };

        // 更正元素的 y 坐标
        for (let i = 0; i < this.listRow.length; i++) {
            let collectionRow = this.listRow[i];
            for (let j = 0; j < collectionRow.listEle.length; j++) {
                let ele = collectionRow.listEle[j];
                if (ele == null) {
                    continue;
                };
                ele.posY = this.alignmentVer.GetPosY(
                    collectionRow.posStart,
                    collectionRow.size,

                    ele.sizeHeight
                );
            };
        };

        // 更正容器宽度
        this.containerWidth = this.paddingLeft;
        for (let i = 0; i < this.listColumn.length; i++) {
            let collectionColumn = this.listColumn[i];
            this.containerWidth = collectionColumn.posStart + collectionColumn.size;
        };
        this.containerWidth += this.paddingRight;

        // 更正容器高度
        this.containerHeight = this.paddingBottom;
        for (let i = 0; i < this.listRow.length; i++) {
            let collectionRow = this.listRow[i];
            this.containerHeight = collectionRow.posStart + collectionRow.size;
        };
        this.containerHeight += this.paddingTop;

        this._recHorStart = 0;
        this._recHorEnd = -1;
        this._recVerStart = 0;
        this._recVerEnd = -1;
    }

    /**
     * 记录 - 水平线方向起始索引
     */
    _recHorStart: number;
    /**
     * 记录 - 水平线方向结束索引
     */
    _recHorEnd: number;
    /**
     * 记录 - 垂直线方向起始索引
     */
    _recVerStart: number;
    /**
     * 记录 - 垂直线方向结束索引
     */
    _recVerEnd: number;

    /**
     * 刷新元素的激活情况
     */
    public UpdateActive (
        viewX: number,
        viewY: number,

        viewWidth: number,
        viewHeight: number
    ) 
    {
        this._recHorStart = this.GetCoverIdxStartToEnd(
            this.listColumn,
            viewX
        );
        this._recHorEnd = this.GetCoverIdxEndToStart(
            this.listColumn,
            viewX + viewWidth
        );
        this._recVerStart = this.GetCoverIdxStartToEnd(
            this.listRow,
            viewY
        );
        this._recVerEnd = this.GetCoverIdxEndToStart(
            this.listRow,
            viewY + viewHeight
        );
    }

    /**
     * 获取 val 位置的左向右包含索引
     * @param val 
     * @returns 
     */
    private GetCoverIdxStartToEnd (
        listCollection: Array<LayoutCollection>, 
        val: number
    ) 
    {
        // 没有元素，找不到的
        if (0 == listCollection.length) {
            return 0;
        };
        let first = listCollection[0];
        let last = listCollection[listCollection.length - 1];
        // 左越界，那么视为包含 0
        if (val < first.posStart) {
            return 0;
        };
        // 右越界，那么视为什么也不包含
        if (last.posEnd < val) {
            return listCollection.length;
        };
        // 否则取边界情况以外的最优解
        return this.GetIdx(
            listCollection,
            (t) => {
                return t.extendStart;
            },
            (t) => {
                return t.posEnd
            },
            0,
            listCollection.length - 1,
            val
        );
    }

    /**
     * 获取 val 位置的右向左包含索引
     * @param val 
     */
    private GetCoverIdxEndToStart (
        listCollection: Array<LayoutCollection>, 
        val: number
    ) 
    {
        // 没有元素，找不到的
        if (0 == listCollection.length) {
            return -1;
        };
        let first = listCollection[0];
        let last = listCollection[listCollection.length - 1];
        // 右越界，那么视为包含最后的元素
        if (last.posEnd < val) {
            return listCollection.length - 1;
        };
        // 左越界，那么视为什么也不包含
        if (val < first.posStart) {
            return -1;
        };
        // 否则取边界情况以外的最优解
        return this.GetIdx(
            listCollection,
            (t) => {
                return t.posStart;
            },
            (t) => {
                return t.extendEnd
            },
            0,
            listCollection.length - 1,
            val
        );
    }

    /**
     * 获取刻度对应的索引
     * @param list 
     * @param leftGetter 
     * @param rightGetter 
     * @param idxStart 
     * @param idxEnd 
     * @param val 
     */
    private GetIdx<T>(
        list: Array<T>,
        leftGetter: (t: T) => number,
        rightGetter: (t: T) => number,
        idxStart: number,
        idxEnd: number,
        val: number
    )
    {
        let centerCeil = Math.ceil((idxStart + idxEnd) / 2);
        let centerRec = list[centerCeil];
        // 目标在索引左侧
        if (val < leftGetter(centerRec)) {
            return this.GetIdx(
                list,
                leftGetter,
                rightGetter,
                idxStart,
                centerCeil - 1,
                val
            );
        };
        // 目标索引在右侧
        if (rightGetter(centerRec) < val) {
            return this.GetIdx(
                list,
                leftGetter,
                rightGetter,
                centerCeil + 1,
                idxEnd,
                val
            );
        };
        // 俩种情况以外，说明自己才是目标
        return centerCeil;
    }

    /**
     * 设置元素位置
     * @param node 
     * @param id 
     * @returns 
     */
    SetElePos (node: cc.Node, id: number) {
        let ele = this._idToEleMap.get(id);
        if (ele == null) {
            console.error(`SetElePos ele == null`);
            return;
        };
        node.x = ele.posX;
        node.y = ele.posY;
    }
}