import Layout from "./Layout";

/**
 * 数据层排版 - 起始角落 - 垂直线
 */
export default abstract class LayoutStartCornerVer {
    /**
     * 刷新格子位置（默认从左下角开始编排位置）
     * @param layout 
     * @param countRow 
     */
    public abstract UpdateGridIdxVer (
        layout: Layout,

        countRow: number
    );
}