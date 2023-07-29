import Layout from "./Layout";

/**
 * 数据层排版 - 约束
 */
export default abstract class LayoutConstraint {
    /**
     * 获取列数
     * @param layout 
     */
    public abstract GetColumnCount (
        layout: Layout
    );

    /**
     * 获取行数
     * @param layout 
     */
    public abstract GetRowCount (
        layout: Layout
    );
}