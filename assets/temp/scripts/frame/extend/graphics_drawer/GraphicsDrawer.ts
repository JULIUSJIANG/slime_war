import utilMath from "../../basic/UtilMath";
import UtilObjPool from "../../basic/UtilObjPool";
import UtilObjPoolType from "../../basic/UtilObjPoolType";

const APP = `GraphicsDrawer`;

/**
 * 画笔绘制工具类
 */
export default class GraphicsDrawer {

    private constructor () {}

    private static _t = new UtilObjPoolType<GraphicsDrawer>({
        instantiate: () => {
            return new GraphicsDrawer();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (
        apply: string,
        graphics: cc.Graphics
    ) 
    {
        let val = UtilObjPool.Pop(GraphicsDrawer._t, apply);
        val._graphics = graphics;
        return val;
    }

    /**
     * 实际用来绘图的画笔
     */
    _graphics: cc.Graphics;

    /**
     * 坐标的缩放
     */
    _cameraPixelPerSize: number = 1;

    /**
     * x 变换
     */
    _cameraX: number = 0;
 
    /**
     * y 变换
     */
    _cameraY: number = 0;

    /**
     * 设置变换
     * @param cameraPixelPerSize 
     * @param cameraX 
     * @param cameraY 
     */
    SetTransform (
        cameraPixelPerSize: number,
        cameraX: number,
        cameraY: number
    )
    {
        this._cameraPixelPerSize = cameraPixelPerSize;
        this._cameraX = cameraX;
        this._cameraY = cameraY;
    }

    /**
     * 填充点集所包围的多边形
     * @param posList 点集
     * @param color 颜色
     */
    FillPosSetAll (posList: Array<utilMath.Position>, color: cc.Color) {
        this.FillPosOrigin(posList, posList.length, color);
    }

    /**
     * 填充点集所包围的多边形
     * @param posList 点集合
     * @param endIndex 终止的索引
     * @param color 颜色
     */
    FillPosOrigin (posList: Array<utilMath.Position>, endIndex: number, color: cc.Color) {
        this._graphics.fillColor = color;
        // 从起点出发
        this.GraphMoveTo(posList[0].x, posList[0].y);
        // 连接后面的
        for (let i = 1; i < endIndex; i++) {
            this.GraphLineTo(posList[i].x, posList[i].y);
        };
        // 回到起点
        this.GraphLineTo(posList[0].x, posList[0].y);
        this._graphics.fill();
    }

    /**
     * 连接点集里面所有的点
     * @param posList 点集
     * @param lineWidth 线宽
     * @param color 颜色
     */
    CyclePosSetAll (posList: Array<utilMath.Position>, lineWidth: number, color: cc.Color) {
        this.CyclePosOrigin(posList, posList.length, lineWidth, color);
    }

    /**
     * 连接点集里面所有的点
     * @param posList 点集合
     * @param endIndex 终止的索引
     * @param lineWidth 线宽
     * @param color 颜色
     */
    CyclePosOrigin (posList: Array<utilMath.Position>, endIndex: number, lineWidth: number, color: cc.Color) {
        for (let i = 0; i < endIndex; i++) {
            let currentPos = posList[i];
            let nextPos = posList[(i + 1) % posList.length]
            this.StraightLine(currentPos.x, currentPos.y, nextPos.x, nextPos.y, lineWidth, color);
        };
    }

    /**
     * 连接点
     * @param posList 
     * @param lineWidth 
     * @param color 
     */
    ConnectPosSetAll (posList: Array<utilMath.Position>, lineWidth: number, color: cc.Color) {
        this.ConnectPosOrigin(posList, posList.length, lineWidth, color);
    }

    /**
     * 连接点
     * @param posList 点集合
     * @param endIndex 终止的索引
     * @param lineWidth 线宽
     * @param color 颜色
     */
    ConnectPosOrigin (posList: Array<utilMath.Position>, endIndex: number, lineWidth: number, color: cc.Color) {
        for (let i = 0; i < endIndex - 1; i++) {
            let currentPos = posList[i];
            let nextPos = posList[(i + 1) % posList.length]
            this.StraightLine(currentPos.x, currentPos.y, nextPos.x, nextPos.y, lineWidth, color);
        };
    }

    /**
     * 填充一个圆
     * @param x 目标的 x 坐标
     * @param y 目标的 y 坐标
     * @param radius 半径
     * @param color 
     */
    RoundFill (
        x: number,
        y: number,

        radius: number,
        color: cc.Color
    ) {
        this._graphics.fillColor = color;
        this.GraphArc(x, y, radius);
        this._graphics.fill();
    }

    /**
     * 画出一个圆
     * @param x 目标位置 x
     * @param y 目标位置 y
     * @param lineWidth 线宽
     * @param color 颜色
     */
    RoundLine (
        x: number,
        y: number,

        radius: number,

        lineWidth: number,
        color: cc.Color
    ) {
        this._graphics.strokeColor = color;
        this._graphics.lineWidth = lineWidth * this._cameraPixelPerSize;
        this.GraphArc(x, y, radius);
        this._graphics.stroke();
    }

    /**
     * 绘制线段
     * @param ax 起始点 x 坐标
     * @param ay 起始点 y 坐标
     * @param bx 终点 x 坐标
     * @param by 终点 y 坐标
     * @param lineWidth 线宽
     * @param color 线颜色
     */
    StraightLine (
        ax: number,
        ay: number,
        
        bx: number,
        by: number,

        lineWidth: number,
        color: cc.Color
    ) {
        this._graphics.strokeColor = color;
        this._graphics.lineWidth = lineWidth * this._cameraPixelPerSize;
        this.GraphMoveTo(ax, ay);
        this.GraphLineTo(bx, by);
        this._graphics.stroke();
    }

    /**
     * 获取某像素尺寸在当前设置下数值应当为多少
     * @param size 
     */
    Pixel (size: number) {
        return size / this._cameraPixelPerSize;
    }

    /**
     * 移动至
     * @param x 目标坐标 x
     * @param y 目标坐标 y
     */
    GraphMoveTo (x: number, y: number) {
        this._graphics.moveTo(this.TransformX(x), this.TransformY(y));
    }

    /**
     * 直线至
     * @param x 目标坐标 x
     * @param y 目标坐标 y
     */
    GraphLineTo (x: number, y: number) {
        this._graphics.lineTo(this.TransformX(x), this.TransformY(y));
    }

    /**
     * 在某个地方画圈
     * @param x 目标坐标 x
     * @param y 目标坐标 y
     * @param radius 半径
     */
    GraphArc(x: number, y: number, radius: number) {
        this._graphics.arc(this.TransformX(x), this.TransformY(y), radius * this._cameraPixelPerSize, 0, 360, true);
    }

    /**
     * 对 x 进行变换
     * @param x 
     */
    TransformX (x: number) {
        return (x - this._cameraX) * this._cameraPixelPerSize
    }

    /**
     * 对 y 进行变换
     * @param y 
     */
    TransformY (y: number) {
        return (y - this._cameraY) * this._cameraPixelPerSize;
    }
}