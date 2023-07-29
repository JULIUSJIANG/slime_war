import { b2BuoyancyController, b2ChainShape, b2CircleShape, b2Controller, b2DistanceJoint, b2EdgeShape, b2Joint, b2JointType, b2Mat33, b2MouseJoint, b2PolygonShape, b2PulleyJoint, b2Shape, b2ShapeType, b2Transform, b2Vec3 } from "../../../../box2d_ts/Box2D";
import UtilObjPool from "../../basic/UtilObjPool";

const APP = `b2Extend`;
namespace b2Extend {

    export function GetDistanceJoint (joint: b2Joint): b2DistanceJoint {
        if (joint == null) {
            return;
        };
        if (joint.m_type == b2JointType.e_distanceJoint) {
            return joint as b2DistanceJoint;
        };
    }

    export function GetPulleyJoint (joint: b2Joint): b2PulleyJoint {
        if (joint == null) {
            return;
        };
        if (joint.m_type == b2JointType.e_pulleyJoint) {
            return joint as b2PulleyJoint;
        };
    }

    export function GetMouseJoint (joint: b2Joint): b2MouseJoint {
        if (joint == null) {
            return;
        };
        if (joint.m_type == b2JointType.e_motorJoint) {
            return joint as b2MouseJoint;
        };
    }

    /**
     * 获取身上的控制
     * @param ctrl 
     * @returns 
     */
    export function Getb2BuoyancyController (ctrl: b2Controller): b2BuoyancyController {
        if (ctrl == null) {
            return;
        };
        if (ctrl instanceof b2BuoyancyController) {
            return ctrl as b2BuoyancyController;
        };
        return;
    }

    /**
     * 获取铰链
     * @param shape 
     */
    export function GetChainShape (shape: b2Shape): b2ChainShape {
        if (shape == null) {
            return;
        };
        if (shape.GetType() == b2ShapeType.e_chainShape) {
            return shape as b2ChainShape;
        };
        return;
    }

    /**
     * 获取身上的线形
     * @param shape 
     */
    export function GetEdgeShape (shape: b2Shape): b2EdgeShape {
        if (shape == null) {
            return;
        };
        if (shape.GetType() == b2ShapeType.e_edgeShape){
            return shape as b2EdgeShape;
        };
        return;
    }

    /**
     * 获取身上的多边形
     * @param shape 
     */
    export function GetPolygonShape (shape: b2Shape): b2PolygonShape {
        if (shape == null) {
            return;
        };
        if (shape.GetType() == b2ShapeType.e_polygonShape) {
            return shape as b2PolygonShape;
        };
        return null;
    }

    /**
     * 获取身上的圆形
     * @param shape 
     */
    export function GetCircleShape (shape: b2Shape): b2CircleShape {
        if (shape == null) {
            return;
        };
        if (shape.GetType() == b2ShapeType.e_circleShape) {
            return shape as b2CircleShape;
        };
        return null;
    }

    /**
     * 获取变换矩阵
     * @param trans 
     */
    export function GetTransMat (trans: b2Transform): b2Mat33 {
        var euler = trans.GetAngle();
        var pos = trans.GetPosition();
        return MergeMat(
            GetPosMat(pos.x, pos.y),
            GetRotateMat(euler)
        );
    }

    /**
     * 获取旋转矩阵
     * @param piEuler 
     */
    export function GetRotateMat (piEuler: number): b2Mat33 {
        let cosEuler = Math.cos(piEuler);
        let sinEuler = Math.sin(piEuler);
        let mat = UtilObjPool.Pop(UtilObjPool.typeB2Mat33, APP);
        mat.SetVVV(
            {
                x: cosEuler,
                y: sinEuler,
                z: 0
            },
            {
                x: -sinEuler,
                y: cosEuler,
                z: 0
            },
            {
                x: 0, 
                y: 0,
                z: 1
            }
        );
        return mat;
    }

    /**
     * 获取位置偏移矩阵
     * @param x 
     * @param y 
     */
    export function GetPosMat (x: number, y: number): b2Mat33 {
        let mat = UtilObjPool.Pop(UtilObjPool.typeB2Mat33, APP);
        // [
        //     1, 0, x,
        //     0, 1, y,
        //     0, 0, 1
        // ]
        mat.SetVVV(
            {
                x: 1, 
                y: 0, 
                z: 0
            },
            {
                x: 0, 
                y: 1, 
                z: 0
            },
            {
                x: x, 
                y: y, 
                z: 1
            }
        );
        return mat;
    }

    /**
     * 合并变换矩阵
     * @param matL 
     * @param matR 
     */
    export function MergeMat (matL: b2Mat33, matR: b2Mat33) {
        let columnX = UtilObjPool.Pop(UtilObjPool.typeB2Vec3, APP);
        let columnY = UtilObjPool.Pop(UtilObjPool.typeB2Vec3, APP);
        let columnZ = UtilObjPool.Pop(UtilObjPool.typeB2Vec3, APP);
        b2Mat33.MulM33V3(matL, matR.ex, columnX);
        b2Mat33.MulM33V3(matL, matR.ey, columnY);
        b2Mat33.MulM33V3(matL, matR.ez, columnZ);
        var freshMat = UtilObjPool.Pop(
            UtilObjPool.typeB2Mat33,
            APP
        );
        freshMat.SetVVV(
            columnX,
            columnY,
            columnZ
        );
        return freshMat;
    }

    /**
     * 获取矩阵的字符串
     * @param mat 
     */
    export function GetMatStr (mat: b2Mat33) {
        return `${mat.ex.x}, ${mat.ey.x}, ${mat.ez.x}\n${mat.ex.y}, ${mat.ey.y}, ${mat.ez.y}\n${mat.ex.z}, ${mat.ey.z}, ${mat.ez.z}`;
    }

    /**
     * 获取向量的字符串
     * @param v 
     */
    export function GetV3Str (v: b2Vec3) {
        return `${v.x}, ${v.y}, ${v.z}`
    }

    export const leftMat = GetRotateMat(Math.PI / 2);

    export const rightMat = GetRotateMat(- Math.PI / 2);
}

export default b2Extend;