/**
 * 数据层排版 - 位置偏好 - 垂直线方向
 */
export default abstract class LayoutAlignmentVer {
    /**
     * 获取元素的 y 坐标
     * @param gridY 
     * @param gridHeight 
     * @param eleHeight 
     */
    abstract GetPosY (
        gridY: number,
        gridHeight: number,
        eleHeight: number
    );
}