/**
 * 数据层排版 - 位置偏好 - 水平线方向
 */
export default abstract class LayoutAlignmentHor {
    /**
     * 获取元素的 x 坐标
     * @param gridX 
     * @param gridWidth 
     * @param eleWidth 
     */
    abstract GetPosX (
        gridX: number,
        gridWidth: number,
        eleWidth: number
    )
}