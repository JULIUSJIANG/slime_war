import Layout from "./Layout";

/**
 * 数据层排版 - 起始方向
 */
export default abstract class LayoutStartAxis {
    /**
     * 刷新格子索引
     */
    public abstract UpdateGridIdx (
        layout: Layout,
        
        countColumn: number,
        countRow: number
    );
}