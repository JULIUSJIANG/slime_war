import { b2Vec2 } from "../../../../box2d_ts/Box2D";
import UtilObjPool from "../../basic/UtilObjPool";

const APP = `b2EleSetting`;

/**
 * 变换的可视化信息
 */
const _transformLen = 1
 /**
 * 原点
 */
const _posO = UtilObjPool.Pop (UtilObjPool.typeB2Vec2, APP);
/**
 * x 坐标
 */
const _xAxis = UtilObjPool.Pop (UtilObjPool.typeB2Vec2, APP);
_xAxis.x = _transformLen;
/**
 * y 坐标
 */
const _yAxis = UtilObjPool.Pop (UtilObjPool.typeB2Vec2, APP);
_yAxis.y = _transformLen;

namespace b2EleSetting {
    /**
     * 线宽
     */
    export const lineWidth = 3;
    /**
     * 点半径
     */
    export const dotRadius = 6;
    /**
     * 表示很远的距离
     */
    export const farLen = 100;

    /**
     * 颜色
     */
    export const color = {
        /**
         * 形状
         */
        shape: {
            /**
             * 外轮廓
             */
            outline: UtilObjPool.PopCCColor (APP, 100, 255, 100, 255),
            /**
             * 身体
             */
            body: UtilObjPool.PopCCColor (APP, 100, 255, 100, 100)
        },

        /**
         * 包围盒线条颜色
         */
        aabb: UtilObjPool.PopCCColor (APP, 0, 0, 255, 255),

        /**
         * 约束
         */
        joint: {
            /**
             * 起始颜色
             */
            areaBegin: UtilObjPool.PopCCColor (APP, 255, 0, 0, 255),

            /**
             * 结束颜色
             */
            areaEnd: UtilObjPool.PopCCColor (APP, 255, 100, 100, 255),

            /**
             * 关节点颜色
             */
            dot: UtilObjPool.PopCCColor (APP, 255, 255, 255, 255),
        },

        /**
         * 变换
         */
        transform: {
            /**
             * x 坐标
             */
            xColor: UtilObjPool.PopCCColor (APP, 255, 0, 0, 255),
            /**
             * y 坐标
             */
            yColor: UtilObjPool.PopCCColor (APP, 0, 255, 0, 255)
        },

        /**
         * 碰撞点的颜色
         */
        contactPoint: {
            dot: UtilObjPool.PopCCColor (APP, 255, 255, 100, 255)
        },

        /**
         * 粒子颜色
         */
        particle: {
            /**
             * 填充色
             */
            fill: UtilObjPool.PopCCColor (APP, 100, 100, 255, 100),
            /**
             * 描边色
             */
            stroke: UtilObjPool.PopCCColor (APP, 100, 100, 255, 255)
        },

        /**
         * 控制器颜色
         */
        controller: {
            /**
             * 浮力控制器
             */
            b2BuoyancyController: UtilObjPool.PopCCColor (APP, 255, 100, 100, 100)
        }
    }

    /**
     * 变换的可视化信息
     */
    export const transformLen = _transformLen;

     /**
     * 原点
     */
    export const posO = _posO;

    /**
     * x 坐标
     */
    export const xAxis = _xAxis;

    /**
     * y 坐标
     */
    export const yAxis = _yAxis;
}

export default b2EleSetting;