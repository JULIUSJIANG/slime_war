import Layout from "./Layout";

/**
 * 数据层排版 - 起始角落 - 水平线
 */
export default abstract class LayoutStartCornerHor {
    /**
     * 刷新格子位置（默认从左下角开始编排位置）
     * @param layout 
     * @param countRow 
     */
    public abstract UpdateGridIdxHor (
        layout: Layout,

        countColumn: number
    );
}